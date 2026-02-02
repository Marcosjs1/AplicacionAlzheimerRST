import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { DailyAccuracy } from '../../types';

export const useDailyAccuracy = () => {
    const { user } = useAuth();
    const [accuracyData, setAccuracyData] = useState<DailyAccuracy[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAccuracy = async () => {
            if (!user) {
                setAccuracyData([]);
                setLoading(false);
                return;
            }
            setLoading(true);
            
            const { data, error } = await supabase
                .from('metrics_daily_accuracy')
                .select('day, total_hits, total_errors')
                .eq('user_id', user.id)
                .order('day', { ascending: true })
                .limit(7);

            if (error) {
                setError(error.message);
            } else {
                setAccuracyData(data || []);
            }
            setLoading(false);
        };

        fetchAccuracy();
    }, [user]);

    return { accuracyData, loading, error };
};
