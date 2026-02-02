import React from 'react';
import { useProfile } from '../../hooks/useProfile';
import { PatientMetricsDashboard } from '../metrics/dashboards/PatientMetricsDashboard';
import { CaregiverMetricsDashboard } from '../metrics/dashboards/CaregiverMetricsDashboard';
import { BackHeader, BottomNav } from '../Layout';
import { isCaregiverRole } from '../../utils/roleUtils';
import { useCaregiverLink } from '../../hooks/useCaregiverLink';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GameCategory } from '../../types';
import { supabase } from '../../services/supabaseClient';

export const ProgressScreen: React.FC = () => {
  const { profile, loading: profileLoading } = useProfile();
  const { isLinked, loading: linkLoading, patientId } = useCaregiverLink();
  
  const [patientName, setPatientName] = React.useState<string | null>(null);
  const [isExporting, setIsExporting] = React.useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ✅ categoría que viene por URL: /progress?category=memory
  const categoryParam = (searchParams.get("category") || "all").toLowerCase();

  const initialCategory: GameCategory = (
    categoryParam === "memory"
      ? "memory"
      : categoryParam === "attention"
      ? "attention"
      : categoryParam === "calculation"
      ? "calculation"
      : "all"
  ) as GameCategory;

  // Cargar nombre del paciente si es cuidador
  React.useEffect(() => {
    if (patientId) {
      supabase
        .from('profiles')
        .select('name')
        .eq('id', patientId)
        .single()
        .then(({ data }) => {
          if (data) setPatientName(data.name);
        });
    }
  }, [patientId]);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      
      const capture = async (id: string) => {
        const el = document.getElementById(id);
        if (!el) return null;
        try {
          const canvas = await html2canvas(el, {
            scale: 2,
            backgroundColor: profile?.role === 'patient' ? '#f8fafc' : '#ffffff',
            logging: false,
            useCORS: true
          });
          return canvas.toDataURL('image/png');
        } catch (err) {
          console.error(`Error capturing ${id}:`, err);
          return null;
        }
      };

      const charts = {
        accuracy: await capture('chart-accuracy'),
        completion: await capture('chart-completion'),
        weeklyTrend: await capture('card-weekly-trend')
      };

      const { data: { user }, error: userFetchError } = await supabase.auth.getUser();
      if (userFetchError || !user) throw new Error('No se pudo verificar el usuario o la sesión ha expirado');

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No hay sesión activa');

      console.log("DEBUG PDF Export:");
      console.log("- Token length:", session.access_token?.length);
      console.log("- Token prefix:", session.access_token?.substring(0, 10));
      console.log("- PatientId:", patientId);

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/export-progress-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
        },
        body: JSON.stringify({
          patientId,
          patientName: patientName || 'Paciente',
          category: initialCategory,
          charts
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error en el servidor (${response.status}): ${errorText}`);
      }
      
      const pdfBlob = await response.blob();

      // Descargar PDF
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-progreso-${patientName || 'paciente'}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (err) {
      console.error('Error exporting PDF:', err);
      alert('Hubo un error al generar el PDF. Por favor intenta de nuevo.');
    } finally {
      setIsExporting(false);
    }
  };

  const renderDashboard = () => {
    if (profileLoading || linkLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-slate-500 text-sm animate-pulse">Cargando...</p>
        </div>
      );
    }

    const role = profile?.role;

    if (isCaregiverRole(role)) {
      if (!isLinked || !patientId) {
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 mt-10 bg-white dark:bg-surface-dark rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="w-24 h-24 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-4xl text-primary font-bold">
                person_add_help
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              No hay paciente vinculado
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto text-lg leading-relaxed">
              Debes vincularte con tu familiar desde su aplicación para ver su progreso y estadísticas.
            </p>
            <button
              onClick={() => navigate('/profile')}
              className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary/30 transition-all active:scale-95 mt-4 flex items-center gap-2"
            >
              <span className="material-symbols-outlined">settings</span>
              Ir a Perfil
            </button>
          </div>
        );
      }

      // ✅ Usamos la pantalla de paciente pero con el ID real del paciente vinculado
      return <PatientMetricsDashboard initialCategory={initialCategory} patientId={patientId} />;
    }

    // ✅ paciente con filtro automático por query param
    return <PatientMetricsDashboard initialCategory={initialCategory} />;
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen text-slate-900 dark:text-slate-50 transition-colors duration-200 pb-24 md:pb-6 md:pl-64">
      <BackHeader title="Progreso Cognitivo" />

      <main className="px-5 pt-6 max-w-4xl mx-auto">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Estadísticas
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Seguimiento detallado de la salud cerebral
            </p>
          </div>

          {isCaregiverRole(profile?.role) && isLinked && (
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 ${
                isExporting 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 dark:shadow-none'
              }`}
            >
              <span className="material-symbols-outlined">
                {isExporting ? 'sync' : 'picture_as_pdf'}
              </span>
              <span>{isExporting ? 'Generando PDF...' : 'Exportar PDF'}</span>
            </button>
          )}
        </div>

        {renderDashboard()}
      </main>

      <BottomNav active="progress" />
    </div>
  );
};