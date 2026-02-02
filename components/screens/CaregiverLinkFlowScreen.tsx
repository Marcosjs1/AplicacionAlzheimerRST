import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCaregiverLink } from '../../hooks/useCaregiverLink';
import LinkCaregiverScreen from './LinkCaregiverScreen';
import ConfirmCaregiverCodeScreen from './ConfirmCaregiverCodeScreen';
import { BackHeader, BottomNav } from '../Layout';
import './LinkingFlow.css';
import { isPatientRole } from '../../utils/roleUtils';

const CaregiverLinkFlowScreen: React.FC = () => {
    const navigate = useNavigate();
    const { profile } = useAuth();
    const { isLinked, caregiverEmail, loading: checkingLink, refresh } = useCaregiverLink();
    
    const [step, setStep] = useState<1 | 2>(1);
    const [email, setEmail] = useState('');

    // Role protection
    useEffect(() => {
        if (profile && !isPatientRole(profile.role)) {
            navigate("/home");
        }
    }, [profile, navigate]);

    if (checkingLink) {
        return (
            <div className="linking-flow-container flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (isLinked) {
        return (
            <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display">
                <BackHeader title="Vinculación" onBack={() => navigate('/profile')} />
                <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-4xl text-green-600 dark:text-green-400">check_circle</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Ya tienes un cuidador vinculado</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Tu progreso está siendo compartido con:<br/>
                        <span className="font-bold text-slate-900 dark:text-white">{caregiverEmail}</span>
                    </p>
                    <button 
                        onClick={() => navigate('/progress')}
                        className="w-full max-w-xs bg-primary text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all"
                    >
                        Ver mi progreso
                    </button>
                </main>
                <BottomNav/>
            </div>
        );
    }

    const handleCodeSent = (sentEmail: string) => {
        setEmail(sentEmail);
        setStep(2);
    };

    const handleSuccess = async () => {
        await refresh();
        navigate('/progress');
    };

    const handleCancel = () => {
        setStep(1);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display">
            <BackHeader 
                title={step === 1 ? "Vincular Cuidador" : "Confirmar Código"} 
                onBack={() => step === 2 ? setStep(1) : navigate('/profile')} 
            />
            
            <main className="flex-1 p-0">
                {step === 1 ? (
                    <LinkCaregiverScreen onCodeSent={handleCodeSent} />
                ) : (
                    <ConfirmCaregiverCodeScreen 
                        email={email} 
                        onSuccess={handleSuccess} 
                        onCancel={handleCancel} 
                    />
                )}
            </main>

            <BottomNav />
        </div>
    );
};

export default CaregiverLinkFlowScreen;
