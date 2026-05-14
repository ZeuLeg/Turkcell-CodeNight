// Tracks active anomaly injections per station
// Her istasyon için aktif anomali enjeksiyonlarını tutar
import type { AnomalyType } from '@telcoguard/shared';

interface ActiveAnomaly {
  type: AnomalyType;
  expiresAt: number;
}

const activeAnomalies = new Map<string, ActiveAnomaly>();

export function injectAnomaly(stationId: string, type: AnomalyType, durationSeconds: number): void {
  activeAnomalies.set(stationId, {
    type,
    expiresAt: Date.now() + durationSeconds * 1000,
  });
}

export function getActiveAnomaly(stationId: string): AnomalyType | null {
  const anomaly = activeAnomalies.get(stationId);
  if (!anomaly) return null;
  if (Date.now() > anomaly.expiresAt) {
    activeAnomalies.delete(stationId);
    return null;
  }
  return anomaly.type;
}

export function clearAnomaly(stationId: string): void {
  activeAnomalies.delete(stationId);
}