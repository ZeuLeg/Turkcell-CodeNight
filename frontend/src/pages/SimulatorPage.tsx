import React, { useState } from 'react';
import { SimulatorControls } from '../components/simulator/SimulatorControls';
import { AnomalyInjector } from '../components/simulator/AnomalyInjector';
import { ActiveAnomaliesList, ActiveAnomaly } from '../components/simulator/ActiveAnomaliesList';

export const SimulatorPage: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [activeAnomalies, setActiveAnomalies] = useState<ActiveAnomaly[]>([]);

  // Simülatörü Başlat/Durdur eylemi
  const handleToggleSimulator = () => {
    setIsRunning(!isRunning);
    // İleride Backend API'ye simülatör başlatma/durdurma isteği atılacak:
    // axios.post('/api/simulator/status', { active: !isRunning })
  };

  // Yeni anomali tetiklendiğinde
  const handleInjectAnomaly = (anomaly: { stationId: string; type: string; duration: number }) => {
    // Ekranda göstermek için lokal state'e ekliyoruz (Frontend Mock'u)
    const newAnomaly: ActiveAnomaly = {
      id: Math.random().toString(36).substring(7),
      stationId: anomaly.stationId,
      type: anomaly.type,
      endTime: Date.now() + (anomaly.duration * 1000), // Toplam milisaniye
    };
    
    // Aktif listesine ekle
    setActiveAnomalies(prev => [...prev, newAnomaly]);
    
    // Süre dolduğunda listeden otomatik çıkar (Frontend için geçici çözüm)
    setTimeout(() => {
      setActiveAnomalies(prev => prev.filter(a => a.id !== newAnomaly.id));
    }, anomaly.duration * 1000);

    // İleride Backend'e post edilecek kısım: 
    // axios.post('/api/simulator/anomalies', anomaly)
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Simülatör Yönetimi</h1>
        <p className="text-gray-600 mt-1">
          Ağınızdaki istasyon veri akışını simüle edin ve manuel olarak senaryoları tetikleyin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol Sütun: Kontroller ve Liste */}
        <div className="lg:col-span-2 space-y-6">
          <SimulatorControls isRunning={isRunning} onToggle={handleToggleSimulator} />
          <ActiveAnomaliesList anomalies={activeAnomalies} />
        </div>
        
        {/* Sağ Sütun: Anomali Enjeksiyon Formu */}
        <div>
          <AnomalyInjector onInject={handleInjectAnomaly} />
        </div>
      </div>
    </div>
  );
};
