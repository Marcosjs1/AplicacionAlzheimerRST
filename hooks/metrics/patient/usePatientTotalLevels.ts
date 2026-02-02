import { useState, useEffect } from 'react';
import { supabase } from '../../../services/supabaseClient';
import { useAuth } from '../../../contexts/AuthContext';
import { TotalLevels } from '../../../types';

export const usePatientTotalLevels = (userId?: string) => {
    const { user } = useAuth();
    const [data, setData] = useState<TotalLevels | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const effectiveId = userId || user?.id;
            if (!effectiveId) return;

            try {
                const { data: result, error: supabaseError } = await supabase
                    .from('metrics_total_levels')
                    .select('total_completed')
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
