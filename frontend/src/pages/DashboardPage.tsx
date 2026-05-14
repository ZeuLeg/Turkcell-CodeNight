import { useState } from 'react';
import { AlertOctagon, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { StationMap } from '@/components/map/StationMap';
import { AlarmTable } from '@/components/alarms/AlarmTable';
import { StationDetailPanel } from '@/components/stations/StationDetailPanel';
import { MetricChartsGrid } from '@/components/charts/MetricChartsGrid';

const RECENT_ALARMS = [
  { id: '1', stationId: 'BSC-001', metricName: 'cpuUsage', severity: 'CRITICAL', status: 'OPEN', message: 'CPU sınırı aşıldı: %96', createdAt: new Date().toISOString() },
  { id: '2', stationId: 'BSC-003', metricName: 'latency', severity: 'WARNING', status: 'ACKNOWLEDGED', message: 'Yüksek gecikme: 85ms', createdAt: new Date(Date.now() - 3600000).toISOString(), assignedTo: 'Ahmet Yılmaz' },
  { id: '3', stationId: 'BSC-002', metricName: 'packetLoss', severity: 'CRITICAL', status: 'IN_PROGRESS', message: 'Paket kaybı %15', createdAt: new Date(Date.now() - 7200000).toISOString(), assignedTo: 'Ayşe Demir' },
  { id: '4', stationId: 'BSC-007', metricName: 'memoryUsage', severity: 'WARNING', status: 'OPEN', message: 'Bellek %82 — uyarı eşiği aşıldı', createdAt: new Date(Date.now() - 1800000).toISOString() },
];

const CRITICAL_OPEN = RECENT_ALARMS.filter((a) => a.severity === 'CRITICAL' && a.status === 'OPEN');

export default function DashboardPage() {
  const [selectedStationId, setSelectedStationId] = useState<number | null>(null);

  return (
    <div className="flex flex-col space-y-5 h-full relative">

      {/* Critical alarm banner */}
      {CRITICAL_OPEN.length > 0 && (
        <div className="flex items-center gap-3 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
          <AlertOctagon className="h-5 w-5 text-red-600 shrink-0" />
          <p className="text-sm font-medium text-red-800 flex-1">
            <span className="font-bold">{CRITICAL_OPEN.length} kritik alarm</span> aktif ve müdahale bekliyor.
            {CRITICAL_OPEN[0] && (
              <span className="ml-1 text-red-700">
                Son: <span className="font-semibold">{CRITICAL_OPEN[0].stationId}</span> — {CRITICAL_OPEN[0].message}
              </span>
            )}
          </p>
          <Link
            to="/alarms"
            className="flex items-center gap-1 text-xs font-semibold text-red-700 hover:text-red-900 whitespace-nowrap"
          >
            Alarm Yönetimine Git <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* KPI Cards */}
      <SummaryCards />

      {/* Map + Recent Alarms */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 min-h-[420px]">
        <div className="lg:col-span-2 min-h-[380px]">
          <StationMap onSelectStation={setSelectedStationId} />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-0.5">
            <h3 className="text-sm font-semibold text-slate-700">Son Alarmlar</h3>
            <Link to="/alarms" className="text-xs text-primary hover:underline flex items-center gap-0.5">
              Tümünü gör <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <AlarmTable
            data={RECENT_ALARMS}
            onRowClick={() => {}}
            maxRows={5}
          />
        </div>
      </section>

      {/* System Metric Charts — PDF requirement: zaman serisi + eşik çizgileri */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Anlık Ağ Metrikleri</h2>
            <p className="text-xs text-slate-500 mt-0.5">Son 20 ölçüm — eşik değerleri gösterilmektedir</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="inline-block w-6 border-t-2 border-dashed border-amber-400" />
              Uyarı eşiği
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-6 border-t-2 border-dashed border-red-400" />
              Kritik eşiği
            </span>
          </div>
        </div>
        <MetricChartsGrid />
      </section>

      <StationDetailPanel
        stationId={selectedStationId}
        onClose={() => setSelectedStationId(null)}
      />
    </div>
  );
}
