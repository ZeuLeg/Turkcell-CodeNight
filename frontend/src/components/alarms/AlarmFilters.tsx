import React from 'react';
import { Filter } from 'lucide-react';

interface AlarmFiltersProps {
  onFilterChange: (filters: any) => void;
}

export const AlarmFilters: React.FC<AlarmFiltersProps> = ({ onFilterChange }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="h-4 w-4 text-slate-500" />
        <span className="text-sm font-semibold text-slate-700">Filtreler</span>
      </div>
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1 min-w-[130px]">
          <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Şiddet</label>
          <select
            className="h-9 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            onChange={(e) => onFilterChange({ severity: e.target.value })}
          >
            <option value="">Tümü</option>
            <option value="CRITICAL">Kritik</option>
            <option value="WARNING">Uyarı</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[170px]">
          <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Durum</label>
          <select
            className="h-9 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            onChange={(e) => onFilterChange({ status: e.target.value })}
          >
            <option value="">Tümü</option>
            <option value="OPEN">Açık</option>
            <option value="ACKNOWLEDGED">Kabul Edildi</option>
            <option value="IN_PROGRESS">Müdahale Ediliyor</option>
            <option value="RESOLVED">Çözüldü</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[160px]">
          <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">İstasyon</label>
          <select
            className="h-9 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            onChange={(e) => onFilterChange({ stationId: e.target.value })}
          >
            <option value="">Tüm İstasyonlar</option>
            <option value="BSC-001">BSC-001 Levent-K1</option>
            <option value="BSC-002">BSC-002 Kadıköy-M3</option>
            <option value="BSC-003">BSC-003 Taksim-A2</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Başlangıç</label>
          <input
            type="date"
            className="h-9 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            onChange={(e) => onFilterChange({ startDate: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Bitiş</label>
          <input
            type="date"
            className="h-9 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            onChange={(e) => onFilterChange({ endDate: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};
