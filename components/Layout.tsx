import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/* ===========================
   BACK HEADER
=========================== */
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
      <button
        onClick={handleBack}
        aria-label="Volver atrás"
        className="flex size-12 shrink-0 items-center justify-center rounded-full active:bg-slate-200 dark:active:bg-slate-800 transition-colors text-slate-900 dark:text-white cursor-pointer hover:bg-black/5 dark:hover:bg-white/10"
      >
        <span className="material-symbols-outlined text-[28px]">arrow_back</span>
      </button>

      <h1 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
        {title}
      </h1>
    </header>
  );
};

/* ===========================
   NAV ITEM (shared)
=========================== */
type NavItemProps = {
  to: string;
  icon: string;
  label: string;
  end?: boolean;
};

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, end }) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex md:flex-row flex-col items-center justify-center md:justify-start w-full h-full md:h-12 md:px-4 gap-1 md:gap-4 md:rounded-xl transition-colors
         ${
           isActive
             ? "bg-primary/10 text-primary font-bold"
             : "text-gray-400 hover:bg-primary/5"
         }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`material-symbols-outlined text-[28px] ${
              isActive ? "fill-1 text-primary" : "text-gray-400"
            }`}
          >
            {icon}
          </span>

          <span
            className={`text-xs md:text-base ${
              isActive ? "text-primary font-bold" : "text-gray-400 font-medium"
            }`}
          >
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
};

/* ===========================
   DESKTOP SIDEBAR
=========================== */
export const DesktopSidebar: React.FC = () => {
  const { profile } = useAuth();
  const userName = profile?.name || "Usuario";

  return (
    <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-[#1a2e1d] border-r border-gray-200 dark:border-gray-800 flex-col z-50">
      <div className="p-6 pb-2">
        <div className="flex items-center gap-3 mb-8">
          <div className="size-10 rounded-full border-2 border-primary overflow-hidden bg-gray-100 flex items-center justify-center">
            <img
              src={
                profile?.avatar_url ||
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Grandma"
              }
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h2 className="text-base font-bold leading-tight text-[#111812] dark:text-white">
              RSTMindHealth
            </h2>
          </div>
        </div>

        <div className="mb-4 px-2">
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">
            Menú
          </p>

          <div className="flex flex-col gap-2">
            <NavItem to="/home" icon="home" label="Inicio" end />
            <NavItem to="/activities" icon="extension" label="Juegos" />
            <NavItem to="/health" icon="cardiology" label="Salud" />
            <NavItem to="/progress" icon="bar_chart" label="Progreso" />
            <NavItem to="/profile" icon="person" label="Perfil" />
          </div>
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50 dark:bg-white/5">
          <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {userName.charAt(0)}
          </div>

          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate dark:text-gray-200">
              {userName}
            </p>
            <p className="text-xs text-gray-500 truncate">En línea</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

/* ===========================
   MOBILE BOTTOM NAV
=========================== */
export const MobileBottomNav: React.FC = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1a2e1d] border-t border-gray-200 dark:border-gray-800 pb-safe pt-2 px-2 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] h-[88px]">
      <div className="flex justify-around items-center h-full pb-2">
        <NavItem to="/home" icon="home" label="Inicio" end />
        <NavItem to="/activities" icon="extension" label="Juegos" />
        <NavItem to="/health" icon="cardiology" label="Salud" />
        <NavItem to="/progress" icon="bar_chart" label="Progreso" />
        <NavItem to="/profile" icon="person" label="Perfil" />
      </div>
    </nav>
  );
};

/* ===========================
   RESPONSIVE NAV (wrapper)
=========================== */
export const ResponsiveNavigation: React.FC = () => {
  return (
    <>
      <DesktopSidebar />
      <MobileBottomNav />
    </>
  );
};

/* ===========================
   BottomNav (alias)
=========================== */
export const BottomNav: React.FC = () => {
  return <ResponsiveNavigation />;
};