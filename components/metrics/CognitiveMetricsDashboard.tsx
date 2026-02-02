import React from 'react';
import { TotalLevelsCard } from './TotalLevelsCard';
import { DailyCompletionCard } from './DailyCompletionCard';
import { AvgSessionTimeCard } from './AvgSessionTimeCard';
import { DailyAccuracyCard } from './DailyAccuracyCard';
import { WeeklyTrendCard } from './WeeklyTrendCard';

export const CognitiveMetricsDashboard: React.FC = () => {
    return (
        <div className="flex flex-col gap-6 p-5 max-w-4xl mx-auto pb-24">
            <header className="mb-2">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">Mi Progreso</h2>
                <p className="text-slate-600 dark:text-slate-300 text-lg mt-1 font-medium">Análisis de actividad y desempeño cognitivo</p>
            </header>

            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TotalLevelsCard />
                <AvgSessionTimeCard />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-6">
                <DailyCompletionCard />
                <DailyAccuracyCard />
            </div>

            {/* Trend & Analysis */}
            <div className="grid grid-cols-1 gap-6">
                <WeeklyTrendCard />
            </div>

            <footer className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                    Seguimiento Clínico Automatizado
                </p>
                <p className="text-slate-400 text-[10px] mt-2 italic px-8">
                    Estos datos son procesados directamente de las sesiones de juego para proporcionar un resumen objetivo del estado cognitivo.
                </p>
            </footer>
        </div>
    );
};
