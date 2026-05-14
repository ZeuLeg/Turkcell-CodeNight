import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface ThresholdConfig {
  warning: number;
  critical: number;
}

interface MetricChartProps {
  title: string;
  data: any[];
  dataKey: string;
  color: string;
  unit: string;
  domain?: [number, number];
  thresholds?: ThresholdConfig;
  /** 'above' = daha yüksek daha kötü (CPU, Bellek, Gecikme)
   *  'below' = daha düşük daha kötü (RSSI sinyal gücü) */
  thresholdDirection?: 'above' | 'below';
  currentValue?: number;
}

function StatusDot({
  value,
  thresholds,
  direction = 'above',
}: {
  value?: number;
  thresholds?: ThresholdConfig;
  direction?: 'above' | 'below';
}) {
  if (value === undefined || !thresholds) return null;

  const isCritical =
    direction === 'above' ? value >= thresholds.critical : value <= thresholds.critical;
  const isWarning =
    direction === 'above' ? value >= thresholds.warning : value <= thresholds.warning;

  if (isCritical) return <span className="inline-block h-2 w-2 rounded-full bg-red-500 mr-1" />;
  if (isWarning) return <span className="inline-block h-2 w-2 rounded-full bg-amber-400 mr-1" />;
  return <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 mr-1" />;
}

export function MetricChart({
  title,
  data,
  dataKey,
  color,
  unit,
  domain = [0, 100],
  thresholds,
  thresholdDirection = 'above',
  currentValue,
}: MetricChartProps) {
  const lastVal = currentValue ?? data[data.length - 1]?.[dataKey];

  // For 'below' direction the thresholds sit near the bottom of the chart,
  // so labels go above the line (insideTopRight). For 'above' they sit near
  // the top, so labels also go to the top — but we nudge warning to bottom
  // to avoid overlap with the critical label.
  const warningLabelPos =
    thresholdDirection === 'below' ? 'insideTopRight' : 'insideBottomRight';
  const criticalLabelPos = 'insideTopRight';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col" style={{ height: '220px' }}>
      <div className="flex justify-between items-center mb-3 shrink-0">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1">
          <StatusDot value={lastVal} thresholds={thresholds} direction={thresholdDirection} />
          {title}
        </h3>
        <span className="text-sm font-bold text-slate-900 tabular-nums">
          {lastVal ?? '—'}{unit}
        </span>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad_${dataKey}_${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="time" hide />
            <YAxis
              domain={domain}
              tick={{ fontSize: 9, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.07)',
                fontSize: '12px',
              }}
              formatter={(val: any) => [`${val}${unit}`, title]}
            />

            {thresholds && (
              <>
                <ReferenceLine
                  y={thresholds.warning}
                  stroke="#f59e0b"
                  strokeDasharray="4 3"
                  strokeWidth={1.5}
                  label={{
                    value: `Uyarı (${thresholds.warning}${unit})`,
                    position: warningLabelPos,
                    fill: '#b45309',
                    fontSize: 9,
                  }}
                />
                <ReferenceLine
                  y={thresholds.critical}
                  stroke="#ef4444"
                  strokeDasharray="4 3"
                  strokeWidth={1.5}
                  label={{
                    value: `Kritik (${thresholds.critical}${unit})`,
                    position: criticalLabelPos,
                    fill: '#b91c1c',
                    fontSize: 9,
                  }}
                />
              </>
            )}

            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#grad_${dataKey}_${title})`}
              isAnimationActive={false}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
