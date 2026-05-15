import React, { useEffect, useState } from 'react';
import { SimulatorControls } from '../components/simulator/SimulatorControls';
import { AnomalyInjector } from '../components/simulator/AnomalyInjector';
import { ActiveAnomaliesList } from '../components/simulator/ActiveAnomaliesList';
import { PageHeader } from '../components/ui/PageHeader';
import { simulatorApi, AnomalyType } from '@/api/simulator.api';
import { useSimulatorStore, ActiveAnomaly } from '@/store/simulator.store';
import { useStations } from '@/hooks/useStations';

export const SimulatorPage: React.FC = () => {
  const { isRunning, setRunning, activeAnomalies, addAnomaly, removeAnomaly, pruneExpired } =
    useSimulatorStore();
  const { stations } = useStations();
  const [error, setError] = useState<string | null>(null);

  // Sayfa açılınca süresi dolmuş anomalileri temizle + backend durum senkronizasyonu
  useEffect(() => {
    pruneExpired();
    simulatorApi.getStatus()
      .then((res) => setRunning(res.data?.running ?? false))
      .catch(() => { /* backend kapalıysa mevcut store değerini koru */ });
  }, []);

  // Store'daki her aktif anomali için bitiş zamanına göre otomatik silme zamanlayıcısı
  useEffect(() => {
    const timers = activeAnomalies
      .filter((a) => a.endTime > Date.now())
      .map((a) => {
        const remaining = a.endTime - Date.now();
        return window.setTimeout(() => removeAnomaly(a.id), remaining);
      });
    return () => timers.forEach(clearTimeout);
  }, []); // Yalnızca mount'ta çalışır — yeni anomaliler handleInjectAnomaly'de ayrıca zamanlanır

  const handleToggleSimulator = async () => {
    setError(null);
    try {
      if (isRunning) {
        await simulatorApi.stop();
      } else {
        await simulatorApi.start();
      }
      setRunning(!isRunning);
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

      const station = stations.find((s) => s.id === anomaly.stationId);
      const now = Date.now();
      const newAnomaly: ActiveAnomaly = {
        id: Math.random().toString(36).substring(7),
        stationId: anomaly.stationId,
        stationName: station?.name ?? anomaly.stationId,
        type: anomaly.type,
        startTime: now,
        endTime: now + anomaly.duration * 1000,
      };
      addAnomaly(newAnomaly);
      // Süre dolunca store'dan sil
      window.setTimeout(() => removeAnomaly(newAnomaly.id), anomaly.duration * 1000);
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
