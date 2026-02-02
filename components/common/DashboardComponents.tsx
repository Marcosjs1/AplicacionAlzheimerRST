import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BottomNav } from '../Layout';

// --- Assets ---
export const DASHBOARD_IMAGES = {
    blue: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPncD26onEVCbcijPBJyGAt9jO1xLvlW8yq3wRbNPHdze-MPxwDUv3Qz1EOnhZ7XoNWmdtoxAnb6zwDdtQcIryJOaKGYuUuan5N7m9ymFqWx-XxdozvIdjvQy67cgdkR4LDO2kgpgIOHTtbW2MCCLsWNMJ0i84Me3uM6LvqlNNsAR2DAMgqcuQvKQ_q0-ewoTbIWv66AJHEqBlqK18XfcHaQF89zuvWfYVPhDoQI4tx6atl43JDwpfnhyVWE92ThdX-wdpCrE08fs",
    green: "https://lh3.googleusercontent.com/aida-public/AB6AXuC020LQqrikOIbKuBqnr_-QCs9G627uIocUAAjo2F7jxwytuJlwgoeclQapnCz25HReCZ93MzrSrowxmhbj5Ksq8qcj7eGZXtoHieAznDeW_nuPeR8IUYJF-mde_v1eMW-q4WaAodc06Qvps_OK9d2jIOTdlkRnoGhNONT6G8O9UxwFawwlFzT0uSmBHOGxlzKjgoOANdoCgQwmM4bUo8Il5pM2glTst4n6VbX1pTCIXmv0ti_DI6FD8FghwP3wAyOuQ6d3iegnRUU",
    purple: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjVi8VPEU5sKyPBSulOWjAnDVxSUwok_1zeKStM8GaRhU9bRjA2iozLhvFM73SAjv4bmMhC5GYy3OJ8N9qzX0wmyA_aIrBuaYYxRU4_dCdACSznxML5Cce0ooPVyAgVjA_wHqtFaN4JPuhXS08XZ162pn9VCKGaBC_Fx022MNlMHm1Fw9tCc3reZCDuCRIkmai82UNf7HPnvvHAroxWu8VMP__asXQEh2Hz1GA1-Kfh5lcAEURD9wl0KUe11EXZ5xRT0K1ElHcomE",
    amber: "https://lh3.googleusercontent.com/aida-public/AB6AXuCtEVRGbwJAakUKFPUYr5l1GGVnjZgMfiyWRviRg2If5omvcjIOA_pHyuX8PqNwKGLANuR_L-jj61R7qm6VTYbvwQH9R5DxYXG_Q8m_Y8bepf5DoFzmqxbJ3fyCuMTLvTPyYlgg7po9wbsq0jJzNwTdJ-16VguipBniklNmmdfeSEltuOldZDBnLO_ZnYZwXw-2qoZuuP9u9FMZ1clC6IcXS3kqlxdJJ1tPcZD6X9Usjd_R3LU9o-60-VAaCqunch5DXiC95wDQGhY",
};

// --- Layout ---
interface DashboardLayoutProps {
    children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden pb-24 md:pb-6 md:pl-64 bg-background-light dark:bg-background-dark font-display text-[#111812] dark:text-white transition-colors duration-200">
            {children}
            <BottomNav />
        </div>
    );
};

