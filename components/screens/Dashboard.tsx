import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BottomNav } from '../Layout';

const UserDashboard: React.FC = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName') || 'María';

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-[#111812] dark:text-white transition-colors duration-200 relative min-h-screen pb-24">
            <header className="flex flex-col bg-white dark:bg-[#1a2e1d] shadow-sm z-10">
                <div className="flex items-center justify-between p-4 pb-2">
                    <div className="flex items-center gap-3">
                        <div className="bg-center bg-no-repeat bg-cover rounded-full size-12 border-2 border-primary" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAau3cJXsyf4mzxpDSi_jOvZfsvhI24YRjkqyGxBdz7ZkNkR1PIfMF6ocgjsjie32pkU30HfIKOq9rV71MjFK86rQqrFElDazCE0xhaLKQ8GpAXZNwymzIcUaJcATLzHTX9l-AbudN1tsx6JzZQnoEwiFgBBU5lSJEJ7t9-TodjfrmBcFtAiugKPyXt2Yb6abVLHYdkFdSWACk_pX7jP9SrE5cYSubBRN2jBoXil6GWfjPqW1K5J4p_mJSVmh4qLoeRHvz6KgDyuzU')"}}>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-[#111812] dark:text-white">RSTMindHealth</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-300 font-medium">Versión Accesible</p>
                        </div>
                    </div>
                    <button onClick={() => navigate('/profile')} aria-label="Ajustes" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-[#111812] dark:text-white">
                        <span className="material-symbols-outlined text-3xl">settings</span>
                    </button>
                </div>
                <div className="px-4 pb-4 pt-2">
                    <h1 className="text-[#111812] dark:text-white text-3xl font-bold leading-tight">Hola, {userName}</h1>
                    <p className="text-gray-600 dark:text-gray-300 text-xl font-medium mt-1">¿Qué quieres hacer hoy?</p>
                </div>
            </header>
            <main className="flex-1 px-4 pt-6 pb-4">
                <div className="grid grid-cols-2 gap-4">
                        {/* AI Assistant Button */}
                        <Link to="/ai-chat" className="group flex flex-col items-center p-4 bg-white dark:bg-[#1e3322] rounded-2xl shadow-sm border-2 border-primary/50 hover:border-primary active:scale-95 transition-all duration-200 h-full col-span-2">
                        <div className="flex flex-row items-center w-full gap-4">
                            <div className="size-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-4xl text-primary">mic</span>
                            </div>
                            <div className="flex flex-col text-left">
                                <p className="text-[#111812] dark:text-white text-lg font-bold leading-tight">Hablar con IA</p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">Tu asistente virtual</p>
                            </div>
                                <div className="ml-auto">
                                <span className="material-symbols-outlined text-primary text-2xl">arrow_forward_ios</span>
                            </div>
                        </div>
                    </Link>

                    <Link to="/activities" className="group flex flex-col items-center p-4 bg-white dark:bg-[#1e3322] rounded-2xl shadow-sm border-2 border-transparent hover:border-primary active:scale-95 transition-all duration-200 h-full">
                        <div className="w-full aspect-[4/3] bg-blue-100 dark:bg-blue-900/30 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20 bg-center bg-cover" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDPncD26onEVCbcijPBJyGAt9jO1xLvlW8yq3wRbNPHdze-MPxwDUv3Qz1EOnhZ7XoNWmdtoxAnb6zwDdtQcIryJOaKGYuUuan5N7m9ymFqWx-XxdozvIdjvQy67cgdkR4LDO2kgpgIOHTtbW2MCCLsWNMJ0i84Me3uM6LvqlNNsAR2DAMgqcuQvKQ_q0-ewoTbIWv66AJHEqBlqK18XfcHaQF89zuvWfYVPhDoQI4tx6atl43JDwpfnhyVWE92ThdX-wdpCrE08fs')"}}></div>
                            <span className="material-symbols-outlined text-6xl text-blue-600 dark:text-blue-400 relative z-10">psychology</span>
                        </div>
                        <div className="text-center">
                            <p className="text-[#111812] dark:text-white text-lg font-bold leading-tight">Estimulación</p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">Juegos mentales</p>
                        </div>
                    </Link>
                    <Link to="/health" className="group flex flex-col items-center p-4 bg-white dark:bg-[#1e3322] rounded-2xl shadow-sm border-2 border-transparent hover:border-primary active:scale-95 transition-all duration-200 h-full">
                        <div className="w-full aspect-[4/3] bg-green-100 dark:bg-green-900/30 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20 bg-center bg-cover" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC020LQqrikOIbKuBqnr_-QCs9G627uIocUAAjo2F7jxwytuJlwgoeclQapnCz25HReCZ93MzrSrowxmhbj5Ksq8qcj7eGZXtoHieAznDeW_nuPeR8IUYJF-mde_v1eMW-q4WaAodc06Qvps_OK9d2jIOTdlkRnoGhNONT6G8O9UxwFawwlFzT0uSmBHOGxlzKjgoOANdoCgQwmM4bUo8Il5pM2glTst4n6VbX1pTCIXmv0ti_DI6FD8FghwP3wAyOuQ6d3iegnRUU')"}}></div>
                            <span className="material-symbols-outlined text-6xl text-green-600 dark:text-green-400 relative z-10">favorite</span>
                        </div>
                        <div className="text-center">
                            <p className="text-[#111812] dark:text-white text-lg font-bold leading-tight">Salud Física</p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">Ejercicios suaves</p>
                        </div>
                    </Link>
                    <Link to="/support" className="group flex flex-col items-center p-4 bg-white dark:bg-[#1e3322] rounded-2xl shadow-sm border-2 border-transparent hover:border-primary active:scale-95 transition-all duration-200 h-full">
                        <div className="w-full aspect-[4/3] bg-purple-100 dark:bg-purple-900/30 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20 bg-center bg-cover" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBjVi8VPEU5sKyPBSulOWjAnDVxSUwok_1zeKStM8GaRhU9bRjA2iozLhvFM73SAjv4bmMhC5GYy3OJ8N9qzX0wmyA_aIrBuaYYxRU4_dCdACSznxML5Cce0ooPVyAgVjA_wHqtFaN4JPuhXS08XZ162pn9VCKGaBC_Fx022MNlMHm1Fw9tCc3reZCDuCRIkmai82UNf7HPnvvHAroxWu8VMP__asXQEh2Hz1GA1-Kfh5lcAEURD9wl0KUe11EXZ5xRT0K1ElHcomE')"}}></div>
                            <span className="material-symbols-outlined text-6xl text-purple-600 dark:text-purple-400 relative z-10">diversity_1</span>
                        </div>
                        <div className="text-center">
                            <p className="text-[#111812] dark:text-white text-lg font-bold leading-tight">Soporte</p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">Comunidad</p>
                        </div>
                    </Link>
                    <Link to="/daily" className="group flex flex-col items-center p-4 bg-white dark:bg-[#1e3322] rounded-2xl shadow-sm border-2 border-transparent hover:border-primary active:scale-95 transition-all duration-200 h-full">
                        <div className="w-full aspect-[4/3] bg-amber-100 dark:bg-amber-900/30 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20 bg-center bg-cover" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCtEVRGbwJAakUKFPUYr5l1GGVnjZgMfiyWRviRg2If5omvcjIOA_pHyuX8PqNwKGLANuR_L-jj61R7qm6VTYbvwQH9R5DxYXG_Q8m_Y8bepf5DoFzmqxbJ3fyCuMTLvTPyYlgg7po9wbsq0jJzNwTdJ-16VguipBniklNmmdfeSEltuOldZDBnLO_ZnYZwXw-2qoZuuP9u9FMZ1clC6IcXS3kqlxdJJ1tPcZD6X9Usjd_R3LU9o-60-VAaCqunch5DXiC95wDQGhY')"}}></div>
                            <span className="material-symbols-outlined text-6xl text-amber-600 dark:text-amber-400 relative z-10">emoji_events</span>
                        </div>
                        <div className="text-center">
                            <p className="text-[#111812] dark:text-white text-lg font-bold leading-tight">Motivación</p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">Mis logros</p>
                        </div>
                    </Link>
                </div>
                <div className="mt-8 mb-6">
                    <Link to="/safety" className="w-full flex items-center justify-center overflow-hidden rounded-xl h-16 px-6 bg-red-100 dark:bg-red-900/40 text-red-900 dark:text-red-100 border-2 border-red-200 dark:border-red-800 shadow-md active:scale-95 transition-transform">
                        <span className="material-symbols-outlined text-4xl mr-3">emergency_home</span>
                        <span className="text-xl font-bold tracking-[0.015em]">EMERGENCIA</span>
                    </Link>
                </div>
            </main>
            <BottomNav active="home" />
        </div>
    );
};

