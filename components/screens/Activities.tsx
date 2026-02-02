import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { BackHeader, BottomNav } from '../Layout';
import { useAuth } from '../../contexts/AuthContext';
import { FamilyStimulationScreen } from './FamilyFeatures';
import { isCaregiverRole } from '@/utils/roleUtils';
import {useState} from 'react';
import { CaregiverMetricsDashboard } from '../metrics/dashboards/CaregiverMetricsDashboard';
import { PatientMetricsDashboard } from '../metrics/dashboards/PatientMetricsDashboard';

const UserActivities: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { profile } = useAuth();
  const userName = profile?.name || "María";

  const caregiver = isCaregiverRole(profile?.role);

  // ✅ Si es cuidador -> manda a estadísticas filtradas
  // ✅ Si es paciente -> manda a juegos
  const memoryLink = caregiver ? "/progress?category=memory" : "/memory-games";
  const attentionLink = caregiver ? "/progress?category=attention" : "/attention-games";
  const calcLink = caregiver ? "/progress?category=calculation" : "/calc-games";

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
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-50 transition-colors duration-200 min-h-screen pb-24 md:pb-6 md:pl-64">
      <BackHeader title="Estimulación" />

      <div className="px-5 pt-6 pb-2">
        <h2 className="text-slate-900 dark:text-white tracking-tight text-[32px] font-bold leading-tight text-left mb-3">
          Hola, {userName}
        </h2>

        <div className="flex gap-3 flex-wrap">
          <div className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/20 dark:bg-primary/10 border border-primary/30 pl-4 pr-5 transition-colors">
            <span className="material-symbols-outlined text-primary-dark dark:text-primary text-[20px]">tune</span>
            <p className="text-primary-dark dark:text-primary text-base font-medium leading-normal">
              Dificultad: Automática
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col mt-4">
        <div className="flex items-center justify-between px-5 pb-3 pt-4">
          <h3 className="text-slate-900 dark:text-white text-[24px] font-bold leading-tight tracking-[-0.015em]">
            Juegos Cognitivos
          </h3>
        </div>

        {/* ✅ MEMORIA */}
        <div className="px-4 mb-4 w-full">
          <Link
            to={memoryLink}
            className="flex flex-col items-stretch justify-start rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 bg-surface-light dark:bg-surface-dark overflow-hidden transition-transform active:scale-[0.99] duration-200"
          >
            <div className="flex flex-row p-3 gap-4 items-center">
              <div
                className="w-24 h-24 shrink-0 bg-center bg-no-repeat bg-cover rounded-xl bg-blue-100"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCqgBMicgKHHkPcQjDCbXSwA7KlhXcHnZIWtn29GgPQ28-79L9Fx8pQsCgOJUxDdjuEmAiJIgUs6_y6ztz-umyDqZ0U6Khv54I27TDJuabrEJ8yxLZdOGiHbaj4IVaGMzM0KrUIuLYQXxx8cU_cE_fLGps_cSMRGLcFjdVaVrrS_SJimxRjkAXgpsGyuZzYinBVTHlnFwP7brrZBSjaqZyb8Yuai592ZjPuuul_6F7VyvKexfr8bIVBNs5dzuEAOTIQUEBT5Xse7l4')",
                }}
              />
              <div className="flex flex-col grow justify-center gap-1">
                <h4 className="text-slate-900 dark:text-white text-xl font-bold leading-tight">Memoria</h4>
                <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">
                  Ejercita tu recuerdo
                </p>
              </div>
              <div className="flex flex-col justify-center pr-2">
                <span className="material-symbols-outlined text-[32px] font-bold text-primary">play_circle</span>
              </div>
            </div>
          </Link>
        </div>

        {/* ✅ ATENCIÓN */}
        <div className="px-4 mb-4 w-full">
          <Link
            to={attentionLink}
            className="flex flex-col items-stretch justify-start rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 bg-surface-light dark:bg-surface-dark overflow-hidden transition-transform active:scale-[0.99] duration-200"
          >
            <div className="flex flex-row p-3 gap-4 items-center">
              <div
                className="w-24 h-24 shrink-0 bg-center bg-no-repeat bg-cover rounded-xl bg-orange-100"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDFoQbS9zRcBiJFVO1RbyNv_B4xG5PqyFvuI-q1VgWHRv2dgo0cB-oyon76L5rTptIHnBEwG9b0xiPgj8bJcH7zgwgFc68UK80i9hUoKIiLOVmhZMaCg4q3zHHNlhM8h6yFNk761tKPoyEIUczCotx4Hhv_POt_a46AlO5Lrnm-4RO9VWhnoMUO24LWazb33l8sqAakATS1H09y6OXZFFzjguR0uqedGTqNRrIuZiip2H3sbntPn3ZYXVmjDh31UrtVbiCvvg5QdNo')",
                }}
              />
              <div className="flex flex-col grow justify-center gap-1">
                <h4 className="text-slate-900 dark:text-white text-xl font-bold leading-tight">Atención</h4>
                <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">
                  Mejora tu enfoque
                </p>
              </div>
              <div className="flex flex-col justify-center pr-2">
                <span className="material-symbols-outlined text-[32px] font-bold text-primary">play_circle</span>
              </div>
            </div>
          </Link>
        </div>

        {/* ✅ CÁLCULO */}
        <div className="px-4 mb-4 w-full">
          <Link
            to={calcLink}
            className="flex flex-col items-stretch justify-start rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 bg-surface-light dark:bg-surface-dark overflow-hidden transition-transform active:scale-[0.99] duration-200"
          >
            <div className="flex flex-row p-3 gap-4 items-center">
              <div
                className="w-24 h-24 shrink-0 bg-center bg-no-repeat bg-cover rounded-xl bg-purple-100"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCgMAnB-kcdLbuJURzzER-LVdJ0lVOthmjmVa0q57Pl36GJmSWA5qpqBwPLuu4ZsF6UZckanOdbbAwocmTi3qyl4ZEWQv59CdJ-S_vVBMN2vno9gBhJcC7M317hPJCUMpeiKTbWSn6-xwSDnw_KARVHADO0X6BQ-_8e4VqqIefpWooNLxh-8Rd2v4p3_1T9kHveWlBD6GgldPOOC_BnZgcWYTPnevfi05MD5dyg5AR89heeYLcRAOjfrydMvEF9ikmwHkiOAhuPx1M')",
                }}
              />
              <div className="flex flex-col grow justify-center gap-1">
                <h4 className="text-slate-900 dark:text-white text-xl font-bold leading-tight">Cálculo</h4>
                <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">
                  Agilidad mental
                </p>
              </div>
              <div className="flex flex-col justify-center pr-2">
                <span className="material-symbols-outlined text-[32px] font-bold text-primary">play_circle</span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* ✅ Reminiscencia (esto queda igual) */}
      <div className="flex flex-col mt-2">
        <div className="flex items-center justify-between px-5 pb-3 pt-4">
          <h3 className="text-slate-900 dark:text-white text-[24px] font-bold leading-tight tracking-[-0.015em]">
            Reminiscencia
          </h3>
          <button
            onClick={scrollCarousel}
            className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary active:bg-primary/20 transition-colors"
          >
            <span>Explorar</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto px-5 pb-8 gap-4 hide-scrollbar snap-x snap-mandatory scroll-pl-5 items-stretch"
        >
          <Link
            to="/stories"
            className="min-w-[85%] md:min-w-[320px] snap-center flex flex-col rounded-3xl shadow-lg bg-surface-light dark:bg-surface-dark overflow-hidden border border-gray-100 dark:border-gray-800 transition-transform active:scale-[0.98]"
          >
            <div
              className="h-48 w-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD4AzXt2HcVVva6cqA2s_LJEd2DB-6ltK5PvXJPS3bKCBIXNmCbUpMSPkALjYeo4tHKSQ6X0GH11tgu8dO_0bpcFOWA2x4FzWn27YKSpNyN8MJ1A8DQ7lAskEjnVVD50jgFUXpnTGjbDvAjnpCaSKuJWUvsJzu7aYEg4CHj8jG_xzFkYKI28jOSc78LcVvAnTMYlp_i3JivXYjtv5F_e3SO5zLhqY7btEJ9nQo7lCDoy054zReHO3CPug6Sum9DO0_c9VBImNKHqFw')",
              }}
            />
            <div className="p-5 flex flex-col gap-3 h-full justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 p-2 rounded-xl">
                    <span className="material-symbols-outlined text-[24px]">photo_library</span>
                  </div>
                  <h4 className="text-slate-900 dark:text-white text-2xl font-bold">Mi Historia</h4>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-lg leading-snug">
                  Revive momentos especiales.
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/music"
            className="min-w-[85%] md:min-w-[320px] snap-center flex flex-col rounded-3xl shadow-lg bg-surface-light dark:bg-surface-dark overflow-hidden border border-gray-100 dark:border-gray-800 transition-transform active:scale-[0.98]"
          >
            <div
              className="h-48 w-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD7xkeiwl9e0CcvbphBxNemPY9kY7jmc6pCLUb5tfWcQG8fP3rEqHJb3oPJCMeZADVm2p3tENaHLZZG9z7g1UzQVDTm9CzlDhcZzCM3eO6K_bVH1j9tlhEnUcWMHPcBh7th5dxHia4uoo2-8uqEG280jelkP1w1z0XVkARYLxn08_NuMPA24zi5eOXmmjHKB6FOjzfYwyYpfvjMOGwTkjTdxxejfT-GIZL34fe4hyapAKCw80lOJbAZQz3yB_mrTOly9PP85mmSh84')",
              }}
            />
            <div className="p-5 flex flex-col gap-3 h-full justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 p-2 rounded-xl">
                    <span className="material-symbols-outlined text-[24px]">music_note</span>
                  </div>
                  <h4 className="text-slate-900 dark:text-white text-2xl font-bold">Música de Ayer</h4>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-lg leading-snug">
                  Escucha las canciones de tu vida.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <BottomNav active="activities" />
    </div>
  );
};

