import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { isCaregiverRole } from '../utils/roleUtils';
import { ARGENTINE_MUSIC_BY_DECADE } from '../utils/argentineMusicData';

export interface MusicRecommendation {
    id: string;
    decade: number;
    title: string;
    artist: string;
    spotify_url?: string;
    youtube_url?: string;
}

export type MusicRegion = 'international' | 'argentina';

export const useMusicRecommendations = (region: MusicRegion = 'international') => {
    const { profile, user } = useAuth();
    const [recommendations, setRecommendations] = useState<MusicRecommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!user || !profile) return;

            try {
                setLoading(true);
                let birthYear: number | null = null;
                let patientId = user.id;

                if (isCaregiverRole(profile.role)) {
                    // If caregiver, get the linked patient's birth year
                    const { data: linkData, error: linkError } = await supabase
                        .from('caregiver_links')
                        .select('patient_id')
                        .eq('caregiver_id', user.id)
                        .maybeSingle();

                    if (linkError) throw linkError;
                    
                    if (linkData) {
                        patientId = linkData.patient_id;
                        const { data: patientProfile, error: patientError } = await supabase
                            .from('profiles')
                            .select('birth_date')
                            .eq('id', patientId)
                            .maybeSingle();
                        
                        if (patientError) throw patientError;
                        if (patientProfile?.birth_date) {
                            birthYear = new Date(patientProfile.birth_date).getFullYear();
                        }
                    }
                } else {
                    // If patient, use their own birth year
                    if (profile.birth_date) {
                        birthYear = new Date(profile.birth_date).getFullYear();
                    }
                }

                if (!birthYear) {
                    // Default birth year if not set (to show something)
                    birthYear = 1950;
                }

                // Calculate relevant decades based on birthYear + 10 logic
                // Example: Born 1950 -> +10 = 1960s. We'll show 1960s and 1970s.
                // 1948 + 10 = 1958 -> 1950s (rounded down)
                const startDecade = Math.floor((birthYear + 10) / 10) * 10;
                const nextDecade = startDecade + 10;
                const decades = [startDecade, nextDecade];

                if (region === 'argentina') {
                    // Fetch from local constant
                    const songs: MusicRecommendation[] = [];
                    decades.forEach(dec => {
                        const decadeSongs = ARGENTINE_MUSIC_BY_DECADE[dec] || [];
                        // Add IDs to local data
                        const songsWithIds = decadeSongs.map((s, idx) => ({
                            ...s,
                            id: `arg-${dec}-${idx}`
                        }));
                        songs.push(...songsWithIds);
                    });
                    
                    // Filter out songs with no valid links
                    const validSongs = songs.filter(song => 
                        (song.spotify_url && song.spotify_url.trim() !== '') || 
                        (song.youtube_url && song.youtube_url.trim() !== '')
                    );
                    
                    setRecommendations(validSongs);
                    setLoading(false);
                } else {
                    // Fetch from Supabase (International)
                    const { data, error: fetchError } = await supabase
                        .from('music_recommendations')
                        .select('*')
                        .in('decade', decades)
                        .order('decade', { ascending: true });

                    if (fetchError) throw fetchError;

                    // Filter out songs with no valid links (International)
                    const validData = (data || []).filter((song: MusicRecommendation) => 
                        (song.spotify_url && song.spotify_url.trim() !== '') || 
                        (song.youtube_url && song.youtube_url.trim() !== '')
                    );

                    setRecommendations(validData);
                    setLoading(false);
                }

            } catch (err: any) {
                console.error("Error fetching music recommendations:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [user, profile, region]); // Re-run when region changes

    return { recommendations, loading, error };
};
