import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Double check both session and user to be safe
  if (!session || !session.user) {
    // Redirigir al login pero guardando la ubicación actual para volver después si es necesario
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
