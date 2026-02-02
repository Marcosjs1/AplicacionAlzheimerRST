import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BackHeader, BottomNav } from '../Layout';
import { FamilyActivities } from './Activities';
import { useAuth } from '../../contexts/AuthContext';
import { useBloodPressureRecords } from '../../hooks/health/useBloodPressureRecords';
import { useCaregiverLink } from '../../hooks/useCaregiverLink';
import { supabase } from '../../services/supabaseClient';

export const HealthScreen: React.FC = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('userRole');

    if (role === 'Familiar') {
        return <FamilyActivities />;
    }
    
    return (
        <div className="bg-background-light dark:bg-background-dark text-[#111812] dark:text-gray-100 font-display transition-colors duration-200 min-h-screen pb-24 md:pb-6 md:pl-64">
            <BackHeader title="Salud y Bienestar" onBack={() => navigate('/home')} />
            <div className="flex flex-col gap-6 px-4 mt-4">
                <Link to="/exercise" className="group w-full text-left focus:outline-none">
                    <div className="flex items-center justify-between gap-5 rounded-xl bg-white dark:bg-[#1A2E1E] p-6 shadow-sm border border-transparent dark:border-gray-800 active:scale-[0.98] transition-transform duration-200">
                        <div className="flex items-center justify-center size-16 rounded-full bg-[#e0fce5] dark:bg-green-500/20 shrink-0">
                            <span className="material-symbols-outlined text-green-700 dark:text-green-500" style={{fontSize: "32px"}}>directions_walk</span>
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                            <p className="text-[#111812] dark:text-white text-xl font-bold leading-tight">Rutinas de Ejercicio</p>
                            <p className="text-[#618968] dark:text-gray-400 text-base font-normal leading-normal">Mover el cuerpo</p>
                        </div>
                        <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-3xl">chevron_right</span>
                    </div>
                </Link>
                    <Link to="/recipes" className="group w-full text-left focus:outline-none">
                    <div className="flex items-center justify-between gap-5 rounded-xl bg-white dark:bg-[#1A2E1E] p-6 shadow-sm border border-transparent dark:border-gray-800 active:scale-[0.98] transition-transform duration-200">
                        <div className="flex items-center justify-center size-16 rounded-full bg-[#fff4e0] dark:bg-orange-500/20 shrink-0">
                            <span className="material-symbols-outlined text-orange-700 dark:text-orange-400" style={{fontSize: "32px"}}>nutrition</span>
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                            <p className="text-[#111812] dark:text-white text-xl font-bold leading-tight">Recetas Saludables</p>
                            <p className="text-[#618968] dark:text-gray-400 text-base font-normal leading-normal">Comidas nutritivas</p>
                        </div>
                        <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-3xl">chevron_right</span>
                    </div>
                </Link>
                    <Link to="/health-record" className="group w-full text-left focus:outline-none">
                    <div className="flex items-center justify-between gap-5 rounded-xl bg-white dark:bg-[#1A2E1E] p-6 shadow-sm border border-transparent dark:border-gray-800 active:scale-[0.98] transition-transform duration-200">
                        <div className="flex items-center justify-center size-16 rounded-full bg-[#e0effc] dark:bg-blue-500/20 shrink-0">
                            <span className="material-symbols-outlined text-blue-700 dark:text-blue-400" style={{fontSize: "32px"}}>cardiology</span>
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                            <p className="text-[#111812] dark:text-white text-xl font-bold leading-tight">Registro de Salud</p>
                            <p className="text-[#618968] dark:text-gray-400 text-base font-normal leading-normal">Ver mi progreso</p>
                        </div>
                        <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-3xl">chevron_right</span>
                    </div>
                </Link>
            </div>
            <BottomNav />
        </div>
    );
};

interface Exercise {
    id: number;
    title: string;
    image: string;
}

export const ExerciseScreen: React.FC = () => {
    // Inicializado vacío para mostrar el estado "sin ejercicios"
    const [exercises, setExercises] = useState<Exercise[]>([]); 

    return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-200 min-h-screen pb-24 md:pb-6 md:pl-64">
        <BackHeader title="Rutinas de Ejercicio" />
        <main className="flex-1 flex flex-col gap-4 p-4 min-h-[60vh]">
            {exercises.length > 0 ? (
                exercises.map((exercise) => (
                    <article key={exercise.id} className="flex flex-col rounded-xl shadow-sm bg-white dark:bg-[#1c2033] overflow-hidden group">
                        <div className="w-full aspect-video bg-cover bg-center" style={{backgroundImage: `url('${exercise.image}')`}}></div>
                        <div className="flex flex-col gap-3 p-5">
                            <h2 className="text-xl font-bold leading-tight">{exercise.title}</h2>
                            <button className="flex items-center justify-center rounded-full h-10 px-6 bg-primary hover:bg-primary/90 transition-colors text-white text-base font-semibold shadow-md active:scale-95 transform transition-transform">
                                Iniciar
                            </button>
                        </div>
                    </article>
                ))
            ) : (
                <div className="flex flex-col items-center justify-center h-full flex-grow mt-20 opacity-70">
                    <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-5xl text-gray-400">fitness_center</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center">No hay ejercicios</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-center max-w-xs mt-2 text-lg">
                        Actualmente no hay rutinas de ejercicios cargadas.
                    </p>
                </div>
            )}
        </main>
        <BottomNav />
    </div>
    );
};

