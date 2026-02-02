-- Agregar constraint UNIQUE a patient_id para permitir UPSERT
ALTER TABLE public.safe_zones 
ADD CONSTRAINT safe_zones_patient_id_key UNIQUE (patient_id);
