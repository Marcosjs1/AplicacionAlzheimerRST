import React, { useEffect, useState } from 'react';
import { GameTypeFilter } from '../GameTypeFilter';
import { MetricCard } from '../cards/MetricCard';
import { AccuracyChart } from '../charts/AccuracyChart';
import { CompletionChart } from '../charts/CompletionChart';
import { WeeklyTrendCard } from '../cards/WeeklyTrendCard';
import { GameCategory } from '../../../types';

import { useCaregiverDailyAccuracy } from '../../../hooks/metrics/caregiver/useCaregiverDailyAccuracy';
import { useCaregiverDailyCompletion } from '../../../hooks/metrics/caregiver/useCaregiverDailyCompletion';
import { useCaregiverTotalLevels } from '../../../hooks/metrics/caregiver/useCaregiverTotalLevels';
import { useCaregiverAvgSessionTime } from '../../../hooks/metrics/caregiver/useCaregiverAvgSessionTime';
import { useCaregiverWeeklyTrend } from '../../../hooks/metrics/caregiver/useCaregiverWeeklyTrend';
import { useCaregiverGameStats } from '../../../hooks/metrics/caregiver/useCaregiverGameStats';

type Props = {
  initialCategory?: GameCategory;
};

export const CaregiverMetricsDashboard: React.FC<Props> = ({ initialCategory = "all" }) => {
  const [category, setCategory] = useState<GameCategory>(initialCategory);

  // ✅ si cambia el initialCategory porque cambió la URL
  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  const accuracy = useCaregiverDailyAccuracy();
  const completion = useCaregiverDailyCompletion();
  const totalLevels = useCaregiverTotalLevels();
  const avgTime = useCaregiverAvgSessionTime();
  const trend = useCaregiverWeeklyTrend();

  const gameStats = useCaregiverGameStats(category);

  const chartAccuracyData = category === 'all' ? accuracy.data : gameStats.accuracyData;
  const chartCompletionData = category === 'all' ? completion.data : gameStats.completionData;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <span className="material-symbols-outlined">family_history</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Seguimiento del Paciente
            </h2>
            <p className="text-xs text-slate-500">Datos actualizados en tiempo real</p>
          </div>
        </div>

        <GameTypeFilter selected={category} onSelect={setCategory} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricCard
          title="Niveles Totales"
          subtitle="Progreso Acumulado"
          value={totalLevels.data?.total_completed || 0}
          icon="military_tech"
          colorClass="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
          loading={totalLevels.loading}
        />

        <MetricCard
          title="Sesión Promedio"
          subtitle="Minutos Activos"
          value={`${Math.round((avgTime.data?.avg_time_seconds || 0) / 60)}m`}
          icon="history_toggle_off"
          colorClass="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
          loading={avgTime.loading}
        />
      </div>

      <WeeklyTrendCard trend={trend.data} loading={trend.loading} forCaregiver />

      <AccuracyChart data={chartAccuracyData} loading={accuracy.loading || gameStats.loading} />
      <CompletionChart data={chartCompletionData} loading={completion.loading || gameStats.loading} />

      <div className="pb-8"></div>
    </div>
  );
};