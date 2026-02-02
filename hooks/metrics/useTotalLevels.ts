import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';

export const useTotalLevels = () => {
    const { user } = useAuth();
    const [totalCompleted, setTotalCompleted] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTotalLevels = async () => {
            if (!user) {
                setTotalCompleted(0);
                setLoading(false);
                return;
            }
            setLoading(true);
            
            const { data, error } = await supabase
                .from('metrics_total_levels')
                .select('total_completed')
                .eq('user_id', user.id)
                .single();

            if (error) {
                if (error.code === 'PGRST116') { // No data found
                    setTotalCompleted(0);
                } else {
                    setError(error.message);
                }
            } else {
                setTotalCompleted(data?.total_completed || 0);
            }
            setLoading(false);
        };

        fetchTotalLevels();
    }, [user]);

    return { totalCompleted, loading, error };
};
