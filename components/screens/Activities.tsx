import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BackHeader, BottomNav } from '../Layout';
import { usePreferences } from '../../contexts/PreferencesContext';

const UserActivities: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const userName = localStorage.getItem('userName') || 'María';

    const scrollCarousel = () => {
        if (scrollRef.current) {
            const container = scrollRef.current;
            const scrollAmount = 336; 
            
            if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
                    container.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-50 transition-colors duration-200 min-h-screen pb-24">
            <BackHeader title="Estimulación" />
            <div className="px-5 pt-6 pb-2">
                <h2 className="text-slate-900 dark:text-white tracking-tight text-[32px] font-bold leading-tight text-left mb-3">Hola, {userName}</h2>
                <div className="flex gap-3 flex-wrap">
                    <div className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/20 dark:bg-primary/10 border border-primary/30 pl-4 pr-5 transition-colors">
                        <span className="material-symbols-outlined text-primary-dark dark:text-primary text-[20px]">tune</span>
                        <p className="text-primary-dark dark:text-primary text-base font-medium leading-normal">Dificultad: Automática</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col mt-4">
                <div className="flex items-center justify-between px-5 pb-3 pt-4">
                    <h3 className="text-slate-900 dark:text-white text-[24px] font-bold leading-tight tracking-[-0.015em]">Juegos Cognitivos</h3>
                </div>
                <div className="px-4 mb-4 w-full">
                    <Link to="/memory-games" className="flex flex-col items-stretch justify-start rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 bg-surface-light dark:bg-surface-dark overflow-hidden transition-transform active:scale-[0.99] duration-200">
                        <div className="flex flex-row p-3 gap-4 items-center">
                            <div className="w-24 h-24 shrink-0 bg-center bg-no-repeat bg-cover rounded-xl bg-blue-100" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCqgBMicgKHHkPcQjDCbXSwA7KlhXcHnZIWtn29GgPQ28-79L9Fx8pQsCgOJUxDdjuEmAiJIgUs6_y6ztz-umyDqZ0U6Khv54I27TDJuabrEJ8yxLZdOGiHbaj4IVaGMzM0KrUIuLYQXxx8cU_cE_fLGps_cSMRGLcFjdVaVrrS_SJimxRjkAXgpsGyuZzYinBVTHlnFwP7brrZBSjaqZyb8Yuai592ZjPuuul_6F7VyvKexfr8bIVBNs5dzuEAOTIQUEBT5Xse7l4')"}}>
                            </div>
                            <div className="flex flex-col grow justify-center gap-1">
                                <h4 className="text-slate-900 dark:text-white text-xl font-bold leading-tight">Memoria</h4>
                                <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">Ejercita tu recuerdo</p>
                            </div>
                            <div className="flex flex-col justify-center pr-2">
                                <span className="material-symbols-outlined text-[32px] font-bold text-primary">play_circle</span>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="px-4 mb-4 w-full">
                    <Link to="/attention-games" className="flex flex-col items-stretch justify-start rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 bg-surface-light dark:bg-surface-dark overflow-hidden transition-transform active:scale-[0.99] duration-200">
                        <div className="flex flex-row p-3 gap-4 items-center">
                            <div className="w-24 h-24 shrink-0 bg-center bg-no-repeat bg-cover rounded-xl bg-orange-100" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDFoQbS9zRcBiJFVO1RbyNv_B4xG5PqyFvuI-q1VgWHRv2dgo0cB-oyon76L5rTptIHnBEwG9b0xiPgj8bJcH7zgwgFc68UK80i9hUoKIiLOVmhZMaCg4q3zHHNlhM8h6yFNk761tKPoyEIUczCotx4Hhv_POt_a46AlO5Lrnm-4RO9VWhnoMUO24LWazb33l8sqAakATS1H09y6OXZFFzjguR0uqedGTqNRrIuZiip2H3sbntPn3ZYXVmjDh31UrtVbiCvvg5QdNo')"}}>
                            </div>
                            <div className="flex flex-col grow justify-center gap-1">
                                <h4 className="text-slate-900 dark:text-white text-xl font-bold leading-tight">Atención</h4>
                                <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">Mejora tu enfoque</p>
                            </div>
                            <div className="flex flex-col justify-center pr-2">
                                    <span className="material-symbols-outlined text-[32px] font-bold text-primary">play_circle</span>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="px-4 mb-4 w-full">
                    <Link to="/calc-games" className="flex flex-col items-stretch justify-start rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 bg-surface-light dark:bg-surface-dark overflow-hidden transition-transform active:scale-[0.99] duration-200">
                        <div className="flex flex-row p-3 gap-4 items-center">
                            <div className="w-24 h-24 shrink-0 bg-center bg-no-repeat bg-cover rounded-xl bg-purple-100" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCgMAnB-kcdLbuJURzzER-LVdJ0lVOthmjmVa0q57Pl36GJmSWA5qpqBwPLuu4ZsF6UZckanOdbbAwocmTi3qyl4ZEWQv59CdJ-S_vVBMN2vno9gBhJcC7M317hPJCUMpeiKTbWSn6-xwSDnw_KARVHADO0X6BQ-_8e4VqqIefpWooNLxh-8Rd2v4p3_1T9kHveWlBD6GgldPOOC_BnZgcWYTPnevfi05MD5dyg5AR89heeYLcRAOjfrydMvEF9ikmwHkiOAhuPx1M')"}}>
                            </div>
                            <div className="flex flex-col grow justify-center gap-1">
                                <h4 className="text-slate-900 dark:text-white text-xl font-bold leading-tight">Cálculo</h4>
                                <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">Agilidad mental</p>
                            </div>
                            <div className="flex flex-col justify-center pr-2">
                                    <span className="material-symbols-outlined text-[32px] font-bold text-primary">play_circle</span>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
                <div className="flex flex-col mt-2">
                <div className="flex items-center justify-between px-5 pb-3 pt-4">
                    <h3 className="text-slate-900 dark:text-white text-[24px] font-bold leading-tight tracking-[-0.015em]">Reminiscencia</h3>
                    <button onClick={scrollCarousel} className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary active:bg-primary/20 transition-colors">
                        <span>Explorar</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>
                <div ref={scrollRef} className="flex overflow-x-auto px-5 pb-8 gap-4 hide-scrollbar snap-x snap-mandatory scroll-pl-5 items-stretch">
                    <Link to="/stories" className="min-w-[85%] md:min-w-[320px] snap-center flex flex-col rounded-3xl shadow-lg bg-surface-light dark:bg-surface-dark overflow-hidden border border-gray-100 dark:border-gray-800 transition-transform active:scale-[0.98]">
                        <div className="h-48 w-full bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD4AzXt2HcVVva6cqA2s_LJEd2DB-6ltK5PvXJPS3bKCBIXNmCbUpMSPkALjYeo4tHKSQ6X0GH11tgu8dO_0bpcFOWA2x4FzWn27YKSpNyN8MJ1A8DQ7lAskEjnVVD50jgFUXpnTGjbDvAjnpCaSKuJWUvsJzu7aYEg4CHj8jG_xzFkYKI28jOSc78LcVvAnTMYlp_i3JivXYjtv5F_e3SO5zLhqY7btEJ9nQo7lCDoy054zReHO3CPug6Sum9DO0_c9VBImNKHqFw')"}}></div>
                        <div className="p-5 flex flex-col gap-3 h-full justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 p-2 rounded-xl">
                                        <span className="material-symbols-outlined text-[24px]">photo_library</span>
                                    </div>
                                    <h4 className="text-slate-900 dark:text-white text-2xl font-bold">Mi Historia</h4>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 text-lg leading-snug">Revive momentos especiales.</p>
                            </div>
                        </div>
                    </Link>
                        <Link to="/music" className="min-w-[85%] md:min-w-[320px] snap-center flex flex-col rounded-3xl shadow-lg bg-surface-light dark:bg-surface-dark overflow-hidden border border-gray-100 dark:border-gray-800 transition-transform active:scale-[0.98]">
                        <div className="h-48 w-full bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD7xkeiwl9e0CcvbphBxNemPY9kY7jmc6pCLUb5tfWcQG8fP3rEqHJb3oPJCMeZADVm2p3tENaHLZZG9z7g1UzQVDTm9CzlDhcZzCM3eO6K_bVH1j9tlhEnUcWMHPcBh7th5dxHia4uoo2-8uqEG280jelkP1w1z0XVkARYLxn08_NuMPA24zi5eOXmmjHKB6FOjzfYwyYpfvjMOGwTkjTdxxejfT-GIZL34fe4hyapAKCw80lOJbAZQz3yB_mrTOly9PP85mmSh84')"}}></div>
                        <div className="p-5 flex flex-col gap-3 h-full justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 p-2 rounded-xl">
                                        <span className="material-symbols-outlined text-[24px]">music_note</span>
                                    </div>
                                    <h4 className="text-slate-900 dark:text-white text-2xl font-bold">Música de Ayer</h4>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 text-lg leading-snug">Escucha las canciones de tu vida.</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
            <BottomNav active="activities" />
        </div>
    );
};