interface Recipe {
    id: number;
    title: string;
    image: string;
}

export const RecipesScreen: React.FC = () => {
    // Inicializado vacío para mostrar el estado "sin recetas"
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-200 min-h-screen pb-24 md:pb-6 md:pl-64">
        <BackHeader title="Recetas Saludables" />
        <main className="flex flex-col gap-6 px-4 pt-4 min-h-[60vh]">
            {recipes.length > 0 ? (
                recipes.map((recipe) => (
                    <article key={recipe.id} className="group/card relative flex flex-col items-stretch justify-start rounded-xl bg-surface-light dark:bg-surface-dark shadow-sm overflow-hidden cursor-pointer active:scale-[0.98] transition-all duration-200">
                        <div className="relative w-full aspect-video">
                            <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: `url('${recipe.image}')`}}></div>
                        </div>
                        <div className="flex w-full flex-col gap-3 p-5">
                            <h3 className="text-2xl font-bold leading-tight">{recipe.title}</h3>
                            <button className="flex items-center justify-center rounded-full h-10 px-6 bg-primary text-white text-base font-bold shadow-md hover:bg-primary-dark transition-colors">
                                Ver Receta
                            </button>
                        </div>
                    </article>
                ))
            ) : (
                <div className="flex flex-col items-center justify-center h-full flex-grow mt-20 opacity-70">
                    <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-5xl text-gray-400">no_meals</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center">No hay recetas</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-center max-w-xs mt-2 text-lg">
                        En este momento no hay recetas cargadas en el sistema.
                    </p>
                </div>
            )}
        </main>
        <BottomNav />
    </div>
    );
};

