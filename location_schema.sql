-- ================================================================
-- GEOFENCING & LOCATION SYSTEM
-- ================================================================

-- 1. EXTENSIÓN POSTGis (Opcional, pero haremos cálculo Haversine manual en Edge Function para no depender de extensiones complejas si no están activas. Usaremos float simples para lat/lng).

-- 2. TABLA: patient_locations
-- Almacena la ÚLTIMA ubicación conocida de cada paciente.
-- Se usa UPSERT sobre user_id.
CREATE TABLE IF NOT EXISTS public.patient_locations (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    accuracy DOUBLE PRECISION DEFAULT 0, -- en metros
    is_inside_safe_zone BOOLEAN DEFAULT true, -- Estado actual
    last_geofence_event_at TIMESTAMPTZ, -- Cuándo cambió de estado por última vez
    last_alert_sent_at TIMESTAMPTZ, -- Para cooldown de correos
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.patient_locations ENABLE ROW LEVEL SECURITY;

-- 3. TABLA: safe_zones
-- Configuración de zona segura. ID único por paciente.
CREATE TABLE IF NOT EXISTS public.safe_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    caregiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    center_lat DOUBLE PRECISION NOT NULL,
    center_lng DOUBLE PRECISION NOT NULL,
    radius_m DOUBLE PRECISION NOT NULL DEFAULT 100, -- Radio en metros
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Restricción: Solo 1 zona por paciente
    CONSTRAINT unique_zone_per_patient UNIQUE (patient_id)
);

ALTER TABLE public.safe_zones ENABLE ROW LEVEL SECURITY;

-- 4. TABLA: zone_alerts
-- Historial de eventos (Solo inserts)
CREATE TABLE IF NOT EXISTS public.zone_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    caregiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, -- Denormalizado para queries rápidas
    event_type TEXT NOT NULL CHECK (event_type IN ('ENTER', 'EXIT')),
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.zone_alerts ENABLE ROW LEVEL SECURITY;


-- ================================================================
-- POLICIAS RLS
-- ================================================================

-- A) patient_locations
-- 1. Paciente: Puede insertar/actualizar SU propia ubicación.
CREATE POLICY "Paciente gestiona su ubicacion"
ON public.patient_locations
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 2. Cuidador: Puede VER la ubicación de sus pacientes vinculados.
CREATE POLICY "Cuidador ve ubicacion de paciente"
ON public.patient_locations
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.caregiver_links
        WHERE caregiver_id = auth.uid() AND patient_id = public.patient_locations.user_id
    )
);

-- 3. Servicio (Edge Function) necesita poder actualizar is_inside_safe_zone, etc.
-- Supabase Service Role se salta RLS, pero si usáramos función RPC con 'security definer', ok.
-- Aquí asumimos que la Edge Function usa SERVICE_ROLE_KEY.

-- B) safe_zones
-- 1. Cuidador: Puede crear/editar zonas para sus pacientes vinculados.
CREATE POLICY "Cuidador gestiona zonas de paciente"
ON public.safe_zones
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.caregiver_links
        WHERE caregiver_id = auth.uid() AND patient_id = public.safe_zones.patient_id
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.caregiver_links
        WHERE caregiver_id = auth.uid() AND patient_id = public.safe_zones.patient_id
    )
);

-- 2. Paciente: Puede leer su propia zona (para mostrar en mapa si quisiera, o debugging).
CREATE POLICY "Paciente ve su zona"
ON public.safe_zones
FOR SELECT
USING (auth.uid() = patient_id);


-- C) zone_alerts
-- 1. Cuidador ve histórico
CREATE POLICY "Cuidador ve alertas"
ON public.zone_alerts
FOR SELECT
USING (
    caregiver_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM public.caregiver_links
        WHERE caregiver_id = auth.uid() AND patient_id = public.zone_alerts.patient_id
    )
);

-- 2. Service Role (Edge Function): Inserta alertas. (Bypass RLS).

-- ================================================================
-- INDEXES
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_patient_locations_user_id ON public.patient_locations(user_id);
CREATE INDEX IF NOT EXISTS idx_safe_zones_patient_id ON public.safe_zones(patient_id);
CREATE INDEX IF NOT EXISTS idx_zone_alerts_patient_id ON public.zone_alerts(patient_id);
CREATE INDEX IF NOT EXISTS idx_zone_alerts_caregiver_id ON public.zone_alerts(caregiver_id);