const FamilyActivities: React.FC = () => {
    const userName = localStorage.getItem('userName') || 'Familiar';
    
    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-24 bg-background-light dark:bg-background-dark font-display text-[#111812] dark:text-white">
            <BackHeader title="Salud y Bienestar" />
            <div className="px-6 pt-6 pb-2">
                <h2 className="text-[#111812] dark:text-white tracking-tight text-[32px] font-bold leading-tight text-left">Hola, {userName}</h2>
                <p className="text-[#618968] dark:text-gray-400 text-sm font-semibold mt-1">Rol: Familiar</p>
                <p className="text-[#4e5850] dark:text-gray-300 text-lg font-normal leading-normal pt-3">¿Qué quieres hacer hoy?</p>
            </div>
            <div className="flex flex-col gap-6 px-4 mt-4">
                 <div className="flex items-center justify-between gap-5 rounded-xl bg-white dark:bg-[#1A2E1E] p-6 shadow-sm cursor-pointer border border-transparent hover:border-[#13ec37]/50 transition-colors">
                    <div className="flex items-center justify-center size-16 rounded-full bg-[#e0fce5] dark:bg-[#13ec37]/20 shrink-0">
                        <span className="material-symbols-outlined text-[#0a3d13] dark:text-[#13ec37]" style={{fontSize: "32px"}}>directions_walk</span>
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                        <p className="text-[#111812] dark:text-white text-xl font-bold leading-tight">Rutinas de Ejercicio</p>
                        <p className="text-[#618968] dark:text-gray-400 text-base font-normal leading-normal">Mover el cuerpo</p>
                    </div>
                    <span className="material-symbols-outlined text-gray-400 text-3xl">chevron_right</span>
                </div>
                 <div className="flex items-center justify-between gap-5 rounded-xl bg-white dark:bg-[#1A2E1E] p-6 shadow-sm cursor-pointer border border-transparent hover:border-[#13ec37]/50 transition-colors">
                    <div className="flex items-center justify-center size-16 rounded-full bg-[#fff4e0] dark:bg-orange-500/20 shrink-0">
                        <span className="material-symbols-outlined text-orange-700 dark:text-orange-400" style={{fontSize: "32px"}}>nutrition</span>
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                        <p className="text-[#111812] dark:text-white text-xl font-bold leading-tight">Recetas Saludables</p>
                        <p className="text-[#618968] dark:text-gray-400 text-base font-normal leading-normal">Comidas nutritivas</p>
                    </div>
                     <span className="material-symbols-outlined text-gray-400 text-3xl">chevron_right</span>
                </div>
                <div className="flex items-center justify-between gap-5 rounded-xl bg-white dark:bg-[#1A2E1E] p-6 shadow-sm cursor-pointer border border-transparent hover:border-[#13ec37]/50 transition-colors">
                    <div className="flex items-center justify-center size-16 rounded-full bg-[#e0effc] dark:bg-blue-500/20 shrink-0">
                        <span className="material-symbols-outlined text-blue-700 dark:text-blue-400" style={{fontSize: "32px"}}>cardiology</span>
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                        <p className="text-[#111812] dark:text-white text-xl font-bold leading-tight">Registro de Salud</p>
                        <p className="text-[#618968] dark:text-gray-400 text-base font-normal leading-normal">Ver el progreso de mi familiar</p>
                    </div>
                     <span className="material-symbols-outlined text-gray-400 text-3xl">chevron_right</span>
                </div>
            </div>
             <div className="px-4 mt-8">
                <div className="rounded-xl bg-[#13ec37]/10 p-5 border border-[#13ec37]/20 flex gap-4 items-start">
                    <span className="material-symbols-outlined text-[#0a3d13] dark:text-[#13ec37] shrink-0 mt-0.5">lightbulb</span>
                    <div>
                        <p className="text-sm font-bold text-[#0a3d13] dark:text-[#13ec37] mb-1">Consejo del día</p>
                        <p className="text-sm text-[#111812] dark:text-gray-200 leading-relaxed">Beber un vaso de agua antes de comer ayuda a la digestión.</p>
                    </div>
                </div>
            </div>
            <BottomNav active="health" />
        </div>
    );
};

