import React, { useEffect, useState } from 'react';
import { RadioTower, AlertTriangle, AlertOctagon, WifiOff, TrendingUp, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { dashboardApi, RegionSummary } from '@/api/dashboard.api';

const STATUS_ICON: Record<string, React.ElementType> = {
  ACTIVE: CheckCircle2,
  WARNING: AlertTriangle,
  CRITICAL: AlertOctagon,
  OFFLINE: WifiOff,
};

const STATUS_STYLE: Record<string, string> = {
  ACTIVE: 'text-emerald-600',
  WARNING: 'text-amber-500',
  CRITICAL: 'text-red-600',
  OFFLINE: 'text-slate-400',
};

function HealthBar({ score }: { score: number }) {
  const color = score >= 90 ? 'bg-emerald-500' : score >= 75 ? 'bg-amber-400' : 'bg-red-500';
  const textColor = score >= 90 ? 'text-emerald-700' : score >= 75 ? 'text-amber-700' : 'text-red-700';
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-slate-500">Sağlık Skoru</span>
        <span className={cn('text-sm font-bold', textColor)}>{score}%</span>
      </div>
      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export default function RegionSummaryPage() {
  const [regions, setRegions] = useState<RegionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dashboardApi.getRegions()
      .then((res) => setRegions(res.data ?? []))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const totalStations = regions.reduce((acc, r) => acc + r.stationCount, 0);
  const totalAlarms = regions.reduce((acc, r) => acc + r.totalAlarms, 0);
  const totalCritical = regions.reduce((acc, r) => acc + r.criticalAlarms, 0);
  const offline = regions.flatMap((r) => r.stations).filter((s) => s.status === 'OFFLINE').length;

  return (
    <div className="flex flex-col space-y-6 h-full">
      <PageHeader
        title="Bölge Özeti"
        description="Türkiye genelinde bölgesel ağ sağlığı, istasyon durumu ve alarm dağılımı"
      />

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Veriler yüklenemedi: {error}
        </div>
      )}

      {/* Summary strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Toplam İstasyon', value: totalStations, icon: RadioTower, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Aktif Alarm', value: totalAlarms, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Kritik Alarm', value: totalCritical, icon: AlertOctagon, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Çevrimdışı', value: offline, icon: WifiOff, color: 'text-slate-500', bg: 'bg-slate-100' },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
            <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center shrink-0', item.bg)}>
              <item.icon className={cn('h-5 w-5', item.color)} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{loading ? '—' : item.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Region cards */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400 text-sm">Yükleniyor...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {regions.map((region) => {
            const byStatus = { ACTIVE: 0, WARNING: 0, CRITICAL: 0, OFFLINE: 0 };
            region.stations.forEach((s) => {
              if (s.status in byStatus) byStatus[s.status as keyof typeof byStatus]++;
            });

            return (
              <div key={region.name} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Card header */}
                <div className="p-5 border-b border-slate-100">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">{region.name}</h2>
                      <p className="text-sm text-slate-500">{region.stationCount} istasyon</p>
                    </div>
                    <span className={cn(
                      'inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full',
                      region.healthScore >= 90 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    )}>
                      <TrendingUp className="h-3 w-3" />
                      {region.healthScore}%
                    </span>
                  </div>
                  <HealthBar score={region.healthScore} />

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                    <span>{region.stationCount} istasyon</span>
                    <span className={region.criticalAlarms > 0 ? 'text-red-600 font-semibold' : 'text-slate-500'}>
                      {region.totalAlarms} alarm {region.criticalAlarms > 0 && `(${region.criticalAlarms} kritik)`}
                    </span>
                  </div>

                  {/* Status dots */}
                  <div className="mt-3 flex items-center gap-3">
                    {(Object.entries(byStatus) as [string, number][]).map(([status, count]) => {
                      const StatusIcon = STATUS_ICON[status];
                      return count > 0 ? (
                        <span key={status} className={cn('flex items-center gap-1 text-xs font-medium', STATUS_STYLE[status])}>
                          <StatusIcon className="h-3 w-3" />
                          {count}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>

                {/* Station list */}
                <div className="divide-y divide-slate-50">
                  {region.stations.map((station) => {
                    const SIcon = STATUS_ICON[station.status] ?? RadioTower;
                    return (
                      <Link
                        key={station.id}
                        to={`/stations/${station.id}`}
                        className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <SIcon className={cn('h-3.5 w-3.5 shrink-0', STATUS_STYLE[station.status])} />
                          <div>
                            <p className="text-sm font-medium text-slate-800 group-hover:text-primary transition-colors">
                              {station.name}
                            </p>
                            <p className="text-xs text-slate-400 font-mono">{station.code} · {station.type}</p>
                          </div>
                        </div>
                        {station.alarmCount > 0 && (
                          <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                            {station.alarmCount}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
