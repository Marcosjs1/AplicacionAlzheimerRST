import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BackHeader, BottomNav } from '../Layout';
import { usePreferences } from '../../contexts/PreferencesContext';

export const ProfileScreen: React.FC = () => {
    const navigate = useNavigate();
    const { fontSize, setFontSize, volume, setVolume, playFeedbackSound } = usePreferences();
    
    // Initialize with stored values, fallback to defaults
    const [name, setName] = useState(localStorage.getItem('userName') || "María García");
    const [role, setRole] = useState(localStorage.getItem('userRole') || "Usuario");
    const [birthDate, setBirthDate] = useState(localStorage.getItem('userBirthDate') || "1953-06-15");
    const [notifications, setNotifications] = useState(true);
    const [dateError, setDateError] = useState<string | null>(null);

    // Update localStorage when name changes
    useEffect(() => {
        localStorage.setItem('userName', name);
    }, [name]);

    // Update localStorage when birthDate changes
    useEffect(() => {
        if (!dateError) {
             localStorage.setItem('userBirthDate', birthDate);
        }
    }, [birthDate, dateError]);

    const handleVolumeChange = (change: number) => {
        const newVol = volume + change;
        setVolume(newVol);
        // Play sound only if interacting
        playFeedbackSound();
    };

    const adjustFontSize = (change: number) => {
        setFontSize(fontSize + change);
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = e.target.value;
        setBirthDate(newVal);

        if (!newVal) {
            setDateError(null);
            return;
        }

        const year = parseInt(newVal.split('-')[0]);
        const currentYear = new Date().getFullYear();

        if (year < 1900 || year > currentYear) {
            setDateError("Fecha inválida, coloca una fecha correcta");
        } else {
            setDateError(null);
        }
    };

    const maxDate = new Date().toISOString().split("T")[0];

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-[#111812] dark:text-gray-100 min-h-screen pb-24">
            <BackHeader title="Mi Perfil" onBack={() => navigate('/home')} />
            <div className="flex p-6 flex-col items-center justify-center">
                <div className="relative group cursor-pointer">
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-36 w-36 shadow-md border-4 border-white dark:border-[#1a2e1d]" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBetOaRTlGIdtbJuU2moNjzXC3N2mdGE-xwuWLak1wu4lN8YdfJQk7iSoMBJuLmV7_zNe0srOvXRrWF-mjXCSWmsGMlXOBfDpEIwZB1x8PMUeY0Kozgk7C6oVI6LpkQ5wjrP6cjtXlUdomdS7j7fPK1Ymv_3uHLqxOdXTqHkJSiQ7ua1OWBoxpIPC-xwo32P38tor_619B_lCL35uLQ3KFiqBUf5x9IopXjIQiNZx60FX8bDciaDJ1eQi_CdYAVuOhxLld23PMgA_E')"}}></div>
                    <div className="absolute bottom-0 right-0 bg-primary h-10 w-10 rounded-full flex items-center justify-center border-4 border-white dark:border-[#1a2e1d]">
                        <span className="material-symbols-outlined text-white text-sm font-bold">edit</span>
                    </div>
                </div>
                <div className="mt-4 flex flex-col items-center gap-1">
                    <h3 className="text-[#111812] dark:text-white text-2xl font-bold text-center">{name}</h3>
                    <p className="text-[#618968] dark:text-[#8ba390] text-lg font-normal text-center">{role}</p>
                </div>
            </div>
            <section className="px-4 py-2 space-y-6">
                {/* Name Input */}
                <div className="flex flex-col gap-2">
                    <label className="text-[#111812] dark:text-[#dbe6dd] text-lg font-medium pl-1">Nombre Completo</label>
                    <div className="relative flex items-center">
                        <input 
                            className="w-full rounded-xl border border-[#dbe6dd] dark:border-[#2a3c2e] bg-white dark:bg-[#1a2e1d] h-16 px-4 pl-12 text-lg text-[#111812] dark:text-white outline-none shadow-sm focus:border-primary focus:ring-1 focus:ring-primary" 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                        />
                        <span className="material-symbols-outlined absolute left-4 text-[#618968]">person</span>
                    </div>
                </div>

                {/* Role Selector - Read Only / View Only */}
                <div className="flex flex-col gap-2">
                    <label className="text-[#111812] dark:text-[#dbe6dd] text-lg font-medium pl-1">Tipo de Rol</label>
                    <div className="relative flex items-center">
                        <input 
                            className="w-full rounded-xl border border-[#dbe6dd] dark:border-[#2a3c2e] bg-gray-50 dark:bg-[#152317] h-16 px-4 pl-12 text-lg text-gray-500 dark:text-gray-400 outline-none shadow-sm"
                            type="text"
                            value={role}
                            readOnly
                        />
                        <span className="material-symbols-outlined absolute left-4 text-gray-400">badge</span>
                        <span className="material-symbols-outlined absolute right-4 text-gray-400">lock</span>
                    </div>
                </div>

                {/* Birth Date */}
                <div className="flex flex-col gap-2">
                    <label className="text-[#111812] dark:text-[#dbe6dd] text-lg font-medium pl-1">Fecha de Nacimiento</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#618968]">
                            <span className="material-symbols-outlined">cake</span>
                        </div>
                        <input 
                            className={`w-full rounded-xl border h-16 px-4 pl-12 text-lg text-[#111812] dark:text-white outline-none shadow-sm focus:border-primary focus:ring-1 focus:ring-primary ${dateError ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-[#dbe6dd] dark:border-[#2a3c2e] bg-white dark:bg-[#1a2e1d]'}`}
                            type="date" 
                            value={birthDate}
                            min="1900-01-01"
                            max={maxDate}
                            onChange={handleDateChange}
                        />
                    </div>
                    {dateError && (
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg mt-1 animate-pulse">
                            <span className="material-symbols-outlined text-xl">warning</span>
                            <span className="text-sm font-bold">{dateError}</span>
                        </div>
                    )}
                </div>

                <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                    <h3 className="text-xl font-bold mb-4 mt-2">Preferencias</h3>
                        
                    {/* Notifications */}
                    <div className="flex items-center justify-between bg-white dark:bg-[#1a2e1d] p-4 rounded-xl border border-[#dbe6dd] dark:border-[#2a3c2e] mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                <span className="material-symbols-outlined">notifications</span>
                            </div>
                            <span className="text-lg font-medium">Notificaciones</span>
                        </div>
                        <button 
                            onClick={() => setNotifications(!notifications)}
                            className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${notifications ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
                        >
                            <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                    </div>

                    {/* Sound / Music Volume */}
                    <div className="flex flex-col gap-3 bg-white dark:bg-[#1a2e1d] p-4 rounded-xl border border-[#dbe6dd] dark:border-[#2a3c2e] mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                                <span className="material-symbols-outlined">volume_up</span>
                            </div>
                            <span className="text-lg font-medium">Sonido y Música</span>
                        </div>
                        <div className="flex items-center gap-4 px-1">
                            <button onClick={() => handleVolumeChange(-10)} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95">
                                <span className="material-symbols-outlined">remove</span>
                            </button>
                            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-primary transition-all duration-300" style={{width: `${volume}%`}}></div>
                            </div>
                            <button onClick={() => handleVolumeChange(10)} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95">
                                <span className="material-symbols-outlined">add</span>
                            </button>
                        </div>
                    </div>

                    {/* Font Size */}
                    <div className="flex flex-col gap-3 bg-white dark:bg-[#1a2e1d] p-4 rounded-xl border border-[#dbe6dd] dark:border-[#2a3c2e]">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                                <span className="material-symbols-outlined">format_size</span>
                            </div>
                            <span className="text-lg font-medium">Tamaño de Letra ({fontSize}px)</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 px-2">
                            <button onClick={() => adjustFontSize(-2)} className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95 border border-gray-200 dark:border-gray-600">
                                <span className="text-sm font-bold">A-</span>
                            </button>
                            <div className="flex-1 text-center bg-gray-50 dark:bg-gray-800/50 py-2 rounded-lg">
                                <span className="font-display text-base">Texto de Prueba</span>
                            </div>
                            <button onClick={() => adjustFontSize(2)} className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95 border border-gray-200 dark:border-gray-600">
                                <span className="text-xl font-bold">A+</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Family Only: Vincular Paciente */}
                {role === 'Familiar' && (
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 mb-6">
                         <button className="w-full flex items-center justify-between p-4 bg-primary/10 hover:bg-primary/20 rounded-xl border border-primary/20 transition-colors group">
                             <div className="flex items-center gap-3">
                                 <div className="p-2 bg-primary rounded-full text-[#052e0d] dark:text-white">
                                     <span className="material-symbols-outlined">diversity_3</span>
                                 </div>
                                 <div className="text-left">
                                     <p className="font-bold text-[#111812] dark:text-white">Vincular Paciente</p>
                                     <p className="text-xs text-gray-500 dark:text-gray-400">Conectar cuenta familiar</p>
                                 </div>
                             </div>
                             <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward_ios</span>
                         </button>
                     </div>
                )}

                {/* User Only: Vincular Cuidador */}
                {role !== 'Familiar' && (
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 mb-6">
                         <button 
                            onClick={() => navigate('/link-caregiver')}
                            className="w-full flex items-center justify-between p-4 bg-primary/10 hover:bg-primary/20 rounded-xl border border-primary/20 transition-colors group"
                        >
                             <div className="flex items-center gap-3">
                                 <div className="p-2 bg-primary rounded-full text-white">
                                     <span className="material-symbols-outlined">group_add</span>
                                 </div>
                                 <div className="text-left">
                                     <p className="font-bold text-[#111812] dark:text-white">Vincular Cuidador</p>
                                     <p className="text-xs text-gray-500 dark:text-gray-400">Compartir mi progreso</p>
                                 </div>
                             </div>
                             <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward_ios</span>
                         </button>
                     </div>
                )}

            </section>
            <div className="px-4 py-6 mt-4">
                <Link to="/help" className="w-full mb-4 flex items-center justify-center gap-3 bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-900/50 transition-colors">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">help</span>
                    <span className="text-blue-700 dark:text-blue-400 font-bold text-lg">Ayuda y Soporte</span>
                </Link>
                <button onClick={() => navigate('/')} className="w-full flex items-center justify-center gap-3 bg-[#ffecec] dark:bg-red-900/20 active:bg-red-100 p-5 rounded-xl border border-red-100 dark:border-red-900/50 transition-colors">
                    <span className="material-symbols-outlined text-red-600 dark:text-red-400">logout</span>
                    <span className="text-red-700 dark:text-red-400 font-bold text-lg">Cerrar Sesión</span>
                </button>
            </div>
            <BottomNav active="profile" />
        </div>
    );
};

export const LinkCaregiverScreen: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");

    const handleSendInvite = () => {
        if (email.trim()) {
            alert(`Invitación enviada a ${email}`);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display antialiased transition-colors duration-200">
            {/* Top Navigation Bar */}
            <header className="flex items-center justify-between px-4 py-4 bg-background-light dark:bg-background-dark sticky top-0 z-10">
                <button 
                    onClick={() => navigate(-1)}
                    aria-label="Volver" 
                    className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-900 dark:text-white"
                >
                    <span className="material-symbols-outlined text-3xl">arrow_back</span>
                </button>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Vincular Cuidador</h1>
                <div className="w-12"></div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 px-5 pb-24 overflow-y-auto no-scrollbar">
                {/* Hero Section */}
                <div className="mt-4 mb-8 text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
                        <span className="material-symbols-outlined text-[40px] text-primary">diversity_3</span>
                    </div>
                    <h2 className="text-slate-900 dark:text-white text-[28px] font-bold leading-tight mb-3">
                        Conecta con tu familiar
                    </h2>
                    <p className="text-[#4c599a] dark:text-[#94a3b8] text-lg font-normal leading-relaxed max-w-xs mx-auto">
                        Introduce el correo y el código que aparece en la aplicación de tu cuidador para compartir tus progresos.
                    </p>
                </div>

                {/* Form Section */}
                <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); navigate('/profile'); }}>
                    {/* Email Field */}
                    <div className="space-y-3">
                        <label className="block text-lg font-bold text-slate-900 dark:text-white pl-2" htmlFor="email">
                            Correo Electrónico
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-[#4c599a] dark:text-[#94a3b8]">mail</span>
                            </div>
                            <input 
                                className="block w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1e35] pl-12 pr-4 py-4 text-lg text-slate-900 dark:text-white placeholder-gray-400 focus:border-primary focus:ring-primary dark:focus:ring-primary dark:focus:border-primary transition-all shadow-sm" 
                                id="email" 
                                placeholder="ejemplo@correo.com" 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button 
                            type="button"
                            onClick={handleSendInvite}
                            className="w-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold py-3 rounded-xl border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors flex items-center justify-center gap-2 mt-2"
                        >
                             <span className="material-symbols-outlined">send</span>
                             Enviar Invitación
                        </button>
                    </div>

                    {/* Code Field */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center pl-2 pr-1">
                            <label className="block text-lg font-bold text-slate-900 dark:text-white" htmlFor="code">
                                Código de Vinculación
                            </label>
                            <button className="text-primary font-medium text-sm hover:underline" type="button">
                                ¿Dónde está mi código?
                            </button>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-[#4c599a] dark:text-[#94a3b8]">lock</span>
                            </div>
                            <input 
                                className="block w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1e35] pl-12 pr-4 py-4 text-2xl tracking-[0.25em] font-bold text-slate-900 dark:text-white placeholder-gray-300 focus:border-primary focus:ring-primary dark:focus:ring-primary dark:focus:border-primary transition-all shadow-sm uppercase" 
                                id="code" 
                                maxLength={6} 
                                placeholder="******" 
                                type="text"
                            />
                        </div>
                        <p className="text-sm text-[#4c599a] dark:text-[#94a3b8] pl-2">
                            Introduce el código de 6 caracteres.
                        </p>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4">
                        <button className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-xl py-5 rounded-full shadow-lg hover:shadow-xl transform active:scale-[0.98] transition-all flex items-center justify-center gap-3" type="submit">
                            <span>Vincular Ahora</span>
                            <span className="material-symbols-outlined">link</span>
                        </button>
                    </div>
                </form>

                {/* Help Link */}
                <div className="mt-8 text-center">
                    <button className="text-[#4c599a] dark:text-[#94a3b8] font-medium hover:text-primary dark:hover:text-primary transition-colors text-base py-2">
                        ¿Necesitas ayuda para conectar?
                    </button>
                </div>
            </main>

            {/* Bottom Navigation Bar (Custom Style for this screen) */}
            <nav className="fixed bottom-0 w-full bg-white dark:bg-[#1a1e35] border-t border-gray-200 dark:border-gray-800 pb-safe pt-2 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
                <div className="flex justify-between items-center max-w-md mx-auto h-[70px] pb-2">
                    {/* Home */}
                    <Link to="/home" className="group flex flex-col items-center justify-center w-16 gap-1 text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[28px] group-hover:-translate-y-0.5 transition-transform">home</span>
                        <span className="text-xs font-medium">Inicio</span>
                    </Link>
                    {/* Activities */}
                    <Link to="/activities" className="group flex flex-col items-center justify-center w-16 gap-1 text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[28px] group-hover:-translate-y-0.5 transition-transform">extension</span>
                        <span className="text-xs font-medium">Juegos</span>
                    </Link>
                    {/* Link (Active) */}
                    <button className="relative group flex flex-col items-center justify-center w-16 gap-1 text-primary">
                        <div className="absolute -top-12 bg-primary rounded-full p-3 shadow-lg border-4 border-background-light dark:border-background-dark">
                            <span className="material-symbols-outlined text-white text-[32px]">group_add</span>
                        </div>
                        <span className="text-xs font-bold mt-8">Vincular</span>
                    </button>
                    {/* Progress */}
                    <Link to="/progress" className="group flex flex-col items-center justify-center w-16 gap-1 text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[28px] group-hover:-translate-y-0.5 transition-transform">monitoring</span>
                        <span className="text-xs font-medium">Progreso</span>
                    </Link>
                    {/* Profile */}
                    <Link to="/profile" className="group flex flex-col items-center justify-center w-16 gap-1 text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[28px] group-hover:-translate-y-0.5 transition-transform">person</span>
                        <span className="text-xs font-medium">Perfil</span>
                    </Link>
                </div>
            </nav>
            {/* Safe area padding for bottom nav on mobile */}
            <div className="h-[20px]"></div>
        </div>
    );
};

export const HelpScreen: React.FC = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-200 min-h-screen pb-24">
            <BackHeader title="Ayuda y Soporte" />
            <main className="p-4 space-y-4">
                 <div className="bg-white dark:bg-[#1a2e1d] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-bold mb-2">Preguntas Frecuentes</h3>
                    <p className="text-gray-600 dark:text-gray-300">¿Cómo cambio el tamaño de letra?</p>
                    <p className="text-sm text-gray-500 mb-2">Ve a Perfil y usa los botones A- / A+.</p>
                 </div>
                 <div className="bg-white dark:bg-[#1a2e1d] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-bold mb-2">Contacto</h3>
                    <p className="text-gray-600 dark:text-gray-300">soporte@rstmindhealth.com</p>
                 </div>
            </main>
            <BottomNav active="profile" />
        </div>
    );
};

