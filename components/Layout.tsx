import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface BottomNavProps {
    active: 'home' | 'activities' | 'health' | 'progress' | 'profile';
}

export const BottomNav: React.FC<BottomNavProps> = ({ active }) => {
    const getIconClass = (name: string) => active === name ? "fill-1 text-primary" : "text-gray-400";
    const getTextClass = (name: string) => active === name ? "text-primary font-bold" : "text-gray-400 font-medium";

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1a2e1d] border-t border-gray-200 dark:border-gray-800 pb-safe pt-2 px-2 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] h-[88px]">
            <div className="flex justify-around items-center h-full pb-2">
                <Link to="/home" className="flex flex-col items-center justify-center w-full h-full gap-1 pt-2">
                    <span className={`material-symbols-outlined text-[28px] ${getIconClass('home')}`}>home</span>
                    <span className={`text-xs ${getTextClass('home')}`}>Inicio</span>
                </Link>
                <Link to="/activities" className="flex flex-col items-center justify-center w-full h-full gap-1 pt-2">
                    <span className={`material-symbols-outlined text-[28px] ${getIconClass('activities')}`}>extension</span>
                    <span className={`text-xs ${getTextClass('activities')}`}>Juegos</span>
                </Link>
                <Link to="/health" className="flex flex-col items-center justify-center w-full h-full gap-1 pt-2">
                    <span className={`material-symbols-outlined text-[28px] ${getIconClass('health')}`}>cardiology</span>
                    <span className={`text-xs ${getTextClass('health')}`}>Salud</span>
                </Link>
                    <Link to="/progress" className="flex flex-col items-center justify-center w-full h-full gap-1 pt-2">
                    <span className={`material-symbols-outlined text-[28px] ${getIconClass('progress')}`}>bar_chart</span>
                    <span className={`text-xs ${getTextClass('progress')}`}>Progreso</span>
                </Link>
                <Link to="/profile" className="flex flex-col items-center justify-center w-full h-full gap-1 pt-2">
                    <span className={`material-symbols-outlined text-[28px] ${getIconClass('profile')}`}>person</span>
                    <span className={`text-xs ${getTextClass('profile')}`}>Perfil</span>
                </Link>
            </div>
        </nav>
    );
};

interface BackHeaderProps {
    title: string;
    onBack?: () => void;
}

export const BackHeader: React.FC<BackHeaderProps> = ({ title, onBack }) => {
    const navigate = useNavigate();
    
    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    return (
        <header className="sticky top-0 z-50 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md p-4 pb-2 justify-between border-b border-gray-200 dark:border-gray-800 transition-colors">
            <button onClick={handleBack} aria-label="Volver atrás" className="flex size-12 shrink-0 items-center justify-center rounded-full active:bg-slate-200 dark:active:bg-slate-800 transition-colors text-slate-900 dark:text-white cursor-pointer hover:bg-black/5 dark:hover:bg-white/10">
                <span className="material-symbols-outlined text-[28px]">arrow_back</span>
            </button>
            <h1 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
                {title}
            </h1>
        </header>
    );
};