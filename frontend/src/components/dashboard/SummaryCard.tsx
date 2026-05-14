import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorClass?: string;
}

export function SummaryCard({ title, value, icon: Icon, trend, colorClass = "text-primary" }: SummaryCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        <Icon className={cn("h-5 w-5", colorClass)} />
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <p className="text-3xl font-bold text-slate-900">{value}</p>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center text-sm font-medium",
              trend.isPositive ? "text-emerald-600" : "text-red-600"
            )}
          >
            {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </div>
  );
}

