import React, { useState, useEffect } from 'react';
import { RadioTower, AlertTriangle, AlertOctagon, WifiOff } from 'lucide-react';
import { SummaryCard } from './SummaryCard';

export function SummaryCards() {
  const [stats, setStats] = useState({
    totalStations: 124,
    activeAlarms: 18,
    criticalAlarms: 3,
    offlineStations: 2,
  });

  // Polling simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        activeAlarms: prev.activeAlarms + (Math.random() > 0.7 ? 1 : Math.random() > 0.5 ? -1 : 0),
        criticalAlarms: prev.criticalAlarms + (Math.random() > 0.9 ? 1 : Math.random() > 0.8 ? -1 : 0),
      }));
    }, 5000); // Every 5 seconds update

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        title="Toplam İstasyon"
        value={stats.totalStations}
        icon={RadioTower}
        colorClass="text-blue-500"
      />
      <SummaryCard
        title="Aktif Alarmlar"
        value={Math.max(0, stats.activeAlarms)} // prevent negative
        icon={AlertTriangle}
        colorClass="text-amber-500"
        trend={{ value: 12, isPositive: false }}
      />
      <SummaryCard
        title="Kritik Alarmlar"
        value={Math.max(0, stats.criticalAlarms)}
        icon={AlertOctagon}
        colorClass="text-red-500"
        trend={{ value: 2, isPositive: false }}
      />
      <SummaryCard
        title="Çevrimdışı İstasyon"
        value={stats.offlineStations}
        icon={WifiOff}
        colorClass="text-slate-500"
      />
    </div>
  );
}
