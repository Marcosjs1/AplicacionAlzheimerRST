-- ================================================================
-- EMERGENCY CONTACTS SYSTEM
-- ================================================================

-- 1. TABLA: emotional_contacts
CREATE TABLE IF NOT EXISTS public.emotional_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL, -- Se validará formato en frontend, aquí lo dejamos abierto o con check simple
    relationship TEXT, -- Opcional: Hijo, Hija, Amigo, etc.
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.emotional_contacts ENABLE ROW LEVEL SECURITY;

-- ================================================================
-- POLICIAS RLS
-- ================================================================

-- 1. PROPIETARIO (PACIENTE): CRUD Completo
CREATE POLICY "Usuarios gestionan sus contactos"
ON public.emotional_contacts
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 2. CUIDADOR: Solo Lectura (Si está vinculado)
CREATE POLICY "Cuidador ve contactos de su paciente"
ON public.emotional_contacts
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.caregiver_links
        WHERE caregiver_id = auth.uid() AND patient_id = public.emotional_contacts.user_id
    )
);

-- ================================================================
-- INDEXES
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_emotional_contacts_user_id ON public.emotional_contacts(user_id);

COMMENT ON TABLE public.emotional_contacts IS 'Contactos de emergencia/soporte del paciente.';
