import React, { useState, useEffect } from 'react';
import { X, AlertOctagon, AlertTriangle, Clock, User, CheckCircle2, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { api } from '@/api/client';
import { ApiResponse } from '@/types/api.types';

interface Engineer { id: string; email: string; }

interface AlarmDetailModalProps {
  alarm: any;
  onClose: () => void;
  onResolve: (alarmId: string, resolutionNote: string) => void;
  onAcknowledge?: (alarmId: string) => void;
  onStartProgress?: (alarmId: string, assignedTo: string) => void;
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  OPEN:         { label: 'Açık',               className: 'bg-red-100 text-red-800' },
  ACKNOWLEDGED: { label: 'Kabul Edildi',        className: 'bg-amber-100 text-amber-800' },
  IN_PROGRESS:  { label: 'Müdahale Ediliyor',   className: 'bg-blue-100 text-blue-800' },
  RESOLVED:     { label: 'Çözüldü',             className: 'bg-emerald-100 text-emerald-800' },
};

const METRIC_LABELS: Record<string, string> = {
  cpuUsage:              'CPU Kullanımı',
  memoryUsage:           'Bellek Kullanımı',
  packetLoss:            'Paket Kaybı',
  latency:               'Gecikme',
  rssi:                  'Sinyal Gücü (RSSI)',
  connectedUsers:        'Bağlı Kullanıcı Sayısı',
  correlation_bottleneck:'Korelasyon: Darboğaz',
};

function nameFromEmail(email: string) {
  return email.split('@')[0].split(/[._-]/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
}

export const AlarmDetailModal: React.FC<AlarmDetailModalProps> = ({
  alarm, onClose, onResolve, onAcknowledge, onStartProgress,
}) => {
  const [resolutionNote, setResolutionNote] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [engineers, setEngineers] = useState<Engineer[]>([]);

  useEffect(() => {
    if (!alarm) return;
    api.get<ApiResponse<{ id: string; email: string; role: string }[]>>('/api/v1/users')
      .then((res) => setEngineers((res.data ?? []).filter(u => u.role === 'FIELD_ENGINEER')))
      .catch(() => { /* kullanıcılar yüklenemezse boş liste */ });
  }, [alarm]);

  if (!alarm) return null;

  const statusCfg = STATUS_CONFIG[alarm.status] ?? { label: alarm.status, className: 'bg-slate-100 text-slate-700' };
  const SeverityIcon = alarm.severity === 'CRITICAL' ? AlertOctagon : AlertTriangle;
  const stationLabel = alarm.station?.name ?? alarm.station?.code ?? alarm.stationId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <SeverityIcon className={`h-5 w-5 ${alarm.severity === 'CRITICAL' ? 'text-red-600' : 'text-amber-500'}`} />
            <h2 className="text-base font-semibold text-slate-900">Alarm Detayı</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">

          <div className="flex items-center gap-3 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusCfg.className}`}>
              {statusCfg.label}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${alarm.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
              {alarm.severity === 'CRITICAL' ? 'Kritik' : 'Uyarı'}
            </span>
            {alarm.assignedTo && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                <User className="h-3 w-3" /> Atandı
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">İstasyon</p>
              <p className="text-sm font-semibold text-slate-900">{stationLabel}</p>
              {alarm.station?.code && alarm.station.name && (
                <p className="text-xs text-slate-400 font-mono">{alarm.station.code}</p>
              )}
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Metrik</p>
              <p className="text-sm font-medium text-slate-900">{METRIC_LABELS[alarm.metricName] ?? alarm.metricName}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
                <Clock className="h-3 w-3" /> Oluşturma Zamanı
              </p>
              <p className="text-sm text-slate-700">{new Date(alarm.createdAt).toLocaleString('tr-TR')}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500 mb-2">Alarm Açıklaması</p>
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <p className="text-sm text-slate-700">{alarm.message}</p>
            </div>
          </div>

          {(alarm.status === 'OPEN' || alarm.status === 'ACKNOWLEDGED') && (
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2">Saha Mühendisine Ata</p>
              <select
                className="w-full h-9 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              >
                <option value="">Kişi seçin...</option>
                {engineers.map((eng) => (
                  <option key={eng.id} value={eng.id}>{nameFromEmail(eng.email)}</option>
                ))}
              </select>
            </div>
          )}

          {(alarm.status === 'OPEN' || alarm.status === 'ACKNOWLEDGED' || alarm.status === 'IN_PROGRESS') && (
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2">Çözüm Notu</p>
              <textarea
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                rows={3}
                placeholder="Bu alarm neden oluştu ve nasıl çözüldü? Açıklayın..."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
              />
            </div>
          )}

          {alarm.status === 'RESOLVED' && alarm.resolutionNote && (
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Çözüm Notu
              </p>
              <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                <p className="text-sm text-emerald-800">{alarm.resolutionNote}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>Kapat</Button>
          <div className="flex gap-2">
            {alarm.status === 'OPEN' && onAcknowledge && (
              <Button variant="secondary" size="sm" onClick={() => onAcknowledge(alarm.id)}>
                Kabul Et
              </Button>
            )}
            {alarm.status === 'ACKNOWLEDGED' && onStartProgress && assignedTo && (
              <Button variant="secondary" size="sm" onClick={() => onStartProgress(alarm.id, assignedTo)}>
                <Wrench className="h-3.5 w-3.5 mr-1.5" />
                Müdahale Başlat
              </Button>
            )}
            {alarm.status !== 'RESOLVED' && (
              <Button
                size="sm"
                onClick={() => onResolve(alarm.id, resolutionNote)}
                disabled={!resolutionNote.trim()}
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                Çözüldü İşaretle
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
