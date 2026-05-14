import React, { useEffect, useState } from 'react';
import { Activity, Clock } from 'lucide-react';

export interface ActiveAnomaly {
  id: string;
  stationId: string;
  type: string;
  endTime: number;
}

interface ActiveAnomaliesListProps {
  anomalies: ActiveAnomaly[];
}

const ANOMALY_LABELS: Record<string, string> = {
  CPU_SPIKE: 'CPU Spike',
  USER_DROP: 'Kullanıcı Düşüşü',
  LATENCY_BURST: 'Gecikme Patlaması',
  PACKET_STORM: 'Paket Fırtınası',
  STATION_DOWN: 'İstasyon Çöküşü',
};

export const ActiveAnomaliesList: React.FC<ActiveAnomaliesListProps> = ({ anomalies }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Activity className="h-4 w-4 text-red-500" />
        Aktif Anomaliler
        {anomalies.length > 0 && (
          <span className="ml-auto inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold">
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
            const totalDuration = Math.ceil((anomaly.endTime - (anomaly.endTime - remaining * 1000 - 100)) / 1000);
            const pct = Math.max(0, remaining / (totalDuration || 1));

            return (
              <li
                key={anomaly.id}
                className="rounded-lg border border-red-200 bg-red-50 p-3.5"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-red-900">
                      {ANOMALY_LABELS[anomaly.type] ?? anomaly.type}
                    </p>
                    <p className="text-xs text-red-600 font-mono">{anomaly.stationId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold tabular-nums text-red-700">{remaining}s</p>
                    <p className="text-xs text-red-500 flex items-center justify-end gap-0.5">
                      <Clock className="h-3 w-3" /> kalan
                    </p>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-red-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full transition-all duration-1000"
                    style={{ width: `${pct * 100}%` }}
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
