import { useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { useCaregiverLink } from './useCaregiverLink';

export const useGeofenceAlerts = () => {
    const { profile } = useAuth();
    const { patientId } = useCaregiverLink();

    useEffect(() => {
        if (!profile || profile.role !== 'caregiver' || !patientId) return;

        console.log('Listening for Geofence Alerts for patient:', patientId);

        const channel = supabase.channel(`geofence-alerts-${patientId}`)
            .on(
                'postgres_changes', 
                { 
                    event: 'INSERT', 
                    schema: 'public', 
                    table: 'geofence_events',
                    filter: `patient_id=eq.${patientId}`
                }, 
                (payload) => {
                    const event = payload.new;
                    if (event.event_type === 'EXIT') {
                        // ALERT!
                        // In a real app, use a Toast or Local Notification
                        // For now, simple Alert UI or Console
                        alert(`⚠️ ALERTA: ¡El paciente ha salido de la zona segura! \nLat: ${event.lat}, Lng: ${event.lng}`);
                        
                        // Play sound?
                        try {
                            const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3'); 
                            audio.play();
                        } catch(e) { console.error('Audio play failed', e)}
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [profile, patientId]);
};