export const ActivitiesScreen: React.FC = () => {
    const role = localStorage.getItem('userRole');
    if (role === 'Familiar') {
        return <FamilyActivities />;
    }
    return <UserActivities />;
};

export const MemoryGamesScreen: React.FC = () => {
    const [difficulty, setDifficulty] = useState('Fácil');
    
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-200 min-h-screen pb-24">
                <BackHeader title="Juegos de Memoria" />
                <div className="px-4 pt-4">
                <p className="mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">Selecciona la Dificultad</p>
                <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-2">
                    {['Fácil', 'Medio', 'Difícil'].map((level) => (
                        <button
                            key={level}
                            onClick={() => setDifficulty(level)}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                                difficulty === level 
                                ? 'bg-white dark:bg-[#2a3c2e] text-primary shadow-sm ring-1 ring-black/5' 
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                            }`}
                        >
                            {level}
                        </button>
                    ))}
                </div>
                </div>
                <main className="flex-1 flex flex-col gap-5 px-4 pt-2 pb-8 overflow-y-auto">
                <article className="group relative overflow-hidden rounded-2xl bg-white dark:bg-[#1c1d27] shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100 dark:border-slate-800">
                    <div className="relative h-40 w-full overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                        <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBlR-dSTgtWjWvv6fvIx2X9KEG18XSIxkZmPSOnJaA_k9_AEHQ385zbMRaCSfuf_ndEi8We6u16lrZxGSf_xb9GUoK3moAvuLjzBR2Zy8bMimK-wyQpCTYi1x3AavoObXx2jH8k0aZg12gH1FC-y1fZQXHC8VhRhnn440DGQq9itSpfXKgN_MxDccp9tRhLO5gMxO7z6SbOgeuIqXYdwyBJT3x5Ssza-beCkOrsPi_kjfboHwkzblx4HqcwFtHaaZ-M5J-Y3kyQnes')"}}></div>
                        <div className="absolute top-3 left-3 z-20">
                            <span className="inline-flex items-center rounded-full bg-green-500/90 px-3 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-sm">
                                <span className="material-symbols-outlined text-[14px] mr-1">eco</span> {difficulty}
                            </span>
                        </div>
                    </div>
                    <div className="p-5 flex flex-col gap-3">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-1">Parejas de Cartas</h3>
                        <button className="mt-2 w-full flex items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/30 transition-transform active:scale-95 hover:bg-primary-dark">
                            <span className="material-symbols-outlined">play_arrow</span>
                            <span>Jugar Ahora</span>
                        </button>
                    </div>
                </article>
                </main>
                <BottomNav active="activities" />
        </div>
    );
};

export const AttentionGamesScreen: React.FC = () => {
    const [difficulty, setDifficulty] = useState('Fácil');

    return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-200 min-h-screen pb-24">
            <BackHeader title="Juegos de Atención" />
            <div className="px-4 pt-4">
            <p className="mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">Selecciona la Dificultad</p>
            <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-2">
                {['Fácil', 'Medio', 'Difícil'].map((level) => (
                    <button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                            difficulty === level 
                            ? 'bg-white dark:bg-[#2a3c2e] text-primary shadow-sm ring-1 ring-black/5' 
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                        }`}
                    >
                        {level}
                    </button>
                ))}
            </div>
            </div>
            <main className="flex-1 flex flex-col gap-5 px-4 pt-2 pb-8 overflow-y-auto">
            <article className="group relative overflow-hidden rounded-2xl bg-white dark:bg-[#1c1d27] shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100 dark:border-slate-800">
                    <div className="relative h-40 w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                    <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAGFdcKuEfQ_9gqz4MrO7sRIpQp2v5Zi3lSc9jIUdSjdCw39eOJo-4NJPkLUenfbJX0E_nWhdsrV9meHNf453QtFD4SP4d98B1CNRoDgKk1A0Mcw9RzOoCQUjW0T0-g564l8rIs7BggRx23D7aQyw1e3AuEeCi1kkfXRHBHe9Ru7XcR1bOlWKKtZK7WfAKhO42YqzZvOndYTR6bFkCLI6vZLJ9oJ68mEruGdsb5nLXQmfD1wD71K2FvFmkWnc_pONVBeotI6DBf7Js')"}}></div>
                    <div className="absolute top-3 left-3 z-20">
                        <span className="inline-flex items-center rounded-full bg-green-500/90 px-3 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-sm">
                            <span className="material-symbols-outlined text-[14px] mr-1">eco</span> {difficulty}
                        </span>
                    </div>
                </div>
                <div className="p-5 flex flex-col gap-3">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-1">Encuentra la Pareja</h3>
                    <button className="mt-2 w-full flex items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/30 transition-transform active:scale-95 hover:bg-primary-dark">
                        <span className="material-symbols-outlined">play_arrow</span>
                        <span>Jugar Ahora</span>
                    </button>
                </div>
            </article>
            </main>
            <BottomNav active="activities" />
    </div>
    );
};