export const HealthRecordScreen: React.FC = () => {
    const { profile } = useAuth();
    const isPatient = profile?.role === 'patient';
    const { patientId: linkedPatientId, loading: linkingLoading } = useCaregiverLink();
    
    const { 
        records, 
        loading: recordsLoading, 
        error: recordsError, 
        addRecord, 
        deleteRecord 
    } = useBloodPressureRecords(isPatient ? undefined : linkedPatientId || undefined);

    const [isAdding, setIsAdding] = useState(false);
    const [systolic, setSystolic] = useState('');
    const [diastolic, setDiastolic] = useState('');
    const [pulse, setPulse] = useState('');
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);
    const [patientName, setPatientName] = useState<string | null>(null);

    useEffect(() => {
        if (!isPatient && linkedPatientId) {
            supabase.from('profiles').select('name').eq('id', linkedPatientId).single()
                .then(({ data }) => {
                    if (data) setPatientName(data.name);
                });
        }
    }, [isPatient, linkedPatientId]);

    const handleSaveRecord = async (e: React.FormEvent) => {
        e.preventDefault();
        if (systolic && diastolic) {
            setSaving(true);
            try {
                await addRecord({
                    systolic: parseInt(systolic),
                    diastolic: parseInt(diastolic),
                    pulse: pulse ? parseInt(pulse) : undefined,
                    notes: notes || undefined,
                });
                setIsAdding(false);
                setSystolic('');
                setDiastolic('');
                setPulse('');
                setNotes('');
            } catch (err) {
                // Error handled by hook
            } finally {
                setSaving(false);
            }
        }
    };

    const handleCancelAdd = () => {
        setIsAdding(false);
        setSystolic('');
        setDiastolic('');
        setPulse('');
        setNotes('');
    };

    if (linkingLoading) {
        return (
            <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-200 min-h-screen pb-24 md:pb-6 md:pl-64">
        <BackHeader title="Registro de Salud" />
        <main className="flex flex-col gap-6 px-4 pt-6 pb-8">
            
            {!isPatient && !linkedPatientId ? (
                <div className="flex flex-col items-center justify-center bg-white dark:bg-surface-dark rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 text-center mt-10">
                    <span className="material-symbols-outlined text-5xl text-gray-400 mb-4">link_off</span>
                    <h2 className="text-xl font-bold mb-2">No hay paciente vinculado</h2>
                    <p className="text-gray-500 max-w-xs">Para ver los registros de salud, debes estar vinculado a un paciente.</p>
                </div>
            ) : (
                <>
                    {!isPatient && patientName && (
                        <div className="bg-primary/10 dark:bg-primary/5 p-4 rounded-xl border border-primary/20">
                            <p className="text-xs font-bold text-primary uppercase tracking-wider">Viendo registros de</p>
                            <p className="text-xl font-bold text-slate-800 dark:text-white uppercase">{patientName}</p>
                        </div>
                    )}

                    <section>
                        <div className="flex items-center gap-2 mb-4 px-2">
                            <span className="material-symbols-outlined text-primary">ecg_heart</span>
                            <h2 className="text-xl font-bold">Presión Arterial</h2>
                        </div>
                        
                        <div className="flex flex-col gap-4">
                            {isPatient && (
                                isAdding ? (
                                    <form onSubmit={handleSaveRecord} className="bg-white dark:bg-[#1e293b] rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200">
                                        <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Nueva Medición</h3>
                                        <div className="flex gap-4 mb-4">
                                            <div className="flex-1">
                                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Sistólica</label>
                                                <input 
                                                    type="number" 
                                                    value={systolic}
                                                    onChange={(e) => setSystolic(e.target.value)}
                                                    placeholder="120"
                                                    min="50"
                                                    max="250"
                                                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 text-2xl font-bold p-3 text-center focus:ring-primary focus:border-primary text-slate-900 dark:text-white"
                                                    autoFocus
                                                    required
                                                />
                                            </div>
                                            <div className="flex items-end pb-7 text-2xl text-gray-300">/</div>
                                             <div className="flex-1">
                                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Diastólica</label>
                                                <input 
                                                    type="number" 
                                                    value={diastolic}
                                                    onChange={(e) => setDiastolic(e.target.value)}
                                                    placeholder="80"
                                                    min="30"
                                                    max="150"
                                                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 text-2xl font-bold p-3 text-center focus:ring-primary focus:border-primary text-slate-900 dark:text-white"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Pulso (BPM)</label>
                                            <input 
                                                type="number" 
                                                value={pulse}
                                                onChange={(e) => setPulse(e.target.value)}
                                                placeholder="70"
                                                min="30"
                                                max="200"
                                                className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-black/20 p-3 font-bold text-slate-900 dark:text-white"
                                            />
                                        </div>

                                        <div className="mb-6">
                                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Notas</label>
                                            <textarea 
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                placeholder="Ej: Después de caminar, me sentí bien."
                                                className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-black/20 p-3 text-slate-900 dark:text-white resize-none h-24"
                                            />
                                        </div>

                                        <div className="flex gap-3">
                                             <button 
                                                type="button" 
                                                disabled={saving}
                                                onClick={handleCancelAdd}
                                                className="flex-1 py-3 font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                            <button 
                                                type="submit" 
                                                disabled={saving}
                                                className="flex-1 py-3 font-bold text-white bg-primary rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
                                            >
                                                {saving ? 'Guardando...' : 'Guardar'}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <button 
                                        onClick={() => setIsAdding(true)}
                                        className="bg-white dark:bg-surface-dark border-2 border-dashed border-primary/30 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 group active:scale-[0.98] transition-all"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary transition-colors group-hover:text-white">
                                            <span className="material-symbols-outlined text-3xl">add</span>
                                        </div>
                                        <p className="font-bold text-primary">Agregar Presión Arterial</p>
                                    </button>
                                )
                            )}

                            {recordsError && (
                                <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl text-sm font-medium">
                                    {recordsError}
                                </div>
                            )}

                            <div className="flex flex-col gap-3">
                                <h3 className="text-lg font-bold px-2 mt-2">Historial</h3>
                                {recordsLoading ? (
                                    <div className="flex justify-center py-10">
                                        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                    </div>
                                ) : records.length > 0 ? (
                                    records.map((record) => (
                                        <div key={record.id} className="bg-white dark:bg-surface-dark rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl text-blue-600">
                                                        <span className="material-symbols-outlined text-2xl font-bold italic">cardiology</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-2xl font-black text-slate-800 dark:text-white leading-tight">
                                                            {record.systolic} / {record.diastolic}
                                                            <span className="text-xs font-bold text-gray-400 ml-1">mmHg</span>
                                                        </p>
                                                        <p className="text-xs text-slate-500 font-bold uppercase mt-1">
                                                            {new Date(record.measured_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                {isPatient && (
                                                    <button 
                                                        onClick={() => {
                                                            if (window.confirm('¿Eliminar este registro?')) {
                                                                deleteRecord(record.id);
                                                            }
                                                        }}
                                                        className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined">delete</span>
                                                    </button>
                                                )}
                                            </div>
                                            {(record.pulse || record.notes) && (
                                                <div className="mt-3 pt-3 border-t border-gray-50 dark:border-gray-800 flex flex-wrap gap-x-4 gap-y-2">
                                                    {record.pulse && (
                                                        <div className="flex items-center gap-1 text-sm font-bold text-red-500">
                                                            <span className="material-symbols-outlined text-sm">favorite</span>
                                                            {record.pulse} BPM
                                                        </div>
                                                    )}
                                                    {record.notes && (
                                                        <div className="flex items-start gap-1 text-sm text-slate-600 dark:text-gray-400">
                                                            <span className="material-symbols-outlined text-sm mt-0.5">sticky_note_2</span>
                                                            <p className="italic">{record.notes}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-10 opacity-50">
                                        <span className="material-symbols-outlined text-4xl mb-2">inbox</span>
                                        <p className="font-bold">Sin registros</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </>
            )}
        </main>
        <BottomNav />
    </div>
    );
};
