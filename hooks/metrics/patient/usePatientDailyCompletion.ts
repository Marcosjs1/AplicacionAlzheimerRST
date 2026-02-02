import { useState, useEffect } from 'react';
import { supabase } from '../../../services/supabaseClient';
import { useAuth } from '../../../contexts/AuthContext';
import { DailyCompletion } from '../../../types';

export const usePatientDailyCompletion = (userId?: string) => {
    const { user } = useAuth();
    const [data, setData] = useState<DailyCompletion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const effectiveId = userId || user?.id;
            if (!effectiveId) return;

            try {
                const { data: result, error: supabaseError } = await supabase
                    .from('metrics_daily_completion')
                    .select('*')
                    .eq('user_id', effectiveId)
                    .order('day', { ascending: true });

                if (supabaseError) throw supabaseError;
                setData(result || []);
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
