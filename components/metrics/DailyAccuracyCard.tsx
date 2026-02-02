import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDailyAccuracy } from '../../hooks/metrics/useDailyAccuracy';

export const DailyAccuracyCard: React.FC = () => {
    const { accuracyData, loading, error } = useDailyAccuracy();

    const formatData = useMemo(() => 
        accuracyData.map(item => ({
            ...item,
            name: new Date(item.day).toLocaleDateString('es-ES', { weekday: 'short' })
        }))
    , [accuracyData]);

    if (error) return null;

    return (
        <div className="flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 shadow-sm animate-in fade-in duration-500">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                        <span className="material-symbols-outlined">analytics</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-200 text-sm font-bold leading-normal">Precisión Cognitiva</p>
                </div>
                <p className="text-slate-500 text-xs font-medium ml-12">Aciertos vs Errores</p>
            </div>

            <div className="h-56 w-full mt-2">
                {loading ? (
                    <div className="w-full h-full bg-gray-50 dark:bg-gray-800/50 animate-pulse rounded-lg flex items-center justify-center">
                        <p className="text-gray-400 text-xs font-bold">Analizando precisión...</p>
                    </div>
                ) : accuracyData.length === 0 ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <span className="material-symbols-outlined text-4xl opacity-20">show_chart</span>
                        <p className="text-xs font-bold mt-2">Sin datos de precisión aún</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={formatData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
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
                            />
                            <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 700, paddingTop: '10px' }} />
                            <Line 
                                type="monotone" 
                                dataKey="total_hits" 
                                name="Aciertos" 
                                stroke="#13ec37" 
                                strokeWidth={3} 
                                dot={{ fill: '#13ec37', r: 4 }} 
                                activeDot={{ r: 6 }} 
                            />
                            <Line 
                                type="monotone" 
                                dataKey="total_errors" 
                                name="Errores" 
                                stroke="#ef4444" 
                                strokeWidth={2} 
                                strokeDasharray="5 5" 
                                dot={{ fill: '#ef4444', r: 3 }} 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};
