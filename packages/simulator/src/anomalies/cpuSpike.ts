import type { GeneratedMetric } from '../core/generator.js';

// Overrides CPU to a critical range, leaves other metrics normal
// CPU değerini kritik aralığa çeker, diğer metrikleri normal bırakır
export function applyCpuSpike(metric: GeneratedMetric): GeneratedMetric {
  return {
    ...metric,
    cpu_usage: 95 + Math.random() * 5,
  };
}