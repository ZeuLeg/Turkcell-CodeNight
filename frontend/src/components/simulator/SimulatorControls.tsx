import React from 'react';
import { Play, Square, Activity } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SimulatorControlsProps {
  isRunning: boolean;
  onToggle: () => void;
}

export const SimulatorControls: React.FC<SimulatorControlsProps> = ({ isRunning, onToggle }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Activity className="h-4 w-4 text-primary" />
        Simülatör Kontrolü
      </h2>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`h-3 w-3 rounded-full ${isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
          <div>
            <p className="text-sm font-medium text-slate-700">
              {isRunning ? 'Simülatör aktif' : 'Simülatör durduruldu'}
            </p>
            <p className="text-xs text-slate-500">
              {isRunning ? 'Her 3-5 saniyede metrik üretiliyor' : 'Başlatmak için butona tıklayın'}
            </p>
          </div>
        </div>

        <Button
          onClick={onToggle}
          variant={isRunning ? 'destructive' : 'default'}
          className="gap-2"
        >
          {isRunning ? (
            <><Square className="h-4 w-4" /> Durdur</>
          ) : (
            <><Play className="h-4 w-4" /> Başlat</>
          )}
        </Button>
      </div>

      {isRunning && (
        <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5 text-sm text-emerald-800">
          Tüm istasyonlar için telemetri verisi üretiliyor. Anomali enjekte etmek için sağdaki formu kullanın.
        </div>
      )}
    </div>
  );
};
