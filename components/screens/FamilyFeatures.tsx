import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BackHeader, BottomNav } from '../Layout';
import { useAuth } from '../../contexts/AuthContext';


import { supabase } from '../../services/supabaseClient';
import { useCaregiverLink } from '../../hooks/useCaregiverLink';
import { useEmotionalContacts, EmotionalContact } from '../../hooks/useEmotionalContacts';

// --- Shared Components for Charts ---
const ProgressLayout = ({ title, weeklyIncrease, chartPath, data }: { title: string, weeklyIncrease: string, chartPath: string, data: any }) => {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-24 md:pb-6 md:pl-64 bg-background-light dark:bg-background-dark font-display text-[#111812] dark:text-white">
            <BackHeader title="Mi Progreso" />
            <div className="flex flex-col px-5 pt-6 pb-2">
                <h1 className="tracking-tight text-3xl font-bold leading-tight text-left">{title}</h1>
                <p className="text-slate-600 dark:text-slate-300 text-lg mt-1 font-medium">Resumen de esta semana</p>
            </div>
             <div className="grid grid-cols-2 gap-4 p-5 w-full">
                <div className="flex flex-col justify-between gap-3 rounded-xl p-5 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">
                            <span className="material-symbols-outlined">emoji_events</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-200 text-sm font-bold leading-normal">Niveles</p>
                    </div>
                    <div>
                        <p className="tracking-tight text-4xl font-bold leading-tight">{data.levels}</p>
                        <p className="text-slate-600 dark:text-slate-400 text-xs font-bold mt-1">Completados</p>
                    </div>
                </div>
                <div className="flex flex-col justify-between gap-3 rounded-xl p-5 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                            <span className="material-symbols-outlined">calendar_month</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-200 text-sm font-bold leading-normal">Diario</p>
                    </div>
                     <div>
                        <p className="tracking-tight text-4xl font-bold leading-tight">{data.daily}</p>
                        <p className="text-slate-600 dark:text-slate-400 text-xs font-bold mt-1">Niveles / Día</p>
                    </div>
                </div>
                 <div className="col-span-2 flex items-center justify-between gap-3 rounded-xl p-5 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                            <span className="material-symbols-outlined">timer</span>
                        </div>
                        <div>
                            <p className="text-slate-700 dark:text-slate-200 text-sm font-bold leading-normal">Tiempo Promedio</p>
                            <p className="text-slate-600 dark:text-slate-400 text-xs font-bold">Por sesión de juego</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="tracking-tight text-3xl font-bold leading-tight">{data.time}</p>
                    </div>
                </div>
             </div>
             <div className="flex flex-col px-5 py-2">
                <div className="flex flex-col gap-4 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                     <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-600 dark:text-slate-300 text-sm font-bold uppercase tracking-wider">Mejora Semanal</p>
                                <p className="tracking-tight text-2xl font-bold leading-tight truncate mt-1">Tendencia</p>
                            </div>
                            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                                <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-sm font-bold">trending_flat</span>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-bold leading-normal">{weeklyIncrease}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full flex-col gap-8 pt-4">
                        <div className="relative w-full aspect-[2/1]">
                            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 340 150">
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#13ec37" stopOpacity="0.2"></stop>
                                        <stop offset="100%" stopColor="#13ec37" stopOpacity="0"></stop>
                                    </linearGradient>
                                </defs>
                                <line className="dark:stroke-gray-700" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="340" y1="150" y2="150"></line>
                                <line className="dark:stroke-gray-700" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="340" y1="75" y2="75"></line>
                                <line className="dark:stroke-gray-700" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="340" y1="0" y2="0"></line>
                                <path d={chartPath} fill="url(#chartGradient)"></path>
                                <path d={chartPath} fill="none" stroke="#13ec37" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>
                            </svg>
                        </div>
                    </div>
                </div>
             </div>
             
             {/* Sección Medallas Ganadas */}
             <div className="flex flex-col px-5 pt-4">
                <h3 className="text-xl font-bold mb-3 text-[#111812] dark:text-white">Medallas Ganadas</h3>
                <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                    {[1, 2, 3].map((i) => (
                         <div key={i} className="min-w-[100px] h-[120px] rounded-2xl bg-white dark:bg-surface-dark flex flex-col items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 shadow-sm opacity-70">
                            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <span className="material-symbols-outlined text-2xl text-gray-400">lock</span>
                            </div>
                            <span className="text-xs font-bold text-gray-400">Nivel {i}</span>
                         </div>
                    ))}
                </div>
             </div>

             <BottomNav />
        </div>
    );
};

