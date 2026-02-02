-- ================================================================
-- EMERGENCY CONTACTS SYSTEM (REAL)
-- ================================================================

-- 1. TABLA: trusted_contacts
CREATE TABLE IF NOT EXISTS public.trusted_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    -- Optional: avoid exact duplicate emails for the same patient
    CONSTRAINT unique_patient_contact_email UNIQUE(patient_id, email)
);

-- Habilitar RLS
ALTER TABLE public.trusted_contacts ENABLE ROW LEVEL SECURITY;

-- ================================================================
-- POLICIES RLS
-- ================================================================

-- 1. PROPIETARIO (PACIENTE): CRUD Completo
CREATE POLICY "Pacientes gestionan sus propios contactos"
ON public.trusted_contacts
FOR ALL
USING (auth.uid() = patient_id)
WITH CHECK (auth.uid() = patient_id);

-- 2. CUIDADOR: Solo Lectura (Únicamente de su paciente vinculado)
CREATE POLICY "Cuidador ve contactos únicamente de su paciente vinculado"
ON public.trusted_contacts
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.caregiver_links
        WHERE caregiver_id = auth.uid() 
        AND patient_id = public.trusted_contacts.patient_id
    )
);

-- ================================================================
-- INDEXES
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_trusted_contacts_patient_id ON public.trusted_contacts(patient_id);

COMMENT ON TABLE public.trusted_contacts IS 'Contactos de confianza reales asociados a un paciente para envíos de SOS.';
