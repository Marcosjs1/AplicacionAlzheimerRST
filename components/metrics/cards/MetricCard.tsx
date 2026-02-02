import React from 'react';

interface Props {
    title: string;
    subtitle: string;
    value: string | number;
    icon: string;
    colorClass: string;
    loading?: boolean;
}

export const MetricCard: React.FC<Props> = ({ title, subtitle, value, icon, colorClass, loading }) => {
    return (
        <div className="flex items-center justify-between gap-3 rounded-xl p-5 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 shadow-sm animate-in fade-in duration-500">
            <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${colorClass}`}>
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
                <div>
                    <p className="text-slate-700 dark:text-slate-200 text-sm font-bold leading-normal">
                        {title}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase tracking-tighter">
                        {subtitle}
                    </p>
                </div>
            </div>

            <div className="text-right">
                {loading ? (
                    <div className="h-8 w-16 bg-gray-100 dark:bg-gray-800 animate-pulse rounded ml-auto" />
                ) : (
                    <p className="tracking-tight text-2xl font-bold leading-tight text-slate-900 dark:text-white">
                        {value}
                    </p>
                )}
            </div>
        </div>
    );
};
