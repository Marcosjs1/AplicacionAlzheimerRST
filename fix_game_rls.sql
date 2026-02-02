-- ================================================================
-- FIX RLS POLICIES FOR GAME SESSIONS AND RESULTS
-- ================================================================

-- 1. Enable RLS on tables (just in case)
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_level_results ENABLE ROW LEVEL SECURITY;

-- GAME SESSIONS POLICIES
-- ======================

-- Allow users to insert their own sessions
DROP POLICY IF EXISTS "Users can insert own sessions" ON public.game_sessions;
CREATE POLICY "Users can insert own sessions"
ON public.game_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own sessions (needed for endLevel)
DROP POLICY IF EXISTS "Users can update own sessions" ON public.game_sessions;
CREATE POLICY "Users can update own sessions"
ON public.game_sessions FOR UPDATE
USING (auth.uid() = user_id);

-- Allow users to view their own sessions
DROP POLICY IF EXISTS "Users can view own sessions" ON public.game_sessions;
CREATE POLICY "Users can view own sessions"
ON public.game_sessions FOR SELECT
USING (auth.uid() = user_id);


-- GAME LEVEL RESULTS POLICIES (The Fix for Error 42501)
-- =====================================================

-- Allow insert ONLY IF the session belongs to the user
DROP POLICY IF EXISTS "Users can insert results for own sessions" ON public.game_level_results;
CREATE POLICY "Users can insert results for own sessions"
ON public.game_level_results FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.game_sessions gs
    WHERE gs.id = session_id
    AND gs.user_id = auth.uid()
  )
);

-- Allow view ONLY IF the session belongs to the user
DROP POLICY IF EXISTS "Users can view results for own sessions" ON public.game_level_results;
CREATE POLICY "Users can view results for own sessions"
ON public.game_level_results FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.game_sessions gs
    WHERE gs.id = session_id
    AND gs.user_id = auth.uid()
  )
);
