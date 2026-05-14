import { CheckCheck, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const alarms = [
  { id: 1, metric: 'CPU Kullanımı Yüksek', severity: 'critical', time: '2 dk önce', status: 'Açık' },
  { id: 2, metric: 'Gecikme (Latency) Artışı', severity: 'warning', time: '15 dk önce', status: 'Açık' },
  { id: 3, metric: 'Paket Kaybı', severity: 'warning', time: '1 saat önce', status: 'Kabul Edildi' },
];

export function StationAlarmTab() {
  return (
    <div className="bg-white rounded-xl border overflow-hidden mt-6 shadow-sm">
      <div className="border-b px-6 py-4 bg-slate-50 flex justify-between items-center">
        <h3 className="font-semibold text-slate-800">Açık Alarmlar</h3>
        <span className="text-xs bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full font-semibold">2 Yeni</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50">
            <tr>
              <th className="px-6 py-3">Metrik/Sorun</th>
              <th className="px-6 py-3">Şiddet</th>
              <th className="px-6 py-3">Zaman</th>
              <th className="px-6 py-3">Durum</th>
              <th className="px-6 py-3 text-right">Aksiyonlar</th>
            </tr>
          </thead>
          <tbody>
            {alarms.map((alarm) => (
              <tr key={alarm.id} className="border-b last:border-0 hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{alarm.metric}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    alarm.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  )}>
                    {alarm.severity}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">{alarm.time}</td>
                <td className="px-6 py-4 text-slate-500">{alarm.status}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs px-2" title="Kabul Et (Acknowledge)">
                      <CheckCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      Kabul Et
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs px-2" title="Teknisyene Ata">
                      <UserPlus className="w-3.5 h-3.5 mr-1 text-blue-600" />
                      Ata
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {alarms.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            Açık alarm bulunmamaktadır.
          </div>
        )}
      </div>
    </div>
  );
}

