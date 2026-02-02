-- Rename user_id to patient_id to match convention
ALTER TABLE public.tasks 
RENAME COLUMN user_id TO patient_id;

-- Add new columns
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS scheduled_time TIME DEFAULT '09:00:00',
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Enable read access for own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Enable insert access for own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Enable update access for own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Enable delete access for own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Individuals can manage their own tasks." ON public.tasks;

-- RLS: Patient can do everything on their own tasks
CREATE POLICY "Patient manages own tasks"
ON public.tasks
FOR ALL
USING (auth.uid() = patient_id);

-- RLS: Linked Caregiver can do everything on their linked patient's tasks
CREATE POLICY "Caregiver manages linked patient tasks"
ON public.tasks
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM caregiver_links
        WHERE caregiver_links.caregiver_id = auth.uid()
        AND caregiver_links.patient_id = tasks.patient_id
    )
);

-- Grant permissions
GRANT ALL ON public.tasks TO authenticated;
GRANT ALL ON public.tasks TO service_role;
