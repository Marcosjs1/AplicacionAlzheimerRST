import React from 'react';
import { WeeklyTrend } from '../../../types';

interface Props {
    trend: WeeklyTrend | null;
    loading?: boolean;
    forCaregiver?: boolean;
}

export const WeeklyTrendCard: React.FC<Props> = ({ trend, loading, forCaregiver }) => {
    if (loading) return <div className="h-40 w-full bg-gray-50 animate-pulse rounded-xl" />;
    if (!trend) return (
        <div className="p-6 bg-white dark:bg-surface-dark border border-dashed border-gray-300 rounded-xl text-center">
            <p className="text-gray-400 text-sm">Sin datos suficientes para tendencia semanal.</p>
        </div>
    );

    const isPositive = (trend.percentage_change || 0) >= 0;
    const absChange = Math.abs(trend.percentage_change || 0);

    return (
        <div className="flex flex-col gap-4 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                    <p className="text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">Análisis Clínico</p>
                    <p className="tracking-tight text-2xl font-bold leading-tight">Tendencia Semanal</p>
                </div>
                
                <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${
                    isPositive 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                    <span className="material-symbols-outlined text-lg font-bold">
                        {isPositive ? 'trending_up' : 'trending_down'}
                    </span>
                    <p className="text-sm font-bold">{absChange}%</p>
                </div>
            </div>

            <div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {forCaregiver 
                        ? (isPositive 
                            ? "El paciente muestra una mejora en su desempeño esta semana. ¡Buen progreso!" 
                            : "Se observa una ligera disminución en el desempeño semanal.")
                        : (isPositive 
                            ? "¡Excelente trabajo! Has mejorado tu precisión respecto a la semana pasada." 
                            : "Sigue practicando, cada esfuerzo cuenta para mantener tu mente activa.")}
                </p>
            </div>
            
            <div className="mt-2 text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">info</span>
                Cálculo basado en precisión histórica
            </div>
        </div>
    );
};
