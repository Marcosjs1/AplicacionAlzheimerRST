import { useState, useEffect } from 'react';
import { supabase } from '../../../services/supabaseClient';
import { useAuth } from '../../../contexts/AuthContext';
import { DailyAccuracy } from '../../../types';

export const usePatientDailyAccuracy = (userId?: string) => {
    const { user } = useAuth();
    const [data, setData] = useState<DailyAccuracy[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const effectiveId = userId || user?.id;
            if (!effectiveId) return;

            try {
                const { data: result, error: supabaseError } = await supabase
                    .from('metrics_daily_accuracy')
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
