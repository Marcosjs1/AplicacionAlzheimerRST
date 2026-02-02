import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { useCaregiverLink } from './useCaregiverLink';

export interface EmotionalContact {
    id: string;
    user_id: string;
    name: string;
    phone: string;
    relationship?: string;
    created_at: string;
}

export const useEmotionalContacts = () => {
    const { profile } = useAuth();
    const { patientId, isLinked } = useCaregiverLink();
    
    // Determining Target User ID
    // If I am a Caregiver and Linked -> view Patient's contacts
    // If I am a Patient -> view MY contacts
    const role = profile?.role?.toLowerCase();

    const targetUserId =
        role === "caregiver"
            ? (isLinked && patientId ? patientId : null)
            : profile?.id;

    const isReadOnly = role === "caregiver";

    const [contacts, setContacts] = useState<EmotionalContact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchContacts = useCallback(async () => {
        if (!targetUserId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('emotional_contacts')
                .select('*')
                .eq('user_id', targetUserId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            setContacts(data || []);
        } catch (err: any) {
            console.error('Error fetching contacts:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [targetUserId]);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    const addContact = async (name: string, phone: string, relationship?: string) => {
        if (isReadOnly) return;
        if (contacts.length >= 10) throw new Error("Máximo 10 contactos permitidos.");
        if (!targetUserId) return;

        // Simple validation
        if (!/^\+?[0-9\s-]{6,}$/.test(phone)) {
            throw new Error("El teléfono no es válido. Use solo números, guiones o +.");
        }

        const { error } = await supabase.from('emotional_contacts').insert({
            user_id: targetUserId,
            name,
            phone,
            relationship
        });

        if (error) throw error;
        await fetchContacts();
    };

    const updateContact = async (id: string, updates: Partial<Pick<EmotionalContact, 'name' | 'phone' | 'relationship'>>) => {
        if (isReadOnly) return;
        
        if (updates.phone && !/^\+?[0-9\s-]{6,}$/.test(updates.phone)) {
             throw new Error("El teléfono no es válido.");
        }

        const { error } = await supabase.from('emotional_contacts').update(updates).eq('id', id);
        if (error) throw error;
        await fetchContacts();
    };

    const deleteContact = async (id: string) => {
        if (isReadOnly) return;

        const { error } = await supabase.from('emotional_contacts').delete().eq('id', id);
        if (error) throw error;
        await fetchContacts();
    };

    return {
        contacts,
        loading,
        error,
        isReadOnly,
        addContact,
        updateContact,
        deleteContact,
        refresh: fetchContacts
    };
};
