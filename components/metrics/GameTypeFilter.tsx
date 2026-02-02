import React from 'react';
import { GameCategory } from '../../types';

interface Props {
    selected: GameCategory;
    onSelect: (category: GameCategory) => void;
}

export const GameTypeFilter: React.FC<Props> = ({ selected, onSelect }) => {
    const categories: { id: GameCategory; label: string; icon: string }[] = [
        { id: 'all', label: 'Todos', icon: 'grid_view' },
        { id: 'memory', label: 'Memoria', icon: 'psychology' },
        { id: 'attention', label: 'Atención', icon: 'visibility' },
        { id: 'calculation', label: 'Cálculo', icon: 'calculate' },
    ];

    return (
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => onSelect(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm font-bold ${
                        selected === cat.id
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-400 border border-gray-200 dark:border-gray-700'
                    }`}
                >
                    <span className="material-symbols-outlined text-lg">{cat.icon}</span>
                    {cat.label}
                </button>
            ))}
        </div>
    );
};
