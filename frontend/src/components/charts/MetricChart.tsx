import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MetricChartProps {
  title: string;
  data: any[];
  dataKey: string;
  color: string;
  unit: string;
  domain?: [number, number];
}

export function MetricChart({ title, data, dataKey, color, unit, domain = [0, 100] }: MetricChartProps) {
  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm h-64 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
        <span className="text-xs font-medium text-slate-500">{data[data.length - 1]?.[dataKey]} {unit}</span>
      </div>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="time" hide />
            <YAxis 
              domain={domain} 
              tick={{ fontSize: 10, fill: '#64748b' }} 
              axisLine={false} 
              tickLine={false}
              tickFormatter={(val) => `${val}${unit === '%' ? '' : ''}`}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              labelStyle={{ color: '#64748b', fontSize: '12px' }}
              itemStyle={{ color: '#0f172a', fontSize: '14px', fontWeight: 'bold' }}
            />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              strokeWidth={2}
              fillOpacity={1} 
              fill={`url(#color${dataKey})`} 
              isAnimationActive={false} // Disable animation for smoother live updates
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

