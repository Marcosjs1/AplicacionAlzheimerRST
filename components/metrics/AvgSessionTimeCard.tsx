import React, { useMemo } from 'react';
import { useAvgSessionTime } from '../../hooks/metrics/useAvgSessionTime';

export const AvgSessionTimeCard: React.FC = () => {
    const { avgSeconds, loading, error } = useAvgSessionTime();
    
    const formattedTime = useMemo(() => {
        const m = Math.floor(avgSeconds / 60);
        const s = avgSeconds % 60;
        return `${m}m ${s}s`;
    }, [avgSeconds]);

    if (error) return null;

        return (
        <div className="flex items-center justify-between gap-3 rounded-xl p-5 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 shadow-sm animate-in fade-in duration-500">
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                    <span className="material-symbols-outlined">timer</span>
                </div>
                <div>
                    <p className="text-slate-700 dark:text-slate-200 text-sm font-bold leading-normal">
                        Tiempo Promedio
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-tighter">
                        Resistencia Cognitiva
                    </p>
                </div>
            </div>

            <div className="text-right">
                {loading ? (
                    <div className="h-8 w-16 bg-gray-100 dark:bg-gray-800 animate-pulse rounded ml-auto" />
                ) : (
                    <p className="tracking-tight text-3xl font-bold leading-tight text-slate-900 dark:text-white">
                        {formattedTime}
                    </p>
                )}
            </div>
        </div>
    );
};
