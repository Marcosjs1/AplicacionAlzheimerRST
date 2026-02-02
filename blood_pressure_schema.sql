-- Create blood_pressure_records table
CREATE TABLE IF NOT EXISTS public.blood_pressure_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    systolic INTEGER NOT NULL,
    diastolic INTEGER NOT NULL,
    pulse INTEGER,
    notes TEXT,
    measured_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blood_pressure_records ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_blood_pressure_patient_id ON public.blood_pressure_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_blood_pressure_measured_at ON public.blood_pressure_records(measured_at DESC);

-- Policies

-- 1. Patient: CRUD complete solo de sus registros
CREATE POLICY "Patients can manage their own blood pressure records"
ON public.blood_pressure_records
FOR ALL
TO authenticated
USING (auth.uid() = patient_id)
WITH CHECK (auth.uid() = patient_id);

-- 2. Cuidador: Solo SELECT de registros del paciente vinculado
CREATE POLICY "Caregivers can view linked patients' blood pressure records"
ON public.blood_pressure_records
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.caregiver_links
        WHERE caregiver_id = auth.uid()
        AND patient_id = public.blood_pressure_records.patient_id
        AND status = 'active'
    )
);
