import type { GeneratedMetric } from '../core/generator.js';

// Drops connected users by 80 percent suddenly
// Bağlı kullanıcı sayısını ani olarak yüzde 80 düşürür
export function applyUserDrop(metric: GeneratedMetric): GeneratedMetric {
  return {
    ...metric,
    connected_users: Math.floor(metric.connected_users * 0.2),
  };
}