import { useState, useEffect } from 'react';
import { supabase } from '../../../services/supabaseClient';
import { useAuth } from '../../../contexts/AuthContext';
import { WeeklyTrend } from '../../../types';

export const useCaregiverWeeklyTrend = () => {
    const { user } = useAuth();
    const [data, setData] = useState<WeeklyTrend | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                setData(null);
                setLoading(false);
                return;
            }
            setError(null);
            setLoading(true);
            try {
                const { data: result, error: supabaseError } = await supabase
                    .from('metrics_caregiver_weekly_trend')
                    .select('*')
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
    }, [user]);

    return { data, loading, error };
};
