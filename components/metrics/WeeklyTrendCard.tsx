import React from 'react';
import { useWeeklyTrend } from '../../hooks/metrics/useWeeklyTrend';

export const WeeklyTrendCard: React.FC = () => {
    const { trend, loading, error } = useWeeklyTrend();

    if (error) return null;

    const isPositive = trend && (trend.percentage_change || 0) >= 0;
    const absChange = Math.abs(trend?.percentage_change || 0);

    return (
        <div className="flex flex-col gap-4 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 p-6 shadow-sm animate-in fade-in duration-500">
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                    <p className="text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">Desempeño Clínico</p>
                    <p className="tracking-tight text-2xl font-bold leading-tight truncate">Tendencia Semanal</p>
                </div>
                
                {!loading && trend && (
                    <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${
                        isPositive 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                        <span className="material-symbols-outlined text-lg font-bold">
                            {isPositive ? 'trending_up' : 'trending_down'}
                        </span>
                        <p className="text-sm font-bold leading-normal">{absChange}%</p>
                    </div>
                )}
            </div>

            <div className="pt-2">
                {loading ? (
                    <div className="h-6 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded"></div>
                ) : !trend ? (
                    <p className="text-gray-400 text-sm italic">Sin datos suficientes para calcular tendencia.</p>
                ) : (
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                        {isPositive 
                            ? "Tu familiar muestra una mejora en su desempeño esta semana. ¡Sigan así!" 
                            : "Se observa una ligera disminución en el desempeño semanal. Considere aumentar el apoyo."}
                    </p>
                )}
            </div>
            
            <div className="mt-2 text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">info</span>
                Basado en precisión (aciertos - errores)
            </div>
        </div>
    );
};
