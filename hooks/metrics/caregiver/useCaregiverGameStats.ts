import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../../services/supabaseClient';
import { useAuth } from '../../../contexts/AuthContext';
import { GameStats, GameCategory } from '../../../types';

export const useCaregiverGameStats = (category: GameCategory) => {
    const { user } = useAuth();

    const [data, setData] = useState<GameStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log("CARE USER ID:", user?.id); 
        const fetchData = async () => {
            if (!user) {
                setData([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                let query = supabase
                    .from('metrics_caregiver_by_game_type')
                    .select('day,total_hits,total_errors,levels_completed,game_type');

                if (category !== 'all') {
                    query = query.eq('game_type', category);
                }

                const { data: result, error: supabaseError } = await query
                    .order('day', { ascending: true })
                    .limit(7);

                if (supabaseError) throw supabaseError;

                setData((result || []).reverse());
            } catch (err: any) {
                setError(err.message);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, category]);

    // ✅ Dataset para AccuracyChart
    const accuracyData = useMemo(() => {
        return data.map((row) => ({
            day: row.day,
            total_hits: row.total_hits,
            total_errors: row.total_errors,
        }));
    }, [data]);

    // ✅ Dataset para CompletionChart
    const completionData = useMemo(() => {
        return data.map((row) => ({
            day: row.day,
            levels_completed: row.levels_completed,
        }));
    }, [data]);

    return { data, accuracyData, completionData, loading, error };
};