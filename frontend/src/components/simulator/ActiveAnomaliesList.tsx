import React, { useEffect, useState } from 'react';
import { Activity, Clock, RadioTower } from 'lucide-react';
import { ActiveAnomaly } from '@/store/simulator.store';

interface ActiveAnomaliesListProps {
  anomalies: ActiveAnomaly[];
}

const ANOMALY_LABELS: Record<string, { label: string; color: string }> = {
  CPU_SPIKE:     { label: 'CPU Spike',          color: 'text-red-700 bg-red-50 border-red-200' },
  USER_DROP:     { label: 'Kullanıcı Düşüşü',   color: 'text-orange-700 bg-orange-50 border-orange-200' },
  LATENCY_BURST: { label: 'Gecikme Patlaması',   color: 'text-amber-700 bg-amber-50 border-amber-200' },
  PACKET_STORM:  { label: 'Paket Fırtınası',     color: 'text-purple-700 bg-purple-50 border-purple-200' },
  STATION_DOWN:  { label: 'İstasyon Çöküşü',     color: 'text-slate-700 bg-slate-100 border-slate-300' },
};

export const ActiveAnomaliesList: React.FC<ActiveAnomaliesListProps> = ({ anomalies }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (anomalies.length === 0) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [anomalies.length]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Activity className="h-4 w-4 text-red-500" />
        Aktif Anomaliler
        {anomalies.length > 0 && (
          <span className="ml-auto inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold animate-pulse">
            {anomalies.length}
          </span>
        )}
      </h2>

      {anomalies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
          <Activity className="h-8 w-8 mb-2 opacity-30" />
          <p className="text-sm font-medium">Aktif anomali yok</p>
          <p className="text-xs mt-0.5">Anomali enjekte etmek için sağdaki formu kullanın</p>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {anomalies.map((anomaly) => {
            const remaining = Math.max(0, Math.ceil((anomaly.endTime - now) / 1000));
            const total = Math.max(1, (anomaly.endTime - anomaly.startTime) / 1000);
            const pct = Math.max(0, (remaining / total) * 100);
            const cfg = ANOMALY_LABELS[anomaly.type] ?? { label: anomaly.type, color: 'text-slate-700 bg-slate-100 border-slate-300' };

            return (
              <li key={anomaly.id} className={`rounded-lg border p-3.5 ${cfg.color}`}>
                <div className="flex items-start justify-between mb-2 gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{cfg.label}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <RadioTower className="h-3 w-3 shrink-0 opacity-60" />
                      <p className="text-xs font-medium truncate opacity-80">
                        {anomaly.stationName ?? anomaly.stationId}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xl font-bold tabular-nums">{remaining}s</p>
                    <p className="text-xs opacity-60 flex items-center justify-end gap-0.5">
                      <Clock className="h-3 w-3" /> kalan
                    </p>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-black/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-current rounded-full transition-all duration-1000 opacity-60"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
