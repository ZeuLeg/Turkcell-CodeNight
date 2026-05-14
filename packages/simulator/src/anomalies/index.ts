import type { AnomalyType } from '@telcoguard/shared';
import type { GeneratedMetric } from '../core/generator.js';
import { applyCpuSpike } from './cpuSpike.js';
import { applyUserDrop } from './userDrop.js';
import { applyStationDown } from './stationDown.js';
import { applyLatencyBurst } from './latencyBurst.js';
import { applyPacketStorm } from './packetStorm.js';

// Map anomaly types to their handlers
// Anomali tiplerini handler fonksiyonlarına eşler
const handlers: Record<AnomalyType, (m: GeneratedMetric) => GeneratedMetric> = {
  CPU_SPIKE: applyCpuSpike,
  USER_DROP: applyUserDrop,
  STATION_DOWN: applyStationDown,
  LATENCY_BURST: applyLatencyBurst,
  PACKET_STORM: applyPacketStorm,
};

export function applyAnomaly(type: AnomalyType, metric: GeneratedMetric): GeneratedMetric {
  return handlers[type](metric);
}