interface Contact {
    id: number;
    name: string;
    phone: string;
    image?: string;
}

export const SafetyScreen: React.FC = () => {
    const [contacts, setContacts] = useState<Contact[]>([
        { 
            id: 1, 
            name: "Maria", 
            phone: "123456789", 
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgi1Jmd8M0ATjIZ-jlbIA5MaKcy-vam23CzmI7MT1bRii1NgItVJZoH1cw7zf-uYqABSGoyBPJCCjQJK0RMj9q_kKTVaUmHyFpuksRo8MUi3738n5ChXpDJQVfH4LhKneLM75nwzraSLWCpP6CqTy1Eminux4vOJMTrH7HsPOFCcYeOkUeKePJjA0wFEQIEjCnctl-HMI2jKqmorcBao1QsYcZtpRKWvgF9ZMJ4HJRq8V_I3JvXo4tMa9luXNYmJVEpl8GG4VoQSQ" 
        },
        { 
            id: 2, 
            name: "Dr. Carlos", 
            phone: "987654321", 
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCI2YKNdJ2_tnRQndLI4FvsFhuXzWRbJm86KruVr1-_A_WsqeIlE1vF2s8kAMYPfJ8rJWuep-qkx8nZ6oVTqF0ooFEA_IZ9D0H7tsP8Aj7laJ98PlAc5qXtsvtIQ9zj4Pbj3ZC_s0vI8F4azqVJPLXzEDCBmO3Hsd8sr0ImgTxWLuy1KogsAw42Jm2LV9X_OaqQr6KirQWVri-cxMrIYUxNxYqDuSogP9GyvIDEJWOsJhEw4sfC-PtP6FsgrVV528rZmE-_-H4iBJI" 
        }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newName, setNewName] = useState("");
    const [newPhone, setNewPhone] = useState("");

    const handleAddContact = (e: React.FormEvent) => {
        e.preventDefault();
        if (newName.trim() && newPhone.trim()) {
            const newContact: Contact = {
                id: Date.now(),
                name: newName,
                phone: newPhone
            };
            setContacts([...contacts, newContact]);
            setNewName("");
            setNewPhone("");
            setIsModalOpen(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-200 min-h-screen pb-24 flex flex-col relative">
            <BackHeader title="Seguridad" />
            
            <div className="px-6 py-2 bg-background-light dark:bg-background-dark">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium text-center">
                    Conectado con: Maria (Hija)
                </p>
            </div>

            <main className="flex-1 flex flex-col items-center w-full mt-4 px-4">
                {/* SOS Section */}
                <div className="w-full flex flex-col items-center justify-center py-6">
                    <div className="relative flex items-center justify-center">
                        <div className="absolute w-64 h-64 rounded-full bg-[#ff3b30]/10 animate-pulse dark:bg-[#ff3b30]/20"></div>
                        <div className="absolute w-52 h-52 rounded-full bg-[#ff3b30]/20 dark:bg-[#ff3b30]/30"></div>
                        <button className="relative flex flex-col items-center justify-center w-44 h-44 rounded-full bg-[#ff3b30] shadow-[0_0_30px_rgba(255,59,48,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 z-10 group border-4 border-white dark:border-[#1a2e1d]">
                            <span className="material-symbols-outlined text-white text-[56px] mb-1 group-hover:animate-bounce">sos</span>
                            <span className="text-white text-lg font-bold tracking-widest">AYUDA</span>
                        </button>
                    </div>
                    <div className="mt-8 text-center px-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">¿Necesitas asistencia urgente?</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                            Presiona el botón rojo para enviar una alerta inmediata a tu cuidador y servicios de emergencia.
                        </p>
                    </div>
                </div>

                <div className="w-full h-px bg-gray-200 dark:bg-white/10 my-4"></div>

                {/* Trusted Contacts */}
                <div className="w-full mt-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white px-2 mb-3">Contactos de Confianza</h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar px-2 -mx-2">
                        {/* Dynamic Contacts */}
                        {contacts.map((contact) => (
                            <div key={contact.id} className="flex flex-col items-center gap-2 min-w-[72px] cursor-pointer group">
                                <div className="w-[72px] h-[72px] rounded-full p-1 border-2 border-transparent bg-white dark:bg-[#1a2e1d] overflow-hidden">
                                    {contact.image ? (
                                        <img 
                                            alt={contact.name} 
                                            className="w-full h-full rounded-full object-cover" 
                                            src={contact.image}
                                        />
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-2xl">
                                            {contact.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <span className="text-xs font-semibold text-slate-900 dark:text-white truncate w-20 text-center">{contact.name}</span>
                            </div>
                        ))}

                        {/* Add Button */}
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="flex flex-col items-center gap-2 min-w-[72px] group"
                        >
                            <div className="w-[72px] h-[72px] rounded-full bg-gray-100 dark:bg-white/5 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:border-primary transition-colors">
                                <span className="material-symbols-outlined text-3xl">add</span>
                            </div>
                            <span className="text-xs font-medium text-gray-400 group-hover:text-primary">Añadir</span>
                        </button>
                    </div>
                </div>
            </main>
            
            {/* Add Contact Modal */}
            {isModalOpen && (
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
                                    placeholder="Ej. Juan Pérez"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono</label>
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
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={!newName.trim() || !newPhone.trim()}
                                    className="flex-1 py-3 font-bold text-white bg-primary rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <BottomNav active="profile" /> 
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

export const SupportScreen: React.FC = () => {
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
        // 1. Start with hardcoded demo contacts matches HTML provided
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

        // 2. Check for Linked Caregiver (Simulated Logic)
        const isLinked = true; 
        
        if (isLinked) {
            const linkedContact: SupportContact = {
                id: 2,
                name: 'Luis',
                role: 'Cuidador Vinculado',
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1utRIzC0ScWslZ8dwRLYapPiMqbDzuB-l4UTwJEDnSHCxhurjIprCtT7iWBF6HqNz1HcPmiliVEioVtAX8NYh5kknk_TPsMaRSawx8lrCoH0rY6uzmR2BGOK-riSiRdcoI4hhLjL7doeerOcnPtqJINSGqlNrUdAe35e658fKiFXQJvXT52knY97FnKC9wVxVcaiZOokFoMxJiWyMx2VcfHtGf342zDr9_M89BirDk3-Fbfa05-Us-yXiVOupV1FFLWb1OBMN8EY',
                isLinked: true
            };
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
                image: ''
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
            <BackHeader title="Soporte Emocional" />
            
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
                                {/* Delete Button (for demo purposes) */}
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
                                        {contact.role}
                                    </p>
                                    <p className="text-sm font-normal text-gray-500">({contact.name})</p>
                                    
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

            <BottomNav active="home" />
        </div>
    );
};

export const DailyScreen: React.FC = () => {
    const role = localStorage.getItem('userRole');

    // --- Family View Logic (kept as previously requested) ---
    const [familyTasks, setFamilyTasks] = useState([
        { id: 1, text: "Tomar medicina de la mañana", time: "8:00 AM", completed: false },
        { id: 2, text: "Completar ejercicio de memoria", time: "10:30 AM", completed: true },
        { id: 3, text: "Cita médica control presión", time: "4:00 PM", completed: false },
    ]);
    const [familyHistory, setFamilyHistory] = useState([
        { id: 101, text: "Caminata suave 20 min", time: "9:00 AM", completed: true },
        { id: 102, text: "Beber 2L de agua", time: "Todo el día", completed: true },
        { id: 103, text: "Juego de cartas (Atención)", time: "6:00 PM", completed: true },
    ]);
    const [isAddingFamily, setIsAddingFamily] = useState(false);
    const [newFamilyTaskText, setNewFamilyTaskText] = useState("");
    const [newFamilyTaskTime, setNewFamilyTaskTime] = useState("");

    const handleAddFamilyTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFamilyTaskText.trim()) return;
        const newTask = {
            id: Date.now(),
            text: newFamilyTaskText,
            time: newFamilyTaskTime || "Sin hora",
            completed: false
        };
        setFamilyTasks([...familyTasks, newTask]);
        setNewFamilyTaskText("");
        setNewFamilyTaskTime("");
        setIsAddingFamily(false);
    };

    const toggleFamilyTask = (id: number) => {
        setFamilyTasks(familyTasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    // --- User View Logic (New & Interactive) ---
    const [todayTasks, setTodayTasks] = useState<Task[]>([
        { id: 1, text: "Tomar medicación (Mañana)", completed: true },
        { id: 2, text: "Caminata de 15 min", completed: false },
        { id: 3, text: "Beber agua (4 vasos)", completed: false },
    ]);

    const [tomorrowTasks, setTomorrowTasks] = useState<Task[]>([
        { id: 4, text: "Cita médica - Dr. Perez", completed: false },
        { id: 5, text: "Llamar a mi hija", completed: false },
    ]);

    const [isAddingType, setIsAddingType] = useState<'today' | 'tomorrow' | null>(null);
    const [newTaskText, setNewTaskText] = useState("");

    const toggleTodayTask = (id: number) => {
        setTodayTasks(todayTasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const toggleTomorrowTask = (id: number) => {
        setTomorrowTasks(tomorrowTasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskText.trim()) return;

        const newTask: Task = {
            id: Date.now(),
            text: newTaskText,
            completed: false
        };

        if (isAddingType === 'today') {
            setTodayTasks([...todayTasks, newTask]);
        } else if (isAddingType === 'tomorrow') {
            setTomorrowTasks([...tomorrowTasks, newTask]);
        }
        
        setNewTaskText("");
        setIsAddingType(null);
    };


    // Family View Render
    if (role === 'Familiar') {
         return (
             <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-24 bg-background-light dark:bg-background-dark font-display text-[#111812] dark:text-white">
                 <BackHeader title="Mi Día a Día" />
                 
                 {/* Header Date */}
                 <div className="px-6 py-4 flex flex-col items-center justify-center border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark/50">
                    <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Hoy es</p>
                    <p className="text-[#111812] dark:text-white text-3xl font-bold mt-1">Miércoles, 14 Oct</p>
                </div>

                {/* Today's Tasks */}
                <section className="mt-4">
                    <div className="flex items-center justify-between px-6 pb-4">
                        <h2 className="text-[#111812] dark:text-white tracking-light text-[24px] font-bold leading-tight">Tareas de Hoy</h2>
                        <button 
                            onClick={() => setIsAddingFamily(!isAddingFamily)}
                            className="flex items-center gap-1 text-[#0ea826] dark:text-[#13ec37] font-bold text-sm bg-[#13ec37]/10 px-3 py-1.5 rounded-full hover:bg-[#13ec37]/20 transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg">{isAddingFamily ? 'close' : 'add'}</span>
                            {isAddingFamily ? 'Cancelar' : 'Nueva'}
                        </button>
                    </div>

                    {/* Add Task Form (Family) */}
                    {isAddingFamily && (
                        <form onSubmit={handleAddFamilyTask} className="mx-4 mb-6 p-4 bg-white dark:bg-surface-dark rounded-xl shadow-md border-2 border-[#13ec37]/30 animate-in fade-in slide-in-from-top-4 duration-200">
                            <h3 className="font-bold text-lg mb-3">Nueva Tarea</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Actividad</label>
                                    <input 
                                        type="text" 
                                        value={newFamilyTaskText}
                                        onChange={(e) => setNewFamilyTaskText(e.target.value)}
                                        placeholder="Ej. Tomar vitaminas"
                                        className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 focus:ring-[#13ec37] focus:border-[#13ec37]"
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Hora (Opcional)</label>
                                    <input 
                                        type="text" 
                                        value={newFamilyTaskTime}
                                        onChange={(e) => setNewFamilyTaskTime(e.target.value)}
                                        placeholder="Ej. 2:00 PM"
                                        className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 focus:ring-[#13ec37] focus:border-[#13ec37]"
                                    />
                                </div>
                                <button type="submit" className="w-full bg-[#13ec37] hover:bg-[#0ea826] text-[#052e0d] font-bold py-3 rounded-lg mt-2 transition-colors">
                                    Guardar Tarea
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="px-4 flex flex-col gap-3">
                        {familyTasks.map((task) => (
                            <label key={task.id} className="group flex items-center gap-x-4 p-4 rounded-xl bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-gray-800 active:scale-[0.99] transition-all cursor-pointer relative">
                                <div className="relative flex items-center">
                                    <input 
                                        type="checkbox" 
                                        checked={task.completed} 
                                        onChange={() => toggleFamilyTask(task.id)}
                                        className="peer h-8 w-8 rounded-lg border-2 border-gray-300 dark:border-gray-600 checked:bg-[#13ec37] checked:border-[#13ec37] transition-all focus:ring-4 focus:ring-[#13ec37]/20 focus:ring-offset-0 focus:outline-none"
                                    />
                                    <span className="material-symbols-outlined absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none text-xl font-bold">check</span>
                                </div>
                                <div className="flex flex-col flex-1">
                                    <p className={`text-lg font-medium leading-normal transition-colors ${task.completed ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-[#111812] dark:text-white group-hover:text-[#0ea826] dark:group-hover:text-[#13ec37]'}`}>
                                        {task.text}
                                    </p>
                                    <span className={`text-sm ${task.completed ? 'text-gray-300 line-through' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {task.time}
                                    </span>
                                </div>
                            </label>
                        ))}
                        {familyTasks.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">event_available</span>
                                <p>No hay tareas para hoy.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* History Section (Family) */}
                <section className="mt-8 mb-6">
                    <div className="flex items-center px-6 pb-4">
                        <h3 className="text-gray-500 dark:text-gray-400 text-lg font-bold uppercase tracking-wider">Ayer - Completado</h3>
                    </div>
                    <div className="px-4 flex flex-col gap-3">
                         {familyHistory.map((task) => (
                            <div key={task.id} className="flex items-center gap-x-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent opacity-80">
                                <div className="relative flex items-center justify-center h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-700">
                                    <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-xl font-bold">check</span>
                                </div>
                                <div className="flex flex-col flex-1">
                                    <p className="text-gray-600 dark:text-gray-300 text-lg font-medium leading-normal line-through">
                                        {task.text}
                                    </p>
                                    <span className="text-sm text-gray-400">
                                        {task.time}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <BottomNav active="home" /> 
             </div>
         );
    }

    // User View (Interactive)
    return (
         <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-200 min-h-screen pb-24">
            <BackHeader title="Mi Día a Día" />
            <main className="p-4 space-y-8">
                {/* Today Section */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Tareas de Hoy</h2>
                    </div>
                    <div className="space-y-3">
                        {todayTasks.map(task => (
                            <div 
                                key={task.id}
                                onClick={() => toggleTodayTask(task.id)}
                                className={`flex items-center gap-3 bg-white dark:bg-[#1a2e1d] p-4 rounded-xl shadow-sm border cursor-pointer transition-all active:scale-[0.98] ${task.completed ? 'border-green-200 dark:border-green-900/30' : 'border-gray-100 dark:border-gray-800'}`}
                            >
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-600'}`}>
                                    {task.completed && <span className="material-symbols-outlined text-white font-bold text-lg">check</span>}
                                </div>
                                <span className={`flex-1 text-lg font-medium transition-colors ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-slate-900 dark:text-white'}`}>
                                    {task.text}
                                </span>
                            </div>
                        ))}
                        {todayTasks.length === 0 && (
                             <p className="text-gray-500 italic text-center py-4">No tienes tareas para hoy.</p>
                        )}
                        <button 
                            onClick={() => setIsAddingType('today')}
                            className="w-full py-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">add</span>
                            Agregar tarea para hoy
                        </button>
                    </div>
                </section>

                {/* Tomorrow Section */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-600 dark:text-gray-300">Mañana</h2>
                    </div>
                    <div className="space-y-3">
                         {tomorrowTasks.map(task => (
                            <div 
                                key={task.id}
                                onClick={() => toggleTomorrowTask(task.id)}
                                className={`flex items-center gap-3 bg-white/60 dark:bg-[#1a2e1d]/60 p-4 rounded-xl shadow-sm border cursor-pointer transition-all active:scale-[0.98] ${task.completed ? 'border-green-200 dark:border-green-900/30' : 'border-gray-100 dark:border-gray-800'}`}
                            >
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-600'}`}>
                                    {task.completed && <span className="material-symbols-outlined text-white font-bold text-lg">check</span>}
                                </div>
                                <span className={`flex-1 text-lg font-medium transition-colors ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-slate-800 dark:text-gray-200'}`}>
                                    {task.text}
                                </span>
                            </div>
                        ))}
                        {tomorrowTasks.length === 0 && (
                             <p className="text-gray-500 italic text-center py-4">No hay tareas programadas para mañana.</p>
                        )}
                        <button 
                            onClick={() => setIsAddingType('tomorrow')}
                            className="w-full py-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">add</span>
                            Agregar tarea para mañana
                        </button>
                    </div>
                </section>
            </main>

            {/* Add Task Modal */}
            {isAddingType && (
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#1c1d27] rounded-t-2xl sm:rounded-2xl w-full max-w-md p-6 shadow-xl border-t sm:border border-gray-200 dark:border-gray-700 animate-in slide-in-from-bottom-10 duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                {isAddingType === 'today' ? 'Nueva tarea para Hoy' : 'Nueva tarea para Mañana'}
                            </h3>
                            <button onClick={() => setIsAddingType(null)} className="p-2 bg-gray-100 dark:bg-white/10 rounded-full">
                                <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleAddTask} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                                <input 
                                    type="text" 
                                    value={newTaskText}
                                    onChange={(e) => setNewTaskText(e.target.value)}
                                    className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary py-4 text-lg"
                                    placeholder="Ej. Llamar al médico"
                                    autoFocus
                                />
                            </div>
                            <div className="pt-2">
                                <button 
                                    type="submit" 
                                    disabled={!newTaskText.trim()}
                                    className="w-full py-4 font-bold text-lg text-white bg-primary rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/30"
                                >
                                    Guardar Tarea
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <BottomNav active="home" /> 
        </div>
    );
};

export const ProgressScreen: React.FC = () => {
    const role = localStorage.getItem('userRole');
    // Mock state for linked patient
    const [linkedPatient, setLinkedPatient] = useState(localStorage.getItem('linkedPatient'));

    const handleLinkPatient = () => {
        localStorage.setItem('linkedPatient', 'María Gómez');
        setLinkedPatient('María Gómez');
    };

    if (role === 'Familiar') {
        return (
            <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-200 min-h-screen pb-24">
                <BackHeader title="Progreso Familiar" />
                <main className="p-4 space-y-6">
                    {!linkedPatient ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 mt-10">
                            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-2">
                                <span className="material-symbols-outlined text-4xl text-gray-400">person_add</span>
                            </div>
                            <h2 className="text-xl font-bold">No hay familiar vinculado</h2>
                            <p className="text-gray-500 max-w-xs mx-auto">
                                Vincúlate con tu familiar (rol: Usuario) para ver su progreso y estadísticas en tiempo real.
                            </p>
                            <button 
                                onClick={handleLinkPatient}
                                className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/30 transition-all active:scale-95 mt-4"
                            >
                                Vincular Familiar
                            </button>
                        </div>
                    ) : (
                        <>
                             {/* Zero State Stats */}
                             <div className="bg-white dark:bg-[#1a2e1d] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
                                <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600 mb-2">emoji_events</span>
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Nivel 0</h2>
                                <p className="text-gray-500">Sin actividad reciente</p>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mt-4 overflow-hidden">
                                    <div className="bg-gray-400 h-full w-[0%]"></div>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">0% para el siguiente nivel</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-center">
                                    <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300">0</h3>
                                    <p className="text-sm text-blue-600 dark:text-blue-400">Días seguidos</p>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl text-center">
                                    <h3 className="text-2xl font-bold text-green-700 dark:text-green-300">0</h3>
                                    <p className="text-sm text-green-600 dark:text-green-400">Ejercicios</p>
                                </div>
                            </div>
                            
                            {/* Empty Chart Visual */}
                            <div className="bg-white dark:bg-[#1a2e1d] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <h3 className="font-bold mb-4">Actividad Semanal</h3>
                                <div className="relative h-32 w-full flex items-end justify-between px-2 gap-2">
                                     {[...Array(7)].map((_, i) => (
                                         <div key={i} className="w-full bg-gray-100 dark:bg-gray-800 rounded-t-sm h-full relative group">
                                             <div className="absolute bottom-0 w-full bg-primary/20 h-0 transition-all duration-500"></div>
                                             <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-400">
                                                 {['L','M','X','J','V','S','D'][i]}
                                             </span>
                                         </div>
                                     ))}
                                </div>
                                <div className="h-4"></div>
                            </div>

                            {/* Medallas Ganadas (Linked Family View) */}
                            <div className="bg-white dark:bg-[#1a2e1d] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-slate-900 dark:text-white">Medallas Ganadas</h3>
                                    <span className="text-sm font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">0 / 12</span>
                                </div>
                                <div className="grid grid-cols-4 gap-3">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="aspect-square rounded-xl bg-gray-50 dark:bg-black/20 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700">
                                            <span className="material-symbols-outlined text-3xl text-gray-300 dark:text-gray-600">stars</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-center text-xs text-gray-400 mt-4">Juega más para desbloquear insignias</p>
                            </div>
                        </>
                    )}
                </main>
                <BottomNav active="progress" />
            </div>
        );
    }

    return (
         <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-200 min-h-screen pb-24">
            <BackHeader title="Mi Progreso" />
            <main className="p-4 space-y-6">
                <div className="bg-white dark:bg-[#1a2e1d] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
                    <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600 mb-2">emoji_events</span>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Nivel 0</h2>
                    <p className="text-gray-500">Sin actividad reciente</p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mt-4 overflow-hidden">
                        <div className="bg-gray-400 h-full w-[0%]"></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">0% para el siguiente nivel</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-center">
                        <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300">0</h3>
                        <p className="text-sm text-blue-600 dark:text-blue-400">Días seguidos</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl text-center">
                        <h3 className="text-2xl font-bold text-green-700 dark:text-green-300">0</h3>
                        <p className="text-sm text-green-600 dark:text-green-400">Ejercicios</p>
                    </div>
                </div>

                {/* Empty Chart Visual for User as well */}
                <div className="bg-white dark:bg-[#1a2e1d] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="font-bold mb-4">Actividad Semanal</h3>
                    <div className="relative h-32 w-full flex items-end justify-between px-2 gap-2">
                            {[...Array(7)].map((_, i) => (
                                <div key={i} className="w-full bg-gray-100 dark:bg-gray-800 rounded-t-sm h-full relative group">
                                    <div className="absolute bottom-0 w-full bg-primary/20 h-0 transition-all duration-500"></div>
                                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-400">
                                        {['L','M','X','J','V','S','D'][i]}
                                    </span>
                                </div>
                            ))}
                    </div>
                    <div className="h-4"></div>
                </div>

                {/* Medallas Ganadas (User View) */}
                <div className="bg-white dark:bg-[#1a2e1d] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-900 dark:text-white">Medallas Ganadas</h3>
                        <span className="text-sm font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">0 / 12</span>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-square rounded-xl bg-gray-50 dark:bg-black/20 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700">
                                <span className="material-symbols-outlined text-3xl text-gray-300 dark:text-gray-600">stars</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-xs text-gray-400 mt-4">Juega más para desbloquear insignias</p>
                </div>
            </main>
            <BottomNav active="progress" /> 
        </div>
    );
};
interface Task {
    id: number;
    text: string;
    completed: boolean;
}