export const CalcGamesScreen: React.FC = () => {
    const [difficulty, setDifficulty] = useState('Fácil');

    return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-200 min-h-screen pb-24">
            <BackHeader title="Juegos de Cálculo" />
            <div className="px-4 pt-4">
            <p className="mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">Selecciona la Dificultad</p>
            <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-2">
                {['Fácil', 'Medio', 'Difícil'].map((level) => (
                    <button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                            difficulty === level 
                            ? 'bg-white dark:bg-[#2a3c2e] text-primary shadow-sm ring-1 ring-black/5' 
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                        }`}
                    >
                        {level}
                    </button>
                ))}
            </div>
            </div>
            <main className="flex-1 flex flex-col gap-5 px-4 pt-2 pb-8 overflow-y-auto">
            <article className="group relative overflow-hidden rounded-2xl bg-white dark:bg-[#1c1d27] shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100 dark:border-slate-800">
                    <div className="relative h-40 w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                    <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDXKhRAfJMeKGy5XTIsbrlsklk4fuXzm5WsZOIE0C9Q2eRtnQs_TQ5VfIEe2Z0ar7lS3qFuLNMlEtewZvSjMP9WCHfXF-QbkdCZQACwJzOv2USqj41U7pSqdZ_Dc1zK3MFQ_eUjNzv6l0zEeIpVbUh2IFZxjd_MW9tgfr5mafQhhiC3y6o4YYFR1Zv2e-4yfUZUqSTdwEgarXjkOG1g6tdA7YlkCDOyq5XjL-57f8wakqpdWcXihL8qMYYJZ4CAhFHc95cWv3RNKY8')"}}></div>
                    <div className="absolute top-3 left-3 z-20">
                        <span className="inline-flex items-center rounded-full bg-green-500/90 px-3 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-sm">
                            <span className="material-symbols-outlined text-[14px] mr-1">eco</span> {difficulty}
                        </span>
                    </div>
                </div>
                <div className="p-5 flex flex-col gap-3">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-1">Sumas Rápidas</h3>
                    <button className="mt-2 w-full flex items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/30 transition-transform active:scale-95 hover:bg-primary-dark">
                        <span className="material-symbols-outlined">play_arrow</span>
                        <span>Jugar Ahora</span>
                    </button>
                </div>
            </article>
            </main>
            <BottomNav active="activities" />
    </div>
    );
};

export const StoriesScreen: React.FC = () => {
    return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-200 min-h-screen pb-24">
        <BackHeader title="Mi Historia" />
        <main className="flex-1 w-full max-w-lg mx-auto flex flex-col px-4 pt-4">
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                <article className="flex flex-col gap-2 group cursor-pointer">
                    <div className="w-full aspect-square rounded-xl overflow-hidden shadow-soft bg-gray-100 dark:bg-gray-800 relative">
                        <div className="w-full h-full bg-center bg-cover" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBrnz2eolo0C_wPHS6t86M1yBTjC5tDnIbNMIk5928HTbvfDpknfFN5Cn36hNMaYjomjUXEsJYP212OiHHT0FG_0zmsVq_YNJOIo3ypp11BgR8f1IV5bT2QiClje_HiOpUK4qb04REZt9cYZRu8gIgCWMkew-K2APNC3vYLBljBCc0rGjzwlBWAs-N81ndEW925X_yGTvSSodle-SIuuG6lgr3WeETgkVzOB6VQImRYWPw-nWCO_RMjhUjYha6jK4ewzR8-4lc-LbA')"}}></div>
                    </div>
                    <div className="px-1">
                        <p className="text-lg font-bold leading-tight">Nietos</p>
                        <p className="text-base font-medium text-gray-500">Verano 2022</p>
                    </div>
                </article>
                </div>
        </main>
        <BottomNav active="activities" />
    </div>
    );
};

export const MusicScreen: React.FC = () => {
    const { volume } = usePreferences();
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initial setup for audio element
    useEffect(() => {
        audioRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
        audioRef.current.loop = true;
        
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // Effect to handle volume changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.log("Playback error", e));
        }
        setIsPlaying(!isPlaying);
    };

    return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-200 min-h-screen pb-24">
            <BackHeader title="Música de Ayer" />
            <main className="flex-1 overflow-y-auto pb-8 px-4 sm:px-6 pt-6">
            <div className="flex flex-col items-center justify-center mt-2 mb-8 gap-6">
                <div className={`w-full max-w-xs aspect-square rounded-xl shadow-2xl overflow-hidden relative ring-1 ring-white/10 transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}>
                    <div className="w-full h-full bg-center bg-cover" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDVxS6T0GGPstA1LvgcuXH3wfSsS9qi-2eip18ORpcDtxmnhTY073CiAPvoxdzj-iem497TgZUZ5rLdA0M2OYBQs5TLs8o0LlsiOI47LJ3YE66XVb3STdsfXYMfArlTucm4AXvtVasp3oA3k4IVkvkwxNcMAvJgFR-c28K-cEaMXsqdqJY1KoJ6KYUxjLlMYTXrHKK6kpgLxA97wcA-k0qK1Y-EfNFtmC4DhIZhStsrSGOrK3hBJ3kgkcvdypGtJAEeGHbUZVKUVu0')"}}></div>
                </div>
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold leading-tight tracking-tight">Bésame Mucho</h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">Los Panchos</p>
                </div>
            </div>
            <div className="flex items-center justify-center gap-8 mb-10">
                <button 
                    onClick={togglePlay}
                    className={`flex items-center justify-center w-24 h-24 rounded-full text-white shadow-xl shadow-primary/30 active:scale-95 transition-all ${isPlaying ? 'bg-primary-dark' : 'bg-primary'}`}
                >
                    <span className="material-symbols-outlined" style={{fontSize: "56px"}}>
                        {isPlaying ? 'pause' : 'play_arrow'}
                    </span>
                </button>
            </div>
            <div className="px-8 text-center">
                <p className="text-sm text-gray-400">Volumen Actual: {volume}%</p>
                <p className="text-xs text-gray-300 mt-1">(Ajustable en Perfil)</p>
            </div>
            </main>
            <BottomNav active="activities" />
    </div>
    );
};