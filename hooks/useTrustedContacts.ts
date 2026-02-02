import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { useCaregiverLink } from './useCaregiverLink';

export interface TrustedContact {
    id: string;
    patient_id: string;
    name: string;
    email: string;
    phone?: string;
    created_at: string;
}

export const useTrustedContacts = () => {
    const { profile } = useAuth();
    const { patientId, isLinked } = useCaregiverLink();
    
    const role = profile?.role?.toLowerCase();

    // Determining target patient ID
    // If I'm a caregiver, I can see my linked patient's contacts
    const targetPatientId =
        role === "caregiver"
            ? (isLinked && patientId ? patientId : null)
            : (role === "patient" ? profile?.id : null);

    const isReadOnly = role === "caregiver";

    const [contacts, setContacts] = useState<TrustedContact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchContacts = useCallback(async () => {
        if (!targetPatientId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('trusted_contacts')
                .select('*')
                .eq('patient_id', targetPatientId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            setContacts(data || []);
        } catch (err: any) {
            console.error('Error fetching trusted contacts:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [targetPatientId]);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    const addContact = async (name: string, email: string, phone?: string) => {
        if (isReadOnly) throw new Error("Los cuidadores no pueden editar contactos.");
        if (contacts.length >= 5) throw new Error("Máximo 5 contactos de confianza.");
        if (!targetPatientId) throw new Error("ID de paciente no encontrado.");

        // Validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error("El email no es válido.");
        }

        const { error } = await supabase.from('trusted_contacts').insert({
            patient_id: targetPatientId,
            name,
            email,
            phone
        });

        if (error) {
            if (error.code === '23505') throw new Error("Este email ya está en tu lista de contactos.");
            throw error;
        }
        await fetchContacts();
    };

    const deleteContact = async (id: string) => {
        if (isReadOnly) throw new Error("Los cuidadores no pueden eliminar contactos.");

        const { error } = await supabase.from('trusted_contacts').delete().eq('id', id);
        if (error) throw error;
        await fetchContacts();
    };

    const sendSOS = async (location?: string, message?: string) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("No hay sesión activa");

            const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-sos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
                },
                body: JSON.stringify({
                    location,
                    message
                })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Error al enviar SOS");
            
            return result;
        } catch (err: any) {
            console.error("SOS Function error:", err);
            throw err;
        }
    };

    return {
        contacts,
        loading,
        error,
        isReadOnly,
        addContact,
        deleteContact,
        sendSOS,
        refresh: fetchContacts
    };
};
