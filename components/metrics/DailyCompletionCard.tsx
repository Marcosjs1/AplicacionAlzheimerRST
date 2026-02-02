import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useDailyCompletion } from '../../hooks/metrics/useDailyCompletion';

export const DailyCompletionCard: React.FC = () => {
    const { dailyData, loading, error } = useDailyCompletion();

    // Format dates for cognitive ease (E.g. "Lun 12")
    const formatData = dailyData.map(item => ({
        ...item,
        name: new Date(item.day).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })
    }));

    if (error) return null;

    return (
        <div className="flex flex-col gap-4 rounded-xl p-5 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 shadow-sm animate-in fade-in duration-500">
            <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                    <span className="material-symbols-outlined">calendar_month</span>
                </div>
                <p className="text-slate-700 dark:text-slate-200 text-sm font-bold leading-normal">Actividad Diaria</p>
            </div>
            
            <div className="h-48 w-full mt-2">
                {loading ? (
                    <div className="w-full h-full bg-gray-50 dark:bg-gray-800/50 animate-pulse rounded-lg flex items-center justify-center">
                        <p className="text-gray-400 text-xs font-bold">Cargando datos...</p>
                    </div>
                ) : dailyData.length === 0 ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <span className="material-symbols-outlined text-4xl opacity-20">bar_chart</span>
                        <p className="text-xs font-bold mt-2">Sin actividad esta semana</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={formatData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} 
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                            />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                cursor={{ fill: 'transparent' }}
                            />
                            <Bar dataKey="levels_completed" radius={[4, 4, 0, 0]}>
                                {formatData.map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === formatData.length - 1 ? '#13ec37' : '#94a3b8'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
             <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest text-center mt-1">Niveles por día (Últimos 7 días)</p>
        </div>
    );
};
