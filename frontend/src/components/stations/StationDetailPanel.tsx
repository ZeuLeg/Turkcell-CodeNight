import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { StationHeader } from './StationHeader';
import { StationAlarmTab } from './StationAlarmTab';
import { MetricChartsGrid } from '../charts/MetricChartsGrid';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

import { stationsApi } from '@/api/stations.api';
import { Station } from '@/types/station.types';

interface StationDetailPanelProps {
  stationId: string | null;
  onClose: () => void;
}

export function StationDetailPanel({ stationId, onClose }: StationDetailPanelProps) {
  const [station, setStation] = useState<Station | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (stationId !== null) {
      setIsClosing(false);
      stationsApi.getById(stationId)
        .then((res) => setStation(res.data))
        .catch(() => setStation(null));
    }
  }, [stationId]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setStation(null);
    }, 300); // match transition duration
  };

  if (!stationId && !isClosing && !station) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity duration-300",
          (stationId && !isClosing) ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={handleClose}
      />

      {/* Sliding Panel (40% width on large screens, full width on small) */}
      <div 
        className={cn(
          "fixed top-0 right-0 h-full w-full lg:w-[45%] xl:w-[40%] bg-slate-50 z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col overflow-hidden",
          (stationId && !isClosing) ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
          <h2 className="text-lg font-semibold text-slate-800">İstasyon Detayı</h2>
          <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full hover:bg-slate-100">
            <X className="w-5 h-5 text-slate-500" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {station && (
            <>
              <StationHeader station={{
                name: station.name,
                code: station.code,
                region: station.region,
                type: station.type,
                capacity: `${station.capacity.toLocaleString('tr-TR')} kullanıcı`,
                status: ({ ACTIVE: 'normal', WARNING: 'warning', CRITICAL: 'critical', OFFLINE: 'offline' } as const)[station.status] ?? 'normal',
              }} />
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Canlı Metrikler</h3>
                <MetricChartsGrid />
              </div>
              
              <div>
                <StationAlarmTab />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

