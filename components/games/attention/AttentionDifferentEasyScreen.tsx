import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../services/supabaseClient";
import { useAuth } from "../../../contexts/AuthContext";
import { BackHeader } from "../../Layout";

// Configuration Constants
const TOTAL_ROUNDS = 10;
const GAME_NAME = "Encuentra el Diferente (Fácil)";
const GAME_TYPE = "attention_easy_different";
const COGNITIVE_AREA = "attention";

const PAIRS = [
  { normal: "🍎", different: "🍏" },
  { normal: "●", different: "○" },
  { normal: "■", different: "□" },
  { normal: "⭐", different: "🌟" },
  { normal: "🔵", different: "🔴" },
  { normal: "🐶", different: "🐱" },
  { normal: "🚗", different: "🚲" },
  { normal: "🌻", different: "🌸" },
  { normal: "🍦", different: "🍰" },
  { normal: "☀️", different: "🌙" }
];

interface GridItem {
  id: number;
  content: string;
  isDifferent: boolean;
}

type FeedbackState = { isCorrect: boolean; show: boolean } | null;

const AttentionDifferentEasyScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Game State
  const [grid, setGrid] = useState<GridItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [timer, setTimer] = useState(0);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  // App State
  const [isActive, setIsActive] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);

  // Refs
  const sessionIdRef = useRef<string | null>(null);
  const timerRef = useRef<number | null>(null);
  const attemptsRef = useRef(0);
  const statsRef = useRef({ hits: 0, errors: 0, timer: 0, attempts: 0 });

  // Sync stats ref for closures and abandonment
  useEffect(() => {
    statsRef.current = {
      hits: score,
      errors,
      timer,
      attempts: attemptsRef.current,
    };
  }, [score, errors, timer]);

  // Timer Effect
  useEffect(() => {
    if (isActive && !isGameComplete) {
      timerRef.current = window.setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isGameComplete]);

  // Initialize Game & Supabase
  useEffect(() => {
    if (!user) return;

    const init = async () => {
      try {
        setErrorMessage(null);

        // 1) Ensure game exists in catalogue
        const { data: existing, error: existingErr } = await supabase
          .from("games")
          .select("id")
          .eq("name", GAME_NAME)
          .limit(1)
          .maybeSingle();

        if (existingErr) throw existingErr;

        let finalGameId = existing?.id;

        if (!finalGameId) {
          const { data: created, error: createErr } = await supabase
            .from("games")
            .insert([
              {
                name: GAME_NAME,
                description:
                  "Encuentra el elemento que es diferente a los demás en la cuadrícula.",
                cognitive_area: COGNITIVE_AREA,
                max_level: 1,
              },
            ])
            .select("id")
            .single();

          if (createErr) throw createErr;
          finalGameId = created.id;
        }

        setGameId(finalGameId);
        await startNewSession(finalGameId);
      } catch (e: any) {
        console.error("Error init AttentionDifferentEasy:", e);
        setErrorMessage(e?.message || "Error al inicializar el juego");
        setIsLoading(false);
      }
    };

    init();
  }, [user?.id]);

  // Helpers
  const generateRoundGrid = () => {
    const randomPair = PAIRS[Math.floor(Math.random() * PAIRS.length)];
    const differentPos = Math.floor(Math.random() * 9);
    const newGrid: GridItem[] = [];

    for (let i = 0; i < 9; i++) {
      if (i === differentPos) {
        newGrid.push({ id: i, content: randomPair.different, isDifferent: true });
      } else {
        newGrid.push({ id: i, content: randomPair.normal, isDifferent: false });
      }
    }

    setGrid(newGrid);
  };

  const startNewSession = async (currentGameId: string) => {
    setIsLoading(true);

    // Reset
    setIsActive(false);
    setIsGameComplete(false);
    setTimer(0);
    setScore(0);
    setErrors(0);
    setCurrentIndex(0);
    setSelectedId(null);
    setFeedback(null);
    attemptsRef.current = 0;

    generateRoundGrid();

    try {
      const { data, error } = await supabase
        .from("game_sessions")
        .insert([
          {
            user_id: user?.id,
            game_id: currentGameId,
            game_type: GAME_TYPE,
            started_at: new Date().toISOString(),
            completed: false,
          },
        ])
        .select("id")
        .single();

      if (error) throw error;

      sessionIdRef.current = data.id;
      setIsLoading(false);
      setIsActive(true);
    } catch (e) {
      console.error("Error creating session:", e);
      setErrorMessage("Error al crear sesión de juego");
      setIsLoading(false);
    }
  };

  const handleTap = (item: GridItem) => {
    if (!isActive || feedback?.show) return;

    attemptsRef.current += 1;
    setSelectedId(item.id);

    const isCorrect = item.isDifferent;
    const newScore = isCorrect ? score + 1 : score;
    const newErrors = !isCorrect ? errors + 1 : errors;

    setScore(newScore);
    setErrors(newErrors);
    setFeedback({ isCorrect, show: true });

    setTimeout(() => {
      setFeedback(null);
      setSelectedId(null);

      if (currentIndex + 1 < TOTAL_ROUNDS) {
        setCurrentIndex((v) => v + 1);
        generateRoundGrid();
      } else {
        handleGameComplete({
          finalHits: newScore,
          finalErrors: newErrors,
          finalTimer: statsRef.current.timer,
        });
      }
    }, 800);
  };

  const handleGameComplete = async ({
    finalHits,
    finalErrors,
    finalTimer,
  }: {
    finalHits: number;
    finalErrors: number;
    finalTimer: number;
  }) => {
    setIsActive(false);
    setIsGameComplete(true);

    const sid = sessionIdRef.current;
    if (!sid || !user) return;

    const accuracy = (finalHits / TOTAL_ROUNDS) * 100;

    try {
      await supabase
        .from("game_sessions")
        .update({
          ended_at: new Date().toISOString(),
          total_attempts: TOTAL_ROUNDS,
          total_hits: finalHits,
          total_errors: finalErrors,
          completed: true,
        })
        .eq("id", sid);

      await supabase.from("game_level_results").insert([
        {
          session_id: sid,
          level: 1,
          attempts: TOTAL_ROUNDS,
          hits: finalHits,
          errors: finalErrors,
          completed: true,
          time_spent_seconds: finalTimer,
        },
      ]);

      await supabase.from("game_progress").insert([
        {
          user_id: user.id,
          game_type: GAME_TYPE,
          score: finalHits,
          details: {
            category: COGNITIVE_AREA,
            difficulty: "easy",
            total_rounds: TOTAL_ROUNDS,
            correct_taps: finalHits,
            wrong_taps: finalErrors,
            accuracy: Number(accuracy.toFixed(1)),
            duration_seconds: finalTimer,
          },
          played_at: new Date().toISOString(),
        },
      ]);
    } catch (e) {
      console.error("Error saving game results:", e);
    }
  };

  const finalizeAbandonedSession = async () => {
    const sid = sessionIdRef.current;
    if (!sid || !user) return;

    const { hits, errors: err, timer: t, attempts } = statsRef.current;

    try {
      await supabase
        .from("game_sessions")
        .update({
          ended_at: new Date().toISOString(),
          total_attempts: attempts,
          total_hits: hits,
          total_errors: err,
          completed: false,
        })
        .eq("id", sid);

      await supabase.from("game_level_results").insert([
        {
          session_id: sid,
          level: 1,
          attempts,
          hits,
          errors: err,
          completed: false,
          time_spent_seconds: t,
        },
      ]);

      await supabase.from("game_progress").insert([
        {
          user_id: user.id,
          game_type: GAME_TYPE,
          score: hits,
          details: {
            category: COGNITIVE_AREA,
            difficulty: "easy",
            total_rounds: TOTAL_ROUNDS,
            attempts_partial: attempts,
            correct_taps: hits,
            wrong_taps: err,
            accuracy: Number(((hits / Math.max(1, attempts)) * 100).toFixed(1)),
            duration_seconds: t,
            abandoned: true,
          },
          played_at: new Date().toISOString(),
        },
      ]);
    } catch (e) {
      console.error("Error finalizing abandoned session:", e);
    }
  };

  const handleExit = async () => {
    if (isActive && !isGameComplete) {
      const ok = window.confirm(
        "¿Estás seguro de que quieres salir? Se guardará el progreso parcial."
      );
      if (!ok) return;
      await finalizeAbandonedSession();
    }
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined text-5xl animate-spin text-primary">
          progress_activity
        </span>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-4xl text-red-500">
            error
          </span>
        </div>
        <h2 className="text-xl font-bold mb-2">Ups, algo salió mal</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{errorMessage}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary text-white px-8 py-3 rounded-xl font-bold"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display transition-colors">
      <BackHeader title={GAME_NAME} onBack={handleExit} />

      {/* HUD */}
      {!isGameComplete && (
        <div className="px-6 py-4 flex justify-between items-center bg-white dark:bg-surface-dark shadow-sm">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">
              Ronda
            </span>
            <span className="text-xl font-bold text-primary">
              {currentIndex + 1} / {TOTAL_ROUNDS}
            </span>
          </div>
          <div className="flex gap-6">
            <div className="flex flex-col items-center">
              <span className="text-xs text-green-600 uppercase font-bold tracking-wider">
                Aciertos
              </span>
              <span className="text-xl font-bold text-green-600">{score}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                Tiempo
              </span>
              <span className="text-xl font-bold">{timer}s</span>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        {!isGameComplete ? (
          <div className="w-full max-w-sm animate-in fade-in duration-500">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Toca el elemento diferente
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-4 aspect-square">
              {grid.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTap(item)}
                  disabled={feedback?.show}
                  className={`
                    aspect-square rounded-[24px] text-[40px] flex items-center justify-center transition-all transform active:scale-90
                    ${
                      selectedId === item.id
                        ? item.isDifferent
                          ? "bg-green-500 text-white shadow-lg shadow-green-200"
                          : "bg-red-500 text-white shadow-lg shadow-red-200"
                        : "bg-white dark:bg-surface-dark border-2 border-slate-100 dark:border-white/5 shadow-sm hover:border-primary/20"
                    }
                  `}
                >
                  {item.content}
                </button>
              ))}
            </div>

            {/* Feedback Text */}
            <div className="h-16 mt-8 flex items-center justify-center">
              {feedback?.show && (
                <div className="flex items-center gap-2 animate-in slide-in-from-bottom-2 duration-200">
                  <span
                    className={`material-symbols-outlined text-3xl ${
                      feedback.isCorrect ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {feedback.isCorrect ? "check_circle" : "cancel"}
                  </span>
                  <p
                    className={`text-2xl font-bold ${
                      feedback.isCorrect ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {feedback.isCorrect ? "¡Correcto!" : "Incorrecto"}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md bg-white dark:bg-surface-dark rounded-[32px] p-8 shadow-2xl border border-primary/10 text-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl text-primary font-bold">
                military_tech
              </span>
            </div>

            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
              ¡Partida Finalizada!
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
              Entrenaste tu atención visual.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <p className="text-xs text-slate-500 uppercase font-bold mb-1">
                  Aciertos
                </p>
                <p className="text-3xl font-black text-green-600">{score}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <p className="text-xs text-slate-500 uppercase font-bold mb-1">
                  Errores
                </p>
                <p className="text-3xl font-black text-red-500">{errors}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <p className="text-xs text-slate-500 uppercase font-bold mb-1">
                  Tiempo
                </p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  {timer}s
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <p className="text-xs text-slate-500 uppercase font-bold mb-1">
                  Precisión
                </p>
                <p className="text-2xl font-black text-primary">
                  {((score / TOTAL_ROUNDS) * 100).toFixed(0)}%
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => gameId && startNewSession(gameId)}
                className="w-full py-4 bg-primary text-white rounded-2xl font-black text-lg shadow-lg shadow-primary/20 hover:bg-primary-dark transition-colors"
              >
                Volver a jugar
              </button>

              <button
                onClick={() => navigate(-1)}
                className="w-full py-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-2xl font-bold text-lg hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
              >
                Volver al menú
              </button>
            </div>
          </div>
        )}
      </main>

      <div className="px-6 py-4 flex justify-center">
        <button
          onClick={handleExit}
          className="text-slate-400 font-bold text-sm hover:text-red-400 transition-colors"
        >
          Salir del juego
        </button>
      </div>
    </div>
  );
};

export default AttentionDifferentEasyScreen;
