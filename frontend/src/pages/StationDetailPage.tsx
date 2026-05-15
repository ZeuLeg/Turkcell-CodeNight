import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, MapPin, RadioTower, HardDrive, Clock, Activity } from 'lucide-react';
import { MetricChartsGrid } from '@/components/charts/MetricChartsGrid';
import { AlarmTable } from '@/components/alarms/AlarmTable';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { stationsApi } from '@/api/stations.api';
import { alarmsApi } from '@/api/alarms.api';
import { Station } from '@/types/station.types';
import { Alarm } from '@/types/alarm.types';

const STATUS_CONFIG: Record<string, { label: string; className: string; dot: string }> = {
  ACTIVE:   { label: 'Aktif',        className: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500' },
  WARNING:  { label: 'Uyarı',        className: 'bg-amber-100 text-amber-800 border-amber-200',   dot: 'bg-amber-400' },
  CRITICAL: { label: 'Kritik',       className: 'bg-red-100 text-red-800 border-red-200',         dot: 'bg-red-500 animate-pulse' },
  OFFLINE:  { label: 'Çevrimdışı',   className: 'bg-slate-100 text-slate-600 border-slate-200',   dot: 'bg-slate-400' },
};

export default function StationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [station, setStation] = useState<Station | null>(null);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (isInitial = false) => {
    if (!id) return;
    if (isInitial) setLoading(true);
    try {
      const [s, a] = await Promise.all([
        stationsApi.getById(id).then((r) => r.data),
        alarmsApi.getAll({ station: id }).then((r) => r.data ?? []),
      ]);
      setStation(s);
      setAlarms(a);
      setError(null);
    } catch (err: unknown) {
      if (isInitial) setError(err instanceof Error ? err.message : 'Hata');
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [id]);

  // İlk yükleme
  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  // Canlı alarm + istasyon durumu: 6 saniyede bir yenile
  useEffect(() => {
    const id = setInterval(() => fetchData(false), 6000);
    return () => clearInterval(id);
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-sm">Yükleniyor...</div>
    );
  }

  if (error || !station) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
        {error ?? 'İstasyon bulunamadı'}
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[station.status] ?? STATUS_CONFIG['ACTIVE'];

  return (
    <div className="flex flex-col space-y-6">

      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm text-slate-500">
        <Link to="/stations" className="hover:text-slate-800 transition-colors">İstasyonlar</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-slate-800 font-medium">{station.name}</span>
      </div>

      {/* Station Info Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <RadioTower className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900">{station.name}</h1>
                <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border', statusCfg.className)}>
                  <span className={cn('h-1.5 w-1.5 rounded-full', statusCfg.dot)} />
                  {statusCfg.label}
                </span>
              </div>
              <p className="text-slate-500 font-mono text-sm mt-0.5">{station.code}</p>
            </div>
          </div>
          <Link to="/alarms">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Activity className="h-3.5 w-3.5" />
              Alarm Yönetimine Git
            </Button>
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 border-t border-slate-100">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
            <div>
              <p className="text-xs text-slate-500">Bölge</p>
              <p className="font-medium">{station.region}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <RadioTower className="h-4 w-4 text-slate-400 shrink-0" />
            <div>
              <p className="text-xs text-slate-500">Tür</p>
              <p className="font-medium">{station.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <HardDrive className="h-4 w-4 text-slate-400 shrink-0" />
            <div>
              <p className="text-xs text-slate-500">Kapasite</p>
              <p className="font-medium">{station.capacity.toLocaleString('tr-TR')} kullanıcı</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <Clock className="h-4 w-4 text-slate-400 shrink-0" />
            <div>
              <p className="text-xs text-slate-500">Koordinatlar</p>
              <p className="font-medium font-mono text-xs">{parseFloat(station.latitude).toFixed(3)}, {parseFloat(station.longitude).toFixed(3)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Metric Charts */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Canlı Metrik Grafikleri</h2>
            <p className="text-xs text-slate-500 mt-0.5">Son 10 dakika — eşik değerleri gösterilmektedir</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="inline-block w-5 border-t-2 border-dashed border-amber-400" />
              Uyarı
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-5 border-t-2 border-dashed border-red-400" />
              Kritik
            </span>
          </div>
        </div>
        <MetricChartsGrid stationId={station.id} />
      </div>

      {/* Alarm History */}
      <div>
        <h2 className="text-base font-semibold text-slate-900 mb-3">
          Bu İstasyona Ait Alarmlar
          {alarms.length > 0 && (
            <span className="ml-2 text-xs font-normal text-slate-400">({alarms.length} alarm)</span>
          )}
        </h2>
        <AlarmTable
          data={alarms}
          onRowClick={() => {}}
        />
      </div>
    </div>
  );
}