export const FamilyActivities: React.FC = () => {
  const userName = localStorage.getItem('userName') || 'Familiar';

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-24 md:pb-6 md:pl-64 bg-background-light dark:bg-background-dark font-display text-[#111812] dark:text-white">
      <BackHeader title="Salud y Bienestar" />
      <div className="px-6 pt-6 pb-2">
        <h2 className="text-[#111812] dark:text-white tracking-tight text-[32px] font-bold leading-tight text-left">
          Hola, {userName}
        </h2>
        <p className="text-[#618968] dark:text-gray-400 text-sm font-semibold mt-1">Rol: Familiar</p>
        <p className="text-[#4e5850] dark:text-gray-300 text-lg font-normal leading-normal pt-3">
          ¿Qué quieres hacer hoy?
        </p>
      </div>

      {/* (tu contenido de FamilyActivities queda igual) */}

      <BottomNav active="health" />
    </div>
  );
};

export const ActivitiesScreen: React.FC = () => {
  // ✅ IMPORTANTE: esto lo dejo así, porque vos ya usás FamilyStimulationScreen para caregiver
  // Peeero, si querés que el caregiver vea este UserActivities (pero con links de stats),
  // decime y lo adaptamos.
  const { profile } = useAuth();
  const role = profile?.role;

  if (isCaregiverRole(role)) return <FamilyStimulationScreen />;
  return <UserActivities />;
};

