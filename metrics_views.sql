-- ==========================================
-- CAPA DE MÉTRICAS Y ESTADÍSTICAS COGNITIVAS (CORREGIDA)
-- ==========================================
-- Estas vistas están diseñadas para ser consumidas desde el frontend
-- y proporcionan datos fundamentales para el seguimiento clínico.

-- Eliminar vistas existentes para permitir cambios en la estructura de columnas
DROP VIEW IF EXISTS public.metrics_weekly_trend;
DROP VIEW IF EXISTS public.metrics_daily_accuracy;
DROP VIEW IF EXISTS public.metrics_avg_session_time;
DROP VIEW IF EXISTS public.metrics_daily_completion;
DROP VIEW IF EXISTS public.metrics_total_levels;

-- A) TOTAL DE NIVELES COMPLETADOS
CREATE OR REPLACE VIEW public.metrics_total_levels AS
SELECT 
    gs.user_id,
    COUNT(glr.id) as total_completed
FROM public.game_level_results glr
JOIN public.game_sessions gs ON glr.session_id = gs.id
WHERE glr.completed = true
GROUP BY gs.user_id;

-- B) NIVELES COMPLETADOS POR DÍA (Últimos 7 días)
CREATE OR REPLACE VIEW public.metrics_daily_completion AS
SELECT 
    gs.user_id,
    glr.created_at::date as day,
    COUNT(glr.id) as levels_completed
FROM public.game_level_results glr
JOIN public.game_sessions gs ON glr.session_id = gs.id
WHERE glr.completed = true 
  AND glr.created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY gs.user_id, glr.created_at::date;

-- C) TIEMPO PROMEDIO POR SESIÓN
CREATE OR REPLACE VIEW public.metrics_avg_session_time AS
SELECT 
    user_id,
    ROUND(AVG(EXTRACT(EPOCH FROM (ended_at - started_at))))::integer as avg_time_seconds
FROM public.game_sessions
WHERE ended_at IS NOT NULL
GROUP BY user_id;

-- D) ACIERTOS VS ERRORES POR DÍA
CREATE OR REPLACE VIEW public.metrics_daily_accuracy AS
SELECT 
    gs.user_id,
    glr.created_at::date as day,
    SUM(glr.hits) as total_hits,
    SUM(glr.errors) as total_errors
FROM public.game_level_results glr
JOIN public.game_sessions gs ON glr.session_id = gs.id
GROUP BY gs.user_id, glr.created_at::date;

-- E) TENDENCIA SEMANAL (Uso Clínico)
-- Métrica refinada: Compara el desempeño (aciertos - errores) entre semanas.
CREATE OR REPLACE VIEW public.metrics_weekly_trend AS
WITH weekly_stats AS (
    SELECT 
        gs.user_id,
        SUM(glr.hits - glr.errors)
          FILTER (WHERE glr.created_at >= CURRENT_DATE - INTERVAL '7 days')
          AS current_week_score,
        SUM(glr.hits - glr.errors)
          FILTER (
            WHERE glr.created_at < CURRENT_DATE - INTERVAL '7 days'
              AND glr.created_at >= CURRENT_DATE - INTERVAL '14 days'
          )
          AS previous_week_score
    FROM public.game_level_results glr
    JOIN public.game_sessions gs ON glr.session_id = gs.id
    WHERE glr.completed = true
    GROUP BY gs.user_id
)
SELECT 
    user_id,
    current_week_score,
    previous_week_score,
    CASE 
        WHEN previous_week_score IS NULL OR previous_week_score = 0 THEN NULL
        ELSE ROUND(
          ((current_week_score - previous_week_score)::numeric / previous_week_score) * 100,
          2
        )
    END AS percentage_change
FROM weekly_stats;

-- Comentarios detallados
COMMENT ON VIEW public.metrics_total_levels IS 'Niveles totales ganados (Sentido de logro).';
COMMENT ON VIEW public.metrics_daily_completion IS 'Frecuencia de entrenamiento cerebral diaria.';
COMMENT ON VIEW public.metrics_avg_session_time IS 'Capacidad de concentración y fatiga cognitiva.';
COMMENT ON VIEW public.metrics_daily_accuracy IS 'Precisión y control motor/cognitivo.';
COMMENT ON VIEW public.metrics_weekly_trend IS 'Indicador de mejora o necesidad de mayor apoyo.';
