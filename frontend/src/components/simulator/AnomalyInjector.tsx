import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useStations } from '@/hooks/useStations';

const ANOMALY_TYPES = [
  { value: 'CPU_SPIKE', label: 'CPU Spike', description: 'CPU %95+ — Kritik CPU alarmı' },
  { value: 'USER_DROP', label: 'Kullanıcı Düşüşü', description: 'Bağlı kullanıcı %80 ani düşüş' },
  { value: 'LATENCY_BURST', label: 'Gecikme Patlaması', description: 'Gecikme 200ms+ — Bağlantı sorunu' },
  { value: 'PACKET_STORM', label: 'Paket Fırtınası', description: 'Paket kaybı %15+ dalgalı' },
  { value: 'STATION_DOWN', label: 'İstasyon Çöküşü', description: 'Tüm metrikler 0, veri gelmiyor' },
];

interface AnomalyInjectorProps {
  onInject: (anomaly: { stationId: string; type: string; duration: number }) => void;
}

export const AnomalyInjector: React.FC<AnomalyInjectorProps> = ({ onInject }) => {
  const { stations } = useStations();
  const [stationId, setStationId] = useState('');
  const [type, setType] = useState(ANOMALY_TYPES[0].value);
  const [duration, setDuration] = useState(60);

  const selectedType = ANOMALY_TYPES.find((t) => t.value === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = stationId || stations[0]?.id;
    if (!target) return;
    onInject({ stationId: target, type, duration });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Zap className="h-4 w-4 text-amber-500" />
        Manuel Anomali Tetikle
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
            İstasyon
          </label>
          <select
            value={stationId}
            onChange={(e) => setStationId(e.target.value)}
            className="w-full h-9 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          >
            {stations.length === 0 && <option value="">Yükleniyor...</option>}
            {stations.map((s) => (
              <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
            Anomali Tipi
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full h-9 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          >
            {ANOMALY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          {selectedType && (
            <p className="mt-1.5 text-xs text-slate-500">{selectedType.description}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
            Süre: <span className="text-primary font-bold">{duration} saniye</span>
          </label>
          <input
            type="range"
            min="10"
            max="300"
            step="10"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>10s</span>
            <span>5 dk</span>
          </div>
        </div>

        <Button type="submit" className="w-full gap-2" variant="destructive" disabled={stations.length === 0}>
          <Zap className="h-4 w-4" />
          Anomali Başlat
        </Button>
      </form>
    </div>
  );
};
