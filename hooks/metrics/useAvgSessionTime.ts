import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';

export const useAvgSessionTime = () => {
    const { user } = useAuth();
    const [avgSeconds, setAvgSeconds] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAvgTime = async () => {
            if (!user) {
                setAvgSeconds(0);
                setLoading(false);
                return;
            }
            setLoading(true);
            
            const { data, error } = await supabase
                .from('metrics_avg_session_time')
                .select('avg_time_seconds')
                .eq('user_id', user.id)
                .single();

           if (error) {
                if (error.code === 'PGRST116') {
                    setAvgSeconds(0);
                } else {
                    setError(error.message);
                }
            } else {
                setAvgSeconds(data?.avg_time_seconds || 0);
            }
            setLoading(false);
        };

        fetchAvgTime();
    }, [user]);

    return { avgSeconds, loading, error };
};