const FamilyDashboard: React.FC = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName') || 'Juan Pérez';
    const role = localStorage.getItem('userRole') || 'Familiar';

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden pb-24 bg-background-light dark:bg-background-dark font-display text-[#111812] dark:text-white">
            <header className="flex flex-col bg-white dark:bg-[#1a2e1d] shadow-sm z-10">
                <div className="flex items-center justify-between p-4 pb-2">
                    <div className="flex items-center gap-3">
                        <div className="bg-center bg-no-repeat bg-cover rounded-full size-12 border-2 border-[#13ec37]" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAau3cJXsyf4mzxpDSi_jOvZfsvhI24YRjkqyGxBdz7ZkNkR1PIfMF6ocgjsjie32pkU30HfIKOq9rV71MjFK86rQqrFElDazCE0xhaLKQ8GpAXZNwymzIcUaJcATLzHTX9l-AbudN1tsx6JzZQnoEwiFgBBU5lSJEJ7t9-TodjfrmBcFtAiugKPyXt2Yb6abVLHYdkFdSWACk_pX7jP9SrE5cYSubBRN2jBoXil6GWfjPqW1K5J4p_mJSVmh4qLoeRHvz6KgDyuzU')"}}></div>
                        <div>
                            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">RSTMindHealth</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-300 font-medium">Versión Accesible</p>
                        </div>
                    </div>
                    <button onClick={() => navigate('/profile')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <span className="material-symbols-outlined text-3xl">settings</span>
                    </button>
                </div>
                <div className="px-4 pb-4 pt-2">
                    <h1 className="text-3xl font-bold leading-tight">Hola, {userName}</h1>
                    <p className="text-[#0ea826] dark:text-[#13ec37] text-lg font-bold mt-1">Rol: {role}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-xl font-medium mt-2">¿Qué te gustaría revisar del progreso de tu familiar hoy?</p>
                </div>
            </header>
            <main className="flex-1 px-4 pt-6 pb-4">
                <Link to="/location" className="w-full mb-6 p-4 rounded-2xl bg-white dark:bg-[#1e3322] border-2 border-blue-500 dark:border-blue-400 shadow-sm flex items-center justify-between hover:bg-blue-50 dark:hover:bg-blue-900/20 active:scale-[0.98] transition-all duration-200 group">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-xl text-blue-600 dark:text-blue-400">
                            <span className="material-symbols-outlined text-3xl">location_on</span>
                        </div>
                        <div className="text-left">
                            <p className="text-lg font-bold leading-tight">Ver ubicación de mi familiar</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Mapa y seguridad en tiempo real</p>
                        </div>
                    </div>
                    <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">arrow_forward_ios</span>
                </Link>
                <div className="grid grid-cols-2 gap-4">
                    <Link to="/stimulation" className="group flex flex-col items-center p-4 bg-white dark:bg-[#1e3322] rounded-2xl shadow-sm border-2 border-transparent hover:border-[#13ec37] active:scale-95 transition-all duration-200 h-full">
                        <div className="w-full aspect-[4/3] bg-blue-100 dark:bg-blue-900/30 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 opacity-20 bg-center bg-cover" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDPncD26onEVCbcijPBJyGAt9jO1xLvlW8yq3wRbNPHdze-MPxwDUv3Qz1EOnhZ7XoNWmdtoxAnb6zwDdtQcIryJOaKGYuUuan5N7m9ymFqWx-XxdozvIdjvQy67cgdkR4LDO2kgpgIOHTtbW2MCCLsWNMJ0i84Me3uM6LvqlNNsAR2DAMgqcuQvKQ_q0-ewoTbIWv66AJHEqBlqK18XfcHaQF89zuvWfYVPhDoQI4tx6atl43JDwpfnhyVWE92ThdX-wdpCrE08fs')"}}></div>
                            <span className="material-symbols-outlined text-6xl text-blue-600 dark:text-blue-400 relative z-10">psychology</span>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-bold leading-tight">Estimulación Cognitiva</p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">Juegos mentales</p>
                        </div>
                    </Link>
                    <Link to="/activities" className="group flex flex-col items-center p-4 bg-white dark:bg-[#1e3322] rounded-2xl shadow-sm border-2 border-transparent hover:border-[#13ec37] active:scale-95 transition-all duration-200 h-full">
                        <div className="w-full aspect-[4/3] bg-green-100 dark:bg-green-900/30 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 opacity-20 bg-center bg-cover" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC020LQqrikOIbKuBqnr_-QCs9G627uIocUAAjo2F7jxwytuJlwgoeclQapnCz25HReCZ93MzrSrowxmhbj5Ksq8qcj7eGZXtoHieAznDeW_nuPeR8IUYJF-mde_v1eMW-q4WaAodc06Qvps_OK9d2jIOTdlkRnoGhNONT6G8O9UxwFawwlFzT0uSmBHOGxlzKjgoOANdoCgQwmM4bUo8Il5pM2glTst4n6VbX1pTCIXmv0ti_DI6FD8FghwP3wAyOuQ6d3iegnRUU')"}}></div>
                            <span className="material-symbols-outlined text-6xl text-green-600 dark:text-green-400 relative z-10">favorite</span>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-bold leading-tight">Salud Física</p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">Ejercicios suaves</p>
                        </div>
                    </Link>
                    <Link to="/emotional" className="group flex flex-col items-center p-4 bg-white dark:bg-[#1e3322] rounded-2xl shadow-sm border-2 border-transparent hover:border-[#13ec37] active:scale-95 transition-all duration-200 h-full">
                        <div className="w-full aspect-[4/3] bg-purple-100 dark:bg-purple-900/30 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20 bg-center bg-cover" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBjVi8VPEU5sKyPBSulOWjAnDVxSUwok_1zeKStM8GaRhU9bRjA2iozLhvFM73SAjv4bmMhC5GYy3OJ8N9qzX0wmyA_aIrBuaYYxRU4_dCdACSznxML5Cce0ooPVyAgVjA_wHqtFaN4JPuhXS08XZ162pn9VCKGaBC_Fx022MNlMHm1Fw9tCc3reZCDuCRIkmai82UNf7HPnvvHAroxWu8VMP__asXQEh2Hz1GA1-Kfh5lcAEURD9wl0KUe11EXZ5xRT0K1ElHcomE')"}}></div>
                            <span className="material-symbols-outlined text-6xl text-purple-600 dark:text-purple-400 relative z-10">diversity_1</span>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-bold leading-tight">Soporte Emocional</p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">Comunidad</p>
                        </div>
                    </Link>
                    <Link to="/daily" className="group flex flex-col items-center p-4 bg-white dark:bg-[#1e3322] rounded-2xl shadow-sm border-2 border-transparent hover:border-[#13ec37] active:scale-95 transition-all duration-200 h-full">
                        <div className="w-full aspect-[4/3] bg-amber-100 dark:bg-amber-900/30 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20 bg-center bg-cover" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCtEVRGbwJAakUKFPUYr5l1GGVnjZgMfiyWRviRg2If5omvcjIOA_pHyuX8PqNwKGLANuR_L-jj61R7qm6VTYbvwQH9R5DxYXG_Q8m_Y8bepf5DoFzmqxbJ3fyCuMTLvTPyYlgg7po9wbsq0jJzNwTdJ-16VguipBniklNmmdfeSEltuOldZDBnLO_ZnYZwXw-2qoZuuP9u9FMZ1clC6IcXS3kqlxdJJ1tPcZD6X9Usjd_R3LU9o-60-VAaCqunch5DXiC95wDQGhY')"}}></div>
                            <span className="material-symbols-outlined text-6xl text-amber-600 dark:text-amber-400 relative z-10">emoji_events</span>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-bold leading-tight">Motivación</p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">Mis logros</p>
                        </div>
                    </Link>
                </div>
            </main>
        </div>
    );
};

export const HomeScreen: React.FC = () => {
    const role = localStorage.getItem('userRole');
    if (role === 'Familiar') {
        return <FamilyDashboard />;
    }
    return <UserDashboard />;
};