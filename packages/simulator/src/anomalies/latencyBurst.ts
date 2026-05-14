import type { GeneratedMetric } from '../core/generator.js';

// Latency spikes above 200ms threshold
// Gecikme 200ms eşiğinin üzerine çıkar
export function applyLatencyBurst(metric: GeneratedMetric): GeneratedMetric {
  return {
    ...metric,
    latency: 200 + Math.random() * 100,
  };
}