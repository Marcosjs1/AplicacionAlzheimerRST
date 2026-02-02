import React, { useEffect, useState } from 'react';
import { GameTypeFilter } from '../GameTypeFilter';
import { MetricCard } from '../cards/MetricCard';
import { AccuracyChart } from '../charts/AccuracyChart';
import { CompletionChart } from '../charts/CompletionChart';
import { WeeklyTrendCard } from '../cards/WeeklyTrendCard';
import { GameCategory } from '../../../types';

import { usePatientDailyAccuracy } from '../../../hooks/metrics/patient/usePatientDailyAccuracy';
import { usePatientDailyCompletion } from '../../../hooks/metrics/patient/usePatientDailyCompletion';
import { usePatientTotalLevels } from '../../../hooks/metrics/patient/usePatientTotalLevels';
import { usePatientAvgSessionTime } from '../../../hooks/metrics/patient/usePatientAvgSessionTime';
import { usePatientWeeklyTrend } from '../../../hooks/metrics/patient/usePatientWeeklyTrend';
import { usePatientGameStats } from '../../../hooks/metrics/patient/usePatientGameStats';

type Props = {
  initialCategory?: GameCategory;
  patientId?: string; // 👈 Agregamos patientId opcional
};

export const PatientMetricsDashboard: React.FC<Props> = ({ initialCategory = "all", patientId }) => {
  const [category, setCategory] = useState<GameCategory>(initialCategory);

  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  const accuracy = usePatientDailyAccuracy(patientId);
  const completion = usePatientDailyCompletion(patientId);
  const totalLevels = usePatientTotalLevels(patientId);
  const avgTime = usePatientAvgSessionTime(patientId);
  const trend = usePatientWeeklyTrend(patientId);

  const gameStats = usePatientGameStats(category, patientId);

  const chartAccuracyData = category === 'all' ? accuracy.data : gameStats.accuracyData;
  const chartCompletionData = category === 'all' ? completion.data : gameStats.completionData;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Mi Progreso</h2>
        <GameTypeFilter selected={category} onSelect={setCategory} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricCard
          title="Niveles Ganados"
          subtitle="Sentido de Logro"
          value={totalLevels.data?.total_completed || 0}
          icon="workspace_premium"
          colorClass="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
          loading={totalLevels.loading}
        />

        <MetricCard
          title="Tiempo Promedio"
          subtitle="Resistencia Cognitiva"
          value={`${Math.round((avgTime.data?.avg_time_seconds || 0) / 60)}m`}
          icon="timer"
          colorClass="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
          loading={avgTime.loading}
        />
      </div>

      <div id="card-weekly-trend">
        <WeeklyTrendCard trend={trend.data} loading={trend.loading} />
      </div>

      <div id="chart-accuracy">
        <AccuracyChart data={chartAccuracyData} loading={accuracy.loading || gameStats.loading} />
      </div>

      <div id="chart-completion">
        <CompletionChart data={chartCompletionData} loading={completion.loading || gameStats.loading} />
      </div>

      <div className="pb-8"></div>
    </div>
  );
};