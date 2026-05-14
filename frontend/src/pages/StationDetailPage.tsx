import { useParams, Link } from 'react-router-dom';
import { ChevronRight, MapPin, RadioTower, HardDrive, Clock, Activity } from 'lucide-react';
import { MetricChartsGrid } from '@/components/charts/MetricChartsGrid';
import { AlarmTable } from '@/components/alarms/AlarmTable';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const MOCK_STATIONS: Record<string, any> = {
  'BSC-001': { id: 'BSC-001', name: 'Levent-K1', code: 'BSC-001', region: 'Marmara', city: 'İstanbul', lat: 41.083, lng: 29.011, type: 'NR_5G', capacity: 1000, status: 'CRITICAL', lastSeen: '12 sn önce', uptime: '98.2%' },
  'BSC-002': { id: 'BSC-002', name: 'Kadıköy-M3', code: 'BSC-002', region: 'Marmara', city: 'İstanbul', lat: 40.990, lng: 29.028, type: 'LTE', capacity: 800, status: 'WARNING', lastSeen: '8 sn önce', uptime: '99.1%' },
  'BSC-003': { id: 'BSC-003', name: 'Taksim-A2', code: 'BSC-003', region: 'Marmara', city: 'İstanbul', lat: 41.036, lng: 28.985, type: 'NR_5G', capacity: 1200, status: 'ACTIVE', lastSeen: '5 sn önce', uptime: '99.8%' },
  'BSC-004': { id: 'BSC-004', name: 'Beşiktaş-B1', code: 'BSC-004', region: 'Marmara', city: 'İstanbul', lat: 41.043, lng: 29.004, type: 'NR_5G', capacity: 900, status: 'ACTIVE', lastSeen: '6 sn önce', uptime: '99.5%' },
  'BSC-005': { id: 'BSC-005', name: 'Üsküdar-U3', code: 'BSC-005', region: 'Marmara', city: 'İstanbul', lat: 41.024, lng: 29.013, type: 'LTE', capacity: 700, status: 'OFFLINE', lastSeen: '15 dk önce', uptime: '91.3%' },
};

const STATUS_CONFIG: Record<string, { label: string; className: string; dot: string }> = {
  ACTIVE: { label: 'Aktif', className: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500' },
  WARNING: { label: 'Uyarı', className: 'bg-amber-100 text-amber-800 border-amber-200', dot: 'bg-amber-400' },
  CRITICAL: { label: 'Kritik', className: 'bg-red-100 text-red-800 border-red-200', dot: 'bg-red-500 animate-pulse' },
  OFFLINE: { label: 'Çevrimdışı', className: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
};

const STATION_ALARMS = [
  { id: 'a1', stationId: 'BSC-001', metricName: 'cpuUsage', severity: 'CRITICAL', status: 'OPEN', message: 'CPU %96 — kritik eşik aşıldı', createdAt: new Date().toISOString() },
  { id: 'a2', stationId: 'BSC-001', metricName: 'latency', severity: 'WARNING', status: 'ACKNOWLEDGED', message: 'Gecikme 85ms — uyarı eşiği aşıldı', createdAt: new Date(Date.now() - 3600000).toISOString(), assignedTo: 'Ahmet Yılmaz' },
  { id: 'a3', stationId: 'BSC-001', metricName: 'connectedUsers', severity: 'WARNING', status: 'RESOLVED', message: 'Bağlı kullanıcı sayısı düştü: 8 kişi', createdAt: new Date(Date.now() - 86400000).toISOString(), resolutionNote: 'Planlı bakım sonrası normale döndü.' },
];

export default function StationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const stationId = id ?? 'BSC-001';
  const station = MOCK_STATIONS[stationId] ?? MOCK_STATIONS['BSC-001'];
  const statusCfg = STATUS_CONFIG[station.status] ?? STATUS_CONFIG['ACTIVE'];

  return (
    <div className="flex flex-col space-y-6 h-full">

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
              <p className="font-medium">{station.region} / {station.city}</p>
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
              <p className="text-xs text-slate-500">Son Veri</p>
              <p className="font-medium">{station.lastSeen}</p>
            </div>
          </div>
        </div>

        {/* Uptime bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-500 font-medium">Uptime (Son 30 gün)</span>
            <span className="font-bold text-emerald-700">{station.uptime}</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: station.uptime }}
            />
          </div>
        </div>
      </div>

      {/* Live Metric Charts — with threshold lines (PDF requirement) */}
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
        <MetricChartsGrid />
      </div>

      {/* Alarm History */}
      <div>
        <h2 className="text-base font-semibold text-slate-900 mb-3">Bu İstasyona Ait Alarmlar</h2>
        <AlarmTable
          data={STATION_ALARMS}
          onRowClick={() => {}}
        />
      </div>
    </div>
  );
}
