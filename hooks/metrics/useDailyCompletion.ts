import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { DailyCompletion } from '../../types';

export const useDailyCompletion = () => {
    const { user } = useAuth();
    const [dailyData, setDailyData] = useState<DailyCompletion[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDailyCompletion = async () => {
            if (!user) {
                setDailyData([]);
                setLoading(false);
                return;
            }
            setLoading(true);
            
            const { data, error } = await supabase
                .from('metrics_daily_completion')
                .select('day, levels_completed')
                .eq('user_id', user.id)
                .order('day', { ascending: true });

            if (error) {
                setError(error.message);
            } else {
                setDailyData(data || []);
            }
            setLoading(false);
        };

        fetchDailyCompletion();
    }, [user]);

    return { dailyData, loading, error };
};
