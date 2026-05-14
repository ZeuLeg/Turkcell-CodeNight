import React, { useState } from 'react';
import { SimulatorControls } from '../components/simulator/SimulatorControls';
import { AnomalyInjector } from '../components/simulator/AnomalyInjector';
import { ActiveAnomaliesList, ActiveAnomaly } from '../components/simulator/ActiveAnomaliesList';
import { PageHeader } from '../components/ui/PageHeader';
import { simulatorApi, AnomalyType } from '@/api/simulator.api';

export const SimulatorPage: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [activeAnomalies, setActiveAnomalies] = useState<ActiveAnomaly[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleToggleSimulator = async () => {
    setError(null);
    try {
      if (isRunning) {
        await simulatorApi.stop();
      } else {
        await simulatorApi.start();
      }
      setIsRunning((prev) => !prev);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Simülatör kontrolü başarısız');
    }
  };

  const handleInjectAnomaly = async (anomaly: { stationId: string; type: string; duration: number }) => {
    setError(null);
    try {
      await simulatorApi.injectAnomaly({
        station_id: anomaly.stationId,
        anomaly_type: anomaly.type as AnomalyType,
        duration_seconds: anomaly.duration,
      });

      const newAnomaly: ActiveAnomaly = {
        id: Math.random().toString(36).substring(7),
        stationId: anomaly.stationId,
        type: anomaly.type,
        endTime: Date.now() + anomaly.duration * 1000,
      };
      setActiveAnomalies((prev) => [...prev, newAnomaly]);
      setTimeout(() => {
        setActiveAnomalies((prev) => prev.filter((a) => a.id !== newAnomaly.id));
      }, anomaly.duration * 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Anomali enjekte edilemedi');
    }
  };

  return (
    <div className="flex flex-col space-y-6 h-full">
      <PageHeader
        title="Simülatör Yönetimi"
        description="Ağınızdaki istasyon veri akışını simüle edin ve manuel olarak anomali senaryoları tetikleyin."
      />

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SimulatorControls isRunning={isRunning} onToggle={handleToggleSimulator} />
          <ActiveAnomaliesList anomalies={activeAnomalies} />
        </div>
        <div>
          <AnomalyInjector onInject={handleInjectAnomaly} />
        </div>
      </div>
    </div>
  );
};
