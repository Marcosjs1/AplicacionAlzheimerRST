import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { useCaregiverLink } from './useCaregiverLink';

export interface StoryAlbum {
    id: string;
    patient_id: string;
    created_by: string;
    title: string;
    description?: string;
    created_at: string;
    // Optional: cover_photo_url logic could be added later
}

export const useStoryAlbums = () => {
    const { profile } = useAuth();
    const { patientId, isLinked } = useCaregiverLink();

    // Determine target based on role
    // Caregiver -> Linked Patient
    // Patient -> Self
    const role = profile?.role?.toLowerCase();
    const targetUserId =
        role === "caregiver"
            ? (isLinked && patientId ? patientId : null)
            : profile?.id;

    const [albums, setAlbums] = useState<StoryAlbum[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAlbums = useCallback(async () => {
        if (!targetUserId) {
            setLoading(false);
            return;
        }
        
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('story_albums')
                .select('*')
                .eq('patient_id', targetUserId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAlbums(data || []);
        } catch (err: any) {
            console.error('Error fetching albums:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [targetUserId]);

    useEffect(() => {
        fetchAlbums();
    }, [fetchAlbums]);

    const createAlbum = async (title: string, description?: string) => {
        if (!targetUserId) return;
        if (albums.length >= 20) throw new Error("Máximo 20 álbumes permitidos.");

        const { error } = await supabase.from('story_albums').insert({
            patient_id: targetUserId,
            created_by: profile?.id,
            title,
            description
        });

        if (error) throw error;
        await fetchAlbums();
    };

    const deleteAlbum = async (albumId: string) => {
        const { error } = await supabase.from('story_albums').delete().eq('id', albumId);
        if (error) throw error;
        await fetchAlbums();
    };

    return {
        albums,
        loading,
        error,
        createAlbum,
        deleteAlbum,
        refresh: fetchAlbums,
        canEdit: !!targetUserId // Both patient and linked caregiver can edit
    };
};
