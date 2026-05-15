import React, { useState, useMemo } from 'react';
import { AlarmFilters } from '../components/alarms/AlarmFilters';
import { AlarmTable } from '../components/alarms/AlarmTable';
import { AlarmDetailModal } from '../components/alarms/AlarmDetailModal';
import { PageHeader } from '../components/ui/PageHeader';
import { useAlarms } from '@/hooks/useAlarms';
import { Alarm } from '@/types/alarm.types';

export const AlarmsPage: React.FC = () => {
  const [selectedAlarm, setSelectedAlarm] = useState<Alarm | null>(null);
  const [filters, setFilters] = useState({ severity: '', status: '', stationId: '' });

  const apiFilters = useMemo(() => ({
    severity: filters.severity || undefined,
    status: filters.status || undefined,
    station: filters.stationId || undefined,
  }), [filters.severity, filters.status, filters.stationId]);

  const { alarms, loading, error, acknowledge, assign, resolve } = useAlarms(apiFilters);

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResolveAlarm = async (alarmId: string, note: string) => {
    await resolve(alarmId, note);
    setSelectedAlarm(null);
  };

  const handleAcknowledge = async (alarmId: string) => {
    await acknowledge(alarmId);
    setSelectedAlarm((prev) => prev?.id === alarmId ? { ...prev, status: 'ACKNOWLEDGED' } : prev);
  };

  const handleStartProgress = async (alarmId: string, assignedTo: string) => {
    await assign(alarmId, assignedTo);
    setSelectedAlarm((prev) => prev?.id === alarmId ? { ...prev, status: 'IN_PROGRESS', assignedTo } : prev);
  };

  return (
    <div className="flex flex-col space-y-6">
      <PageHeader
        title="Alarm Yönetimi"
        description="İstasyonlardan gelen kritik ve uyarı seviyesindeki anomalileri takip edin."
      />

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Alarmlar yüklenemedi: {error}
        </div>
      )}

      <AlarmFilters onFilterChange={handleFilterChange} />

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400 text-sm">Yükleniyor...</div>
      ) : (
        <AlarmTable
          data={alarms}
          onRowClick={(alarm) => setSelectedAlarm(alarm as Alarm)}
        />
      )}

      <AlarmDetailModal
        alarm={selectedAlarm}
        onClose={() => setSelectedAlarm(null)}
        onResolve={handleResolveAlarm}
        onAcknowledge={handleAcknowledge}
        onStartProgress={handleStartProgress}
      />
    </div>
  );
};
