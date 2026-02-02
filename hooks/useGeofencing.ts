import { useEffect, useRef } from 'react';
import { registerPlugin } from '@capacitor/core';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

interface GeofencePlugin {
    start(options: { 
        lat: number; 
        lng: number; 
        radius: number; 
        patientId: string; 
        token: string;
        supabaseUrl: string;
    }): Promise<void>;
    stop(): Promise<void>;
}

const Geofence = registerPlugin<GeofencePlugin>('GeofencePlugin');

export const useGeofencing = () => {
    const { profile } = useAuth();
    const isRunning = useRef(false);

    useEffect(() => {
        // Only run for patients on Android (Capacitor)
        // For development, we might not be on Android, so we check capability or platform
        // But logic is: if role === patient
        if (!profile || profile.role !== 'patient') return;

        const initGeofence = async () => {
            if (isRunning.current) return;
            
            try {
                // 1. Get Session Token (Refresh if needed)
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) return;

                // 2. Fetch Safe Zone
                const { data: zone } = await supabase
                    .from('safe_zones')
                    .select('*')
                    .eq('patient_id', profile.id)
                    .eq('active', true)
                    .single();

                if (zone) {
                    console.log('Starting Geofence for', zone);
                    await Geofence.start({
                        lat: zone.center_lat,
                        lng: zone.center_lng,
                        radius: zone.radius_meters, // Make sure plugin accepts int
                        patientId: profile.id,
                        token: session.access_token,
                        supabaseUrl: import.meta.env.VITE_SUPABASE_URL
                    });
                    isRunning.current = true;
                } else {
                    console.log('No active safe zone found');
                    await Geofence.stop(); // Stop if no zone active
                    isRunning.current = false;
                }
            } catch (err) {
                console.error('Geofence Init Error:', err);
            }
        };

        initGeofence();

        // Optional: Listen for UPDATE on safe_zones to restart?
        const channel = supabase.channel(`geofence-config-${profile.id}`)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'safe_zones', filter: `patient_id=eq.${profile.id}` }, (payload) => {
                 console.log('Safe Zone Updated via Realtime', payload);
                 isRunning.current = false; // Reset flag to allow restart
                 initGeofence(); 
            })
            .subscribe();

        return () => {
             supabase.removeChannel(channel);
        };
    }, [profile]);
};
