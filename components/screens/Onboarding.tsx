import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';

export const WelcomeScreen: React.FC = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-[#111812] dark:text-gray-100 min-h-screen flex flex-col items-center overflow-x-hidden selection:bg-primary selection:text-[#111812]">
            <header className="w-full px-6 pt-12 pb-4 flex justify-between items-start z-10">
                <div className="w-12"></div> 
                <button aria-label="Ajustes y Ayuda" className="group flex flex-col items-center justify-center p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-3xl group-hover:text-primary transition-colors">settings_accessibility</span>
                </button>
            </header>
            <main className="flex-1 w-full max-w-md flex flex-col items-center px-6 pb-8 gap-6 z-0">
                <div className="w-full flex justify-center py-4">
                    <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-white dark:bg-surface-dark shadow-soft flex items-center justify-center p-2">
                        <div className="w-full h-full rounded-full overflow-hidden relative">
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105" data-alt="Una imagen tranquila de hojas verdes suaves y naturaleza que inspira calma" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDZdNTPVyZqhztGZOyzmmWikrtrYlIEm_E39lnrMcXK-YKQ5cNX3mZW39puOoRPeYhdYBoxSKLkSjMdCzTRxfO8Opp4THgxGSd9HHA7k_j59ClGFlT2onSO0fAm51IYCUo1UphGvXQsG4NbDee5uWM7KaWB-0D-0Qh-IsXqb-cLxI3Sp3Q3cFpKNEFcsUm1NHGB2GLFeFIktovw92jUmGn_v0PMdVid-mPhGDQaEbAWB6I7_ABt6So3WBT3LguZq9kQG3uZvtlak-g')"}}>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-center flex flex-col gap-3 mt-2">
                    <h1 className="text-[#111812] dark:text-white text-4xl sm:text-[40px] font-bold tracking-tight leading-tight">
                        FullSaludAlzheimer
                    </h1>
                    <div className="space-y-2 max-w-[320px] mx-auto">
                        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                            Bienvenido
                        </h2>
                        <p className="text-xl text-gray-500 dark:text-gray-400 font-normal leading-relaxed">
                            Estamos aquí para ayudarte a ejercitar tu mente.
                        </p>
                    </div>
                </div>
                <div className="flex-grow min-h-[20px]"></div>
                <div className="w-full flex flex-col items-center gap-4 mb-4">
                    <Link to="/register" className="w-full max-w-[360px] group relative flex items-center justify-center overflow-hidden rounded-2xl h-20 bg-primary shadow-button active:shadow-none active:translate-y-[4px] transition-all duration-150 cursor-pointer text-decoration-none">
                        <span className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-colors duration-300"></span>
                        <span className="relative flex items-center gap-3 text-white text-2xl font-bold tracking-wide uppercase">
                            <span className="material-symbols-outlined text-3xl font-bold">play_arrow</span>
                            COMENZAR
                        </span>
                    </Link>
                     <Link to="/login" className="text-primary hover:text-primary-dark font-semibold text-lg py-2">
                        ¿Ya tienes cuenta? Iniciar Sesión
                    </Link>
                </div>
            </main>
            <div className="h-6 w-full"></div>
        </div>
    );
};

