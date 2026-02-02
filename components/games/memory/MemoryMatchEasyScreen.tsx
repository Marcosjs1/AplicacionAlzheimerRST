import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../services/supabaseClient";
import { useAuth } from "../../../contexts/AuthContext";
import { BackHeader } from "../../Layout";

interface Card {
  id: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const TOTAL_PAIRS = 4;
const SHOW_PREVIEW_TIME = 1200;
const FLIP_BACK_TIME = 700;
const GAME_NAME = "Memory Match (Fácil)";
const CARD_ICONS = ["🍎", "🍌", "🍒", "🍇"];

const MemoryMatchEasyScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [hits, setHits] = useState(0);
  const [errors, setErrors] = useState(0);
  const [timer, setTimer] = useState(0);

  const [isActive, setIsActive] = useState(false);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [lockBoard, setLockBoard] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [gameId, setGameId] = useState<string | null>(null);

  // ✅ IMPORTANT: useRef so we never lose session_id
  const sessionIdRef = useRef<string | null>(null);

  // ✅ Valid stats for closures
  const statsRef = useRef({ moves: 0, errors: 0, timer: 0 });

  const timerRef = useRef<number | null>(null);

  // Sync stats ref
  useEffect(() => {
    statsRef.current = { moves, errors, timer };
  }, [moves, errors, timer]);

  // ------------------------
  // Timer
  // ------------------------
  useEffect(() => {
    if (isActive && !isLevelComplete) {
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
  }, [isActive, isLevelComplete]);

  // ------------------------
  // Init game + ensure gameId
  // ------------------------
  useEffect(() => {
    if (!user) return;

    const init = async () => {
      try {
        setErrorMessage(null);
        console.log("[INIT] fetching game id for:", GAME_NAME);

        // buscar game
        const { data: existing, error: existingErr } = await supabase
          .from("games")
          .select("id")
          .eq("name", GAME_NAME)
          .limit(1)
          .maybeSingle();

        if (existingErr) {
          console.error("[INIT] Error fetching game:", existingErr);
          throw existingErr;
        }

        let finalGameId = existing?.id;

        if (!finalGameId) {
          console.log("[INIT] Game not found, creating game...");
          const { data: created, error: createErr } = await supabase
            .from("games")
            .insert([
              {
                name: GAME_NAME,
                description: "Encuentra los pares iguales (Fácil)",
                cognitive_area: "memory",
                max_level: 1,
              },
            ])
            .select("id")
            .single();

          if (createErr) {
            console.error("[INIT] Error creating game:", createErr);
            throw createErr;
          }
          finalGameId = created.id;
          console.log("[INIT] Game created with ID:", finalGameId);
        } else {
          console.log("[INIT] Game found with ID:", finalGameId);
        }

        setGameId(finalGameId);
        await startNewSession(finalGameId);
      } catch (e: any) {
        console.error("Error init MemoryMatchEasy:", {
          message: e?.message,
          details: e?.details,
          hint: e?.hint,
          code: e?.code,
          raw: e,
        });
        setErrorMessage(e?.message || "Error al inicializar el juego");
        setIsLoading(false);
      }
    };

    init();
  }, [user]);

  // ------------------------
  // Helpers
  // ------------------------
  const setupBoard = () => {
    const deck: Card[] = [...CARD_ICONS, ...CARD_ICONS].map((icon, index) => ({
      id: index,
      content: icon,
      isFlipped: true, // preview
      isMatched: false,
    }));

    // shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setFlippedCards([]);
    setLockBoard(true);
    setIsLoading(false);

    setTimeout(() => {
      setCards((prev) => prev.map((c) => ({ ...c, isFlipped: false })));
      setLockBoard(false);
      setIsActive(true);
    }, SHOW_PREVIEW_TIME);
  };

  const createSession = async (currentGameId: string) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from("game_sessions")
      .insert([
        {
          user_id: user.id,
          game_id: currentGameId,
          game_type: "memory",
          started_at: new Date().toISOString(),
          completed: false,
        },
      ])
      .select("id")
      .single();

    if (error) throw error;
    return data.id as string;
  };

  const startNewSession = async (currentGameId: string) => {
    setIsLoading(true);
    setIsActive(false);
    setIsLevelComplete(false);
    setTimer(0);
    setMoves(0);
    setHits(0);
    setErrors(0);
    setFlippedCards([]);
    setLockBoard(true);

    console.log("[SESSION] creating session for gameId:", currentGameId);

    try {
      const newSessionId = await createSession(currentGameId);
      console.log("[SESSION] created session ID:", newSessionId);

      // ✅ store in ref
      sessionIdRef.current = newSessionId;
      setupBoard();
    } catch (e) {
      console.error("Error creating session:", e);
      setErrorMessage("Error al crear sesión de juego");
      setIsLoading(false);
      setLockBoard(false);
    }
  };

