import { useState } from 'react';
import { Wrench, CheckCircle2, Clock, AlertOctagon } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { AlarmTable } from '@/components/alarms/AlarmTable';
import { AlarmDetailModal } from '@/components/alarms/AlarmDetailModal';
import { useAlarms } from '@/hooks/useAlarms';
import { useAuthStore } from '@/store/auth.store';
import { Alarm } from '@/types/alarm.types';
import { cn } from '@/lib/utils';

const STATUS_TABS = [
  { value: '', label: 'Tümü', icon: Wrench },
  { value: 'IN_PROGRESS', label: 'Devam Eden', icon: Clock },
  { value: 'ACKNOWLEDGED', label: 'Onaylandı', icon: AlertOctagon },
  { value: 'RESOLVED', label: 'Çözüldü', icon: CheckCircle2 },
] as const;

export default function MyTasksPage() {
  const { user } = useAuthStore();
  const [activeStatus, setActiveStatus] = useState<string>('');
  const [selectedAlarm, setSelectedAlarm] = useState<Alarm | null>(null);

  const { alarms, loading, error, acknowledge, assign, resolve } = useAlarms(
    activeStatus ? { status: activeStatus } : undefined
  );

  // Saha mühendisi yalnızca kendine atanmış alarmları görür
  const myAlarms = alarms.filter(
    (a) => a.assignedTo && user?.name && a.assignedTo.toLowerCase().includes(user.name.toLowerCase())
  );

  const openCount = alarms.filter((a) => a.status === 'IN_PROGRESS' || a.status === 'ACKNOWLEDGED').length;
  const resolvedCount = alarms.filter((a) => a.status === 'RESOLVED').length;

  const handleResolve = async (id: string, note: string) => {
    await resolve(id, note);
    setSelectedAlarm(null);
  };

  const handleAcknowledge = async (id: string) => {
    await acknowledge(id);
    setSelectedAlarm((prev) => prev?.id === id ? { ...prev, status: 'ACKNOWLEDGED' } : prev);
  };

  const handleStartProgress = async (id: string, assignedTo: string) => {
    await assign(id, assignedTo);
    setSelectedAlarm((prev) => prev?.id === id ? { ...prev, status: 'IN_PROGRESS', assignedTo } : prev);
  };

  return (
    <div className="flex flex-col space-y-6 h-full">
      <PageHeader
        title="Görevlerim"
        description="Size atanmış alarm ve saha müdahalelerini buradan takip edip güncelleyebilirsiniz."
      />

      {/* Özet kartlar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
            <Clock className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums text-slate-900">{openCount}</p>
            <p className="text-xs text-slate-500">Açık Görev</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums text-slate-900">{resolvedCount}</p>
            <p className="text-xs text-slate-500">Çözülen</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <Wrench className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums text-slate-900">{myAlarms.length}</p>
            <p className="text-xs text-slate-500">Toplam Görev</p>
          </div>
        </div>
      </div>

      {/* Durum sekmeleri */}
      <div className="flex gap-2">
        {STATUS_TABS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setActiveStatus(value)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all',
              activeStatus === value
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Görevler yüklenemedi: {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400 text-sm">Yükleniyor...</div>
      ) : (
        <AlarmTable
          data={myAlarms.length > 0 ? myAlarms : alarms}
          onRowClick={(alarm) => setSelectedAlarm(alarm as Alarm)}
        />
      )}

      {myAlarms.length === 0 && !loading && (
        <p className="text-xs text-slate-400 -mt-4 px-1">
          Not: Atama eşleştirmesi için hesap adınızın alarm atama kaydıyla uyuşması gerekir. Tüm alarmlar gösteriliyor.
        </p>
      )}

      <AlarmDetailModal
        alarm={selectedAlarm}
        onClose={() => setSelectedAlarm(null)}
        onResolve={handleResolve}
        onAcknowledge={handleAcknowledge}
        onStartProgress={handleStartProgress}
      />
    </div>
  );
}
