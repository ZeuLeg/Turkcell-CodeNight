import type { MetricName } from './metric.js';

export type ThresholdDirection = 'ABOVE' | 'BELOW';

export interface ThresholdConfig {
  id: string;
  metric_name: MetricName;
  warning_value: number;
  critical_value: number;
  direction: ThresholdDirection;
  is_active: boolean;
}