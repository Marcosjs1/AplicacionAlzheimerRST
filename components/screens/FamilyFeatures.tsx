import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BackHeader, BottomNav } from '../Layout';

// --- Shared Components for Charts ---
const ProgressLayout = ({ title, weeklyIncrease, chartPath, data }: { title: string, weeklyIncrease: string, chartPath: string, data: any }) => {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-24 bg-background-light dark:bg-background-dark font-display text-[#111812] dark:text-white">
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

             <BottomNav active="progress" />
        </div>
    );
};

// --- Screens ---

export const LocationScreen: React.FC = () => {
    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark font-display">
            <BackHeader title="Ubicación del Familiar" />
            <main className="flex-1 overflow-y-auto pb-24">
                <div className="px-4 py-2">
                     <div className="relative w-full h-[420px] rounded-2xl overflow-hidden shadow-lg group bg-surface-dark border-2 border-[#13ec37]/30">
                        <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCEpf1x-NLA6-3igQ6zYwcGJwx2RHSE2z8a8_xgwzVDPXCWm7xQBBxq0r_xZjicQAcG7x-1HNH7nYMkz9uQNaHhHmguVRg79ADrXtlfb21TDC26h2ZSdK2Bgnx6cb30-Hj8zWcDtQcBSaKw8eG3Iv2CDdHpNorGVD26KEFvvlUpIm9lTFpUTrigwh2ldP2H6q4z3RTujuzET7TqzuX-UqJ-0muk4Hr6p9ppgRpi_sTg8oI2Ud9jRGBuVsy8pLsrb9pWaeGzE2rXVlI')", filter: "grayscale(100%) invert(10%) contrast(1.2)"}}></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-2 border-[#13ec37]/30 bg-[#13ec37]/5 pointer-events-none animate-pulse"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-20">
                            <div className="relative">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-[#13ec37] opacity-75 animate-ping"></span>
                                <div className="relative flex items-center justify-center h-12 w-12 rounded-full border-4 border-white dark:border-background-dark bg-[#13ec37] shadow-xl overflow-hidden">
                                    <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGhyIQ_AgFhxunFqUFXI3nuUbjC4KK4l7s76wMBbdvKWwj907gN_1_OuSNklWLJLUmabtgM7ICOMbSnZmxiscSQgKOQg_BYfOoqiyj3LGQwHRSZvQezV5V3CK9kDWYvdY-pGADVUfs6HXm0_Eoeynwu5ReT71eH6hkb0HaG5H5-RX-VOFsrMQujsmMge8rKvgSMsFKHUeLMO8jmL_HCsKqVMqm8rfG9LqzKbHowibMdghQfyXVWr845o1vUKXHCoOXSJQ-NY--2Jw" alt="Familiar" />
                                </div>
                            </div>
                            <div className="px-3 py-1 bg-white dark:bg-background-dark rounded-full shadow-lg border border-[#13ec37]/20">
                                <span className="text-xs font-bold text-slate-900 dark:text-white whitespace-nowrap">María Gómez</span>
                            </div>
                        </div>
                        <div className="absolute top-4 left-4 right-4 z-10">
                            <div className="flex w-full items-center bg-white/90 dark:bg-surface-dark/95 backdrop-blur-md rounded-xl p-1 pr-4 shadow-lg border border-white/10">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#13ec37]/20 text-[#0a3d13] dark:text-[#13ec37] mr-3 shrink-0">
                                    <span className="material-symbols-outlined text-[20px]">my_location</span>
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Ubicación actual</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">Calle Gran Vía, 22, Madrid</p>
                                </div>
                            </div>
                        </div>
                     </div>
                </div>
                {/* Patient Info Card */}
                <div className="px-4 mt-2">
                    <div className="flex flex-col gap-4 rounded-2xl bg-white dark:bg-surface-dark p-5 shadow-sm border border-gray-100 dark:border-white/5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs font-medium">Estado</span>
                                    <div className="flex items-center gap-2">
                                        <span className="relative flex h-2.5 w-2.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#13ec37] opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#13ec37]"></span>
                                        </span>
                                        <span className="text-slate-900 dark:text-white font-semibold">En zona segura</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

interface SupportContact {
    id: number;
    name: string;
    role: string;
    image?: string;
    isLinked?: boolean;
}

export const EmotionalSupportScreen: React.FC = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName') || 'María';
    
    // State for contacts
    const [contacts, setContacts] = useState<SupportContact[]>([]);
    
    // Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newName, setNewName] = useState('');
    const [newRole, setNewRole] = useState('');
    const [newPhone, setNewPhone] = useState('');

    useEffect(() => {
        // 1. Start with hardcoded demo contacts
        const initialContacts: SupportContact[] = [
            { 
                id: 1, 
                name: 'Ana', 
                role: 'Hija', 
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkWhiKGAfpwvxCvrKndaPlIbWTTNhCrCQUa4kzixFE7wpt3qLVrgFZou_tkMqj-VHcP79K9t0-wEiY_9X3u_xk0dgKH2lVa_TEqe68OHocdZx74J_rIyItL0g-C50TV5dJ4WEaViBqG5NGnbsLoojQ3lFxGmWyiEqsl4W3NR-ovZmJXqJi7ePU_hEKx-SHBFUY4baYWQUTeKTU4R4YTTtBf-SjdxoROFCOVwYanlqUB3rAw1DpafBEQSHayaeP_I1ierafv6VYEQw' 
            },
            { 
                id: 3, 
                name: 'Pedro', 
                role: 'Nieto', 
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrqfvJ7EugJhZ_0sIAMXglX0eYm2vNkioZQ0K05MmBIs7EEbK1ln41XfYvHUvFWfklAcsnovknbYU0_ECBZCvq45DsqrPKrZTAsIHzLtcOf6ZtJ3xXIGkd4ijuH-L5_Pu_T9tBeCIRYQaJyADwTmkTiyQMXXoGb9Wu8eHw56uI8iYYu9sV9460crT6f5XZFtFpTMG5EkoxLkNTu-jy0zrnEV9goSGjdcxllPOU3-BP5Nds7u4DGYplriDIkOD1knNVn5GjTom2FIE' 
            },
            { 
                id: 4, 
                name: 'Maria', 
                role: 'Doctora', 
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqim4uW0TtGMdllLYPNPt2YT4PmQ2ua-1V0ZvKKg-aInOwh1BWFcF6cHAOt5qNerdJIxvoCOCYRTEm1pc0XB-ZjBwiPU3xr6VKFO-ud4fOT6YkCdCgPsAzObVWdc5RNjCxcRCf9pK5pTNqORf80B9nr8wIIL75LM5-X3ualxHR7D_8e7mmv61KCDmL3NW1yXAaXRTMHVx8DPl_N7wMimRBysd6-SY78beW5ElAG3jQg_OAx2fWzU5Nt69CquJCtepE0smcyePagXw' 
            }
        ];

        // 2. Check for Linked Caregiver/Patient (Simulated Logic)
        // In a real app, this would come from an API or consistent context. 
        // We'll simulate that "Luis" is a linked caregiver.
        // We can simulate checking localStorage for a flag like 'isLinked'
        const isLinked = true; // Hardcoded for demo to satisfy "if linked, show contact"
        
        if (isLinked) {
            const linkedContact: SupportContact = {
                id: 2,
                name: 'Luis',
                role: 'Cuidador Vinculado',
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1utRIzC0ScWslZ8dwRLYapPiMqbDzuB-l4UTwJEDnSHCxhurjIprCtT7iWBF6HqNz1HcPmiliVEioVtAX8NYh5kknk_TPsMaRSawx8lrCoH0rY6uzmR2BGOK-riSiRdcoI4hhLjL7doeerOcnPtqJINSGqlNrUdAe35e658fKiFXQJvXT52knY97FnKC9wVxVcaiZOokFoMxJiWyMx2VcfHtGf342zDr9_M89BirDk3-Fbfa05-Us-yXiVOupV1FFLWb1OBMN8EY',
                isLinked: true
            };
            // Insert linked contact at specific position or push
            initialContacts.splice(1, 0, linkedContact);
        }

        setContacts(initialContacts);
    }, []);

    const handleCall = (name: string) => {
        alert(`Iniciando videollamada con ${name}...`);
    };

    const handleDelete = (id: number) => {
        setContacts(prev => prev.filter(c => c.id !== id));
    };

    const handleAddContact = (e: React.FormEvent) => {
        e.preventDefault();
        if (newName && newRole) {
            const newContact: SupportContact = {
                id: Date.now(),
                name: newName,
                role: newRole,
                image: '' // Placeholder handling in render
            };
            setContacts(prev => [...prev, newContact]);
            setIsAddModalOpen(false);
            setNewName('');
            setNewRole('');
            setNewPhone('');
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-[#111812] dark:text-gray-100 min-h-screen pb-24 transition-colors duration-200">
            <header className="sticky top-0 z-50 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm p-4 pb-2 border-b border-gray-200/20 dark:border-white/5">
                <button onClick={() => navigate(-1)} className="flex size-12 shrink-0 items-center justify-center rounded-full active:bg-black/5 dark:active:bg-white/5 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-3xl">arrow_back</span>
                </button>
                <h1 className="text-xl font-bold leading-tight tracking-tight flex-1 text-center pr-12">Soporte Emocional</h1>
            </header>
            
            <div className="px-6 pt-4 pb-2">
                <p className="text-[#618968] dark:text-[#aecfb4] text-lg font-medium">Hola {userName}, aquí está tu red de apoyo.</p>
            </div>

            <section className="flex flex-col">
                <div className="flex items-center justify-between px-6 pt-4 pb-4">
                     <h2 className="tracking-tight text-2xl font-bold leading-tight">Llamar a Familia</h2>
                     {contacts.length > 0 && (
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-primary/10 text-primary p-2 rounded-full hover:bg-primary/20 transition-colors"
                        >
                            <span className="material-symbols-outlined">add</span>
                        </button>
                     )}
                </div>
               
                {contacts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 gap-4 mt-4 bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 mx-4 animate-in fade-in zoom-in-95 duration-300">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-2">
                            <span className="material-symbols-outlined text-4xl text-gray-400">group_off</span>
                        </div>
                        <h3 className="text-xl font-bold text-center text-[#111812] dark:text-white">No hay ningún contacto cargado</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-center max-w-xs">
                            Agrega a tus familiares o cuidadores para poder contactarlos rápidamente.
                        </p>
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="mt-2 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95 flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined">person_add</span>
                            Agregar Contacto
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 px-4 pb-4">
                        {contacts.map((contact) => (
                            <div key={contact.id} className={`relative flex flex-col items-center gap-3 bg-white dark:bg-[#1a2e1d] p-4 rounded-xl shadow-sm border ${contact.isLinked ? 'border-primary/50 dark:border-primary/40 ring-1 ring-primary/20' : 'border-gray-100 dark:border-white/5'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                {/* Delete Button (for demo purposes to reach empty state) */}
                                <button 
                                    onClick={() => handleDelete(contact.id)}
                                    className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors p-1"
                                >
                                    <span className="material-symbols-outlined text-sm">close</span>
                                </button>

                                <div className="relative w-full max-w-[140px] aspect-square">
                                    <div 
                                        className="w-full h-full bg-center bg-no-repeat bg-cover rounded-full shadow-inner border-4 border-white dark:border-background-dark" 
                                        style={{backgroundImage: contact.image ? `url('${contact.image}')` : 'none'}}
                                    >
                                        {!contact.image && (
                                            <div className="w-full h-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center rounded-full text-blue-600 dark:text-blue-400 font-bold text-3xl">
                                                {contact.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full shadow-lg flex items-center justify-center ring-2 ring-white dark:ring-background-dark">
                                        <span className="material-symbols-outlined text-xl font-bold">videocam</span>
                                    </div>
                                </div>
                                <div className="text-center w-full">
                                    <p className="text-lg font-bold leading-tight truncate">
                                        {contact.role} <span className="text-sm font-normal text-gray-500">({contact.name})</span>
                                    </p>
                                    {contact.isLinked && (
                                         <span className="inline-block mt-1 text-[10px] uppercase font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">Vinculado</span>
                                    )}
                                    <button 
                                        onClick={() => handleCall(contact.name)}
                                        className="mt-3 w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg text-lg flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md shadow-primary/20"
                                    >
                                        Llamar
                                    </button>
                                </div>
                            </div>
                        ))}
                         {/* Add Button Card in Grid */}
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex flex-col items-center justify-center gap-3 bg-gray-50 dark:bg-white/5 p-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                        >
                            <div className="w-14 h-14 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-3xl">add</span>
                            </div>
                            <p className="font-bold text-gray-500 group-hover:text-primary transition-colors">Agregar</p>
                        </button>
                    </div>
                )}
            </section>
            
            <div className="h-8"></div>

            {/* Add Contact Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#1c1d27] rounded-2xl w-full max-w-sm p-6 shadow-xl border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Nuevo Contacto</h3>
                        <form onSubmit={handleAddContact} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                                <input 
                                    type="text" 
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary py-3"
                                    placeholder="Ej. Juan"
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
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono (Opcional)</label>
                                <input 
                                    type="tel" 
                                    value={newPhone}
                                    onChange={(e) => setNewPhone(e.target.value)}
                                    className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary py-3"
                                    placeholder="Ej. 600 123 456"
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

            <BottomNav active="health" />
        </div>
    );
};

export const FamilyStimulationScreen: React.FC = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName') || 'Familiar';
    
    return (
        <div className="relative flex h-full min-h-screen w-full flex-col pb-24 overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-[#111812] dark:text-white">
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
                   <Link to="/progress/memory" className="flex flex-col items-stretch justify-start rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark overflow-hidden transition-transform active:scale-[0.99] duration-200">
                       <div className="flex flex-row p-3 gap-4 items-center">
                           <div className="w-24 h-24 shrink-0 bg-center bg-no-repeat bg-cover rounded-xl bg-blue-100" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCqgBMicgKHHkPcQjDCbXSwA7KlhXcHnZIWtn29GgPQ28-79L9Fx8pQsCgOJUxDdjuEmAiJIgUs6_y6ztz-umyDqZ0U6Khv54I27TDJuabrEJ8yxLZdOGiHbaj4IVaGMzM0KrUIuLYQXxx8cU_cE_fLGps_cSMRGLcFjdVaVrrS_SJimxRjkAXgpsGyuZzYinBVTHlnFwP7brrZBSjaqZyb8Yuai592ZjPuuul_6F7VyvKexfr8bIVBNs5dzuEAOTIQUEBT5Xse7l4')"}}></div>
                           <div className="flex flex-col grow justify-center gap-1">
                               <h4 className="text-xl font-bold leading-tight">Memoria</h4>
                               <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">Ver progreso de la actividad</p>
                           </div>
                           <div className="flex flex-col justify-center pr-2">
                               <div className="flex size-12 items-center justify-center rounded-full bg-[#13ec37] text-[#052e0d] shadow-md hover:bg-green-400 transition-colors">
                                   <span className="material-symbols-outlined text-[32px] font-bold ml-1">play_arrow</span>
                               </div>
                           </div>
                       </div>
                   </Link>
                </div>
                <div className="px-4 mb-4 w-full">
                   <Link to="/progress/attention" className="flex flex-col items-stretch justify-start rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark overflow-hidden transition-transform active:scale-[0.99] duration-200">
                       <div className="flex flex-row p-3 gap-4 items-center">
                           <div className="w-24 h-24 shrink-0 bg-center bg-no-repeat bg-cover rounded-xl bg-orange-100" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDFoQbS9zRcBiJFVO1RbyNv_B4xG5PqyFvuI-q1VgWHRv2dgo0cB-oyon76L5rTptIHnBEwG9b0xiPgj8bJcH7zgwgFc68UK80i9hUoKIiLOVmhZMaCg4q3zHHNlhM8h6yFNk761tKPoyEIUczCotx4Hhv_POt_a46AlO5Lrnm-4RO9VWhnoMUO24LWazb33l8sqAakATS1H09y6OXZFFzjguR0uqedGTqNRrIuZiip2H3sbntPn3ZYXVmjDh31UrtVbiCvvg5QdNo')"}}></div>
                           <div className="flex flex-col grow justify-center gap-1">
                               <h4 className="text-xl font-bold leading-tight">Atención</h4>
                               <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">Ver progreso de la actividad</p>
                           </div>
                           <div className="flex flex-col justify-center pr-2">
                               <div className="flex size-12 items-center justify-center rounded-full bg-[#13ec37] text-[#052e0d] shadow-md hover:bg-green-400 transition-colors">
                                   <span className="material-symbols-outlined text-[32px] font-bold ml-1">play_arrow</span>
                               </div>
                           </div>
                       </div>
                   </Link>
                </div>
                <div className="px-4 mb-4 w-full">
                   <Link to="/progress/calculation" className="flex flex-col items-stretch justify-start rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark overflow-hidden transition-transform active:scale-[0.99] duration-200">
                       <div className="flex flex-row p-3 gap-4 items-center">
                           <div className="w-24 h-24 shrink-0 bg-center bg-no-repeat bg-cover rounded-xl bg-purple-100" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCgMAnB-kcdLbuJURzzER-LVdJ0lVOthmjmVa0q57Pl36GJmSWA5qpqBwPLuu4ZsF6UZckanOdbbAwocmTi3qyl4ZEWQv59CdJ-S_vVBMN2vno9gBhJcC7M317hPJCUMpeiKTbWSn6-xwSDnw_KARVHADO0X6BQ-_8e4VqqIefpWooNLxh-8Rd2v4p3_1T9kHveWlBD6GgldPOOC_BnZgcWYTPnevfi05MD5dyg5AR89heeYLcRAOjfrydMvEF9ikmwHkiOAhuPx1M')"}}></div>
                           <div className="flex flex-col grow justify-center gap-1">
                               <h4 className="text-xl font-bold leading-tight">Cálculo</h4>
                               <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">Ver progreso de la actividad</p>
                           </div>
                           <div className="flex flex-col justify-center pr-2">
                               <div className="flex size-12 items-center justify-center rounded-full bg-[#13ec37] text-[#052e0d] shadow-md hover:bg-green-400 transition-colors">
                                   <span className="material-symbols-outlined text-[32px] font-bold ml-1">play_arrow</span>
                               </div>
                           </div>
                       </div>
                   </Link>
                </div>
           </div>
           <BottomNav active="activities" />
        </div>
    );
};

export const CalculationProgressScreen = () => <ProgressLayout title="Juegos de Cálculo" weeklyIncrease="0%" data={{levels: 0, daily: 0, time: "0m 0s"}} chartPath="M0 145 L340 145" />;
export const AttentionProgressScreen = () => <ProgressLayout title="Juegos de Atención" weeklyIncrease="0%" data={{levels: 0, daily: 0, time: "0m 0s"}} chartPath="M0 145 L340 145" />;
export const MemoryProgressScreen = () => <ProgressLayout title="Juegos de Memoria" weeklyIncrease="0%" data={{levels: 0, daily: 0, time: "0m 0s"}} chartPath="M0 145 L340 145" />;