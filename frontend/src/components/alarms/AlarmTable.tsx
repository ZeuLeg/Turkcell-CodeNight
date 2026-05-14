import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef
} from '@tanstack/react-table';

interface AlarmTableProps {
  data: any[];
  onRowClick: (alarm: any) => void;
}

export const AlarmTable: React.FC<AlarmTableProps> = ({ data, onRowClick }) => {
  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'severity',
        header: 'Şiddet',
        cell: (info) => {
          const val = info.getValue() as string;
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${val === 'CRITICAL' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>
              {val === 'CRITICAL' ? 'Kritik' : 'Uyarı'}
            </span>
          );
        }
      },
      {
        accessorKey: 'stationId',
        header: 'İstasyon ID',
      },
      {
        accessorKey: 'metricName',
        header: 'Metrik',
      },
      {
        accessorKey: 'status',
        header: 'Durum',
        cell: (info) => {
          const val = info.getValue() as string;
          return (
            <span className={`font-medium ${val === 'OPEN' ? 'text-red-600' : 'text-green-600'}`}>
              {val === 'OPEN' ? 'Açık' : 'Çözüldü'}
            </span>
          );
        }
      },
      {
        accessorKey: 'createdAt',
        header: 'Tarih',
        cell: (info) => new Date(info.getValue() as string).toLocaleString()
      }
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-6 py-3">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr 
                key={row.id} 
                onClick={() => onRowClick(row.original)}
                className="bg-white border-b hover:bg-gray-50 cursor-pointer transition-colors"
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Kayıtlı alarm bulunmuyor veya filtrelere uyan sonuç yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