// --- Screens ---

export const LocationScreen: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark font-display md:pl-64">
            <BackHeader title="Ubicación" />
            <main className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2 animate-in zoom-in-50 duration-500">
                    <span className="material-symbols-outlined text-4xl text-green-600 dark:text-green-400 font-bold">my_location</span>
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Nueva Zona Segura
                </h2>
                
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-lg leading-relaxed">
                    Hemos actualizado la funcionalidad de ubicación. Ahora puedes configurar zonas seguras y recibir alertas con mayor precisión.
                </p>

                <button 
                    onClick={() => navigate('/safe-zone')}
                    className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary/30 transition-all active:scale-95 flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">security</span>
                    Configurar Zona Segura
                </button>
            </main>
            <BottomNav active="location" />
        </div>
    );
};


export const EmotionalSupportScreen: React.FC = () => {
    const navigate = useNavigate();
    const { profile } = useAuth();
    const userName = profile?.name || 'Usuario';
    
    // Hook Data
    const { contacts, loading, error, isReadOnly, addContact, updateContact, deleteContact } = useEmotionalContacts();
    
    // Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<EmotionalContact | null>(null);
    const [newName, setNewName] = useState('');
    const [newRole, setNewRole] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Open Modal for Create or Edit
    const openModal = (contact: EmotionalContact | null = null) => {
        setSubmitError(null);
        if (contact) {
            setEditingContact(contact);
            setNewName(contact.name);
            setNewRole(contact.relationship || '');
            setNewPhone(contact.phone);
        } else {
            setEditingContact(null);
            setNewName('');
            setNewRole('');
            setNewPhone('');
        }
        setIsAddModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);
        try {
            if (editingContact) {
                await updateContact(editingContact.id, { name: newName, phone: newPhone, relationship: newRole });
            } else {
                await addContact(newName, newPhone, newRole);
            }
            setIsAddModalOpen(false);
        } catch (err: any) {
            setSubmitError(err.message);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`¿Seguro que deseas eliminar a ${name}?`)) {
            try {
                await deleteContact(id);
            } catch (err: any) {
                alert("Error al eliminar: " + err.message);
            }
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-[#111812] dark:text-gray-100 min-h-screen pb-24 transition-colors duration-200 md:pb-6 md:pl-64">
            <header className="sticky top-0 z-50 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm p-4 pb-2 border-b border-gray-200/20 dark:border-white/5">
                <button onClick={() => navigate(-1)} className="flex size-12 shrink-0 items-center justify-center rounded-full active:bg-black/5 dark:active:bg-white/5 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-3xl">arrow_back</span>
                </button>
                <h1 className="text-xl font-bold leading-tight tracking-tight flex-1 text-center pr-12">Soporte Emocional</h1>
            </header>
            
            <div className="px-6 pt-4 pb-2">
                <p className="text-[#618968] dark:text-[#aecfb4] text-lg font-medium">
                    {isReadOnly ? `Red de apoyo del paciente` : `Hola ${userName}, gestiona tu red de apoyo.`}
                </p>
            </div>

            <section className="flex flex-col">
                <div className="flex items-center justify-between px-6 pt-4 pb-4">
                     <h2 className="tracking-tight text-2xl font-bold leading-tight">Contactos de Emergencia</h2>
                     {!isReadOnly && contacts.length < 10 && (
                        <button 
                            onClick={() => openModal()}
                            className="bg-primary/10 text-primary p-2 rounded-full hover:bg-primary/20 transition-colors"
                        >
                            <span className="material-symbols-outlined">add</span>
                        </button>
                     )}
                </div>
                
                {loading && <div className="p-6 text-center text-gray-500">Cargando contactos...</div>}
                
                {error && <div className="p-6 text-center text-red-500">Error: {error}</div>}

                {!loading && !error && contacts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 gap-4 mt-4 bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 mx-4 animate-in fade-in zoom-in-95 duration-300">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-2">
                            <span className="material-symbols-outlined text-4xl text-gray-400">group_off</span>
                        </div>
                        <h3 className="text-xl font-bold text-center text-[#111812] dark:text-white">Lista vacía</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-center max-w-xs">
                            {isReadOnly ? "El paciente no tiene contactos asignados." : "Agrega familiares o servicios de emergencia."}
                        </p>
                        {!isReadOnly && (
                            <button 
                                onClick={() => openModal()}
                                className="mt-2 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined">person_add</span>
                                Agregar
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 px-4 pb-4">
                        {contacts.map((contact) => (
                            <div key={contact.id} className="relative flex flex-col items-center gap-3 bg-white dark:bg-[#1a2e1d] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                
                                {!isReadOnly && (
                                    <div className="absolute top-2 right-2 flex gap-1">
                                        <button 
                                            onClick={() => openModal(contact)}
                                            className="text-gray-300 hover:text-blue-500 transition-colors p-1"
                                        >
                                            <span className="material-symbols-outlined text-sm">edit</span>
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(contact.id, contact.name)}
                                            className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                        >
                                            <span className="material-symbols-outlined text-sm">close</span>
                                        </button>
                                    </div>
                                )}

                                <div className="relative w-full max-w-[100px] aspect-square">
                                    <div className="w-full h-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center rounded-full text-blue-600 dark:text-blue-400 font-bold text-3xl shadow-inner border-4 border-white dark:border-background-dark">
                                        {contact.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg flex items-center justify-center ring-2 ring-white dark:ring-background-dark">
                                        <span className="material-symbols-outlined text-lg font-bold">call</span>
                                    </div>
                                </div>
                                
                                <div className="text-center w-full">
                                    <p className="text-lg font-bold leading-tight truncate">
                                        {contact.relationship || 'Contacto'} 
                                    </p>
                                    <p className="text-sm font-normal text-gray-500 mb-2">({contact.name})</p>
                                    
                                    <a 
                                        href={`tel:${contact.phone}`}
                                        className="mt-1 w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md shadow-primary/20"
                                    >
                                        Llamar
                                    </a>
                                </div>
                            </div>
                        ))}
                         
                        {!isReadOnly && contacts.length < 10 && (
                            <button 
                                onClick={() => openModal()}
                                className="flex flex-col items-center justify-center gap-3 bg-gray-50 dark:bg-white/5 p-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:bg-primary/5 transition-all group min-h-[220px]"
                            >
                                <div className="w-14 h-14 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-3xl">add</span>
                                </div>
                                <p className="font-bold text-gray-500 group-hover:text-primary transition-colors">Agregar</p>
                            </button>
                        )}
                    </div>
                )}
            </section>
            
            <div className="h-8"></div>

            {/* Add/Edit Contact Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#1c1d27] rounded-2xl w-full max-w-sm p-6 shadow-xl border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
                            {editingContact ? 'Editar Contacto' : 'Nuevo Contacto'}
                        </h3>
                        {submitError && <p className="text-red-500 text-sm mb-3">{submitError}</p>}
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                                <input 
                                    type="text" 
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary py-3"
                                    placeholder="Ej. Juan Pérez"
                                    autoFocus
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rol / Parentesco</label>
                                <input 
                                    type="text" 
                                    value={newRole}
                                    onChange={(e) => setNewRole(e.target.value)}
                                    className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary py-3"
                                    placeholder="Ej. Sobrino"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono</label>
                                <input 
                                    type="tel" 
                                    value={newPhone}
                                    onChange={(e) => setNewPhone(e.target.value)}
                                    className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary py-3"
                                    placeholder="+54 9 11 1234 5678"
                                    required
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setIsAddModalOpen(false)}
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
                    </div>
                </div>
            )}

            <BottomNav />
        </div>
    );
};

export const FamilyStimulationScreen: React.FC = () => {
    const navigate = useNavigate();
    const { profile } = useAuth();
    const { isLinked, loading } = useCaregiverLink();
    const userName = profile?.name || 'Familiar';

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isLinked) {
        return (
            <div className="relative flex h-full min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display md:pl-64">
                <BackHeader title="Estimulación" onBack={() => navigate('/home')} />
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 mt-20">
                    <div className="w-24 h-24 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-2">
                        <span className="material-symbols-outlined text-4xl text-primary font-bold">person_add_help</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">No hay paciente vinculado</h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto text-lg leading-relaxed">
                        Debes vincularte con tu familiar para ver su progreso y estadísticas.
                    </p>
                    <button 
                        onClick={() => navigate('/profile')}
                        className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary/30 transition-all active:scale-95 mt-4 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">settings</span>
                        Ir a Perfil
                    </button>
                </div>
                <BottomNav active="health" />
            </div>
        );
    }
    
    return (
        <div className="relative flex h-full min-h-screen w-full flex-col pb-24 overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-[#111812] dark:text-white md:pb-6 md:pl-64">
           <BackHeader title="Estimulación" onBack={() => navigate('/home')} />
           <div className="px-5 pt-6 pb-2">
               <h2 className="tracking-tight text-[32px] font-bold leading-tight text-left">Hola, {userName}</h2>
               <p className="text-slate-500 dark:text-slate-400 text-base font-medium mb-3 mt-1">Rol: Familiar</p>
               <div className="flex gap-3 flex-wrap">
                   <div className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#13ec37]/20 dark:bg-[#13ec37]/10 border border-[#13ec37]/30 pl-4 pr-5 transition-colors">
                       <span className="material-symbols-outlined text-green-700 dark:text-green-400 text-[20px]">tune</span>
                       <p className="text-green-900 dark:text-green-300 text-base font-medium leading-normal">Dificultad: Automática</p>
                   </div>
               </div>
           </div>
           <div className="flex flex-col mt-4">
                <div className="flex items-center justify-between px-5 pb-3 pt-4">
                   <h3 className="text-[24px] font-bold leading-tight tracking-[-0.015em]">Juegos Cognitivos</h3>
                </div>
                <div className="px-4 mb-4 w-full">
                   <Link to="/progress?category=memory" className="flex flex-col items-stretch justify-start rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark overflow-hidden transition-transform active:scale-[0.99] duration-200">
                       <div className="flex flex-row p-3 gap-4 items-center">
                           <div className="w-24 h-24 shrink-0 bg-center bg-no-repeat bg-cover rounded-xl bg-blue-100" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCqgBMicgKHHkPcQjDCbXSwA7KlhXcHnZIWtn29GgPQ28-79L9Fx8pQsCgOJUxDdjuEmAiJIgUs6_y6ztz-umyDqZ0U6Khv54I27TDJuabrEJ8yxLZdOGiHbaj4IVaGMzM0KrUIuLYQXxx8cU_cE_fLGps_cSMRGLcFjdVaVrrS_SJimxRjkAXgpsGyuZzYinBVTHlnFwP7brrZBSjaqZyb8Yuai592ZjPuuul_6F7VyvKexfr8bIVBNs5dzuEAOTIQUEBT5Xse7l4')"}}></div>
                           <div className="flex flex-col grow justify-center gap-1">
                               <h4 className="text-xl font-bold leading-tight">Memoria</h4>
                               <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">Ver progreso de la actividad</p>
                           </div>
                           <div className="flex flex-col justify-center pr-2">
                               <div className="flex size-12 items-center justify-center rounded-full bg-[#13ec37] text-[#052e0d] shadow-md hover:bg-green-400 transition-colors">
                                   <span className="material-symbols-outlined text-[32px] font-bold">analytics</span>
                               </div>
                           </div>
                       </div>
                   </Link>
                </div>
                <div className="px-4 mb-4 w-full">
                   <Link to="/progress?category=attention" className="flex flex-col items-stretch justify-start rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark overflow-hidden transition-transform active:scale-[0.99] duration-200">
                       <div className="flex flex-row p-3 gap-4 items-center">
                           <div className="w-24 h-24 shrink-0 bg-center bg-no-repeat bg-cover rounded-xl bg-orange-100" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDFoQbS9zRcBiJFVO1RbyNv_B4xG5PqyFvuI-q1VgWHRv2dgo0cB-oyon76L5rTptIHnBEwG9b0xiPgj8bJcH7zgwgFc68UK80i9hUoKIiLOVmhZMaCg4q3zHHNlhM8h6yFNk761tKPoyEIUczCotx4Hhv_POt_a46AlO5Lrnm-4RO9VWhnoMUO24LWazb33l8sqAakATS1H09y6OXZFFzjguR0uqedGTqNRrIuZiip2H3sbntPn3ZYXVmjDh31UrtVbiCvvg5QdNo')"}}></div>
                           <div className="flex flex-col grow justify-center gap-1">
                               <h4 className="text-xl font-bold leading-tight">Atención</h4>
                               <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">Ver progreso de la actividad</p>
                           </div>
                           <div className="flex flex-col justify-center pr-2">
                               <div className="flex size-12 items-center justify-center rounded-full bg-[#13ec37] text-[#052e0d] shadow-md hover:bg-green-400 transition-colors">
                                   <span className="material-symbols-outlined text-[32px] font-bold">analytics</span>
                               </div>
                           </div>
                       </div>
                   </Link>
                </div>
                <div className="px-4 mb-4 w-full">
                   <Link to="/progress?category=calculation" className="flex flex-col items-stretch justify-start rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark overflow-hidden transition-transform active:scale-[0.99] duration-200">
                       <div className="flex flex-row p-3 gap-4 items-center">
                           <div className="w-24 h-24 shrink-0 bg-center bg-no-repeat bg-cover rounded-xl bg-purple-100" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCgMAnB-kcdLbuJURzzER-LVdJ0lVOthmjmVa0q57Pl36GJmSWA5qpqBwPLuu4ZsF6UZckanOdbbAwocmTi3qyl4ZEWQv59CdJ-S_vVBMN2vno9gBhJcC7M317hPJCUMpeiKTbWSn6-xwSDnw_KARVHADO0X6BQ-_8e4VqqIefpWooNLxh-8Rd2v4p3_1T9kHveWlBD6GgldPOOC_BnZgcWYTPnevfi05MD5dyg5AR89heeYLcRAOjfrydMvEF9ikmwHkiOAhuPx1M')"}}></div>
                           <div className="flex flex-col grow justify-center gap-1">
                               <h4 className="text-xl font-bold leading-tight">Cálculo</h4>
                               <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">Ver progreso de la actividad</p>
                           </div>
                           <div className="flex flex-col justify-center pr-2">
                               <div className="flex size-12 items-center justify-center rounded-full bg-[#13ec37] text-[#052e0d] shadow-md hover:bg-green-400 transition-colors">
                                   <span className="material-symbols-outlined text-[32px] font-bold">analytics</span>
                               </div>
                           </div>
                       </div>
                   </Link>
                </div>
           </div>
           <BottomNav active="health" />
        </div>
    );
};

export const CalculationProgressScreen = () => <ProgressLayout title="Juegos de Cálculo" weeklyIncrease="0%" data={{levels: 0, daily: 0, time: "0m 0s"}} chartPath="M0 145 L340 145" />;
export const AttentionProgressScreen = () => <ProgressLayout title="Juegos de Atención" weeklyIncrease="0%" data={{levels: 0, daily: 0, time: "0m 0s"}} chartPath="M0 145 L340 145" />;
export const MemoryProgressScreen = () => <ProgressLayout title="Juegos de Memoria" weeklyIncrease="0%" data={{levels: 0, daily: 0, time: "0m 0s"}} chartPath="M0 145 L340 145" />;