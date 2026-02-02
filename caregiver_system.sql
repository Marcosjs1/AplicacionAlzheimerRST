-- ================================================================

-- 0) CORRECCIÓN DE ESQUEMA (Si falta la columna game_type)
-- Agregamos la columna game_type a game_sessions si no existe.
ALTER TABLE public.game_sessions 
ADD COLUMN IF NOT EXISTS game_type TEXT;

-- A) TABLA DE VÍNCULO 1 A 1
-- Esta tabla gestiona la relación exclusiva entre un cuidador y un paciente.
CREATE TABLE IF NOT EXISTS public.caregiver_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    caregiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    -- Restricciones UNIQUE para forzar relación 1:1 estricta
    CONSTRAINT unique_caregiver UNIQUE (caregiver_id),
    CONSTRAINT unique_patient UNIQUE (patient_id),
    -- Evitar que un usuario se vincule consigo mismo
    CONSTRAINT cannot_link_self CHECK (caregiver_id <> patient_id)
);

-- B) RLS Y POLICIES PARA caregiver_links
ALTER TABLE public.caregiver_links ENABLE ROW LEVEL SECURITY;

-- 1. Los involucrados (cuidador o paciente) pueden ver el vínculo.
CREATE POLICY "Involucrados pueden ver su vínculo" 
ON public.caregiver_links 
FOR SELECT 
USING (
    auth.uid() = caregiver_id OR auth.uid() = patient_id
);

-- 2. Solo el cuidador puede insertar el vínculo (asumiendo que es quien lo inicia).
-- Nota: En un flujo de producción, esto podría requerir una invitación/confirmación.
CREATE POLICY "Cuidadores pueden insertar vínculos" 
ON public.caregiver_links 
FOR INSERT 
WITH CHECK (
    auth.uid() = caregiver_id
);

-- C) ACTUALIZACIÓN DE RLS EN TABLAS BASE PARA PERMITIR ACCESO AL CUIDADOR
-- Para que el cuidador pueda leer las métricas, necesita permiso SELECT en las tablas base.

-- Permiso en game_sessions
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'game_sessions' AND policyname = 'Cuidadores pueden ver sesiones de sus pacientes'
    ) THEN
        CREATE POLICY "Cuidadores pueden ver sesiones de sus pacientes"
        ON public.game_sessions FOR SELECT
        USING (
            EXISTS (
                SELECT 1 FROM public.caregiver_links
                WHERE caregiver_id = auth.uid() AND patient_id = public.game_sessions.user_id
            )
        );
    END IF;
END $$;

-- Permiso en game_level_results
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'game_level_results' AND policyname = 'Cuidadores pueden ver resultados de sus pacientes'
    ) THEN
        CREATE POLICY "Cuidadores pueden ver resultados de sus pacientes"
        ON public.game_level_results FOR SELECT
        USING (
            EXISTS (
                SELECT 1 FROM public.game_sessions gs
                JOIN public.caregiver_links cl ON cl.patient_id = gs.user_id
                WHERE gs.id = public.game_level_results.session_id
                AND cl.caregiver_id = auth.uid()
            )
        );
    END IF;
END $$;


-- D) MÉTRICAS POR TIPO DE JUEGO (General)
-- Estas vistas facilitan el filtrado por 'memory', 'attention', 'calculation'.

-- 1. Vista para Pacientes (Filtro por Tipo de Juego)
CREATE OR REPLACE VIEW public.metrics_by_game_type AS
SELECT 
    gs.user_id,
    gs.game_type,
    glr.created_at::date as day,
    SUM(glr.hits) as total_hits,
    SUM(glr.errors) as total_errors,
    COUNT(glr.id) FILTER (WHERE glr.completed = true) as levels_completed
FROM public.game_level_results glr
JOIN public.game_sessions gs ON glr.session_id = gs.id
GROUP BY gs.user_id, gs.game_type, glr.created_at::date;

-- 2. Vista equivalente para Cuidadores
CREATE OR REPLACE VIEW public.metrics_caregiver_by_game_type AS
SELECT 
    cl.caregiver_id,
    cl.patient_id,
    m.game_type,
    m.day,
    m.total_hits,
    m.total_errors,
    m.levels_completed
FROM public.metrics_by_game_type m
JOIN public.caregiver_links cl ON m.user_id = cl.patient_id
WHERE cl.caregiver_id = auth.uid();


-- E) MÉTRICAS ESPECÍFICAS PARA EL CUIDADOR
-- Estas vistas devuelven datos filtrados automáticamente por el cuidador autenticado.

-- 1. Precisión Diaria (Caregiver)
CREATE OR REPLACE VIEW public.metrics_caregiver_daily_accuracy AS
SELECT 
    cl.caregiver_id,
    cl.patient_id,
    m.day,
    m.total_hits,
    m.total_errors
FROM public.metrics_daily_accuracy m
JOIN public.caregiver_links cl ON m.user_id = cl.patient_id
WHERE cl.caregiver_id = auth.uid();

-- 2. Completitud Diaria (Caregiver)
CREATE OR REPLACE VIEW public.metrics_caregiver_daily_completion AS
SELECT 
    cl.caregiver_id,
    cl.patient_id,
    m.day,
    m.levels_completed
FROM public.metrics_daily_completion m
JOIN public.caregiver_links cl ON m.user_id = cl.patient_id
WHERE cl.caregiver_id = auth.uid();

-- 3. Niveles Totales (Caregiver)
CREATE OR REPLACE VIEW public.metrics_caregiver_total_levels AS
SELECT 
    cl.caregiver_id,
    cl.patient_id,
    m.total_completed
FROM public.metrics_total_levels m
JOIN public.caregiver_links cl ON m.user_id = cl.patient_id
WHERE cl.caregiver_id = auth.uid();

-- 4. Tiempo Promedio de Sesión (Caregiver)
CREATE OR REPLACE VIEW public.metrics_caregiver_avg_session_time AS
SELECT 
    cl.caregiver_id,
    cl.patient_id,
    m.avg_time_seconds
FROM public.metrics_avg_session_time m
JOIN public.caregiver_links cl ON m.user_id = cl.patient_id
WHERE cl.caregiver_id = auth.uid();

-- 5. Tendencia Semanal (Caregiver)
CREATE OR REPLACE VIEW public.metrics_caregiver_weekly_trend AS
SELECT 
    cl.caregiver_id,
    cl.patient_id,
    m.current_week_score,
    m.previous_week_score,
    m.percentage_change
FROM public.metrics_weekly_trend m
JOIN public.caregiver_links cl ON m.user_id = cl.patient_id
WHERE cl.caregiver_id = auth.uid();


-- Comentarios de base de datos
COMMENT ON TABLE public.caregiver_links IS 'Relación 1:1 estricta entre cuidador y paciente.';
COMMENT ON VIEW public.metrics_caregiver_by_game_type IS 'Métricas detalladas por tipo de juego visibles para el cuidador.';
COMMENT ON VIEW public.metrics_caregiver_weekly_trend IS 'Resumen clínico del paciente para uso del cuidador.';
