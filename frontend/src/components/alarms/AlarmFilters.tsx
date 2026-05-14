import React from 'react';

interface AlarmFiltersProps {
  onFilterChange: (filters: any) => void;
}

export const AlarmFilters: React.FC<AlarmFiltersProps> = ({ onFilterChange }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-wrap gap-4 items-end">
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Şiddet</label>
        <select 
          className="border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) => onFilterChange({ severity: e.target.value })}
        >
          <option value="">Tümü</option>
          <option value="CRITICAL">Kritik</option>
          <option value="WARNING">Uyarı</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Durum</label>
        <select 
          className="border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) => onFilterChange({ status: e.target.value })}
        >
          <option value="">Tümü</option>
          <option value="OPEN">Açık</option>
          <option value="RESOLVED">Çözüldü</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">İstasyon</label>
        <select 
          className="border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) => onFilterChange({ stationId: e.target.value })}
        >
          <option value="">Tüm İstasyonlar</option>
          {/* Mocked stations, in real app fetch from API */}
          <option value="1">İstasyon 1</option>
          <option value="2">İstasyon 2</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Başlangıç Tarihi</label>
        <input 
          type="date"
          className="border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) => onFilterChange({ startDate: e.target.value })}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Bitiş Tarihi</label>
        <input 
          type="date"
          className="border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) => onFilterChange({ endDate: e.target.value })}
        />
      </div>
    </div>
  );
};