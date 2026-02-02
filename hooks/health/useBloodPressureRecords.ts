import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';

export interface BloodPressureRecord {
    id: string;
    patient_id: string;
    systolic: number;
    diastolic: number;
    pulse?: number;
    notes?: string;
    measured_at: string;
    created_at: string;
}

export const useBloodPressureRecords = (patientId?: string) => {
    const { user, profile } = useAuth();
    const [records, setRecords] = useState<BloodPressureRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isPatient = profile?.role === 'patient';
    const effectivePatientId = patientId || user?.id;

    const fetchRecords = useCallback(async () => {
        if (!effectivePatientId) return;

        setLoading(true);
        setError(null);
        try {
            const { data, error: fetchError } = await supabase
                .from('blood_pressure_records')
                .select('*')
                .eq('patient_id', effectivePatientId)
                .order('measured_at', { ascending: false });

            if (fetchError) throw fetchError;
            setRecords(data || []);
        } catch (err: any) {
            console.error('Error fetching blood pressure records:', err);
            setError(err.message || 'Error al obtener los registros');
        } finally {
            setLoading(false);
        }
    }, [effectivePatientId]);

    const addRecord = async (data: {
        systolic: number;
        diastolic: number;
        pulse?: number;
        notes?: string;
        measured_at?: string;
    }) => {
        if (!isPatient) throw new Error('Solo los pacientes pueden agregar registros');
        if (!user) throw new Error('Usuario no autenticado');

        setLoading(true);
        try {
            const { error: insertError } = await supabase
                .from('blood_pressure_records')
                .insert([{
                    ...data,
                    patient_id: user.id,
                    measured_at: data.measured_at || new Date().toISOString()
                }]);

            if (insertError) throw insertError;
            await fetchRecords();
        } catch (err: any) {
            console.error('Error adding blood pressure record:', err);
            setError(err.message || 'Error al agregar el registro');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteRecord = async (id: string) => {
        if (!isPatient) throw new Error('Solo los pacientes pueden eliminar registros');

        setLoading(true);
        try {
            const { error: deleteError } = await supabase
                .from('blood_pressure_records')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;
            setRecords(prev => prev.filter(r => r.id !== id));
        } catch (err: any) {
            console.error('Error deleting blood pressure record:', err);
            setError(err.message || 'Error al eliminar el registro');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, [fetchRecords]);

    return {
        records,
        loading,
        error,
        fetchRecords,
        addRecord,
        deleteRecord,
        isPatient
    };
};
