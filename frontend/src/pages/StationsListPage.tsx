import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RadioTower, MapPin, AlertOctagon, AlertTriangle, WifiOff, CheckCircle2, ChevronRight, Search } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { cn } from '@/lib/utils';
import { useStations } from '@/hooks/useStations';
import { StationStatus } from '@/types/station.types';

const STATUS_CONFIG = {
  ACTIVE: { label: 'Aktif', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
  WARNING: { label: 'Uyarı', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-400' },
  CRITICAL: { label: 'Kritik', icon: AlertOctagon, color: 'text-red-600', bg: 'bg-red-50', dot: 'bg-red-500 animate-pulse' },
  OFFLINE: { label: 'Çevrimdışı', icon: WifiOff, color: 'text-slate-500', bg: 'bg-slate-100', dot: 'bg-slate-400' },
} as const;

export default function StationsListPage() {
  const { stations, loading, error } = useStations();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterRegion, setFilterRegion] = useState('');

  const filtered = stations.filter((s) => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.code.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStatus && s.status !== filterStatus) return false;
    if (filterRegion && s.region !== filterRegion) return false;
    return true;
  });

  const byStatus = { ACTIVE: 0, WARNING: 0, CRITICAL: 0, OFFLINE: 0 };
  stations.forEach((s) => { if (s.status in byStatus) byStatus[s.status as StationStatus]++; });

  const regions = [...new Set(stations.map((s) => s.region))].sort();

  return (
    <div className="flex flex-col space-y-6">
      <PageHeader
        title="İstasyonlar"
        description={`Şebekedeki ${stations.length} baz istasyonunun durumu ve anlık metrikleri`}
      />

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Veriler yüklenemedi: {error}
        </div>
      )}

      {/* Quick stats */}
      <div className="flex gap-3 flex-wrap">
        {Object.entries(STATUS_CONFIG).map(([status, cfg]) => {
          const Icon = cfg.icon;
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(filterStatus === status ? '' : status)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all',
                filterStatus === status
                  ? `${cfg.bg} ${cfg.color} border-current/30 shadow-sm`
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              )}
            >
              <Icon className="h-4 w-4" />
              {cfg.label}
              <span className={cn('ml-1 h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold', cfg.bg, cfg.color)}>
                {byStatus[status as StationStatus]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="İstasyon ara (ad veya kod)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-md border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>
        <select
          value={filterRegion}
          onChange={(e) => setFilterRegion(e.target.value)}
          className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
        >
          <option value="">Tüm Bölgeler</option>
          {regions.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Station table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 text-sm">
            Yükleniyor...
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Durum', 'İstasyon', 'Bölge', 'Tür', 'Kapasite', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((station) => {
                const cfg = STATUS_CONFIG[station.status as StationStatus] ?? STATUS_CONFIG.OFFLINE;
                return (
                  <tr key={station.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold', cfg.bg, cfg.color)}>
                        <span className={cn('h-1.5 w-1.5 rounded-full', cfg.dot)} />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">{station.name}</p>
                      <p className="text-xs font-mono text-slate-500">{station.code}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-slate-600">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        <span>{station.region}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold',
                        station.type === 'NR_5G' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                      )}>
                        {station.type === 'NR_5G' ? '5G' : '4G LTE'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 tabular-nums">
                      {station.capacity.toLocaleString('tr-TR')}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/stations/${station.id}`}
                        className="inline-flex items-center text-xs text-primary hover:text-primary/80 font-medium gap-0.5 transition-colors"
                      >
                        Detay <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <RadioTower className="h-10 w-10 mb-3 opacity-30" />
            <p className="text-sm font-medium">İstasyon bulunamadı</p>
            <p className="text-xs mt-1">Arama veya filtre kriterlerini değiştirin</p>
          </div>
        )}

        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-500">
          {filtered.length} / {stations.length} istasyon gösteriliyor
        </div>
      </div>
    </div>
  );
}
