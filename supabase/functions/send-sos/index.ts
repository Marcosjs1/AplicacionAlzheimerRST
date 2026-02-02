import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

const getCorsHeaders = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin || "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
});

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const authHeader = req.headers.get("authorization");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response("ok", { 
      status: 200, 
      headers: corsHeaders 
    });
  }

  try {
    const token = authHeader?.replace("Bearer ", "").trim();
    if (!token) {
      return new Response(JSON.stringify({ error: "No autorizado (falta token)" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader! } },
    });

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !user) {
      console.error("[Auth Error]", authError);
      return new Response(JSON.stringify({ error: "No autorizado (JWT inválido)" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const patientId = user.id;
    const body = await req.json().catch(() => ({}));
    const { location, message } = body;

    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Obtener datos del paciente
    const { data: patientProfile } = await adminClient
      .from("profiles")
      .select("name")
      .eq("id", patientId)
      .single();

    const patientName = patientProfile?.name || "Un paciente";

    // 2. Obtener email del cuidador vinculado
    const { data: linkData } = await adminClient
      .from("caregiver_links")
      .select("caregiver_id")
      .eq("patient_id", patientId)
      .maybeSingle();

    let caregiverEmail = null;
    if (linkData?.caregiver_id) {
      const { data: caregiverProfile } = await adminClient
        .from("profiles")
        .select("email")
        .eq("id", linkData.caregiver_id)
        .single();
      caregiverEmail = caregiverProfile?.email;
    }

    // 3. Obtener emails de contactos de confianza
    const { data: trustedContacts } = await adminClient
      .from("trusted_contacts")
      .select("email")
      .eq("patient_id", patientId);

    const contactEmails = (trustedContacts || []).map(topic => topic.email);

    // 4. Consolidar destinatarios (SET para únicos)
    const emailSet = new Set<string>();
    if (caregiverEmail) emailSet.add(caregiverEmail);
    contactEmails.forEach(email => emailSet.add(email));

    const recipients = Array.from(emailSet);

    if (recipients.length === 0) {
      return new Response(JSON.stringify({ error: "No hay destinatarios configurados" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 5. Enviar Correo con Resend
    const now = new Date();
    const formattedDate = now.toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" });

    const emailHtml = `
      <div style="font-family: sans-serif; padding: 20px; border: 2px solid #ff3b30; border-radius: 12px;">
        <h1 style="color: #ff3b30; margin-top: 0;">🚨 Alerta de Emergencia (SOS)</h1>
        <p>El paciente <b>${patientName}</b> ha activado el botón de ayuda.</p>
        <p style="font-size: 18px; background: #fff5f5; padding: 15px; border-left: 5px solid #ff3b30;">
          "${message || "Necesito ayuda urgente"}"
        </p>
        <p><b>Fecha y Hora:</b> ${formattedDate}</p>
        ${location ? `<p><b>Ubicación aproximada:</b> ${location}</p>` : ""}
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #666;">
          Este es un mensaje automático enviado desde FullSaludAlzheimer. Por favor, contacte al paciente o acuda a su ubicación lo antes posible.
        </p>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "FullSaludAlzheimer SOS <onboarding@resend.dev>",
        to: recipients,
        subject: `🚨 SOS Emergencia: ${patientName}`,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("[Resend Error]", errorText);
      throw new Error("Error al enviar el correo");
    }

    return new Response(JSON.stringify({ success: true, recipients: recipients.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err: any) {
    console.error("[Unexpected Error]", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
