import { useState, useEffect } from 'react';
import { AlertOctagon, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { StationMap } from '@/components/map/StationMap';
import { AlarmTable } from '@/components/alarms/AlarmTable';
import { StationDetailPanel } from '@/components/stations/StationDetailPanel';
import { MetricChartsGrid } from '@/components/charts/MetricChartsGrid';
import { dashboardApi } from '@/api/dashboard.api';
import { Alarm } from '@/types/alarm.types';

export default function DashboardPage() {
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [recentAlarms, setRecentAlarms] = useState<Alarm[]>([]);

  useEffect(() => {
    dashboardApi.getRecentAlarms()
      .then((res) => setRecentAlarms(res.data ?? []))
      .catch(() => { /* keep empty */ });
  }, []);

  const criticalOpen = recentAlarms.filter((a) => a.severity === 'CRITICAL' && a.status === 'OPEN');

  return (
    <div className="flex flex-col space-y-5 h-full relative">

      {/* Critical alarm banner */}
      {criticalOpen.length > 0 && (
        <div className="flex items-center gap-3 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
          <AlertOctagon className="h-5 w-5 text-red-600 shrink-0" />
          <p className="text-sm font-medium text-red-800 flex-1">
            <span className="font-bold">{criticalOpen.length} kritik alarm</span> aktif ve müdahale bekliyor.
            {criticalOpen[0] && (
              <span className="ml-1 text-red-700">
                Son: <span className="font-semibold">{criticalOpen[0].station?.name ?? criticalOpen[0].stationId}</span> — {criticalOpen[0].message}
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
            data={recentAlarms.slice(0, 5)}
            onRowClick={() => {}}
            maxRows={5}
          />
        </div>
      </section>

      {/* System Metric Charts */}
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
