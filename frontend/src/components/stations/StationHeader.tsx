import { RadioTower, MapPin, Activity, HardDrive } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

interface StationHeaderProps {
  station: {
    name: string;
    code: string;
    region: string;
    type: string;
    capacity: string;
    status: 'normal' | 'warning' | 'critical' | 'offline';
  };
}

export function StationHeader({ station }: StationHeaderProps) {
  const statusColor = {
    normal: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    critical: 'bg-red-100 text-red-800 border-red-200',
    offline: 'bg-slate-100 text-slate-800 border-slate-200',
  }[station.status];

  const statusLabel = {
    normal: 'Normal',
    warning: 'Uyarı',
    critical: 'Kritik',
    offline: 'Çevrimdışı',
  }[station.status];

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm mb-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-slate-900">{station.name}</h1>
            <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-semibold border', statusColor)}>
              {statusLabel}
            </span>
          </div>
          <p className="text-slate-500 font-medium mt-1">{station.code}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="flex items-center space-x-2 text-slate-600">
          <MapPin className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium">{station.region}</span>
        </div>
        <div className="flex items-center space-x-2 text-slate-600">
          <RadioTower className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium">{station.type}</span>
        </div>
        <div className="flex items-center space-x-2 text-slate-600">
          <HardDrive className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium">Kapasite: {station.capacity}</span>
        </div>
        <div className="flex items-center space-x-2 text-slate-600">
          <Activity className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium">Aktif</span>
        </div>
      </div>
    </div>
  );
}

