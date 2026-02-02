import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import './LinkingFlow.css';

interface ConfirmCaregiverCodeScreenProps {
  email: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const ConfirmCaregiverCodeScreen: React.FC<ConfirmCaregiverCodeScreenProps> = ({ email, onSuccess, onCancel }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResendCode = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: funcError } = await supabase.functions.invoke('create-caregiver-invite', {
        body: { caregiverEmail: email.trim().toLowerCase() },
      });
      if (funcError) throw funcError;
      if (data?.error) throw new Error(data.error);
      alert('Código reenviado con éxito');
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

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('El código debe tener 6 dígitos');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: funcError } = await supabase.functions.invoke('confirm-caregiver-invite', {
        body: { code },
      });

      if (funcError) throw funcError;
      if (data?.error) throw new Error(data.error);

      onSuccess();
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
        <h1>Confirmar Código</h1>
        <p>Hemos enviado un código de 6 dígitos al correo: <strong>{email}</strong></p>
        <p className="subtext">Pídele a tu cuidador que te dicte el código.</p>
        
        <form onSubmit={handleConfirm}>
          <div className="input-group">
            <label htmlFor="code">Código de 6 dígitos</label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              required
              disabled={loading}
              className="code-input"
            />
          </div>
          
          <div className="flex justify-end mb-4">
            <button 
              type="button" 
              className="text-primary text-sm font-bold hover:underline disabled:opacity-50"
              onClick={handleResendCode}
              disabled={loading}
            >
              ¿No recibiste el código? Reenviar
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading || code.length !== 6}
          >
            {loading ? 'Validando...' : 'Confirmar vinculación'}
          </button>

          <button 
            type="button" 
            className="btn-secondary" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConfirmCaregiverCodeScreen;
