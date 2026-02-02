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

function sha256Hex(input: string) {
  const encoder = new TextEncoder();
  return crypto.subtle.digest("SHA-256", encoder.encode(input)).then((hashBuffer) => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  });
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const method = req.method;
  const authHeader = req.headers.get("authorization") ?? req.headers.get("Authorization");

  console.log(`[Request] Origin: ${origin} | Method: ${method} | Has Auth: ${Boolean(authHeader)}`);
  
  // DEBUG AGRESIVO
  if (authHeader) {
      console.log(`[Debug Auth] Header Start: ${authHeader.substring(0, 20)}...`);
  }
  console.log(`[Debug Config] Anon Key Start: ${SUPABASE_ANON_KEY.substring(0, 10)}... (Length: ${SUPABASE_ANON_KEY.length})`);

  const corsHeaders = getCorsHeaders(origin);

  const jsonResponse = (body: any, status = 200) => {
    return new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  };

  if (method === "OPTIONS") {
    return jsonResponse({ message: "ok" });
  }

  try {
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    if (!authHeader) {
      return jsonResponse({ error: "No autorizado (falta Authorization)" }, 401);
    }

    // Limpieza y validación explícita
    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) {
        return jsonResponse({ error: "Token vacío" }, 401);
    }

    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: { Authorization: authHeader },
      },
      auth: { persistSession: false },
    });

    // Pasamos el token explícitamente a getUser
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      console.error("[Auth Error Details]", authError);
      return jsonResponse({ error: `[Function Auth Error] Invalid JWT: ${authError?.message}` }, 401);
    }
    
    // Usamos el 'user' validado
    const patient = user;
    console.log(`[Auth Success] User ID: ${patient.id}`);

    const body = await req.json().catch(() => null);
    const caregiverEmailRaw = body?.caregiverEmail;

    if (!caregiverEmailRaw || typeof caregiverEmailRaw !== "string") {
      return jsonResponse({ error: "Email del cuidador requerido" }, 400);
    }

    const caregiverEmail = caregiverEmailRaw.trim().toLowerCase();

    if (!isValidEmail(caregiverEmail)) {
      return jsonResponse({ error: "Email inválido" }, 400);
    }

    // caregiver existe y es caregiver
    const { data: caregiverProfile, error: caregiverError } = await admin
      .from("profiles")
      .select("id, role")
      .eq("email", caregiverEmail)
      .eq("role", "caregiver")
      .maybeSingle();

    if (caregiverError || !caregiverProfile) {
      return jsonResponse(
        { error: "El cuidador debe registrarse primero con rol caregiver" },
        404
      );
    }

    if (caregiverProfile.id === patient.id) {
      return jsonResponse({ error: "No puedes vincularte contigo mismo" }, 400);
    }

    // evitar duplicados 1:1
    const { data: existingPatientLink } = await admin
      .from("caregiver_links")
      .select("id")
      .eq("patient_id", patient.id)
      .maybeSingle();

    if (existingPatientLink) {
      return jsonResponse({ error: "Ya tienes un cuidador vinculado" }, 400);
    }

    const { data: existingCaregiverLink } = await admin
      .from("caregiver_links")
      .select("id")
      .eq("caregiver_id", caregiverProfile.id)
      .maybeSingle();

    if (existingCaregiverLink) {
      return jsonResponse(
        { error: "Este cuidador ya está vinculado a otro paciente" },
        400
      );
    }

    // invalidar invites previos
    await admin
      .from("caregiver_invites")
      .update({ used: true })
      .eq("patient_id", patient.id)
      .eq("caregiver_email", caregiverEmail)
      .eq("used", false);

    // generar código
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = await sha256Hex(code);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    const { error: insertError } = await admin.from("caregiver_invites").insert({
      patient_id: patient.id,
      caregiver_email: caregiverEmail,
      code_hash: codeHash,
      expires_at: expiresAt,
    });

    if (insertError) {
      return jsonResponse({ error: insertError.message }, 500);
    }

    // enviar mail
    const mailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "FullSaludAlzheimer <onboarding@resend.dev>",
        to: [caregiverEmail],
        subject: "Código de vinculación de cuidador",
        html: `<p><b>Código:</b> ${code}</p><p>Expira en 15 minutos.</p>`,
      }),
    });

    if (!mailRes.ok) {
      const txt = await mailRes.text();
      console.error("[Resend error]", txt);
      return jsonResponse({ error: "No se pudo enviar el email" }, 500);
    }

    return jsonResponse({ success: true });
  } catch (err: any) {
    console.error("[Unexpected error]", err);
    return jsonResponse({ error: err?.message ?? "Error inesperado" }, 500);
  }
});