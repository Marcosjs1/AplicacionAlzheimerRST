import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PreferencesContextType {
    fontSize: number;
    setFontSize: (size: number) => void;
    volume: number;
    setVolume: (vol: number) => void;
    playFeedbackSound: () => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Cargar de localStorage o usar valores por defecto
    const [fontSize, setFontSizeState] = useState(() => {
        const saved = localStorage.getItem('appFontSize');
        return saved ? parseInt(saved, 10) : 16;
    });

    const [volume, setVolumeState] = useState(() => {
        const saved = localStorage.getItem('appVolume');
        return saved ? parseInt(saved, 10) : 50;
    });

    // Efecto para aplicar el tamaño de letra al HTML root
    useEffect(() => {
        // Tailwind usa rem. 1rem = 16px por defecto.
        // Al cambiar el font-size del root (html), todo lo que use rem (padding, margin, text-xl, etc) escala.
        const percentage = (fontSize / 16) * 100;
        document.documentElement.style.fontSize = `${percentage}%`;
        localStorage.setItem('appFontSize', fontSize.toString());
    }, [fontSize]);

    // Efecto para guardar volumen
    useEffect(() => {
        localStorage.setItem('appVolume', volume.toString());
    }, [volume]);

    const setFontSize = (size: number) => {
        // Limitar entre 12px y 24px para evitar romper el diseño totalmente
        const newSize = Math.max(12, Math.min(24, size));
        setFontSizeState(newSize);
    };

    const setVolume = (vol: number) => {
        const newVol = Math.max(0, Math.min(100, vol));
        setVolumeState(newVol);
    };

    const playFeedbackSound = () => {
        // Reproducir un sonido corto para probar el volumen
        // Usamos un oscilador simple del navegador para no depender de archivos externos
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContext) {
                const ctx = new AudioContext();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                // Aplicar el volumen actual (escala logarítmica suave)
                gain.gain.value = volume / 100; 
                
                osc.frequency.value = 440; // Nota La (A4)
                osc.type = 'sine';
                
                osc.start();
                setTimeout(() => {
                    osc.stop();
                    ctx.close();
                }, 150); // Beep de 150ms
            }
        } catch (e) {
            console.error("Audio context error", e);
        }
    };

    return (
        <PreferencesContext.Provider value={{ fontSize, setFontSize, volume, setVolume, playFeedbackSound }}>
            {children}
        </PreferencesContext.Provider>
    );
};

export const usePreferences = () => {
    const context = useContext(PreferencesContext);
    if (!context) {
        throw new Error('usePreferences must be used within a PreferencesProvider');
    }
    return context;
};