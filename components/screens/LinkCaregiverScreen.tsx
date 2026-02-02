import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import './LinkingFlow.css';

interface LinkCaregiverScreenProps {
  onCodeSent: (email: string) => void;
}

const LinkCaregiverScreen: React.FC<LinkCaregiverScreenProps> = ({ onCodeSent }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("--- DEBUG CONFIG ---");
      // @ts-ignore
      console.log("Supabase URL:", supabase.supabaseUrl);
      // @ts-ignore
      console.log("Anon Key (first 10):", supabase.supabaseKey?.substring(0, 10));
      
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      
      console.log("SESSION ACCESS TOKEN:", token);

      if (!token) {
        throw new Error("No hay sesión activa");
      }

      const { data: funcData, error: funcError } = await supabase.functions.invoke('create-caregiver-invite', {
        body: { caregiverEmail: email.trim().toLowerCase() },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (funcError) throw funcError;
      if (funcData?.error) throw new Error(funcData.error);

      onCodeSent(email.trim());
    } catch (err: any) {
        console.log("FULL ERROR:", err);

        const msg =
            err?.context?.body?.error ||
            err?.message ||
            "Error desconocido";

        setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="linking-container">
      <div className="linking-card">
        <h1>Vincular Cuidador</h1>
        <p>Ingresa el email de la persona que te ayudará a monitorear tus avances.</p>
        
        <form onSubmit={handleSendCode}>
          <div className="input-group">
            <label htmlFor="email">Email del Cuidador</label>
            <input
              id="email"
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading || !email}
          >
            {loading ? 'Enviando...' : 'Enviar código de vinculación'}
          </button>
        </form>

        <div className="info-box">
          <p><strong>Nota:</strong> El cuidador debe haberse registrado previamente en la aplicación con el rol de "Cuidador".</p>
        </div>
      </div>
    </div>
  );
};

export default LinkCaregiverScreen;
