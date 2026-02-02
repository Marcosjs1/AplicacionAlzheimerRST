import { serve } from "http/server.ts";
import { createClient } from "@supabase/supabase-js";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase configuration");
    }

    // 1. Create Service Client
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 2. Identify Patient
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const patientId = user.id;

    // 3. Get Data (Safe Zone + Latest Location)
    // Query Safe Zone
    const { data: safeZone, error: zoneError } = await supabaseAdmin
      .from("safe_zones")
      .select("*")
      .eq("patient_id", patientId)
      .single();

    if (zoneError && zoneError.code !== "PGRST116") { // Ignore if no zone found
      throw zoneError;
    }
    if (!safeZone) {
      return new Response(JSON.stringify({ message: "No safe zone defined" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Query Location (Should be fresh from upsert)
    const { data: location, error: locError } = await supabaseAdmin
      .from("patient_locations")
      .select("*")
      .eq("user_id", patientId)
      .single();

    if (locError) {
       throw locError;
    }

    // 4. Calculate Distance
    const currentLat = location.lat;
    const currentLng = location.lng;
    const distanceM = getDistanceFromLatLonInM(currentLat, currentLng, safeZone.center_lat, safeZone.center_lng);
    const isInside = distanceM <= safeZone.radius_m;

    // 5. Logic
    const previousState = location.is_inside_safe_zone;
    // Handle null previousState (first run) as "Inside" to avoid false positive Exit alert on first location?
    // Or assume "Inside" if undefined?
    // If null, we define it now. If it turns out it's OUTSIDE, we might want to alert immediately. 
    // Default in DB is true. So if it's new row, it's true.
    
    const now = new Date();
    
    let shouldUpdateParam = isInside !== previousState;
    let updates: any = {};
    let sentEmail = false;

    if (shouldUpdateParam) {
        updates.is_inside_safe_zone = isInside;
        updates.last_geofence_event_at = now.toISOString();

        const eventType = isInside ? "ENTER" : "EXIT";

        // Insert Alert
        await supabaseAdmin.from("zone_alerts").insert({
            patient_id: patientId,
            caregiver_id: safeZone.caregiver_id,
            event_type: eventType,
            lat: currentLat,
            lng: currentLng
        });

        // If EXIT -> Send Email
        // Check cooldown: Don't send if last alert was < 10 mins ago (Jitter protection)
        if (!isInside) {
             const lastSent = location.last_alert_sent_at ? new Date(location.last_alert_sent_at) : null;
             // If lastSent is null, we send. 
             // If lastSent is recent, we skip.
             const timeDiff = lastSent ? (now.getTime() - lastSent.getTime()) / 1000 / 60 : 999; // mins

             if (timeDiff >= 10) {
                 // Send Email
                 await sendAlertEmail(safeZone.caregiver_id, supabaseAdmin, eventType, currentLat, currentLng);
                 updates.last_alert_sent_at = now.toISOString();
                 sentEmail = true;
             } else {
                 console.log("Skipping email due to cooldown");
             }
        }
    }

    // If param needs updating
    if (shouldUpdateParam) {
        await supabaseAdmin.from("patient_locations").update(updates).eq("user_id", patientId);
    }

    return new Response(JSON.stringify({ 
        success: true, 
        is_inside: isInside, 
        distance_m: distanceM,
        state_changed: shouldUpdateParam, 
        email_sent: sentEmail 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// Helpers
function getDistanceFromLatLonInM(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // Radius of the earth in m
  const dLat = deg2rad(lat2-lat1);
  const dLon = deg2rad(lon2-lon1); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c; // Distance in m
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180)
}

async function sendAlertEmail(caregiverId: string, supabase: any, type: string, lat: number, lng: number) {
    const key = Deno.env.get("RESEND_API_KEY");
    if (!key) {
        console.error("Missing RESEND_API_KEY");
        return;
    }

    // Get Caregiver Email
    let email = "";
    // Try profiles first
    const { data: profile } = await supabase.from("profiles").select("email").eq("id", caregiverId).single();
    if (profile && profile.email) {
        email = profile.email;
    } else {
        // Fallback to auth
        const { data: user } = await supabase.auth.admin.getUserById(caregiverId);
        if (user && user.user) email = user.user.email;
    }

    if (!email) {
        console.error("Could not find caregiver email");
        return;
    }

    const subject = type === 'EXIT' ? '🚨 ALERTA: Paciente salió de Zona Segura' : '✅ Paciente entró en Zona Segura';
    const message = type === 'EXIT' 
        ? 'El paciente ha SALIDO de la zona segura.' 
        : 'El paciente ha ENTRADO en la zona segura.';

    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${key}`
        },
        body: JSON.stringify({
            from: "Alerta <onboarding@resend.dev>", 
            to: [email],
            subject: subject,
            html: `
              <h2>${subject}</h2>
              <p>${message}</p>
              <p>
                <a href="https://www.google.com/maps/search/?api=1&query=${lat},${lng}">
                  Ver ubicación en Mapa
                </a>
              </p>
              <p>Coordenadas: ${lat}, ${lng}</p>
            `
        })
    });
    
    if (!res.ok) {
        console.error("Failed to send email:", await res.text());
    } else {
        console.log("Email sent successfully");
    }
}