  // ------------------------
  // Click logic
  // ------------------------
  const handleCardClick = (index: number) => {
    if (lockBoard || !isActive) return;

    const card = cards[index];
    if (!card || card.isFlipped || card.isMatched) return;

    // flip
    const newCards = [...cards];
    newCards[index] = { ...newCards[index], isFlipped: true };
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setLockBoard(true);
      setMoves((m) => m + 1);

      const [a, b] = newFlipped;
      const isMatch = newCards[a].content === newCards[b].content;

      if (isMatch) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === a || i === b ? { ...c, isMatched: true } : c
            )
          );
          setFlippedCards([]);
          setHits((h) => {
            const newHits = h + 1;
            if (newHits === TOTAL_PAIRS) {
              // ✅ use ref values safely
              handleLevelComplete(newHits);
            }
            return newHits;
          });
          setLockBoard(false);
        }, 300);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === a || i === b ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedCards([]);
          setErrors((e) => e + 1);
          setLockBoard(false);
        }, FLIP_BACK_TIME);
      }
    }
  };

  // ------------------------
  // Finish + Save metrics
  // ------------------------
  const handleLevelComplete = async (finalHits: number) => {
    setIsActive(false);
    setIsLevelComplete(true);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;

    const sid = sessionIdRef.current;
    if (!sid) {
      console.warn("No sessionId available, cannot save level result");
      return;
    }

    const endTime = new Date().toISOString();
    const { moves: finalMoves, errors: finalErrors, timer: finalTimer } = statsRef.current;
    
    // Attempt adjustment (since handleCardClick increments moves AFTER checking, wait, no, we incremented before)
    // Actually, let's trust the ref values but add 1 to moves if it was the triggering move? 
    // In handleCardClick we called setMoves(m=>m+1) then waiting 300ms. Ref SHOULD have updated by then. 
    // But to be safe let's assume ref is up to date because of the timeout.

    console.log("[SAVE] Starting save process...", { sid, finalMoves, finalErrors, finalTimer });

    try {
      // 1. UPDATE session
      console.log("[SAVE] Updating session...");
      const { error: sessionErr } = await supabase
        .from("game_sessions")
        .update({
          ended_at: endTime,
          total_attempts: finalMoves,
          total_hits: finalHits,
          total_errors: finalErrors,
          completed: true,
        })
        .eq("id", sid);

      if (sessionErr) {
        console.error("[SAVE] Update session FAILED:", sessionErr);
        // We continue trying to insert results even if update failed? No, probably should try.
      } else {
        console.log("[SAVE] Session updated successfully.");
      }

      // 2. INSERT level results
      const resultPayload = {
        session_id: sid,
        level: 1,
        attempts: finalMoves,
        hits: finalHits,
        errors: finalErrors,
        completed: true,
        time_spent_seconds: finalTimer,
      };
      
      console.log("[SAVE] Inserting level results:", resultPayload);
      
      const { data: insertData, error: levelErr } = await supabase
        .from("game_level_results")
        .insert([resultPayload])
        .select();

      if (levelErr) {
         console.error("[SAVE] Insert results FAILED:", levelErr);
         throw levelErr;
      } else {
         console.log("[SAVE] Results inserted:", insertData);
      }

    } catch (e) {
      console.error("Error saving level metrics:", e);
      setErrorMessage("Error al guardar resultados");
    }
  };

  const handleRestart = () => {
    if (gameId) startNewSession(gameId);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display">
      <BackHeader title={GAME_NAME} />

      {/* HUD */}
      <div className="px-4 py-3 flex justify-between items-center bg-white dark:bg-surface-dark shadow-sm">
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500 uppercase font-bold">Tiempo</span>
          <span className="text-xl font-bold">
            {Math.floor(timer / 60)}:{("0" + (timer % 60)).slice(-2)}
          </span>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <span className="text-xs text-green-600 uppercase font-bold">
              Aciertos
            </span>
            <span className="text-xl font-bold text-green-600">{hits}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-red-500 uppercase font-bold">
              Errores
            </span>
            <span className="text-xl font-bold text-red-500">{errors}</span>
          </div>
        </div>
      </div>

      {/* Board */}
      <main className="flex-1 flex items-center justify-center p-4">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl animate-spin text-primary">
              progress_activity
            </span>
          </div>
        ) : errorMessage ? (
          <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-red-100 dark:border-red-900/30 max-w-sm text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-3xl text-red-500">
                error
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              No se pudo cargar el juego
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 break-words">
              {errorMessage}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-lg">
            {cards.map((card, index) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(index)}
                className={`w-full aspect-[3/4] rounded-2xl shadow-md text-4xl flex items-center justify-center
                  ${
                    card.isFlipped || card.isMatched
                      ? "bg-white dark:bg-gray-700 border-2 border-primary"
                      : "bg-primary text-white"
                  }
                `}
              >
                {card.isFlipped || card.isMatched ? card.content : "🧠"}
              </button>
            ))}
          </div>
        )}
      </main>

      {/* Finish modal */}
      {isLevelComplete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 w-full max-w-sm text-center">
            <h2 className="text-2xl font-bold mb-4">¡Nivel Completado!</h2>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <p className="text-xs text-gray-500">Tiempo</p>
                <p className="font-bold">{timer}s</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <p className="text-xs text-gray-500">Intentos</p>
                <p className="font-bold">{moves}</p>
              </div>
            </div>

            <button
              onClick={handleRestart}
              className="w-full py-3 bg-primary text-white rounded-xl font-bold"
            >
              Jugar de nuevo
            </button>

            <button
              onClick={() => navigate(-1)}
              className="mt-3 text-sm text-gray-500"
            >
              Volver al menú
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryMatchEasyScreen;