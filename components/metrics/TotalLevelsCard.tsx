import React from 'react';
import { useTotalLevels } from '../../hooks/metrics/useTotalLevels';

export const TotalLevelsCard: React.FC = () => {
    const { totalCompleted, loading, error } = useTotalLevels();

    if (error) return null;

    return (
        <div className="flex flex-col justify-between gap-3 rounded-xl p-5 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 shadow-sm animate-in fade-in duration-500">
            <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">
                    <span className="material-symbols-outlined">emoji_events</span>
                </div>
                <p className="text-slate-700 dark:text-slate-200 text-sm font-bold leading-normal">Niveles Totales</p>
            </div>
            <div>
                {loading ? (
                    <div className="h-10 w-20 bg-gray-100 dark:bg-gray-800 animate-pulse rounded"></div>
                ) : (
                    <p className="tracking-tight text-4xl font-bold leading-tight text-slate-900 dark:text-white">
                        {totalCompleted}
                    </p>
                )}
                <p className="text-slate-600 dark:text-slate-400 text-xs font-bold mt-1 uppercase tracking-wider">Superados</p>
            </div>
        </div>
    );
};
