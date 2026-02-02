import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Session, User } from '@supabase/supabase-js';

interface UserProfile {
    id: string;
    name: string | null;
    role: string | null;
    avatar_url: string | null;
    email: string | null;
    phone: string | null;
    birth_date: string | null;
}

interface AuthContextType {
    session: Session | null;
    user: User | null;
    profile: UserProfile | null;
    signOut: () => Promise<void>;
    loading: boolean;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    profile: null,
    signOut: async () => {},
    loading: true,
    refreshProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (currentUser: User) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', currentUser.id)
                .maybeSingle(); // Use maybeSingle to avoid 406 error if row missing
            
            if (error) {
                console.warn('⚠️ AuthContext: Error fetching profile from DB:', error.message);
                // Fallback to metadata
                const meta = currentUser.user_metadata;
                setProfile({
                    id: currentUser.id,
                    name: meta.name || null,
                    role: meta.role || null,
                    avatar_url: meta.avatar_url || null,
                    email: currentUser.email || null,
                    phone: meta.phone || null,
                    birth_date: meta.birth_date || null,
                });
            } else if (!data) {
                // No profile row in DB yet, fallback to metadata
                console.log('ℹ️ AuthContext: No profile in DB, using metadata');
                const meta = currentUser.user_metadata;
                setProfile({
                    id: currentUser.id,
                    name: meta.name || null,
                    role: meta.role || null,
                    avatar_url: meta.avatar_url || null,
                    email: currentUser.email || null,
                    phone: meta.phone || null,
                    birth_date: meta.birth_date || null,
                });
            } else {
                setProfile(data);
                // Sync legacy localStorage for components not yet updated
                if (data.name) localStorage.setItem('userName', data.name);
                if (data.role) localStorage.setItem('userRole', data.role);
                if (data.avatar_url) localStorage.setItem('userAvatar', data.avatar_url);
            }
        } catch (err) {
            console.error('❌ AuthContext: Exception fetching profile:', err);
             // Fallback on exception too
             const meta = currentUser.user_metadata;
             setProfile({
                 id: currentUser.id,
                 name: meta.name || null,
                 role: meta.role || null,
                 avatar_url: meta.avatar_url || null,
                 email: currentUser.email || null,
                 phone: meta.phone || null,
                 birth_date: meta.birth_date || null,
             });
        }
    };

    useEffect(() => {
        console.log('🔄 AuthContext: Iniciando verificación de sesión...');
        
        supabase.auth.getSession().then(({ data: { session }, error }) => {
            if (error) {
                console.error('❌ AuthContext: Error al obtener sesión inicial:', error.message);
            } else {
                setSession(session);
                setUser(session?.user ?? null);
                if (session?.user) {
                    fetchProfile(session.user);
                }
            }
        }).catch(err => {
            console.error('❌ AuthContext: Excepción crítica al obtener sesión:', err);
        }).finally(() => {
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log(`🔔 AuthContext: Cambio de estado auth (${_event})`);
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user) {
                fetchProfile(session.user);
            } else if (_event === 'SIGNED_OUT') {
                setProfile(null);
                // Clear all auth related local storage
                localStorage.removeItem('userName');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userBirthDate');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userAvatar');
                // Keep preferences like fontSize/volume
            }
            
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        // State updates happen in onAuthStateChange
    };

    const refreshProfile = async () => {
        if (user) {
            await fetchProfile(user);
        }
    };

    return (
        <AuthContext.Provider value={{ session, user, profile, signOut, loading, refreshProfile }}>
            {loading ? (
                <div className="flex items-center justify-center min-h-screen bg-[#f8fafc] dark:bg-[#111812]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
