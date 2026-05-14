import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef
} from '@tanstack/react-table';
import { BellOff } from 'lucide-react';

interface AlarmTableProps {
  data: any[];
  onRowClick: (alarm: any) => void;
  maxRows?: number;
}

const SEVERITY_STYLES: Record<string, string> = {
  CRITICAL: 'bg-red-100 text-red-800 ring-1 ring-red-200',
  WARNING: 'bg-amber-100 text-amber-800 ring-1 ring-amber-200',
};

const SEVERITY_LABELS: Record<string, string> = {
  CRITICAL: 'Kritik',
  WARNING: 'Uyarı',
};

const STATUS_STYLES: Record<string, string> = {
  OPEN: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  ACKNOWLEDGED: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  IN_PROGRESS: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  RESOLVED: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
};

const STATUS_LABELS: Record<string, string> = {
  OPEN: 'Açık',
  ACKNOWLEDGED: 'Kabul Edildi',
  IN_PROGRESS: 'Müdahale Ediliyor',
  RESOLVED: 'Çözüldü',
};

const METRIC_LABELS: Record<string, string> = {
  cpuUsage: 'CPU Kullanımı',
  memoryUsage: 'Bellek',
  packetLoss: 'Paket Kaybı',
  latency: 'Gecikme',
  rssi: 'Sinyal',
  connectedUsers: 'Bağlı Kullanıcı',
};

export const AlarmTable: React.FC<AlarmTableProps> = ({ data, onRowClick, maxRows }) => {
  const displayData = maxRows ? data.slice(0, maxRows) : data;

  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'severity',
        header: 'Şiddet',
        cell: (info) => {
          const val = info.getValue() as string;
          return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${SEVERITY_STYLES[val] ?? 'bg-slate-100 text-slate-700'}`}>
              {SEVERITY_LABELS[val] ?? val}
            </span>
          );
        },
      },
      {
        id: 'station',
        header: 'İstasyon',
        cell: ({ row }) => {
          const alarm = row.original;
          const name = alarm.station?.name ?? alarm.station?.code;
          return name
            ? (
              <div>
                <p className="text-sm font-medium text-slate-800">{name}</p>
                <p className="text-xs text-slate-400 font-mono">{alarm.station?.code}</p>
              </div>
            )
            : <span className="font-mono text-xs text-slate-400">{(alarm.stationId as string).slice(0, 8)}…</span>;
        },
      },
      {
        accessorKey: 'metricName',
        header: 'Metrik',
        cell: (info) => {
          const val = info.getValue() as string;
          return <span className="text-sm text-slate-600">{METRIC_LABELS[val] ?? val}</span>;
        },
      },
      {
        accessorKey: 'message',
        header: 'Mesaj',
        cell: (info) => (
          <span className="text-sm text-slate-600 line-clamp-1 max-w-xs">{info.getValue() as string}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Durum',
        cell: (info) => {
          const val = info.getValue() as string;
          return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[val] ?? 'bg-slate-100 text-slate-700'}`}>
              {STATUS_LABELS[val] ?? val}
            </span>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Tarih',
        cell: (info) => (
          <span className="text-xs text-slate-500 whitespace-nowrap">
            {new Date(info.getValue() as string).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
          </span>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: displayData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                onClick={() => onRowClick(row.original)}
                className="hover:bg-slate-50 cursor-pointer transition-colors"
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {displayData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <BellOff className="h-10 w-10 mb-3 opacity-40" />
            <p className="text-sm font-medium">Gösterilecek alarm yok</p>
            <p className="text-xs mt-1">Filtreleri değiştirerek tekrar deneyin</p>
          </div>
        )}
      </div>
    </div>
  );
};
