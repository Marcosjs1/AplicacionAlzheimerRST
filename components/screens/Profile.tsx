import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BackHeader, BottomNav, DesktopSidebar } from '../Layout';
import { usePreferences } from '../../contexts/PreferencesContext';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { useCaregiverLink } from '../../hooks/useCaregiverLink';
import { useTrustedContacts } from '../../hooks/useTrustedContacts';
import { isPatientRole, isCaregiverRole } from '../../utils/roleUtils';

// --- Avatar Options (Shared) ---
const AVATAR_OPTIONS = [
    { id: '1', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Aida', label: 'Robot Aida' },
    { id: '2', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Buddy', label: 'Robot Buddy' },
    { id: '3', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Chip', label: 'Robot Chip' },
    { id: '4', url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Circle', label: 'Abstracto' },
    { id: '5', url: 'https://api.dicebear.com/7.x/identicon/svg?seed=User', label: 'Patrón' },
    { id: '6', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Grandma', label: 'Abuela (Legacy)' },
];

export const ProfileScreen: React.FC = () => {
    const navigate = useNavigate();
    const { fontSize, setFontSize, volume, setVolume, playFeedbackSound } = usePreferences();
    const { profile, signOut, refreshProfile } = useAuth();
    const { isLinked } = useCaregiverLink();

    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);
    
    // Local state for form fields
    const [name, setName] = useState(profile?.name || "");
    const [role, setRole] = useState(profile?.role || "patient");
    const [birthDate, setBirthDate] = useState(profile?.birth_date?.toString() || "");
    const [notifications, setNotifications] = useState(true);
    const [dateError, setDateError] = useState<string | null>(null);

    // Avatar State
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [currentAvatarUrl, setCurrentAvatarUrl] = useState(profile?.avatar_url || AVATAR_OPTIONS[0].url);

    // Update local state when profile loads/changes
    useEffect(() => {
        if (profile) {
            setName(profile.name || "");
            setRole(profile.role || "patient");
            setBirthDate(profile.birth_date?.toString() || "");
            if (profile.avatar_url) {
                setCurrentAvatarUrl(profile.avatar_url);
            }
        }
    }, [profile]);

    const handleAvatarUpdate = async (newUrl: string) => {
        setCurrentAvatarUrl(newUrl);
        setIsAvatarModalOpen(false);

        if (profile) {
            // Upsert in DB to ensure row exists
            const updates = {
                id: profile.id,
                avatar_url: newUrl,
                name: name, // Use current state values to hydrate DB if missing
                role: role,
                birth_date: birthDate || null,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase
                .from('profiles')
                .upsert(updates);

            if (error) {
                console.error("Error updating avatar:", error);
                // Optionally revert local state or show toast
            } else {
                // Refresh global context so header/dashboard update immediately
                await refreshProfile();
            }
        }
    };
    const handleSaveChanges = async () => {
            if (!profile) return;

            if (dateError) {
                setSaveError("Corrige la fecha antes de guardar.");
                return;
            }

            if (!name.trim()) {
                setSaveError("El nombre no puede estar vacío.");
                return;
            }

            setSaving(true);
            setSaveError(null);
            setSaveSuccess(false);

            try {
                const updates = {
                    name: name.trim(),
                    birth_date: birthDate || null,
                    updated_at: new Date().toISOString(),
                };

                const { error } = await supabase
                    .from("profiles")
                    .update(updates)
                    .eq("id", profile.id);

                if (error) throw error;

                await refreshProfile();

                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 2500);
            } catch (err: any) {
                console.error("Error saving profile:", err);
                setSaveError(err.message || "Error al guardar cambios");
            } finally {
                setSaving(false);
            }
        };

    // TODO: We should probably add a save button to persist changes to DB for other fields
    // For now we just keep local state in check
    useEffect(() => {
        // Placeholder for validating date change without saving to LS
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
        <div className="bg-background-light dark:bg-background-dark font-display text-[#111812] dark:text-gray-100 min-h-screen pb-24 md:pb-6 md:pl-64 relative">
            <BackHeader title="Mi Perfil" onBack={() => navigate('/home')} />
            <div className="flex p-6 flex-col items-center justify-center">
                <div 
                    className="relative group cursor-pointer"
                    onClick={() => setIsAvatarModalOpen(true)}
                >
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-36 w-36 shadow-md border-4 border-white dark:border-[#1a2e1d] flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                        <img 
                            src={currentAvatarUrl} 
                            alt="Avatar" 
                            className="w-full h-full object-cover rounded-full"
                            onError={(e) => {
                                // Fallback if image fails
                                e.currentTarget.src = AVATAR_OPTIONS[0].url;
                            }}
                        />
                    </div>
                    <div className="absolute bottom-0 right-0 bg-primary h-10 w-10 rounded-full flex items-center justify-center border-4 border-white dark:border-[#1a2e1d] transform transition-transform group-hover:scale-110">
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
                    <label className="text-[#111812] dark:text-[#dbe6dd] text-lg font-medium pl-1">
                        Fecha de Nacimiento
                    </label>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#618968]">
                            <span className="material-symbols-outlined">cake</span>
                        </div>

                        <input
                            className={`w-full rounded-xl border h-16 px-4 pl-12 text-lg text-[#111812] dark:text-white outline-none shadow-sm focus:border-primary focus:ring-1 focus:ring-primary ${
                                dateError
                                    ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                                    : "border-[#dbe6dd] dark:border-[#2a3c2e] bg-white dark:bg-[#1a2e1d]"
                            }`}
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

                {/* Mensajes */}
                {saveError && (
                    <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-xl text-center font-bold">
                        {saveError}
                    </div>
                )}

                {saveSuccess && (
                    <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-3 rounded-xl text-center font-bold">
                        ✅ Cambios guardados
                    </div>
                )}

                {/* ✅ BOTÓN GUARDAR CAMBIOS (ACÁ MISMO) */}
                <button
                    onClick={handleSaveChanges}
                    disabled={saving || !!dateError}
                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all active:scale-[0.98]
                        ${
                            saving || dateError
                                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                                : "bg-primary text-white hover:bg-primary-dark shadow-primary/30"
                        }`}
                >
                    {saving ? "Guardando..." : "Guardar cambios"}
                </button>

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

                {/* Family Only: Ver mi Paciente */}
                {isCaregiverRole(role) && (
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 mb-6">
                         <button 
                            onClick={() => navigate('/progress')}
                            className="w-full flex items-center justify-between p-4 bg-primary/10 hover:bg-primary/20 rounded-xl border border-primary/20 transition-colors group"
                        >
                             <div className="flex items-center gap-3">
                                 <div className="p-2 bg-primary rounded-full text-[#052e0d] dark:text-white">
                                     <span className="material-symbols-outlined">diversity_3</span>
                                 </div>
                                 <div className="text-left">
                                     <p className="font-bold text-[#111812] dark:text-white">Ver mi Paciente</p>
                                     <p className="text-xs text-gray-500 dark:text-gray-400">Ver progreso del paciente</p>
                                 </div>
                             </div>
                             <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward_ios</span>
                         </button>
                     </div>
                )}

                {isPatientRole(role) && !isLinked && (
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
            
            {/* Avatar Selection Modal */}
            {isAvatarModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#1c1d27] rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-200">
                        <h3 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-white">Elige tu Avatar</h3>
                        
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            {AVATAR_OPTIONS.map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => handleAvatarUpdate(opt.url)}
                                    className={`relative aspect-square rounded-2xl p-2 transition-all duration-200 group ${
                                        currentAvatarUrl === opt.url 
                                            ? 'bg-primary/10 border-2 border-primary scale-105 shadow-lg' 
                                            : 'border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5'
                                    }`}
                                >
                                    <img src={opt.url} alt={opt.label} className="w-full h-full object-contain" />
                                    {currentAvatarUrl === opt.url && (
                                        <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-1 shadow-md">
                                            <span className="material-symbols-outlined text-sm font-bold">check</span>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        <button 
                            onClick={() => setIsAvatarModalOpen(false)}
                            className="w-full py-4 font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors active:scale-[0.98]"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

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
            <BottomNav />
        </div>
    );
};



export const HelpScreen: React.FC = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-200 min-h-screen pb-24 md:pb-6 md:pl-64">
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
            <BottomNav />
        </div>
    );
};



export const SafetyScreen: React.FC = () => {
    const { profile } = useAuth();
    const { isLinked, caregiverName } = useCaregiverLink();
    const { 
        contacts, 
        loading, 
        addContact, 
        deleteContact, 
        sendSOS,
        isReadOnly 
    } = useTrustedContacts();
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPhone, setNewPhone] = useState("");
    
    // SOS States
    const [isSendingSOS, setIsSendingSOS] = useState(false);
    const [sosMessage, setSosMessage] = useState<string | null>(null);

    const handleAddContact = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newName.trim() && newEmail.trim()) {
            try {
                await addContact(newName, newEmail, newPhone);
                setNewName("");
                setNewEmail("");
                setNewPhone("");
                setIsModalOpen(false);
            } catch (err: any) {
                alert(err.message);
            }
        }
    };

    const handleSOS = async () => {
        if (isReadOnly) return; // Prevent caregivers from triggering SOS from patient's perspective if viewing
        
        // Basic check for targets
        if (!isLinked && contacts.length === 0) {
            setSosMessage("⚠️ No hay destinatarios configurados para SOS. Agrega contactos o vincula un cuidador.");
            setTimeout(() => setSosMessage(null), 5000);
            return;
        }

        setIsSendingSOS(true);
        setSosMessage("Enviando alerta SOS...");

        try {
            await sendSOS(); // Use defaults for message/location for now
            setSosMessage("✅ SOS enviado correctamente.");
            setTimeout(() => setSosMessage(null), 4000);
        } catch (err: any) {
            setSosMessage(`❌ No se pudo enviar el SOS: ${err.message}`);
            setTimeout(() => setSosMessage(null), 5000);
        } finally {
            setIsSendingSOS(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-200 min-h-screen pb-24 flex flex-col relative md:pb-6 md:pl-64">
            <BackHeader title="Seguridad" onBack={() => navigate('/home')} />
            
            <div className="px-6 py-2 bg-background-light dark:bg-background-dark">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium text-center">
                    {isLinked ? `Conectado con: ${caregiverName || 'Cuidador'}` : "Sin cuidador vinculado"}
                </p>
            </div>

            <main className="flex-1 flex flex-col items-center w-full mt-4 px-4">
                {/* SOS Section */}
                <div className="w-full flex flex-col items-center justify-center py-6">
                    <div className="relative flex items-center justify-center">
                        <div className={`absolute w-64 h-64 rounded-full bg-[#ff3b30]/10 ${isSendingSOS ? 'animate-ping' : 'animate-pulse'} dark:bg-[#ff3b30]/20`}></div>
                        <div className="absolute w-52 h-52 rounded-full bg-[#ff3b30]/20 dark:bg-[#ff3b30]/30"></div>
                        <button 
                            onClick={handleSOS}
                            disabled={isSendingSOS || isReadOnly}
                            className={`relative flex flex-col items-center justify-center w-44 h-44 rounded-full bg-[#ff3b30] shadow-[0_0_30px_rgba(255,59,48,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 z-10 group border-4 border-white dark:border-[#1a2e1d] ${isSendingSOS ? 'opacity-90' : ''} disabled:cursor-not-allowed`}
                        >
                            <span className={`material-symbols-outlined text-white text-[56px] mb-1 ${isSendingSOS ? 'animate-bounce' : 'group-hover:animate-bounce'}`}>
                                {isSendingSOS ? 'sync' : 'sos'}
                            </span>
                            <span className="text-white text-lg font-bold tracking-widest uppercase">
                                {isSendingSOS ? 'Enviando' : 'AYUDA'}
                            </span>
                        </button>
                    </div>

                    {sosMessage && (
                        <div className={`mt-6 px-6 py-3 rounded-2xl text-center font-bold text-sm shadow-md animate-in fade-in slide-in-from-top-2 duration-300 ${
                            sosMessage.startsWith('✅') ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 
                            sosMessage.startsWith('⚠️') ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                            {sosMessage}
                        </div>
                    )}

                    <div className="mt-8 text-center px-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">¿Necesitas asistencia urgente?</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                            Presiona el botón rojo para enviar una alerta inmediata a tu cuidador y contactos de confianza.
                        </p>
                    </div>
                </div>

                <div className="w-full h-px bg-gray-200 dark:bg-white/10 my-4"></div>

                {/* Trusted Contacts */}
                <div className="w-full mt-4">
                    <div className="flex items-center justify-between px-2 mb-3">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Contactos de Confianza</h3>
                        <p className="text-xs text-slate-400 font-medium">{contacts.length}/5</p>
                    </div>
                    
                    <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar px-2 -mx-2">
                        {/* Real Contacts */}
                        {loading ? (
                             [1, 2].map(i => (
                                <div key={i} className="flex flex-col items-center gap-2 min-w-[72px] animate-pulse">
                                    <div className="w-[72px] h-[72px] rounded-full bg-gray-200 dark:bg-gray-800"></div>
                                    <div className="w-12 h-2 bg-gray-200 dark:bg-gray-800 rounded"></div>
                                </div>
                             ))
                        ) : contacts.map((contact) => (
                            <div key={contact.id} className="flex flex-col items-center gap-2 min-w-[72px] relative group">
                                {!isReadOnly && (
                                    <button 
                                        onClick={() => deleteContact(contact.id)}
                                        className="absolute -top-1 -right-1 z-10 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform"
                                    >
                                        <span className="material-symbols-outlined text-[16px] font-bold">close</span>
                                    </button>
                                )}
                                <div className="w-[72px] h-[72px] rounded-full p-1 border-2 border-transparent bg-white dark:bg-[#1a2e1d] overflow-hidden shadow-sm">
                                    <div className="w-full h-full rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-2xl">
                                        {contact.name.charAt(0)}
                                    </div>
                                </div>
                                <span className="text-xs font-semibold text-slate-900 dark:text-white truncate w-20 text-center">{contact.name}</span>
                            </div>
                        ))}

                        {/* Add Button */}
                        {!isReadOnly && contacts.length < 5 && (
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="flex flex-col items-center gap-2 min-w-[72px] group"
                            >
                                <div className="w-[72px] h-[72px] rounded-full bg-gray-100 dark:bg-white/5 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:border-primary transition-colors">
                                    <span className="material-symbols-outlined text-3xl">add</span>
                                </div>
                                <span className="text-xs font-medium text-gray-400 group-hover:text-primary">Añadir</span>
                            </button>
                        )}
                    </div>
                </div>
            </main>
            
            {/* Add Contact Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#1c1d27] rounded-2xl w-full max-w-sm p-6 shadow-xl border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Nuevo Contacto</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleAddContact} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Nombre</label>
                                <input 
                                    type="text" 
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary py-3 px-4"
                                    placeholder="Ej. Juan Pérez"
                                    autoFocus
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Email (Para alertas)</label>
                                <input 
                                    type="email" 
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary py-3 px-4"
                                    placeholder="ejemplo@correo.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">Teléfono (Opcional)</label>
                                <input 
                                    type="tel" 
                                    value={newPhone}
                                    onChange={(e) => setNewPhone(e.target.value)}
                                    className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary py-3 px-4"
                                    placeholder="Ej. +54 9 11..."
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={!newName.trim() || !newEmail.trim()}
                                    className="flex-1 py-3 font-bold text-white bg-primary rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
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

interface SupportContact {
    id: number | string;
    name: string;
    role: string;
    image?: string;
    isLinked?: boolean;
}

export const SupportScreen: React.FC = () => {
    const navigate = useNavigate();
    const { user, profile } = useAuth();
    const userName = profile?.name || user?.user_metadata?.name || 'Usuario';
    
    // State for contacts
    const [contacts, setContacts] = useState<SupportContact[]>([]);
    
    // Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newName, setNewName] = useState('');
    const [newRole, setNewRole] = useState('');
    const [newPhone, setNewPhone] = useState('');

    const fetchContacts = async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from('contacts')
            .select('*')
            .eq('user_id', user.id);
        
        if (error) {
            console.error('Error fetching contacts:', error);
        } else if (data) {
             // Map DB fields to UI fields if necessary, or just use them
             // SQL: id, name, phone, relation (mapped to role)
             const mapped = data.map((c: any) => ({
                 id: c.id,
                 name: c.name,
                 role: c.relation || 'Familiar',
                 image: '', // No image support in DB yet
                 phone: c.phone
             }));
             setContacts(mapped);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, [user]);

    const handleCall = (name: string) => {
        alert(`Iniciando videollamada con ${name}...`);
    };

    const handleDelete = async (id: number) => {
        // En UI usamos number timestamp para local, pero DB usa UUID string. 
        // Vamos a asumir que si viene de DB es string UUID, pero TS espera number en la interfaz actual.
        // Quick fix: change interface id to string | number and clean up.
        // For now, let's treat id as any to avoid complex TS refactor in this step.
        const contactId = id as any;
        
        const { error } = await supabase.from('contacts').delete().eq('id', contactId);
        if (error) {
            console.error("Error removing contact", error);
        } else {
             setContacts(prev => prev.filter(c => c.id !== id));
        }
    };

    const handleAddContact = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newName && newRole && user) {
            const { data, error } = await supabase.from('contacts').insert([
                {
                    user_id: user.id,
                    name: newName,
                    relation: newRole,
                    phone: newPhone
                }
            ]).select();

            if (error) {
                console.error("Error adding contact", error);
            } else if (data) {
                 const newContact: SupportContact = {
                    id: data[0].id,
                    name: data[0].name,
                    role: data[0].relation,
                    image: ''
                };
                setContacts(prev => [...prev, newContact]);
                setIsAddModalOpen(false);
                setNewName('');
                setNewRole('');
                setNewPhone('');
            }
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-[#111812] dark:text-gray-100 min-h-screen pb-24 transition-colors duration-200 md:pb-6 md:pl-64">
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

            <BottomNav />
        </div>
    );
};

export const DailyScreen: React.FC = () => {
    const { user, profile } = useAuth();
    const role = profile?.role;
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isAddingFamily, setIsAddingFamily] = useState(false);
    const [newFamilyTaskText, setNewFamilyTaskText] = useState("");
    
    const [isAddingType, setIsAddingType] = useState<'today' | 'tomorrow' | null>(null);
    const [newTaskText, setNewTaskText] = useState("");
    const [newTaskTime, setNewTaskTime] = useState("");

    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrowStr = tomorrowDate.toISOString().split('T')[0];

    const fetchTasks = async () => {
        if (!user) return;
        setIsLoading(true);
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching tasks:', error);
        } else {
            setTasks(data || []);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchTasks();
    }, [user]);

    const handleAddTask = async (e: React.FormEvent, date: string) => {
        e.preventDefault();
        const text = isAddingFamily ? newFamilyTaskText : newTaskText;
        const time = isAddingFamily ? "" : (newTaskTime || 'Cualquier hora'); // Special handling if needed
        if (!text.trim() || !user) return;

        const { data, error } = await supabase
            .from('tasks')
            .insert([{
                user_id: user.id,
                title: text,
                scheduled_date: date,
                scheduled_time: time || 'Cualquier hora',
                completed: false
            }])
            .select();

        if (error) {
            console.error('Error adding task:', error);
        } else if (data) {
            setTasks([...tasks, data[0]]);
            setNewTaskText("");
            setNewTaskTime("");
            setNewFamilyTaskText("");
            setIsAddingType(null);
            setIsAddingFamily(false);
        }
    };

    const toggleTask = async (id: string, currentCompleted: boolean) => {
        const { error } = await supabase
            .from('tasks')
            .update({ 
                completed: !currentCompleted,
                completed_at: !currentCompleted ? new Date().toISOString() : null
            })
            .eq('id', id);

        if (error) {
            console.error('Error toggling task:', error);
        } else {
            setTasks(tasks.map(t => t.id === id ? { ...t, completed: !currentCompleted } : t));
        }
    };

    // Filter tasks for UI
    const todayTasks = tasks.filter(t => t.scheduled_date === todayStr && !t.completed);
    const tomorrowTasks = tasks.filter(t => t.scheduled_date === tomorrowStr);
    const completedToday = tasks.filter(t => t.scheduled_date === todayStr && t.completed);
    const completedYesterday = tasks.filter(t => t.scheduled_date === yesterdayStr && t.completed);

    // Family View Render
    if (isCaregiverRole(role)) {
         return (
             <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-32 bg-background-light dark:bg-background-dark font-display text-[#111812] dark:text-white">
                 <BackHeader title="Mi Día a Día" />
                 
                 {/* Header Date */}
                 <div className="px-6 py-4 flex flex-col items-center justify-center border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark/50">
                    <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Hoy es</p>
                    <p className="text-[#111812] dark:text-white text-3xl font-bold mt-1">
                        {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}
                    </p>
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
                        <form onSubmit={(e) => handleAddTask(e, todayStr)} className="mx-4 mb-6 p-4 bg-white dark:bg-surface-dark rounded-xl shadow-md border-2 border-[#13ec37]/30 animate-in fade-in slide-in-from-top-4 duration-200 max-h-[70vh] overflow-y-auto">
                            <h3 className="font-bold text-lg mb-3">Nueva Tarea</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Actividad</label>
                                    <input 
                                        type="text" 
                                        value={newFamilyTaskText}
                                        onChange={(e) => setNewFamilyTaskText(e.target.value)}
                                        placeholder="Ej. Tomar vitaminas"
                                        className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 focus:ring-[#13ec37] focus:border-[#13ec37] px-4 py-3"
                                        autoFocus
                                    />
                                </div>
                                <button type="submit" className="w-full bg-[#13ec37] hover:bg-[#0ea826] text-[#052e0d] font-bold py-3 rounded-lg mt-2 transition-colors">
                                    Guardar Tarea
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="px-4 flex flex-col gap-3">
                        {isLoading ? (
                            <p className="text-center py-4 text-gray-400">Cargando...</p>
                        ) : [...todayTasks, ...completedToday].map((task) => (
                            <div key={task.id} className="group flex items-start gap-x-4 p-5 rounded-xl bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-gray-800 active:scale-[0.99] transition-all cursor-pointer relative" onClick={() => toggleTask(task.id, task.completed)}>
                                <div className="relative flex items-center pt-1">
                                    <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-[#13ec37] border-[#13ec37]' : 'border-gray-200 dark:border-gray-600'}`}>
                                        {task.completed && <span className="material-symbols-outlined text-white text-xl font-bold">check</span>}
                                    </div>
                                </div>
                                <div className="flex flex-col flex-1">
                                    <p className={`text-lg font-bold leading-tight transition-colors ${task.completed ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-[#111812] dark:text-white'}`}>
                                        {task.title}
                                    </p>
                                    <span className={`text-sm font-medium ${task.completed ? 'text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>
                                        {task.scheduled_time || 'Cualquier hora'}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {!isLoading && todayTasks.length === 0 && completedToday.length === 0 && (
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
                        <h2 className="text-[#111812] dark:text-white tracking-light text-[24px] font-bold leading-tight">Tareas de Ayer</h2>
                    </div>
                    <div className="px-4 flex flex-col gap-3">
                         {!isLoading && tasks.filter(t => t.scheduled_date === yesterdayStr).map((task) => (
                            <div key={task.id} className="group flex items-center gap-x-4 p-4 rounded-xl bg-white/60 dark:bg-surface-dark/60 shadow-sm border border-gray-100 dark:border-gray-800 opacity-80" onClick={() => toggleTask(task.id, task.completed)}>
                                <div className="relative flex items-center">
                                    <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-[#13ec37] border-[#13ec37]' : 'border-gray-200 dark:border-gray-600'}`}>
                                        {task.completed && <span className="material-symbols-outlined text-white text-xl font-bold">check</span>}
                                    </div>
                                </div>
                                <div className="flex flex-col flex-1">
                                    <p className={`text-lg font-bold leading-tight transition-colors ${task.completed ? 'text-gray-400 line-through' : 'text-[#111812] dark:text-white'}`}>
                                        {task.title}
                                    </p>
                                    <span className="text-sm text-gray-400">
                                        {task.scheduled_time || 'Cualquier hora'}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {!isLoading && tasks.filter(t => t.scheduled_date === yesterdayStr).length === 0 && (
                            <p className="text-center py-4 text-gray-400 italic">No hay historial para mostrar.</p>
                        )}
                    </div>
                </section>

                <BottomNav /> 
             </div>
         );
    }

    // User View (Interactive)
    return (
         <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-200 min-h-screen pb-32">
            <BackHeader title="Mi Día a Día" />
            <main className="p-4 space-y-8">
                {/* Today Section */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Tareas de Hoy</h2>
                    </div>
                    <div className="space-y-3">
                        {isLoading ? (
                            <p className="text-center py-4 text-gray-400">Cargando...</p>
                        ) : [...todayTasks, ...completedToday].map(task => (
                            <div 
                                key={task.id}
                                onClick={() => toggleTask(task.id, task.completed)}
                                className={`flex items-start gap-4 bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm border transition-all active:scale-[0.98] ${task.completed ? 'border-green-100 dark:border-green-900/20' : 'border-gray-100 dark:border-gray-800'}`}
                            >
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors pt-1 flex-shrink-0 ${task.completed ? 'bg-[#13ec37] border-[#13ec37]' : 'border-gray-200 dark:border-gray-600'}`}>
                                    {task.completed && <span className="material-symbols-outlined text-white font-bold text-lg">check</span>}
                                </div>
                                <div className="flex flex-col flex-1">
                                    <span className={`text-lg font-bold leading-tight transition-colors ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-slate-900 dark:text-white'}`}>
                                        {task.title}
                                    </span>
                                    <span className={`text-sm font-medium ${task.completed ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {task.scheduled_time || 'Cualquier hora'}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {!isLoading && todayTasks.length === 0 && completedToday.length === 0 && (
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

                {/* Yesterday Section */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-600 dark:text-gray-300">Tareas de Ayer</h2>
                    </div>
                    <div className="space-y-3">
                         {isLoading ? (
                            <p className="text-center py-4 text-gray-400">Cargando...</p>
                         ) : tasks.filter(t => t.scheduled_date === yesterdayStr).map(task => (
                            <div 
                                key={task.id}
                                onClick={() => toggleTask(task.id, task.completed)}
                                className={`flex items-center gap-4 bg-white/60 dark:bg-surface-dark/60 p-5 rounded-2xl shadow-sm border transition-all active:scale-[0.98] ${task.completed ? 'border-green-100 dark:border-green-900/20' : 'border-gray-100 dark:border-gray-800'}`}
                            >
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${task.completed ? 'bg-[#13ec37] border-[#13ec37]' : 'border-gray-200 dark:border-gray-600'}`}>
                                    {task.completed && <span className="material-symbols-outlined text-white font-bold text-lg">check</span>}
                                </div>
                                <div className="flex flex-col flex-1">
                                    <span className={`text-lg font-bold leading-tight transition-colors ${task.completed ? 'line-through text-gray-400' : 'text-slate-800 dark:text-gray-200'}`}>
                                        {task.title}
                                    </span>
                                    <span className="text-sm text-gray-400">
                                        {task.scheduled_time || 'Cualquier hora'}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {!isLoading && tasks.filter(t => t.scheduled_date === yesterdayStr).length === 0 && (
                             <p className="text-gray-500 italic text-center py-4">No hay tareas de ayer.</p>
                        )}
                    </div>
                </section>
            </main>

            {/* Add Task Modal */}
            {isAddingType && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#1c1d27] rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 shadow-xl border-t sm:border border-gray-200 dark:border-gray-700 animate-in slide-in-from-bottom-10 duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                {isAddingType === 'today' ? 'Nueva tarea para Hoy' : 'Nueva tarea para Mañana'}
                            </h3>
                            <button onClick={() => setIsAddingType(null)} className="p-2 bg-gray-100 dark:bg-white/10 rounded-full">
                                <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">close</span>
                            </button>
                        </div>
                        <form onSubmit={(e) => handleAddTask(e, isAddingType === 'today' ? todayStr : tomorrowStr)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título de la actividad</label>
                                <input 
                                    type="text" 
                                    value={newTaskText}
                                    onChange={(e) => setNewTaskText(e.target.value)}
                                    className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary py-4 px-4 text-lg"
                                    placeholder="Ej. Tomar medicina"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hora (opcional)</label>
                                <input 
                                    type="text" 
                                    value={newTaskTime}
                                    onChange={(e) => setNewTaskTime(e.target.value)}
                                    className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary py-4 px-4 text-lg"
                                    placeholder="Ej. 8:00 AM o Cualquier hora"
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

            <BottomNav /> 
        </div>
    );
};

import { CognitiveMetricsDashboard } from '../metrics/CognitiveMetricsDashboard';


interface Task {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    scheduled_date: string;
    scheduled_time: string;
    completed: boolean;
    completed_at?: string;
    created_at: string;
}