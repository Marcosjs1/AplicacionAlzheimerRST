import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
    data: any[];
    loading?: boolean;
}

export const CompletionChart: React.FC<Props> = ({ data, loading }) => {
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
                <span className="material-symbols-outlined text-primary text-xl">task_alt</span>
                Niveles Completados Diarios
            </h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis 
                            dataKey="day" 
                            fontSize={10}
                            tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                        />
                        <YAxis fontSize={10} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            cursor={{ fill: 'transparent' }}
                        />
                        <Bar dataKey="levels_completed" name="Completados" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill="#4338ca" />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
