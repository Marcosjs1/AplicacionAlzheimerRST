import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BackHeader, BottomNav } from '../Layout';

export const HealthScreen: React.FC = () => {
    const navigate = useNavigate();
    
    return (
        <div className="bg-background-light dark:bg-background-dark text-[#111812] dark:text-gray-100 font-display transition-colors duration-200 min-h-screen pb-24">
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
            <BottomNav active="health" />
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
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-200 min-h-screen pb-24">
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
        <BottomNav active="health" />
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
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-200 min-h-screen pb-24">
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
        <BottomNav active="health" />
    </div>
    );
};

export const HealthRecordScreen: React.FC = () => {
    // --- State for Bluetooth / Heart Rate ---
    const [isScanning, setIsScanning] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [heartRate, setHeartRate] = useState(0);

    // --- State for Health Records ---
    const [bloodPressure, setBloodPressure] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [systolic, setSystolic] = useState('');
    const [diastolic, setDiastolic] = useState('');

    // Mock Bluetooth Connection Logic
    const handleConnectBluetooth = () => {
        setIsScanning(true);
        // Simulate scanning delay
        setTimeout(() => {
            setIsScanning(false);
            setIsConnected(true);
            setHeartRate(72); // Initial value
        }, 2000);
    };

    const handleDisconnect = () => {
        setIsConnected(false);
        setHeartRate(0);
    };

    // Simulate Live Heart Rate updates
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isConnected) {
            interval = setInterval(() => {
                // Fluctuate heart rate slightly
                setHeartRate((prev) => {
                    const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
                    return prev + change;
                });
            }, 1500);
        }
        return () => clearInterval(interval);
    }, [isConnected]);

    // Save user input record
    const handleSaveRecord = (e: React.FormEvent) => {
        e.preventDefault();
        if (systolic && diastolic) {
            setBloodPressure(`${systolic}/${diastolic}`);
            setIsAdding(false);
            setSystolic('');
            setDiastolic('');
        }
    };

    const handleCancelAdd = () => {
        setIsAdding(false);
        setSystolic('');
        setDiastolic('');
    };

    const handleDeleteRecord = () => {
        setBloodPressure(null);
    };

    return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-200 min-h-screen pb-24">
        <BackHeader title="Registro de Salud" />
        <main className="flex flex-col gap-6 px-4 pt-6 pb-8">
            
            {/* --- Bluetooth / Real-time Section --- */}
            <section className="bg-white dark:bg-[#1e293b] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-red-500">monitor_heart</span>
                        <h2 className="text-xl font-bold">Monitoreo en Tiempo Real</h2>
                    </div>
                    {isConnected && (
                        <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full text-xs font-bold">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Conectado
                        </div>
                    )}
                </div>

                {!isConnected && !isScanning && (
                    <div className="flex flex-col items-center justify-center gap-3 py-4">
                        <p className="text-gray-500 text-center text-sm">Vincula tu smartwatch para ver tu ritmo cardíaco en vivo.</p>
                        <button 
                            onClick={handleConnectBluetooth}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                        >
                            <span className="material-symbols-outlined">bluetooth</span>
                            Vincular Smartwatch
                        </button>
                    </div>
                )}

                {isScanning && (
                    <div className="flex flex-col items-center justify-center gap-3 py-6">
                        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <p className="text-blue-600 font-medium animate-pulse">Buscando dispositivos...</p>
                    </div>
                )}

                {isConnected && (
                    <div className="flex flex-col items-center justify-center gap-2 py-2">
                        <div className="relative flex items-center justify-center">
                            <span className="material-symbols-outlined text-8xl text-red-500 opacity-10 absolute scale-150 animate-pulse">favorite</span>
                            <span className="material-symbols-outlined text-6xl text-red-500 animate-pulse">favorite</span>
                        </div>
                        <div className="text-center">
                            <p className="text-5xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
                                {heartRate} <span className="text-lg font-medium text-gray-500">BPM</span>
                            </p>
                        </div>
                        <button 
                            onClick={handleDisconnect}
                            className="mt-4 text-sm text-gray-400 hover:text-red-500 underline decoration-dotted underline-offset-4"
                        >
                            Desvincular dispositivo
                        </button>
                    </div>
                )}
            </section>

            {/* --- Records Section --- */}
            <section>
                <div className="flex items-center gap-2 mb-2 px-2">
                    <span className="material-symbols-outlined text-primary">ecg_heart</span>
                    <h2 className="text-xl font-bold">Signos Vitales</h2>
                </div>
                
                <div className="px-2 mb-3">
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Presión Arterial</h3>
                </div>

                <div className="flex flex-col gap-4">
                    {bloodPressure ? (
                        <div className="flex flex-col rounded-xl bg-white dark:bg-surface-dark shadow-sm p-6 border-l-4 border-primary animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Promedio</p>
                                    <h3 className="text-4xl font-bold text-slate-900 dark:text-white mt-1">{bloodPressure}</h3>
                                    <p className="text-sm text-gray-400 mt-2">Última lectura: Hoy, ahora</p>
                                </div>
                                <div className="p-3 bg-primary/10 rounded-full text-primary">
                                    <span className="material-symbols-outlined text-2xl">medical_services</span>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                                <button onClick={handleDeleteRecord} className="text-sm text-red-500 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ) : isAdding ? (
                        <form onSubmit={handleSaveRecord} className="bg-white dark:bg-[#1e293b] rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200">
                            <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Nueva Medición</h3>
                            <div className="flex gap-4 mb-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Sistólica</label>
                                    <input 
                                        type="number" 
                                        value={systolic}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === '') {
                                                setSystolic('');
                                            } else {
                                                const num = parseInt(val);
                                                if (!isNaN(num) && num >= 0 && num <= 240) {
                                                    setSystolic(val);
                                                }
                                            }
                                        }}
                                        placeholder="120"
                                        min="0"
                                        max="240"
                                        className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 text-2xl font-bold p-3 text-center focus:ring-primary focus:border-primary text-slate-900 dark:text-white"
                                        autoFocus
                                        required
                                    />
                                    <p className="text-xs text-center text-gray-400 mt-1">Máx: 240</p>
                                </div>
                                <div className="flex items-end pb-7 text-2xl text-gray-300">/</div>
                                 <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Diastólica</label>
                                    <input 
                                        type="number" 
                                        value={diastolic}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === '') {
                                                setDiastolic('');
                                            } else {
                                                const num = parseInt(val);
                                                if (!isNaN(num) && num >= 0 && num <= 200) {
                                                    setDiastolic(val);
                                                }
                                            }
                                        }}
                                        placeholder="80"
                                        min="0"
                                        max="200"
                                        className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 text-2xl font-bold p-3 text-center focus:ring-primary focus:border-primary text-slate-900 dark:text-white"
                                        required
                                    />
                                    <p className="text-xs text-center text-gray-400 mt-1">Máx: 200</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                 <button 
                                    type="button" 
                                    onClick={handleCancelAdd}
                                    className="flex-1 py-3 font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-1 py-3 font-bold text-white bg-primary rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-white/5 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-8 text-center">
                            <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">note_stack</span>
                            <p className="font-bold text-gray-600 dark:text-gray-300">Sin registros de hoy</p>
                            <button 
                                onClick={() => setIsAdding(true)}
                                className="mt-4 bg-primary text-white font-bold py-2 px-6 rounded-full hover:bg-primary-dark transition-colors shadow-md active:scale-95 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">add</span>
                                Agregar Presión Arterial
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </main>
        <BottomNav active="health" />
    </div>
    );
};