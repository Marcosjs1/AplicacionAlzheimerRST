import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
    DashboardLayout, 
    DashboardHeader, 
    DashboardBanner, 
    DashboardGrid, 
    DashboardCard, 
    DASHBOARD_IMAGES 
} from '../common/DashboardComponents';

const UserDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { profile } = useAuth();
    const userName = profile?.name || 'Usuario';

    return (
        <DashboardLayout>
            <DashboardHeader
                userName={userName}
                subtitle="¿Qué quieres hacer hoy?"
                avatarUrl={profile?.avatar_url}
                onSettingsClick={() => navigate('/profile')}
            />
            
            <main className="flex-1 px-4 pt-6 pb-4">
                <DashboardBanner
                    to="/ai-chat"
                    title="Hablar con IA"
                    subtitle="Tu asistente personal"
                    icon="mic"
                    borderColorClass="border-[#13ec37]" // Using the brand green color to match
                />

                <DashboardGrid>
                    <DashboardCard
                        to="/activities"
                        title="Estimulación"
                        subtitle="Juegos mentales"
                        icon="psychology"
                        color="blue"
                        backgroundImage={DASHBOARD_IMAGES.blue}
                    />
                    <DashboardCard
                        to="/health"
                        title="Salud Física"
                        subtitle="Ejercicios suaves"
                        icon="favorite"
                        color="green"
                        backgroundImage={DASHBOARD_IMAGES.green}
                    />
                    <DashboardCard
                        to="/support"
                        title="Soporte"
                        subtitle="Comunidad"
                        icon="diversity_1"
                        color="purple"
                        backgroundImage={DASHBOARD_IMAGES.purple}
                    />
                    <DashboardCard
                        to="/motivation"
                        title="Motivación"
                        subtitle="Mis logros"
                        icon="emoji_events"
                        color="amber"
                        backgroundImage={DASHBOARD_IMAGES.amber}
                    />
                </DashboardGrid>

                <div className="mt-8 mb-6">
                    <Link to="/safety" className="w-full flex items-center justify-center overflow-hidden rounded-2xl h-20 px-6 bg-red-100 dark:bg-red-900/40 text-red-900 dark:text-red-100 border-2 border-red-200 dark:border-red-800 shadow-md active:scale-[0.98] hover:bg-red-200 dark:hover:bg-red-900/60 transition-all">
                        <span className="material-symbols-outlined text-4xl mr-3">emergency_home</span>
                        <span className="text-xl font-bold tracking-[0.015em]">EMERGENCIA</span>
                    </Link>
                </div>
            </main>
        </DashboardLayout>
    );
};

const FamilyDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { profile } = useAuth();
    const userName = profile?.name || 'Familiar';
    const role = profile?.role || 'Familiar';

    return (
        <DashboardLayout>
            <DashboardHeader
                userName={userName}
                role={role}
                subtitle="¿Qué te gustaría revisar del progreso de tu familiar hoy?"
                avatarUrl={profile?.avatar_url}
                avatarBorderColor="border-[#13ec37]"
                onSettingsClick={() => navigate('/profile')}
            />

            <main className="flex-1 px-4 pt-6 pb-4">
                <DashboardBanner
                    to="/location"
                    title="Ver ubicación de mi familiar"
                    subtitle="Mapa y seguridad en tiempo real"
                    icon="location_on"
                    borderColorClass="border-blue-500 dark:border-blue-400"
                    bgHoverClass="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    iconBgClass="bg-blue-100 dark:bg-blue-900/40"
                    iconColorClass="text-blue-600 dark:text-blue-400"
                />

                <DashboardGrid>
                    <DashboardCard
                        to="/activities"
                        title="Estimulación Cognitiva"
                        subtitle="Juegos mentales"
                        icon="psychology"
                        color="blue"
                        backgroundImage={DASHBOARD_IMAGES.blue}
                    />
                    <DashboardCard
                        to="/health"
                        title="Salud Física"
                        subtitle="Ejercicios suaves"
                        icon="favorite"
                        color="green"
                        backgroundImage={DASHBOARD_IMAGES.green}
                    />
                    <DashboardCard
                        to="/emotional"
                        title="Soporte Emocional"
                        subtitle="Comunidad"
                        icon="diversity_1"
                        color="purple"
                        backgroundImage={DASHBOARD_IMAGES.purple}
                    />
                    <DashboardCard
                        to="/motivation"
                        title="Motivación"
                        subtitle="Mis logros"
                        icon="emoji_events"
                        color="amber"
                        backgroundImage={DASHBOARD_IMAGES.amber}
                    />
                    <DashboardCard
                        to="/safe-zone"
                        title="Zona Segura"
                        subtitle="Configurar zona"
                        icon="location_on"
                        color="blue"
                        backgroundImage={DASHBOARD_IMAGES.blue}
                    />
                </DashboardGrid>
            </main>
        </DashboardLayout>
    );
};

export const HomeScreen: React.FC = () => {
    const { profile } = useAuth();
    const role = profile?.role?.toLowerCase();
    
    if (role === 'caregiver' || role === 'familiar' || role === 'cuidador') {
        return <FamilyDashboard />;
    }
    return <UserDashboard />;
};