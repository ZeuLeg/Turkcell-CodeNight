import React, { useEffect, useState } from 'react';

export interface ActiveAnomaly {
  id: string;
  stationId: string;
  type: string;
  endTime: number; // Bitiş zamanı (timestamp)
}

interface ActiveAnomaliesListProps {
  anomalies: ActiveAnomaly[];
}

export const ActiveAnomaliesList: React.FC<ActiveAnomaliesListProps> = ({ anomalies }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    // Kalan süreyi her saniye güncellemek için timer
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Aktif Anomaliler</h2>
      {anomalies.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8 bg-gray-50 rounded border border-dashed border-gray-200">
          Şu an devam eden bir anomali bulunmuyor.
        </p>
      ) : (
        <ul className="space-y-3">
          {anomalies.map(anomaly => {
            const remainingSeconds = Math.max(0, Math.ceil((anomaly.endTime - now) / 1000));
            return (
              <li 
                key={anomaly.id} 
                className="p-4 bg-red-50 border border-red-100 rounded-md flex justify-between items-center"
              >
                <div>
                  <div className="font-semibold text-red-800">{anomaly.type}</div>
                  <div className="text-sm font-medium text-red-600">{anomaly.stationId}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-red-700">{remainingSeconds} sn</div>
                  <div className="text-xs text-red-500 font-semibold uppercase">Kaldı</div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
