import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../services/supabaseClient";
import { useAuth } from "../../../contexts/AuthContext";
import { BackHeader } from "../../Layout";

// Configuration Constants
const TOTAL_QUESTIONS = 10;
const GAME_NAME = "¿Qué número falta? (Fácil)";
const GAME_TYPE = "calculation_easy_sequence";
const COGNITIVE_AREA = "calculation";

interface Question {
  id: number;
  sequence: (number | string)[];
  correctAnswer: number;
  options: number[];
}

type FeedbackState = { isCorrect: boolean; show: boolean } | null;

const CalcSequenceEasyScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Game State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Stats
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [timer, setTimer] = useState(0);

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  // App State
  const [isActive, setIsActive] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);

  // Refs for persistent values
  const sessionIdRef = useRef<string | null>(null);
  const timerRef = useRef<number | null>(null);

  // Ref con stats para no depender de closures
  const statsRef = useRef({ hits: 0, errors: 0, timer: 0, attempts: 0 });
  useEffect(() => {
    statsRef.current = {
      hits: score,
      errors,
      timer,
      attempts: Math.min(currentIndex, TOTAL_QUESTIONS),
    };
  }, [score, errors, timer, currentIndex]);

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
                description: "Completa la secuencia numérica y elige el número faltante.",
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
        console.error("Error init CalcSequenceEasy:", e);
        setErrorMessage(e?.message || "Error al inicializar el juego");
        setIsLoading(false);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Game Logic Helpers
  const generateQuestion = (id: number): Question => {
    // Patrones fáciles: +1, +2, +5
    const patterns = [1, 2, 5];
    const step = patterns[Math.floor(Math.random() * patterns.length)];
    
    // Longitud 3 o 4
    const length = Math.random() > 0.5 ? 3 : 4;
    
    // Rango 0-30. Asegurar que la secuencia no pase de 30
    const startNum = Math.floor(Math.random() * (31 - (length * step)));
    
    const fullSequence: number[] = [];
    for (let i = 0; i < length; i++) {
      fullSequence.push(startNum + i * step);
    }
    
    // Ocultar uno
    const hiddenIndex = Math.floor(Math.random() * length);
    const correctAnswer = fullSequence[hiddenIndex];
    
    const sequence: (number | string)[] = [...fullSequence];
    sequence[hiddenIndex] = "__";

    // Generate distractors
    const distractors = new Set<number>();
    while (distractors.size < 2) {
      const offset = (Math.floor(Math.random() * 3) + 1) * (Math.random() > 0.5 ? 1 : -1);
      const val = correctAnswer + offset;
      if (val >= 0 && val !== correctAnswer) {
        distractors.add(val);
      }
    }

    const options = [correctAnswer, ...Array.from(distractors)].sort(() => Math.random() - 0.5);

    return { id, sequence, correctAnswer, options };
  };

  const startNewSession = async (currentGameId: string) => {
    setIsLoading(true);

    // Reset state
    setIsActive(false);
    setIsGameComplete(false);
    setTimer(0);
    setScore(0);
    setErrors(0);
    setCurrentIndex(0);
    setSelectedOption(null);
    setFeedback(null);

    // Prepare 10 questions
    const newQuestions = Array.from({ length: TOTAL_QUESTIONS }, (_, i) =>
      generateQuestion(i)
    );
    setQuestions(newQuestions);

    try {
      // Create session in Supabase
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

  const handleAnswer = (option: number) => {
    if (!isActive) return;
    if (feedback?.show) return; // evita doble click

    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    setSelectedOption(option);
    const isCorrect = option === currentQ.correctAnswer;

    // Actualizar score/errors
    const newScore = isCorrect ? score + 1 : score;
    const newErrors = !isCorrect ? errors + 1 : errors;

    setScore(newScore);
    setErrors(newErrors);

    setFeedback({ isCorrect, show: true });

    // Transition to next or complete
    setTimeout(() => {
      setFeedback(null);
      setSelectedOption(null);

      if (currentIndex + 1 < TOTAL_QUESTIONS) {
        setCurrentIndex((v) => v + 1);
      } else {
        handleGameComplete({
          finalHits: newScore,
          finalErrors: newErrors,
          finalTimer: statsRef.current.timer,
        });
      }
    }, 1500);
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

    const accuracy = (finalHits / TOTAL_QUESTIONS) * 100;

    try {
      // 1) Update session
      await supabase
        .from("game_sessions")
        .update({
          ended_at: new Date().toISOString(),
          total_attempts: TOTAL_QUESTIONS,
          total_hits: finalHits,
          total_errors: finalErrors,
          completed: true,
        })
        .eq("id", sid);

      // 2) Insert level result
      await supabase.from("game_level_results").insert([
        {
          session_id: sid,
          level: 1,
          attempts: TOTAL_QUESTIONS,
          hits: finalHits,
          errors: finalErrors,
          completed: true,
          time_spent_seconds: finalTimer,
        },
      ]);

      // 3) Insert progress record
      await supabase.from("game_progress").insert([
        {
          user_id: user.id,
          game_type: GAME_TYPE,
          score: finalHits,
          details: {
            category: COGNITIVE_AREA,
            difficulty: "easy",
            total_questions: TOTAL_QUESTIONS,
            correct_answers: finalHits,
            wrong_answers: finalErrors,
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
          total_attempts: Math.min(attempts, TOTAL_QUESTIONS),
          total_hits: hits,
          total_errors: err,
          completed: false,
        })
        .eq("id", sid);

      await supabase.from("game_level_results").insert([
        {
          session_id: sid,
          level: 1,
          attempts: Math.min(attempts, TOTAL_QUESTIONS),
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
            total_questions: TOTAL_QUESTIONS,
            attempts_partial: Math.min(attempts, TOTAL_QUESTIONS),
            correct_answers: hits,
            wrong_answers: err,
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
      navigate(-1);
      return;
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

  const currentQ = questions[currentIndex];

  if (!currentQ && !isGameComplete) {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Preparando preguntas...</p>
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
              Pregunta
            </span>
            <span className="text-xl font-bold text-primary">
              {currentIndex + 1} / {TOTAL_QUESTIONS}
            </span>
          </div>

          <div className="flex gap-6">
            <div className="flex flex-col items-center">
              <span className="text-xs text-green-600 uppercase font-bold tracking-wider">
                Puntos
              </span>
              <span className="text-xl font-bold text-green-600">{score}</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                Tiempo
              </span>
              <span className="text-xl font-bold">
                {Math.floor(timer / 60)}:{("0" + (timer % 60)).slice(-2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Game Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        {!isGameComplete ? (
          <div className="w-full max-w-md animate-in fade-in duration-500">
            {/* Operation Area */}
            <div className="bg-white dark:bg-surface-dark rounded-[32px] p-8 shadow-xl shadow-primary/5 border border-primary/5 mb-8 text-center relative overflow-hidden">
              {/* Feedback Overlay */}
              {feedback?.show && (
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center bg-white/90 dark:bg-surface-dark/95 z-10 animate-in zoom-in-95 duration-200`}
                >
                  <span
                    className={`material-symbols-outlined text-[80px] mb-2 ${
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

              <div className="flex items-center justify-center gap-4 flex-wrap text-[48px] font-black text-slate-900 dark:text-white leading-none">
                {currentQ.sequence.map((item, idx) => (
                  <span key={idx} className={item === "__" ? "text-primary animate-pulse" : ""}>
                    {item}{idx < currentQ.sequence.length - 1 ? "," : ""}
                  </span>
                ))}
              </div>
              <p className="mt-6 text-slate-400 font-medium text-lg">
                ¿Qué número falta?
              </p>
            </div>

            {/* Options */}
            <div className="grid gap-4">
              {currentQ.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  disabled={feedback?.show}
                  className={`
                    w-full py-6 rounded-2xl text-4xl font-bold transition-all transform active:scale-[0.98]
                    ${
                      selectedOption === option
                        ? option === currentQ.correctAnswer
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                        : "bg-white dark:bg-surface-dark text-slate-900 dark:text-white hover:bg-primary/5 border-2 border-transparent hover:border-primary/20 shadow-lg"
                    }
                  `}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Summary Screen */
          <div className="w-full max-w-md bg-white dark:bg-surface-dark rounded-[32px] p-8 shadow-2xl border border-primary/10 text-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl text-primary font-bold">
                celebration
              </span>
            </div>

            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
              ¡Partida Finalizada!
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
              Entrenaste tu agilidad numérica.
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
                  {((score / TOTAL_QUESTIONS) * 100).toFixed(0)}%
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

export default CalcSequenceEasyScreen;
