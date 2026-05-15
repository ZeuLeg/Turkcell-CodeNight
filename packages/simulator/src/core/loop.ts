import { stations } from '../data/stations.js';
import { generateNormalMetric } from './generator.js';
import { getActiveAnomaly } from './state.js';
import { applyAnomaly } from '../anomalies/index.js';
import { sendMetric } from '../api/backendClient.js';
import { env } from '../config/env.js';

let tickHandle: NodeJS.Timeout | null = null;

// Single tick: generate metrics for all stations
// Tek tick: tüm istasyonlar için metrik üret
async function runTick(): Promise<void> {
  await Promise.all(
    stations.map(async (station) => {
      let metric = generateNormalMetric();
      const anomaly = getActiveAnomaly(station.code);
      if (anomaly) {
        metric = applyAnomaly(anomaly, metric);
      }
      await sendMetric(station.code, metric);
    })
  );
}

export function startLoop(): void {
  if (tickHandle) return;
  console.log(`Simulator loop started, interval ${env.TICK_INTERVAL_MS}ms`);
  tickHandle = setInterval(() => {
    runTick().catch((err) => console.error('Tick error', err));
  }, env.TICK_INTERVAL_MS);
}

export function stopLoop(): void {
  if (!tickHandle) return;
  clearInterval(tickHandle);
  tickHandle = null;
  console.log('Simulator loop stopped');
}

export function isRunning(): boolean {
  return tickHandle !== null;
}