export const MemoryGamesScreen: React.FC = () => {
  const [difficulty, setDifficulty] = useState("Fácil");

  const { profile } = useAuth();
  const caregiver = isCaregiverRole(profile?.role);

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-200 min-h-screen pb-24 md:pb-6 md:pl-64">
      <BackHeader title="Juegos de Memoria" />

      {caregiver ? (
        <div className="px-4 pt-4">
          <CaregiverMetricsDashboard initialCategory="memory" />
        </div>
      ) : (
        <>
          {/* ✅ SELECCIÓN DE DIFICULTAD (Solo Paciente) */}
          <div className="px-4 pt-6">
            <p className="mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
              Selecciona la Dificultad
            </p>

            <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-2">
              {["Fácil", "Medio", "Difícil"].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                    difficulty === level
                      ? "bg-white dark:bg-[#2a3c2e] text-primary shadow-sm ring-1 ring-black/5"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* ✅ LISTADO DE JUEGOS (Solo Paciente) */}
          <main className="flex-1 flex flex-col justify-center items-center gap-5 px-4 pt-2 pb-8 overflow-y-auto">
            {difficulty === "Fácil" ? (
              <div className="w-full max-w-sm mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Link
                  to="/games/memory/match/easy"
                  className="flex flex-col rounded-2xl bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden transition-all active:scale-[0.98] hover:shadow-md group mb-4"
                >
                  <div className="h-32 bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 pattern-grid-lg text-primary" />
                    <span className="material-symbols-outlined text-6xl text-primary group-hover:scale-110 transition-transform duration-300">
                      grid_view
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        Encuentra los Pares
                      </h3>
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                        Nivel 1
                      </span>
                    </div>

                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
                      Voltea las cartas y encuentra las parejas iguales. Ideal para calentar la mente.
                    </p>

                    <div className="flex items-center gap-4 text-xs font-medium text-slate-400 dark:text-slate-500">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">timer</span>
                        ~30 seg
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">style</span>
                        8 Cartas
                      </span>
                    </div>

                    <div className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 px-4 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-colors group-hover:bg-primary-dark">
                      <span className="material-symbols-outlined">play_circle</span>
                      <span>Jugar Ahora</span>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/games/memory/sequence/easy"
                  className="flex flex-col rounded-2xl bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden transition-all active:scale-[0.98] hover:shadow-md group"
                >
                  <div className="h-32 bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 pattern-grid-lg text-primary" />
                    <span className="material-symbols-outlined text-6xl text-primary group-hover:scale-110 transition-transform duration-300">
                      reorder
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        Memoria de Secuencia
                      </h3>
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                        Nivel 1
                      </span>
                    </div>

                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
                      Observa la secuencia de colores y repítela. Entrena memoria y concentración.
                    </p>

                    <div className="flex items-center gap-4 text-xs font-medium text-slate-400 dark:text-slate-500">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">timer</span>
                        Variable
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">bolt</span>
                        Secuencia
                      </span>
                    </div>

                    <div className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 px-4 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-colors group-hover:bg-primary-dark">
                      <span className="material-symbols-outlined">play_circle</span>
                      <span>Jugar Ahora</span>
                    </div>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 gap-4 bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 mx-auto animate-in fade-in zoom-in-95 duration-300 max-w-sm w-full">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-4xl text-gray-400">
                    construction
                  </span>
                </div>

                <h3 className="text-xl font-bold text-center text-[#111812] dark:text-white">
                  Próximamente
                </h3>

                <p className="text-gray-500 dark:text-gray-400 text-center text-base">
                  Estamos creando nuevos juegos de memoria para ti.
                </p>

                <button
                  onClick={() => window.history.back()}
                  className="mt-2 text-primary font-bold hover:underline"
                >
                  Volver
                </button>
              </div>
            )}
          </main>
        </>
      )}

      <BottomNav active="activities" />
    </div>
  );
};

