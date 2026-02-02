-- 1) Crear tabla public.caregiver_invites
CREATE TABLE IF NOT EXISTS public.caregiver_invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    caregiver_email TEXT NOT NULL,
    code_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2) Agregar índices recomendados
CREATE INDEX IF NOT EXISTS idx_caregiver_invites_patient_id ON public.caregiver_invites(patient_id);
CREATE INDEX IF NOT EXISTS idx_caregiver_invites_caregiver_email ON public.caregiver_invites(caregiver_email);
CREATE INDEX IF NOT EXISTS idx_caregiver_invites_expires_at ON public.caregiver_invites(expires_at);
CREATE INDEX IF NOT EXISTS idx_caregiver_invites_used ON public.caregiver_invites(used);

-- 3) Activar RLS
ALTER TABLE public.caregiver_invites ENABLE ROW LEVEL SECURITY;

-- 4) Bloquear acceso directo desde frontend (solo permitir acceso via Edge Functions / Service Role)
-- Por defecto, al no haber políticas, todo acceso no-admin está denegado.
-- No creamos políticas de SELECT/INSERT/UPDATE para public o authenticated.
