import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
        console.error("Missing Authorization header in request");
        return new Response(
            JSON.stringify({ error: 'Missing Authorization header' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

    // 1. Create Supabase Admin User (Bypass RLS)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 2. Create Supabase Client for Auth Validation
    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // 3. Get the user from the JWT (Bearer token) to validate caller
    const {
      data: { user },
      error: userError,
    } = await supabaseUser.auth.getUser()

    if (userError || !user) {
      console.error("Auth failed:", userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: userError }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { event_type, lat, lng, patient_id } = await req.json()

    if (!event_type) {
      return new Response(
        JSON.stringify({ error: 'Missing event_type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let finalPatientId = user.id;
    let finalCaregiverId = null;

    // Use supabaseAdmin for DB queries to safely access RLS protected data
    
    // Check 1: Is user a Patient with a linked Caregiver?
    const { data: linkAsPatient } = await supabaseAdmin
      .from('caregiver_links')
      .select('caregiver_id')
      .eq('patient_id', user.id)
      .maybeSingle()

    if (linkAsPatient) {
        finalCaregiverId = linkAsPatient.caregiver_id;
    } else {
        // Check 2: Is user a Caregiver testing for a patient?
        if (patient_id) {
            const { data: linkAsCaregiver } = await supabaseAdmin
                .from('caregiver_links')
                .select('patient_id')
                .eq('caregiver_id', user.id)
                .eq('patient_id', patient_id) // Validate link exists
                .maybeSingle()
            
            if (linkAsCaregiver) {
                finalPatientId = patient_id; 
                finalCaregiverId = user.id;  
            }
        }
    }

    if (!finalCaregiverId) {
      return new Response(
        JSON.stringify({ error: 'No caregiver linked or invalid permissions' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 4. Insert Event using Admin Client
    const { error: insertError } = await supabaseAdmin
      .from('geofence_events')
      .insert({
        patient_id: finalPatientId,
        caregiver_id: finalCaregiverId,
        event_type: event_type,
        lat: lat,
        lng: lng,
        triggered_at: new Date().toISOString()
      })

    if (insertError) {
        throw insertError
    }

    return new Response(
      JSON.stringify({ ok: true, message: 'Event logged successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
