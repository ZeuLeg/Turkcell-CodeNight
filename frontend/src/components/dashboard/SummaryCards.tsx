import { RadioTower, AlertTriangle, AlertOctagon, WifiOff } from 'lucide-react';
import { SummaryCard } from './SummaryCard';
import { useDashboardSummary } from '@/hooks/useDashboardSummary';

export function SummaryCards() {
  const { summary, loading } = useDashboardSummary(5000);

  const totalStations    = summary?.totalStations    ?? 0;
  const activeAlarms     = summary?.activeAlarms     ?? 0;
  const criticalAlarms   = summary?.criticalAlarms   ?? 0;
  const offlineStations  = summary?.offlineStations  ?? 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        title="Toplam İstasyon"
        value={loading ? '—' : totalStations}
        icon={RadioTower}
        colorClass="text-blue-600"
        bgClass="bg-blue-50"
      />
      <SummaryCard
        title="Aktif Alarmlar"
        value={loading ? '—' : activeAlarms}
        icon={AlertTriangle}
        colorClass="text-amber-600"
        bgClass="bg-amber-50"
      />
      <SummaryCard
        title="Kritik Alarmlar"
        value={loading ? '—' : criticalAlarms}
        icon={AlertOctagon}
        colorClass="text-red-600"
        bgClass="bg-red-50"
      />
      <SummaryCard
        title="Çevrimdışı İstasyon"
        value={loading ? '—' : offlineStations}
        icon={WifiOff}
        colorClass="text-slate-500"
        bgClass="bg-slate-100"
      />
    </div>
  );
}
