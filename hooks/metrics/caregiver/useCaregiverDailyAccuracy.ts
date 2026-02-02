import { useState, useEffect } from 'react';
import { supabase } from '../../../services/supabaseClient';
import { useAuth } from '../../../contexts/AuthContext';
import { DailyAccuracy } from '../../../types';

export const useCaregiverDailyAccuracy = () => {
    const { user } = useAuth();
    const [data, setData] = useState<DailyAccuracy[]>([]);
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
            setError(null);
            setLoading(true);
            try {
                // The view already filters by auth.uid()
                const { data: result, error: supabaseError } = await supabase
                    .from('metrics_caregiver_daily_accuracy')
                    .select('day, total_hits, total_errors')
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
