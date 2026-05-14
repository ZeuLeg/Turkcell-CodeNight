import React, { useState, useEffect } from 'react';
import { AlarmFilters } from '../components/alarms/AlarmFilters';
import { AlarmTable } from '../components/alarms/AlarmTable';
import { AlarmDetailModal } from '../components/alarms/AlarmDetailModal';
import { PageHeader } from '../components/ui/PageHeader';

const MOCK_ALARMS = [
  { id: '1', stationId: 'BSC-001', metricName: 'cpuUsage', severity: 'CRITICAL', status: 'OPEN', message: 'CPU sınırı aşıldı: %96 — sürekli yüksek seyretmekte', createdAt: new Date().toISOString() },
  { id: '2', stationId: 'BSC-003', metricName: 'latency', severity: 'WARNING', status: 'ACKNOWLEDGED', message: 'Yüksek gecikme tespit edildi: 85ms (eşik: 50ms)', createdAt: new Date(Date.now() - 3600000).toISOString(), assignedTo: 'Ahmet Yılmaz' },
  { id: '3', stationId: 'BSC-002', metricName: 'packetLoss', severity: 'CRITICAL', status: 'IN_PROGRESS', message: 'Paket kaybı %15 — konfigürasyon hatası olabilir', createdAt: new Date(Date.now() - 7200000).toISOString(), assignedTo: 'Ayşe Demir' },
  { id: '4', stationId: 'BSC-005', metricName: 'connectedUsers', severity: 'CRITICAL', status: 'RESOLVED', message: 'Kapsama alanı tamamen kaybedildi, kullanıcılar düştü.', createdAt: new Date(Date.now() - 86400000).toISOString(), resolutionNote: 'Fiziksel ekip anteni değiştirdi. İstasyon normale döndü.' },
  { id: '5', stationId: 'BSC-007', metricName: 'memoryUsage', severity: 'WARNING', status: 'OPEN', message: 'Bellek kullanımı %82 — uyarı eşiği aşıldı', createdAt: new Date(Date.now() - 1800000).toISOString() },
];

export const AlarmsPage: React.FC = () => {
  const [alarms, setAlarms] = useState<any[]>([]);
  const [filteredAlarms, setFilteredAlarms] = useState<any[]>([]);
  const [selectedAlarm, setSelectedAlarm] = useState<any | null>(null);

  // Filtre durumları tutuluyor (Şimdilik lokal bazda simüle ediyoruz)
  const [filters, setFilters] = useState({
    severity: '',
    status: '',
    stationId: '',
  });

  useEffect(() => {
    // API entegrasyonu gelene kadar mock.
    setAlarms(MOCK_ALARMS);
    setFilteredAlarms(MOCK_ALARMS);
  }, []);

  useEffect(() => {
    // Front-end bazlı basit filtreleme simülasyonu
    let result = alarms;
    if (filters.severity) result = result.filter(a => a.severity === filters.severity);
    if (filters.status) result = result.filter(a => a.status === filters.status);
    if (filters.stationId) result = result.filter(a => a.stationId === filters.stationId);
    
    setFilteredAlarms(result);
  }, [filters, alarms]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const updateAlarm = (alarmId: string, changes: Record<string, unknown>) => {
    setAlarms((prev: any[]) => prev.map((a: any) => a.id === alarmId ? { ...a, ...changes } : a));
  };

  const handleResolveAlarm = (alarmId: string, note: string) => {
    updateAlarm(alarmId, { status: 'RESOLVED', resolutionNote: note });
    setSelectedAlarm(null);
  };

  const handleAcknowledge = (alarmId: string) => {
    updateAlarm(alarmId, { status: 'ACKNOWLEDGED' });
    setSelectedAlarm((prev: any) => prev?.id === alarmId ? { ...prev, status: 'ACKNOWLEDGED' } : prev);
  };

  const handleStartProgress = (alarmId: string, assignedTo: string) => {
    updateAlarm(alarmId, { status: 'IN_PROGRESS', assignedTo });
    setSelectedAlarm((prev: any) => prev?.id === alarmId ? { ...prev, status: 'IN_PROGRESS', assignedTo } : prev);
  };

  return (
    <div className="flex flex-col space-y-6 h-full">
      <PageHeader
        title="Alarm Yönetimi"
        description="İstasyonlardan gelen kritik ve uyarı seviyesindeki anomalileri takip edin."
      />

      <AlarmFilters onFilterChange={handleFilterChange} />

      <AlarmTable
        data={filteredAlarms}
        onRowClick={(alarm) => setSelectedAlarm(alarm)}
      />

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