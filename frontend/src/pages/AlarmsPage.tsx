import React, { useState, useEffect } from 'react';
import { AlarmFilters } from '../components/alarms/AlarmFilters';
import { AlarmTable } from '../components/alarms/AlarmTable';
import { AlarmDetailModal } from '../components/alarms/AlarmDetailModal';

// Geçici mock veri, backend bağlanınca silinecek
const MOCK_ALARMS = [
  { id: '1', stationId: 'ST-101', metricName: 'cpuUsage', severity: 'CRITICAL', status: 'OPEN', message: 'CPU sınırı aşıldı: %96', createdAt: new Date().toISOString() },
  { id: '2', stationId: 'ST-202', metricName: 'latency', severity: 'WARNING', status: 'OPEN', message: 'Yüksek gecikme tespit edildi: 85ms', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: '3', stationId: 'ST-101', metricName: 'connectedUsers', severity: 'CRITICAL', status: 'RESOLVED', message: 'Kapsama alanı tamamen kaybedildi, kullanıcılar düştü.', createdAt: new Date(Date.now() - 86400000).toISOString(), resolutionNote: 'Fiziksel ekip değiştirildi.' },
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

  const handleResolveAlarm = (alarmId: string, note: string) => {
    // Backend API isteği yapılacak kısım eklenecektir. (ör: axios.patch('/api/v1/alarms/...'))
    setAlarms(prev => 
      prev.map(a => a.id === alarmId ? { ...a, status: 'RESOLVED', resolutionNote: note } : a)
    );
    setSelectedAlarm(null); // Modalı kapat
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Alarm Yönetimi</h1>
        <p className="text-gray-600 mt-1">İstasyonlardan gelen kritik ve uyarı seviyesindeki anomalileri takip edin.</p>
      </div>

      <AlarmFilters onFilterChange={handleFilterChange} />
      
      <AlarmTable 
        data={filteredAlarms} 
        onRowClick={(alarm) => setSelectedAlarm(alarm)} 
      />

      <AlarmDetailModal 
        alarm={selectedAlarm} 
        onClose={() => setSelectedAlarm(null)}
        onResolve={handleResolveAlarm}
      />
    </div>
  );
};