// --- Header ---
interface DashboardHeaderProps {
    userName: string;
    role?: string;
    subtitle: string;
    avatarUrl?: string;
    avatarBorderColor?: string; // e.g. 'border-primary' or 'border-[#13ec37]'
    onSettingsClick: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
    userName, 
    role, 
    subtitle, 
    avatarUrl, 
    avatarBorderColor = "border-primary",
    onSettingsClick 
}) => {
    return (
        <header className="flex flex-col bg-white dark:bg-[#1a2e1d] shadow-sm z-10 sticky top-0">
            <div className="flex items-center justify-between p-4 pb-2">
                <div className="flex items-center gap-3">
                    <div 
                        className={`bg-center bg-no-repeat bg-cover rounded-full size-12 border-2 ${avatarBorderColor}`} 
                        style={{backgroundImage: `url('${avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=Buddy"}')`}}
                    ></div>
                    <div>
                        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-[#111812] dark:text-white">FullSaludAlzheimer</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-300 font-medium">Versión Accesible</p>
                    </div>
                </div>
                <button onClick={onSettingsClick} aria-label="Ajustes" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-[#111812] dark:text-white">
                    <span className="material-symbols-outlined text-3xl">settings</span>
                </button>
            </div>
            <div className="px-4 pb-4 pt-2">
                <h1 className="text-[#111812] dark:text-white text-3xl font-bold leading-tight">Hola, {userName}</h1>
                {role && <p className="text-[#0ea826] dark:text-[#13ec37] text-lg font-bold mt-1">Rol: {role}</p>}
                <p className="text-gray-600 dark:text-gray-300 text-xl font-medium mt-2">{subtitle}</p>
            </div>
        </header>
    );
};

// --- Banner ---
interface DashboardBannerProps {
    to: string;
    title: string;
    subtitle: string;
    icon: string;
    // Styling props
    borderColorClass?: string;
    bgHoverClass?: string;
    iconBgClass?: string;
    iconColorClass?: string;
}

export const DashboardBanner: React.FC<DashboardBannerProps> = ({
    to,
    title,
    subtitle,
    icon,
    borderColorClass = "border-primary",
    bgHoverClass = "hover:bg-blue-50 dark:hover:bg-blue-900/20",
    iconBgClass = "bg-primary/10 dark:bg-primary/20",
    iconColorClass = "text-primary dark:text-primary"
}) => {
    return (
        <Link to={to} className={`w-full mb-6 p-4 rounded-2xl bg-white dark:bg-[#1e3322] border-2 ${borderColorClass} shadow-sm flex items-center justify-between ${bgHoverClass} active:scale-[0.98] transition-all duration-200 group`}>
            <div className="flex items-center gap-4">
                <div className={`${iconBgClass} p-3 rounded-xl ${iconColorClass}`}>
                    <span className="material-symbols-outlined text-3xl">{icon}</span>
                </div>
                <div className="text-left">
                    <p className="text-lg font-bold leading-tight text-[#111812] dark:text-white">{title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
                </div>
            </div>
            <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 group-hover:text-primary transition-colors">arrow_forward_ios</span>
        </Link>
    );
};

// --- Card ---
type ColorType = 'blue' | 'green' | 'purple' | 'amber';

interface DashboardCardProps {
    to: string;
    title: string;
    subtitle: string;
    icon: string;
    color: ColorType;
    backgroundImage?: string;
}

const COLOR_STYLES = {
    blue: {
        wrapper: "hover:border-blue-500",
        bgIcon: "bg-blue-100 dark:bg-blue-900/30",
        icon: "text-blue-600 dark:text-blue-400"
    },
    green: {
        wrapper: "hover:border-green-500",
        bgIcon: "bg-green-100 dark:bg-green-900/30",
        icon: "text-green-600 dark:text-green-400"
    },
    purple: {
        wrapper: "hover:border-purple-500",
        bgIcon: "bg-purple-100 dark:bg-purple-900/30",
        icon: "text-purple-600 dark:text-purple-400"
    },
    amber: {
        wrapper: "hover:border-amber-500",
        bgIcon: "bg-amber-100 dark:bg-amber-900/30",
        icon: "text-amber-600 dark:text-amber-400"
    }
};

export const DashboardCard: React.FC<DashboardCardProps> = ({
    to,
    title,
    subtitle,
    icon,
    color,
    backgroundImage
}) => {
    const styles = COLOR_STYLES[color];

    return (
        <Link to={to} className={`group flex flex-col items-center p-4 bg-white dark:bg-[#1e3322] rounded-2xl shadow-sm border-2 border-transparent ${styles.wrapper} active:scale-95 transition-all duration-200 h-full`}>
            <div className={`w-full aspect-[4/3] ${styles.bgIcon} rounded-xl mb-3 flex items-center justify-center relative overflow-hidden`}>
                {backgroundImage && (
                    <div className="absolute inset-0 opacity-20 bg-center bg-cover" style={{backgroundImage: `url('${backgroundImage}')`}}></div>
                )}
                <span className={`material-symbols-outlined text-6xl ${styles.icon} relative z-10`}>{icon}</span>
            </div>
            <div className="text-center">
                <p className="text-lg font-bold leading-tight text-[#111812] dark:text-white">{title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">{subtitle}</p>
            </div>
        </Link>
    );
};

// --- Grid Container ---
export const DashboardGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
            {children}
        </div>
    );
};
