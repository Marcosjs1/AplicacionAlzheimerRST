import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { useCaregiverLink } from './useCaregiverLink';

export interface Task {
  id: string;
  patient_id: string;
  created_by: string | null;
  title: string;
  description?: string | null;
  scheduled_date: string; // YYYY-MM-DD
  scheduled_time: string | null; // HH:MM:SS
  completed: boolean;
  completed_at?: string | null;
  created_at?: string | null;
}

export const useTasks = () => {
  const { profile, user } = useAuth();
  const { patientId, isLinked } = useCaregiverLink();

  const role = profile?.role?.toLowerCase();

  const targetUserId =
    role === 'caregiver'
      ? (isLinked && patientId ? patientId : null)
      : profile?.id ?? null;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!targetUserId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const today = new Date().toISOString().split('T')[0];
      const tomorrowDate = new Date();
      tomorrowDate.setDate(tomorrowDate.getDate() + 1);
      const tomorrow = tomorrowDate.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('patient_id', targetUserId)
        .in('scheduled_date', [today, tomorrow])
        .order('scheduled_date', { ascending: true })
        .order('scheduled_time', { ascending: true });

      if (error) throw error;
      setTasks((data as Task[]) || []);
    } catch (err: any) {
      console.error('Error fetching tasks:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [targetUserId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (
    title: string,
    description: string | undefined,
    date: string,
    time: string
  ) => {
    if (!targetUserId) throw new Error('No hay paciente objetivo para asignar la tarea.');
    if (!user?.id) throw new Error('Usuario no autenticado.');

    const { error } = await supabase.from('tasks').insert({
      patient_id: targetUserId,
      created_by: user.id,
      title,
      description,
      scheduled_date: date,
      scheduled_time: time,
      completed: false,
    });

    if (error) throw error;
    await fetchTasks();
  };

  const toggleTask = async (taskId: string, currentStatus: boolean) => {
    const completed = !currentStatus;
    const completed_at = completed ? new Date().toISOString() : null;

    const { error } = await supabase
      .from('tasks')
      .update({ completed, completed_at })
      .eq('id', taskId);

    if (error) throw error;

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed, completed_at } : t))
    );
  };

  const deleteTask = async (taskId: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);
    if (error) throw error;
    await fetchTasks();
  };

  return {
    tasks,
    loading,
    error,
    targetUserId, // ✅ útil para la UI
    createTask,
    toggleTask,
    deleteTask,
    refresh: fetchTasks,
  };
};