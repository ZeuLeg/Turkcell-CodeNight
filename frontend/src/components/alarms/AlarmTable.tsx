import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge'; // need to create a simple badge or use div

const mockAlarms = [
  { id: 1, station: 'TR-ANK-01', metric: 'Sıcaklık', severity: 'critical', time: '10:45:22' },
  { id: 2, station: 'TR-IST-02', metric: 'Sinyal Gücü', severity: 'warning', time: '10:42:10' },
  { id: 3, station: 'TR-IZM-01', metric: 'Bağlantı', severity: 'offline', time: '10:30:05' },
  { id: 4, station: 'TR-ANT-01', metric: 'Voltaj', severity: 'warning', time: '10:15:33' },
  { id: 5, station: 'TR-IST-01', metric: 'Bant Genişliği', severity: 'warning', time: '09:55:12' },
];

export function AlarmTable() {
  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden flex flex-col h-full">
      <div className="border-b px-4 py-3 bg-slate-50 flex justify-between items-center">
        <h3 className="font-semibold text-slate-800">Son Alarmlar</h3>
        <span className="text-xs text-slate-500">Canlı</span>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0">
            <tr>
              <th className="px-4 py-2">İstasyon</th>
              <th className="px-4 py-2">Metrik</th>
              <th className="px-4 py-2">Şiddet</th>
              <th className="px-4 py-2 text-right">Zaman</th>
            </tr>
          </thead>
          <tbody>
            {mockAlarms.map((alarm) => (
              <tr key={alarm.id} className="border-b last:border-0 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{alarm.station}</td>
                <td className="px-4 py-3 text-slate-600">{alarm.metric}</td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                    alarm.severity === 'critical' ? 'bg-red-100 text-red-700' :
                    alarm.severity === 'warning' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-700'
                  )}>
                    {alarm.severity}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-slate-500">{alarm.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

