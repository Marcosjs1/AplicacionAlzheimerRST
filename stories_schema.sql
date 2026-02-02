-- ================================================================
-- REMINISCENCE SYSTEM (MY STORY)
-- ================================================================

-- 1. TABLA: story_albums
CREATE TABLE IF NOT EXISTS public.story_albums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_by UUID REFERENCES auth.users(id), -- Puede ser el paciente o el cuidador
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. TABLA: story_photos
CREATE TABLE IF NOT EXISTS public.story_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    album_id UUID NOT NULL REFERENCES public.story_albums(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, -- Redundante pero útil para RLS rápido
    created_by UUID REFERENCES auth.users(id),
    image_path TEXT NOT NULL, -- Ruta en Storage: patient_id/album_id/filename
    caption TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_story_albums_patient ON public.story_albums(patient_id);
CREATE INDEX IF NOT EXISTS idx_story_photos_album ON public.story_photos(album_id);
CREATE INDEX IF NOT EXISTS idx_story_photos_patient ON public.story_photos(patient_id);

-- Enable RLS
ALTER TABLE public.story_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_photos ENABLE ROW LEVEL SECURITY;

-- ================================================================
-- RLS POLICIES (DB)
-- ================================================================

-- ALBUMS
-- Patient: CRUD Own
CREATE POLICY "Patient manages own albums" ON public.story_albums
FOR ALL USING (auth.uid() = patient_id) WITH CHECK (auth.uid() = patient_id);

-- Caregiver: CRUD Linked Patient
CREATE POLICY "Caregiver manages linked patient albums" ON public.story_albums
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.caregiver_links
        WHERE caregiver_id = auth.uid() AND patient_id = public.story_albums.patient_id
    )
) WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.caregiver_links
        WHERE caregiver_id = auth.uid() AND patient_id = public.story_albums.patient_id
    )
);

-- PHOTOS
-- Patient: CRUD Own
CREATE POLICY "Patient manages own photos" ON public.story_photos
FOR ALL USING (auth.uid() = patient_id) WITH CHECK (auth.uid() = patient_id);

-- Caregiver: CRUD Linked Patient
CREATE POLICY "Caregiver manages linked patient photos" ON public.story_photos
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.caregiver_links
        WHERE caregiver_id = auth.uid() AND patient_id = public.story_photos.patient_id
    )
) WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.caregiver_links
        WHERE caregiver_id = auth.uid() AND patient_id = public.story_photos.patient_id
    )
);

-- ================================================================
-- STORAGE BUCKET & POLICIES
-- ================================================================

-- Create Bucket (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('story_photos', 'story_photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- Helper logic: path is patient_id/album_id/filename
-- We check if the first segment of the path matches permission

-- 1. SELECT (Public view or Restricted? User asked for patient/caregiver visibility)
-- Let's make it restricted to be safe, or public if we want to use public URLs easily.
-- Given requirement: "Todo lo que suba el cuidador lo debe ver también el paciente."
-- We'll enable SELECT for Authenticated users who match criteria.

CREATE POLICY "Give access to own folder or linked folder" ON storage.objects
FOR SELECT TO authenticated USING (
    bucket_id = 'story_photos' AND (
        -- Is Patient and path starts with their ID
        (storage.foldername(name))[1]::uuid = auth.uid() 
        OR
        -- Is Linked Caregiver
        EXISTS (
            SELECT 1 FROM public.caregiver_links
            WHERE caregiver_id = auth.uid() 
            AND patient_id = (storage.foldername(name))[1]::uuid
        )
    )
);

-- 2. INSERT (Upload)
CREATE POLICY "Allow upload to own folder or linked folder" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'story_photos' AND (
        -- Is Patient
        (storage.foldername(name))[1]::uuid = auth.uid() 
        OR
        -- Is Linked Caregiver
        EXISTS (
            SELECT 1 FROM public.caregiver_links
            WHERE caregiver_id = auth.uid() 
            AND patient_id = (storage.foldername(name))[1]::uuid
        )
    )
);

-- 3. DELETE
CREATE POLICY "Allow delete from own folder or linked folder" ON storage.objects
FOR DELETE TO authenticated USING (
    bucket_id = 'story_photos' AND (
        -- Is Patient
        (storage.foldername(name))[1]::uuid = auth.uid() 
        OR
        -- Is Linked Caregiver
        EXISTS (
            SELECT 1 FROM public.caregiver_links
            WHERE caregiver_id = auth.uid() 
            AND patient_id = (storage.foldername(name))[1]::uuid
        )
    )
);