export const AttentionGamesScreen: React.FC = () => {
    const [difficulty, setDifficulty] = useState('Fácil');
    const { profile } = useAuth();
    const caregiver = isCaregiverRole(profile?.role);

    return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-200 min-h-screen pb-24 md:pb-6 md:pl-64">
            <BackHeader title="Juegos de Atención" />
            
            {caregiver ? (
              <div className="px-4 pt-4">
                <CaregiverMetricsDashboard initialCategory="attention" />
              </div>
            ) : (
              <>
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
                <main className="flex-1 flex flex-col justify-center items-center gap-5 px-4 pt-2 pb-8 overflow-y-auto">
                    {difficulty === 'Fácil' ? (
                        <div className="w-full max-w-sm mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                             <Link
                                to="/games/attention/easy"
                                className="flex flex-col rounded-2xl bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden transition-all active:scale-[0.98] hover:shadow-md group"
                            >
                                <div className="h-32 bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-10 pattern-grid-lg text-primary" />
                                    <span className="material-symbols-outlined text-6xl text-primary group-hover:scale-110 transition-transform duration-300">
                                        touch_app
                                    </span>
                                </div>

                                <div className="p-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                            Toca el Objetivo
                                        </h3>
                                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                            Nivel 1
                                        </span>
                                    </div>

                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
                                        Toca la estrella ⭐ lo más rápido posible. Entrena tu atención visual y reflejos.
                                    </p>

                                    <div className="flex items-center gap-4 text-xs font-medium text-slate-400 dark:text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">timer</span>
                                            10 Rondas
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">bolt</span>
                                            Fácil
                                        </span>
                                    </div>

                                    <div className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 px-4 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-colors group-hover:bg-primary-dark">
                                        <span className="material-symbols-outlined">play_circle</span>
                                        <span>Jugar Ahora</span>
                                    </div>
                                </div>
                            </Link>
                             <Link
                                to="/games/attention/different/easy"
                                className="flex flex-col rounded-2xl bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden transition-all active:scale-[0.98] hover:shadow-md group"
                            >
                                <div className="h-32 bg-green-50 dark:bg-green-900/20 flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-10 pattern-grid-lg text-primary" />
                                    <span className="material-symbols-outlined text-6xl text-primary group-hover:scale-110 transition-transform duration-300">
                                        category
                                    </span>
                                </div>

                                <div className="p-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                            Encuentra el Diferente
                                        </h3>
                                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                            Nivel 1
                                        </span>
                                    </div>

                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
                                        Encuentra el elemento que no encaja con los demás. Mejora tu percepción visual.
                                    </p>

                                    <div className="flex items-center gap-4 text-xs font-medium text-slate-400 dark:text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">timer</span>
                                            10 Rondas
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">bolt</span>
                                            Fácil
                                        </span>
                                    </div>

                                    <div className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 px-4 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-colors group-hover:bg-primary-dark">
                                        <span className="material-symbols-outlined">play_circle</span>
                                        <span>Jugar Ahora</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-8 gap-4 bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 mx-auto animate-in fade-in zoom-in-95 duration-300 max-w-sm w-full">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-2">
                                <span className="material-symbols-outlined text-4xl text-gray-400">psychology</span>
                            </div>
                            <h3 className="text-xl font-bold text-center text-[#111812] dark:text-white">Próximamente</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-center text-base">
                                Estamos diseñando juegos de atención para otros niveles.
                            </p>
                            <button onClick={() => window.history.back()} className="mt-2 text-primary font-bold hover:underline">
                                Volver
                            </button>
                        </div>
                    )}
                </main>
              </>
            )}
            <BottomNav active="activities" />
    </div>
    );
};

