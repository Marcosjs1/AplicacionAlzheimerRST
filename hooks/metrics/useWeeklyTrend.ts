import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { WeeklyTrend } from '../../types';

export const useWeeklyTrend = () => {
    const { user } = useAuth();
    const [trend, setTrend] = useState<WeeklyTrend | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const isDeclining = trend?.percentage_change < 0;
    const isImproving = trend?.percentage_change > 0;

    useEffect(() => {
        const fetchTrend = async () => {
            if (!user) return;
            setLoading(true);
            
            const { data, error } = await supabase
                .from('metrics_weekly_trend')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    setTrend(null);
                } else {
                    setError(error.message);
                }
            } else {
                setTrend(data);
            }
            setLoading(false);
        };

        fetchTrend();
    }, [user]);

    return { trend, isDeclining, isImproving, loading, error };
};
