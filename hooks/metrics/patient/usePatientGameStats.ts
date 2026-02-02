import { useState, useEffect, useMemo } from "react";
import { supabase } from "../../../services/supabaseClient";
import { useAuth } from "../../../contexts/AuthContext";
import { GameStats, GameCategory } from "../../../types";

export const usePatientGameStats = (category: GameCategory, userId?: string) => {
  const { user } = useAuth();

  const [data, setData] = useState<GameStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const effectiveId = userId || user?.id;
      if (!effectiveId) return;

      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from("metrics_by_game_type")
          .select("*")
          .eq("user_id", effectiveId);


          
        if (category !== "all") {
          query = query.ilike("game_type", `${category}%`);
        }

        const { data: result, error: supabaseError } = await query.order("day", {
          ascending: true,
        });

        if (supabaseError) throw supabaseError;

        setData(result || []);
      } catch (err: any) {
        setError(err?.message || "Error cargando estadísticas");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id, category, userId]);

  // ✅ Dataset para AccuracyChart (Aciertos vs Errores) con Agregación por día
  const accuracyData = useMemo(() => {
    const aggregated = (data || []).reduce((acc: any, row: any) => {
      const day = row.day;
      if (!acc[day]) {
        acc[day] = { day, total_hits: 0, total_errors: 0 };
      }
      acc[day].total_hits += Number(row.total_hits ?? 0);
      acc[day].total_errors += Number(row.total_errors ?? 0);
      return acc;
    }, {});

    return Object.values(aggregated).sort((a: any, b: any) => 
      new Date(a.day).getTime() - new Date(b.day).getTime()
    );
  }, [data]);

  // ✅ Dataset para CompletionChart (Niveles) con Agregación por día
  const completionData = useMemo(() => {
    const aggregated = (data || []).reduce((acc: any, row: any) => {
      const day = row.day;
      if (!acc[day]) {
        acc[day] = { day, levels_completed: 0 };
      }
      acc[day].levels_completed += Number(row.levels_completed ?? 0);
      return acc;
    }, {});

    return Object.values(aggregated).sort((a: any, b: any) => 
      new Date(a.day).getTime() - new Date(b.day).getTime()
    );
  }, [data]);

  return { data, loading, error, accuracyData, completionData };
};