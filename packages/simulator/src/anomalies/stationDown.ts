import type { GeneratedMetric } from '../core/generator.js';

// All metrics drop to zero or invalid range
// Tüm metrikler sıfıra veya geçersiz aralığa düşer
export function applyStationDown(metric: GeneratedMetric): GeneratedMetric {
  return {
    cpu_usage: 0,
    memory_usage: 0,
    packet_loss: 100,
    latency: 0,
    rssi: -100,
    connected_users: 0,
  };
}