export const LoginScreen: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            setError(error.message);
        } else {
            navigate('/home');
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-screen flex flex-col antialiased">
            <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-transparent dark:border-[#3b3f54]/30">
                <button onClick={() => navigate('/')} aria-label="Volver" className="flex items-center justify-center size-12 rounded-full hover:bg-slate-200 dark:hover:bg-[#1c1d27] transition-colors">
                    <span className="material-symbols-outlined text-2xl">arrow_back</span>
                </button>
                <div className="text-lg font-bold">Iniciar Sesión</div>
                <div className="size-12"></div>
            </div>
            <main className="flex-1 flex flex-col w-full max-w-lg mx-auto px-6 pt-4 pb-8">
                <header className="mb-6 text-center">
                    <div className="mx-auto mb-6 size-16 rounded-2xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-3xl text-white">login</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mb-3">Bienvenido de nuevo</h1>
                    <p className="text-slate-600 dark:text-[#9da1b9] text-lg leading-relaxed max-w-xs mx-auto">
                        Ingresa tus datos para continuar.
                    </p>
                </header>
                
                {error && (
                    <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl text-center">
                        {error}
                    </div>
                )}

                <form className="flex flex-col gap-5" onSubmit={handleLogin}>
                    <div className="space-y-2">
                        <label className="block text-base font-medium ml-1" htmlFor="email">Correo Electrónico</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                <span className="material-symbols-outlined">mail</span>
                            </div>
                            <input 
                                className="w-full h-14 pl-12 pr-4 bg-white dark:bg-[#1c1d27] border-2 border-slate-200 dark:border-[#3b3f54] rounded-xl focus:border-primary focus:ring-0 text-lg placeholder-slate-400 dark:placeholder-[#9da1b9] transition-colors shadow-sm"
                                id="email" 
                                type="email" 
                                placeholder="nombre@ejemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-base font-medium ml-1" htmlFor="password">Contraseña</label>
                        <div className="relative">
                             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                <span className="material-symbols-outlined">lock</span>
                            </div>
                            <input 
                                className="w-full h-14 pl-12 pr-4 bg-white dark:bg-[#1c1d27] border-2 border-slate-200 dark:border-[#3b3f54] rounded-xl focus:border-primary focus:ring-0 text-lg placeholder-slate-400 dark:placeholder-[#9da1b9] transition-colors shadow-sm"
                                id="password" 
                                type="password" 
                                placeholder="Tu contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-6">
                        <button 
                            disabled={loading}
                            className={`w-full h-16 text-white text-xl font-bold rounded-full shadow-lg transition-all flex items-center justify-center gap-2 ${loading ? 'bg-gray-400 cursor-wait' : 'bg-primary hover:bg-primary-dark shadow-primary/30 active:scale-[0.98] cursor-pointer'}`} 
                            type="submit"
                        >
                            {loading ? (
                                <span>Cargando...</span>
                            ) : (
                                <>
                                    <span>Ingresar</span>
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
                <div className="mt-8 text-center space-y-4">
                    <p className="text-slate-600 dark:text-[#9da1b9] text-base">
                        ¿No tienes una cuenta?
                    </p>
                    <button onClick={() => navigate('/register')} className="text-primary hover:text-white dark:hover:text-white font-semibold text-lg py-2 px-6 rounded-full border border-primary/20 hover:bg-primary transition-colors">
                        Registrarse
                    </button>
                </div>
            </main>
        </div>
    );
};

// --- Avatar Options (Generic, non-human) ---
const AVATAR_OPTIONS = [
    { id: '1', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Aida', label: 'Robot Aida' },
    { id: '2', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Buddy', label: 'Robot Buddy' },
    { id: '3', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Chip', label: 'Robot Chip' },
    { id: '4', url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Circle', label: 'Abstracto' },
    { id: '5', url: 'https://api.dicebear.com/7.x/identicon/svg?seed=User', label: 'Patrón' },
];

// --- Argentina Area Codes ---
const AREA_CODES = [
    { code: '11', label: 'Buenos Aires (11)' },
    { code: '351', label: 'Córdoba (351)' },
    { code: '341', label: 'Rosario (341)' },
    { code: '261', label: 'Mendoza (261)' },
    { code: '381', label: 'Tucumán (381)' },
    { code: '221', label: 'La Plata (221)' },
    { code: '223', label: 'Mar del Plata (223)' },
    { code: '387', label: 'Salta (387)' },
    { code: '342', label: 'Santa Fe (342)' },
    { code: '299', label: 'Neuquén (299)' },
    { code: 'Otro', label: 'Otro' }
];

export const RegisterScreen: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [role, setRole] = useState('patient');
    const [birthDate, setBirthDate] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // New State
    const [areaCode, setAreaCode] = useState('11');
    const [localPhoneNumber, setLocalPhoneNumber] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0].url);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Validación
    const isNameValid = name.trim().length > 0 && name.length <= 30;
    
    let isBirthDateValid = false;
    const maxDate = new Date().toISOString().split("T")[0];
    if (birthDate) {
        const year = parseInt(birthDate.split('-')[0]);
        const currentYear = new Date().getFullYear();
        if (year >= 1900 && year <= currentYear) {
             isBirthDateValid = true;
        }
    }

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPasswordValid = password.length >= 6;
    const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0;

    // Basic Phone Validation
    const fullPhoneRaw = areaCode === 'Otro' ? localPhoneNumber : areaCode + localPhoneNumber;
    const isPhoneValid = fullPhoneRaw.replace(/\D/g, '').length >= 10;

    const isFormValid = isNameValid && isBirthDateValid && isEmailValid && isPasswordValid && doPasswordsMatch && isPhoneValid;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;
        
        setLoading(true);
        setError(null);

        // Format Phone
        let fullPhoneFormatted = '';
        if (areaCode === 'Otro') {
            fullPhoneFormatted = localPhoneNumber;
        } else {
            fullPhoneFormatted = `+54 9 ${areaCode} ${localPhoneNumber}`;
        }

        // 1. Crear usuario en Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    role,
                    birth_date: birthDate,
                    phone: fullPhoneFormatted,
                    avatar_url: selectedAvatar
                }
            }
        });

        if (authError) {
            setLoading(false);
            setError(authError.message);
            return;
        }

        if (authData.user) {
            // Explicitly create profile in DB to ensure immediate availability
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: authData.user.id,
                        name: name,
                        role: role,
                        birth_date: birthDate || null,
                        email: email,
                        avatar_url: selectedAvatar,
                        phone: fullPhoneFormatted,
                        updated_at: new Date().toISOString()
                    }
                ]);

            if (profileError) {
                console.error("Error creating profile:", profileError);
                // We don't block navigation, but we log it. 
                // The trigger might have handled it or it might be a dup if clicked twice.
            }

            // Guardar localmente también por compatibilidad
            localStorage.setItem('userName', name);
            localStorage.setItem('userRole', role);
            localStorage.setItem('userBirthDate', birthDate);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userAvatar', selectedAvatar);
            
            setLoading(false);
            navigate('/home');
        } else {
             setLoading(false);
             setError("Revisa tu correo para confirmar la cuenta (si es necesario) o intenta iniciar sesión.");
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-screen flex flex-col antialiased">
            <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-transparent dark:border-[#3b3f54]/30">
                <button onClick={() => navigate('/')} aria-label="Volver" className="flex items-center justify-center size-12 rounded-full hover:bg-slate-200 dark:hover:bg-[#1c1d27] transition-colors">
                    <span className="material-symbols-outlined text-2xl">arrow_back</span>
                </button>
                <div className="text-lg font-bold">Registro</div>
                <div className="size-12"></div>
            </div>
            <main className="flex-1 flex flex-col w-full max-w-lg mx-auto px-6 pt-4 pb-8">
                <header className="mb-6 text-center">
                    <div className="mx-auto mb-6 size-16 rounded-2xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-3xl text-white">psychology</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mb-3">Crear Cuenta</h1>
                    <p className="text-slate-600 dark:text-[#9da1b9] text-lg leading-relaxed max-w-xs mx-auto">
                        Completa tus datos para unirte a FullSaludAlzheimer.
                    </p>
                </header>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl text-center">
                        {error}
                    </div>
                )}

                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    {/* Avatar Selection */}
                    <div className="space-y-3">
                        <label className="block text-base font-medium ml-1">Elige tu Avatar</label>
                        <div className="flex justify-center mb-4">
                            <div className="size-24 rounded-full overflow-hidden border-4 border-primary shadow-lg bg-gray-50">
                                <img src={selectedAvatar} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div className="flex gap-2 justify-center flex-wrap">
                            {AVATAR_OPTIONS.map((opt) => (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => setSelectedAvatar(opt.url)}
                                    className={`size-12 rounded-xl border-2 p-1 transition-all ${
                                        selectedAvatar === opt.url 
                                            ? 'border-primary bg-primary/10 scale-110' 
                                            : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                                    }`}
                                >
                                    <img src={opt.url} alt={opt.label} className="w-full h-full" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label className="block text-base font-medium ml-1" htmlFor="name">Nombre Completo</label>
                            <span className={`text-xs font-medium mt-1 ${name.length === 30 ? 'text-red-500' : 'text-slate-400'}`}>
                                {name.length}/30
                            </span>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                <span className="material-symbols-outlined">person</span>
                            </div>
                            <input 
                                className="w-full h-14 pl-12 pr-4 bg-white dark:bg-[#1c1d27] border-2 border-slate-200 dark:border-[#3b3f54] rounded-xl focus:border-primary focus:ring-0 text-lg placeholder-slate-400 dark:placeholder-[#9da1b9] transition-colors shadow-sm" 
                                id="name" 
                                placeholder="Ej. María García" 
                                type="text"
                                maxLength={30}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                        <label className="block text-base font-medium ml-1" htmlFor="phone">Número de Teléfono</label>
                        <div className="flex h-14 rounded-xl shadow-sm">
                             <div className="relative h-full">
                                <select
                                   value={areaCode}
                                   onChange={(e) => setAreaCode(e.target.value)}
                                   className="h-full rounded-l-xl border-2 border-r-0 border-slate-200 dark:border-[#3b3f54] bg-gray-50 dark:bg-[#102213] text-gray-700 dark:text-gray-300 font-medium px-3 focus:ring-0 focus:border-primary appearance-none cursor-pointer"
                                   style={{ minWidth: '80px', textAlign: 'center' }}
                                >
                                   {AREA_CODES.map(c => (
                                       <option key={c.code} value={c.code}>{c.code}</option>
                                   ))}
                                </select>
                             </div>
                             <div className="relative flex-1">
                                <input
                                    id="phone"
                                    type="tel"
                                    required
                                    value={localPhoneNumber}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        if (val.length <= 10) setLocalPhoneNumber(val);
                                    }}
                                    className="block w-full h-full rounded-r-xl border-2 border-slate-200 dark:border-[#3b3f54] border-l-0 focus:border-primary focus:ring-0 bg-white dark:bg-[#1c1d27] pl-4 text-lg placeholder-slate-400 dark:placeholder-[#9da1b9] transition-colors"
                                    placeholder={areaCode === '11' ? '12345678' : '154123456'}
                                />
                             </div>
                        </div>
                        <p className="text-xs text-slate-500 ml-1">
                            {areaCode !== 'Otro' && `Cód. Área (${areaCode}) + Número. Ej: 11 12345678`}
                        </p>
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-2">
                        <label className="block text-base font-medium ml-1" htmlFor="role">Rol / Tipo de Usuario</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                <span className="material-symbols-outlined">badge</span>
                            </div>
                            <select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full h-14 pl-12 pr-10 bg-white dark:bg-[#1c1d27] border-2 border-slate-200 dark:border-[#3b3f54] rounded-xl focus:border-primary focus:ring-0 text-lg text-slate-900 dark:text-white transition-colors shadow-sm appearance-none"
                            >
                                <option value="patient">Paciente</option>
                                <option value="caregiver">Cuidador</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                                <span className="material-symbols-outlined">expand_more</span>
                            </div>
                        </div>
                    </div>

                    {/* Birth Date */}
                    <div className="space-y-2">
                        <label className="block text-base font-medium ml-1" htmlFor="birthDate">Fecha de Nacimiento</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                <span className="material-symbols-outlined">cake</span>
                            </div>
                            <input 
                                className={`w-full h-14 pl-12 pr-4 bg-white dark:bg-[#1c1d27] border-2 rounded-xl focus:border-primary focus:ring-0 text-lg placeholder-slate-400 dark:placeholder-[#9da1b9] transition-colors shadow-sm ${birthDate && !isBirthDateValid ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-[#3b3f54]'}`}
                                id="birthDate" 
                                type="date" 
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                min="1900-01-01"
                                max={maxDate}
                            />
                        </div>
                        {birthDate && !isBirthDateValid && (
                            <p className="text-red-500 text-sm ml-1">Fecha inválida.</p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="block text-base font-medium ml-1" htmlFor="email">Correo Electrónico</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                <span className="material-symbols-outlined">mail</span>
                            </div>
                            <input 
                                className={`w-full h-14 pl-12 pr-4 bg-white dark:bg-[#1c1d27] border-2 rounded-xl focus:border-primary focus:ring-0 text-lg placeholder-slate-400 dark:placeholder-[#9da1b9] transition-colors shadow-sm ${email && !isEmailValid ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-[#3b3f54]'}`}
                                id="email" 
                                type="email" 
                                placeholder="nombre@ejemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                         {email && !isEmailValid && (
                            <p className="text-red-500 text-sm ml-1">Formato de correo inválido.</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label className="block text-base font-medium ml-1" htmlFor="password">Contraseña</label>
                        <div className="relative">
                             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                <span className="material-symbols-outlined">lock</span>
                            </div>
                            <input 
                                className={`w-full h-14 pl-12 pr-4 bg-white dark:bg-[#1c1d27] border-2 rounded-xl focus:border-primary focus:ring-0 text-lg placeholder-slate-400 dark:placeholder-[#9da1b9] transition-colors shadow-sm ${password && !isPasswordValid ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-[#3b3f54]'}`}
                                id="password" 
                                type="password" 
                                placeholder="Mínimo 6 caracteres"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {password && !isPasswordValid && (
                            <p className="text-red-500 text-sm ml-1">La contraseña debe tener al menos 6 caracteres.</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <label className="block text-base font-medium ml-1" htmlFor="confirmPassword">Confirmar Contraseña</label>
                        <div className="relative">
                             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                <span className="material-symbols-outlined">lock_reset</span>
                            </div>
                            <input 
                                className={`w-full h-14 pl-12 pr-4 bg-white dark:bg-[#1c1d27] border-2 rounded-xl focus:border-primary focus:ring-0 text-lg placeholder-slate-400 dark:placeholder-[#9da1b9] transition-colors shadow-sm ${confirmPassword && !doPasswordsMatch ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-[#3b3f54]'}`}
                                id="confirmPassword" 
                                type="password" 
                                placeholder="Repite la contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        {confirmPassword && !doPasswordsMatch && (
                            <p className="text-red-500 text-sm ml-1">Las contraseñas no coinciden.</p>
                        )}
                    </div>

                    <div className="pt-6">
                        <button 
                            disabled={!isFormValid || loading}
                            className={`w-full h-16 text-white text-xl font-bold rounded-full shadow-lg transition-all flex items-center justify-center gap-2 ${isFormValid && !loading ? 'bg-primary hover:bg-primary-dark shadow-primary/30 active:scale-[0.98] cursor-pointer' : 'bg-gray-300 dark:bg-gray-700 shadow-none cursor-not-allowed opacity-70'}`} 
                            type="submit"
                        >
                            {loading ? (
                                <span>Cargando...</span>
                            ) : (
                                <>
                                    <span>Crear Cuenta</span>
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
                <div className="mt-8 text-center space-y-4">
                    <p className="text-slate-600 dark:text-[#9da1b9] text-base">
                        ¿Ya tienes una cuenta?
                    </p>
                    <button onClick={() => navigate('/login')} className="text-primary hover:text-white dark:hover:text-white font-semibold text-lg py-2 px-6 rounded-full border border-primary/20 hover:bg-primary transition-colors">
                        Iniciar Sesión
                    </button>
                </div>
            </main>
        </div>
    );
};