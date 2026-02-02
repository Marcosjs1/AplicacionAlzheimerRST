import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../services/supabaseClient";
import { useAuth } from "../../../contexts/AuthContext";
import { BackHeader } from "../../Layout";
import { usePreferences } from "../../../contexts/PreferencesContext";

// Configuration
const GAME_NAME = "Memoria de Secuencia (Fácil)";
const GAME_TYPE = "memory_easy";
const COGNITIVE_AREA = "memory";
const MAX_LEVEL_STEPS = 6;
const INITIAL_STEPS = 2;
const SHOW_DELAY = 600;
const HIGHLIGHT_TIME = 400;

const COLORS = [
  { id: 0, name: "blue", bg: "bg-blue-500", highlight: "bg-blue-300", sound: 261.63 }, // C4
  { id: 1, name: "red", bg: "bg-red-500", highlight: "bg-red-300", sound: 329.63 },  // E4
  { id: 2, name: "green", bg: "bg-green-500", highlight: "bg-green-300", sound: 392.00 }, // G4
  { id: 3, name: "yellow", bg: "bg-yellow-400", highlight: "bg-yellow-200", sound: 523.25 }, // C5
];

type GameStatus = "PLAYBACK" | "USER_TURN" | "FEEDBACK" | "SUMMARY" | "LOADING";

const MemorySequenceEasyScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { volume } = usePreferences();

  // References
  const sessionIdRef = useRef<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const statsRef = useRef({ hits: 0, errors: 0, timer: 0, bestLevel: 0 });
  const timerIntervalRef = useRef<number | null>(null);

  // State
  const [status, setStatus] = useState<GameStatus>("LOADING");
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; show: boolean } | null>(null);
  const [timer, setTimer] = useState(0);
  const [gameId, setGameId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sound logic
  const playNote = useCallback((freq: number) => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) audioCtxRef.current = new AudioCtx();
      }

      if (audioCtxRef.current) {
        const ctx = audioCtxRef.current;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        gainNode.gain.value = (volume / 100) * 0.2; // Softer sound
        oscillator.frequency.value = freq;
        oscillator.type = "sine";

        oscillator.start();
        setTimeout(() => {
          oscillator.stop();
        }, HIGHLIGHT_TIME - 50);
      }
    } catch (err) {
      console.warn("Audio error:", err);
    }
  }, [volume]);

  // Sync stats ref
  useEffect(() => {
    statsRef.current.timer = timer;
    statsRef.current.bestLevel = Math.max(statsRef.current.bestLevel, sequence.length - (feedback?.isCorrect === false ? 1 : 0));
  }, [timer, sequence.length, feedback]);

  // Timer
  useEffect(() => {
    if (status !== "LOADING" && status !== "SUMMARY") {
      timerIntervalRef.current = window.setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [status]);

  // Initialize Game
  useEffect(() => {
    if (!user) return;

    const init = async () => {
      try {
        setErrorMessage(null);
        const { data: existing, error: fetchErr } = await supabase
          .from("games")
          .select("id")
          .eq("name", GAME_NAME)
          .limit(1)
          .maybeSingle();

        if (fetchErr) throw fetchErr;

        let finalGameId = existing?.id;

        if (!finalGameId) {
          const { data: created, error: createErr } = await supabase
            .from("games")
            .insert([{
              name: GAME_NAME,
              description: "Observa la secuencia de colores y repítela. Entrena memoria y concentración.",
              cognitive_area: COGNITIVE_AREA,
              max_level: 1,
            }])
            .select("id")
            .single();
          if (createErr) throw createErr;
          finalGameId = created.id;
        }

        setGameId(finalGameId);
        startSession(finalGameId);
      } catch (err: any) {
        console.error("Init Error:", err);
        setErrorMessage(err.message || "Error al cargar el juego");
        setStatus("LOADING");
      }
    };

    init();
  }, [user]);

  const startSession = async (gId: string) => {
    try {
      const { data, error } = await supabase
        .from("game_sessions")
        .insert([{
          user_id: user?.id,
          game_id: gId,
          game_type: GAME_TYPE,
          started_at: new Date().toISOString(),
          completed: false,
        }])
        .select("id")
        .single();

      if (error) throw error;
      sessionIdRef.current = data.id;
      
      // Reset game state
      setTimer(0);
      statsRef.current = { hits: 0, errors: 0, timer: 0, bestLevel: 0 };
      newGame();
    } catch (err) {
      console.error("Session Error:", err);
      setErrorMessage("No se pudo iniciar la sesión");
    }
  };

  const newGame = () => {
    const firstSeq = Array.from({ length: INITIAL_STEPS }, () => Math.floor(Math.random() * 4));
    setSequence(firstSeq);
    playSequence(firstSeq);
  };

  const playSequence = async (seq: number[]) => {
    setStatus("PLAYBACK");
    setUserSequence([]);
    
    // Wait a bit before starting
    await new Promise(r => setTimeout(r, 800));

    for (let i = 0; i < seq.length; i++) {
      const colorId = seq[i];
      setHighlightedId(colorId);
      playNote(COLORS[colorId].sound);
      await new Promise(r => setTimeout(r, HIGHLIGHT_TIME));
      setHighlightedId(null);
      await new Promise(r => setTimeout(r, SHOW_DELAY - HIGHLIGHT_TIME));
    }

    setStatus("USER_TURN");
  };

  const handleButtonClick = (id: number) => {
    if (status !== "USER_TURN" || highlightedId !== null) return;

    playNote(COLORS[id].sound);
    setHighlightedId(id);
    setTimeout(() => setHighlightedId(null), 200);

    const nextUserSeq = [...userSequence, id];
    setUserSequence(nextUserSeq);

    // Check correctness
    if (id !== sequence[nextUserSeq.length - 1]) {
      handleStepResult(false);
      return;
    }

    // Check if finished sequence
    if (nextUserSeq.length === sequence.length) {
      handleStepResult(true);
    }
  };

  const handleStepResult = (isCorrect: boolean) => {
    setStatus("FEEDBACK");
    setFeedback({ isCorrect, show: true });

    if (isCorrect) {
      statsRef.current.hits += 1;
      const isComplete = sequence.length >= MAX_LEVEL_STEPS;

      setTimeout(() => {
        setFeedback(null);
        if (isComplete) {
          finishGame(true);
        } else {
          const nextSeq = [...sequence, Math.floor(Math.random() * 4)];
          setSequence(nextSeq);
          playSequence(nextSeq);
        }
      }, 1000);
    } else {
      statsRef.current.errors = 1;
      setTimeout(() => {
        setFeedback(null);
        finishGame(false);
      }, 1500);
    }
  };

  const finishGame = async (completed: boolean) => {
    setStatus("SUMMARY");
    const sid = sessionIdRef.current;
    if (!sid || !user) return;

    const { hits, errors, timer, bestLevel } = statsRef.current;
    const accuracy = Math.round((hits / (hits + errors)) * 100) || 0;

    try {
      // 1. Update Session
      await supabase
        .from("game_sessions")
        .update({
          ended_at: new Date().toISOString(),
          total_attempts: hits + errors,
          total_hits: hits,
          total_errors: errors,
          completed: true,
        })
        .eq("id", sid);

      // 2. Insert Level Results
      await supabase.from("game_level_results").insert([{
        session_id: sid,
        level: 1,
        attempts: hits + errors,
        hits: hits,
        errors: errors,
        completed: completed,
        time_spent_seconds: timer,
      }]);

      // 3. Update Progress
      await supabase.from("game_progress").insert([{
        user_id: user.id,
        game_type: GAME_TYPE,
        score: bestLevel, // Use best sequence length as score
        details: {
          category: COGNITIVE_AREA,
          difficulty: "easy",
          best_level: bestLevel,
          total_rounds: hits + errors,
          correct_sequences: hits,
          wrong_sequences: errors,
          accuracy: accuracy,
          duration_seconds: timer,
        },
        played_at: new Date().toISOString(),
      }]);
    } catch (err) {
      console.error("Save Error:", err);
    }
  };

  const handleExit = async () => {
    if (status !== "SUMMARY" && status !== "LOADING") {
       const ok = window.confirm("¿Deseas salir? Tu progreso no se guardará.");
       if (!ok) return;
    }
    navigate(-1);
  };

  // UI Components
  if (errorMessage) {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold mb-4">{errorMessage}</h2>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-primary text-white rounded-xl">Reintentar</button>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display">
      <BackHeader title={GAME_NAME} onBack={handleExit} />

      {/* HUD */}
      <div className="px-6 py-4 flex justify-between items-center bg-white dark:bg-surface-dark shadow-sm">
        <div className="flex flex-col">
          <span className="text-xs text-slate-500 uppercase font-bold">Rondas</span>
          <span className="text-xl font-bold text-primary">{statsRef.current.hits}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-slate-500 uppercase font-bold">Tiempo</span>
          <span className="text-xl font-bold">{timer}s</span>
        </div>
      </div>

      {/* Main Game Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-background-dark">
        {status === "SUMMARY" ? (
          <div className="w-full max-w-md bg-white dark:bg-surface-dark rounded-[32px] p-8 shadow-2xl text-center animate-in zoom-in-95 duration-500">
            <h2 className="text-3xl font-black mb-6">¡Fin del Juego!</h2>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Nivel Máximo</p>
                <p className="text-3xl font-black text-primary">{statsRef.current.bestLevel}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Secuencias</p>
                <p className="text-3xl font-black text-green-600">{statsRef.current.hits}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Tiempo</p>
                <p className="text-2xl font-black">{timer}s</p>
              </div>
               <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Precisión</p>
                <p className="text-2xl font-black text-primary">
                  {Math.round((statsRef.current.hits / (statsRef.current.hits + statsRef.current.errors)) * 100) || 0}%
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <button 
                onClick={() => gameId && startSession(gameId)}
                className="w-full py-4 bg-primary text-white rounded-2xl font-black text-lg shadow-lg"
              >
                Jugar de nuevo
              </button>
              <button 
                onClick={() => navigate(-1)}
                className="w-full py-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-2xl font-bold"
              >
                Volver
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-sm flex flex-col items-center">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-8 text-center">
              {status === "PLAYBACK" ? "Mirá la secuencia" : "Tu turno"}
            </h2>

            <div className="grid grid-cols-2 gap-4 aspect-square w-full">
              {COLORS.map(color => (
                <button
                  key={color.id}
                  onClick={() => handleButtonClick(color.id)}
                  disabled={status !== "USER_TURN" || highlightedId !== null}
                  className={`
                    aspect-square rounded-[32px] transition-all transform active:scale-95 duration-200 shadow-lg
                    ${highlightedId === color.id ? color.highlight : color.bg}
                    ${status !== "USER_TURN" ? "cursor-default" : "cursor-pointer"}
                    border-4 border-white dark:border-white/10
                  `}
                />
              ))}
            </div>

            {/* Feedback Overlay */}
            <div className="h-16 mt-8 flex items-center justify-center">
              {feedback?.show && (
                <div className="flex items-center gap-3 animate-in slide-in-from-bottom-2 duration-300">
                  <span className={`material-symbols-outlined text-4xl ${feedback.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                    {feedback.isCorrect ? 'check_circle' : 'cancel'}
                  </span>
                  <p className={`text-2xl font-black ${feedback.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {feedback.isCorrect ? '¡Correcto!' : '¡Incorrecto!'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MemorySequenceEasyScreen;
