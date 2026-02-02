import { useState, useEffect } from 'react';
import { supabase } from '../../../services/supabaseClient';
import { useAuth } from '../../../contexts/AuthContext';
import { DailyCompletion } from '../../../types';

export const useCaregiverDailyCompletion = () => {
    const { user } = useAuth();
    const [data, setData] = useState<DailyCompletion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                setData([]);
                setLoading(false);
                return;
            }
            setError(null);
            setLoading(true);
            try {
                const { data: result, error: supabaseError } = await supabase
                    .from('metrics_caregiver_daily_completion')
                    .select('day, levels_completed')
                    .order('day', { ascending: true })
                    .limit(7);

                if (supabaseError) throw supabaseError;
                setData(result || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    return { data, loading, error };
};