export const CalcGamesScreen: React.FC = () => {
    const [difficulty, setDifficulty] = useState('Fácil');
    const { profile } = useAuth();
    const caregiver = isCaregiverRole(profile?.role);

    return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-200 min-h-screen pb-24 md:pb-6 md:pl-64">
            <BackHeader title="Juegos de Cálculo" />

            {caregiver ? (
              <div className="px-4 pt-4">
                <CaregiverMetricsDashboard initialCategory="calculation" />
              </div>
            ) : (
              <>
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
                <main className="flex-1 flex flex-col justify-center items-center gap-5 px-4 pt-2 pb-8 overflow-y-auto">
                    {difficulty === 'Fácil' ? (
                        <div className="w-full max-w-sm mx-auto flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Link
                                to="/games/calculation/easy"
                                className="flex flex-col rounded-2xl bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden transition-all active:scale-[0.98] hover:shadow-md group"
                            >
                                <div className="h-32 bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-10 pattern-grid-lg text-primary" />
                                    <span className="material-symbols-outlined text-6xl text-primary group-hover:scale-110 transition-transform duration-300">
                                        calculate
                                    </span>
                                </div>

                                <div className="p-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                            Suma y Resta Fácil
                                        </h3>
                                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                            Nivel 1
                                        </span>
                                    </div>

                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
                                        Ejercicios simples de suma y resta con números pequeños. Ideal para agilidad mental.
                                    </p>

                                    <div className="flex items-center gap-4 text-xs font-medium text-slate-400 dark:text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">timer</span>
                                            10 Preguntas
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">bolt</span>
                                            Fácil
                                        </span>
                                    </div>

                                    <div className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 px-4 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-colors group-hover:bg-primary-dark">
                                        <span className="material-symbols-outlined">play_circle</span>
                                        <span>Jugar Ahora</span>
                                    </div>
                                </div>
                            </Link>

                            <Link
                                to="/games/calculation/sequence/easy"
                                className="flex flex-col rounded-2xl bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden transition-all active:scale-[0.98] hover:shadow-md group"
                            >
                                <div className="h-32 bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-10 pattern-grid-lg text-primary" />
                                    <span className="material-symbols-outlined text-6xl text-primary group-hover:scale-110 transition-transform duration-300">
                                        format_list_numbered
                                    </span>
                                </div>

                                <div className="p-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                            ¿Qué número falta?
                                        </h3>
                                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                            Nivel 1
                                        </span>
                                    </div>

                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
                                        Completa la secuencia numérica y elige el número faltante. Entrena tu lógica numérica.
                                    </p>

                                    <div className="flex items-center gap-4 text-xs font-medium text-slate-400 dark:text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">timer</span>
                                            10 Preguntas
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">bolt</span>
                                            Fácil
                                        </span>
                                    </div>

                                    <div className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 px-4 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-colors group-hover:bg-primary-dark">
                                        <span className="material-symbols-outlined">play_circle</span>
                                        <span>Jugar Ahora</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-8 gap-4 bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 mx-auto animate-in fade-in zoom-in-95 duration-300 max-w-sm w-full">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-2">
                                <span className="material-symbols-outlined text-4xl text-gray-400">calculate</span>
                            </div>
                            <h3 className="text-xl font-bold text-center text-[#111812] dark:text-white">Próximamente</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-center text-base">
                                Estamos preparando ejercicios de cálculo para otros niveles.
                            </p>
                            <button onClick={() => window.history.back()} className="mt-2 text-primary font-bold hover:underline">
                                Volver
                            </button>
                        </div>
                    )}
                </main>
              </>
            )}
            <BottomNav active="activities" />
    </div>
    );
};

export const StoriesScreen: React.FC = () => {
    return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-200 min-h-screen pb-24 md:pb-6 md:pl-64">
        <BackHeader title="Mi Historia" />
        <main className="flex-1 flex flex-col justify-center items-center gap-5 px-4 pt-2 pb-8 overflow-y-auto">
             <div className="flex flex-col items-center justify-center p-8 gap-4 bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 mx-auto animate-in fade-in zoom-in-95 duration-300 max-w-sm w-full">
                <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-2">
                    <span className="material-symbols-outlined text-4xl text-amber-600 dark:text-amber-400">photo_album</span>
                </div>
                <h3 className="text-xl font-bold text-center text-[#111812] dark:text-white">No hay ningún álbum creado</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center text-sm">
                    Crea un álbum de fotos para revivir momentos especiales.
                </p>
                <button className="mt-4 w-full flex items-center justify-center gap-2 rounded-full bg-primary py-3 px-6 text-base font-bold text-white shadow-lg shadow-primary/20 transition-transform active:scale-95 hover:bg-primary-dark">
                    <span className="material-symbols-outlined">add_circle</span>
                    <span>Crear un álbum</span>
                </button>
            </div>
        </main>
        <BottomNav />
    </div>
    );
};
