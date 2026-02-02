import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
    data: any[];
    loading?: boolean;
}

export const AccuracyChart: React.FC<Props> = ({ data, loading }) => {
    if (loading) return <div className="h-64 w-full bg-gray-50 animate-pulse rounded-xl" />;
    if (!loading && (!data || data.length === 0)) {
        return (
            <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 p-4 rounded-2xl shadow-sm">
                <p className="text-gray-400 text-sm font-bold text-center py-10">
                    No hay datos para mostrar aún.
                </p>
            </div>
  );
}
    return (
        <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 p-4 rounded-2xl shadow-sm">
            <h3 className="text-slate-800 dark:text-white font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">insights</span>
                Precisión (Aciertos vs Errores)
            </h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorHits" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorErrors" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis 
                            dataKey="day" 
                            fontSize={10} 
                            tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                        />
                        <YAxis fontSize={10} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="total_hits" 
                            name="Aciertos"
                            stroke="#10b981" 
                            fillOpacity={1} 
                            fill="url(#colorHits)" 
                            strokeWidth={3}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="total_errors" 
                            name="Errores"
                            stroke="#ef4444" 
                            fillOpacity={1} 
                            fill="url(#colorErrors)" 
                            strokeWidth={3}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
