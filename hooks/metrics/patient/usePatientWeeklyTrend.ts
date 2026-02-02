import { useState, useEffect } from 'react';
import { supabase } from '../../../services/supabaseClient';
import { useAuth } from '../../../contexts/AuthContext';
import { WeeklyTrend } from '../../../types';

export const usePatientWeeklyTrend = (userId?: string) => {
    const { user } = useAuth();
    const [data, setData] = useState<WeeklyTrend | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const effectiveId = userId || user?.id;
            if (!effectiveId) return;

            try {
                const { data: result, error: supabaseError } = await supabase
                    .from('metrics_weekly_trend')
                    .select('*')
                    .eq('user_id', effectiveId)
                    .maybeSingle();

                if (supabaseError) throw supabaseError;
                setData(result);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, userId]);

    return { data, loading, error };
};
