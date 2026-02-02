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

function sha256Hex(input: string) {
  const encoder = new TextEncoder();
  return crypto.subtle.digest("SHA-256", encoder.encode(input)).then((hashBuffer) => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  });
}

function isSixDigitCode(code: string) {
  return /^\d{6}$/.test(code);
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const method = req.method;
  const authHeader = req.headers.get("authorization") ?? req.headers.get("Authorization");

  console.log(`[Request] Origin: ${origin} | Method: ${method} | Has Auth: ${Boolean(authHeader)}`);
  
  // DEBUG AGRESIVO (sólo para troubleshooting)
  if (authHeader) {
      console.log(`[Debug Auth] Header Start: ${authHeader.substring(0, 20)}...`);
  }
  console.log(`[Debug Config] Anon Key Start: ${SUPABASE_ANON_KEY.substring(0, 10)}...`);

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
    const codeRaw = body?.code;

    if (!codeRaw || typeof codeRaw !== "string") {
      return jsonResponse({ error: "Código requerido" }, 400);
    }

    const code = codeRaw.trim();

    if (!isSixDigitCode(code)) {
      return jsonResponse({ error: "El código debe tener 6 dígitos" }, 400);
    }

    const codeHash = await sha256Hex(code);

    const { data: existingLink } = await admin
      .from("caregiver_links")
      .select("id")
      .eq("patient_id", patient.id)
      .maybeSingle();

    if (existingLink) {
      return jsonResponse({ error: "Ya tienes un cuidador vinculado" }, 400);
    }

    const { data: invite, error: inviteError } = await admin
      .from("caregiver_invites")
      .select("*")
      .eq("patient_id", patient.id)
      .eq("code_hash", codeHash)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (inviteError || !invite) {
      return jsonResponse({ error: "Código inválido o expirado" }, 400);
    }

    const caregiverEmail = (invite.caregiver_email ?? "").trim().toLowerCase();

    const { data: caregiverProfile, error: profileError } = await admin
      .from("profiles")
      .select("id, role")
      .eq("email", caregiverEmail)
      .eq("role", "caregiver")
      .maybeSingle();

    if (profileError || !caregiverProfile) {
      return jsonResponse(
        { error: "El cuidador no se encuentra o no tiene rol caregiver" },
        404
      );
    }

    const { data: caregiverLink } = await admin
      .from("caregiver_links")
      .select("id")
      .eq("caregiver_id", caregiverProfile.id)
      .maybeSingle();

    if (caregiverLink) {
      return jsonResponse(
        { error: "Este cuidador ya está vinculado a otro paciente" },
        400
      );
    }

    const { error: linkError } = await admin.from("caregiver_links").insert({
      caregiver_id: caregiverProfile.id,
      patient_id: patient.id,
    });

    if (linkError) {
      return jsonResponse({ error: linkError.message }, 500);
    }

    await admin.from("caregiver_invites").update({ used: true }).eq("id", invite.id);

    return jsonResponse({ success: true });
  } catch (err: any) {
    console.error("[Unexpected error]", err);
    return jsonResponse({ error: err?.message ?? "Error inesperado" }, 500);
  }
});