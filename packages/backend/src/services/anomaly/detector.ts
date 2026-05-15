import { and, eq, gte, desc } from 'drizzle-orm';
import { db } from '../../config/db';
import { alarms, thresholdConfigs, stations, metrics } from '../../db/schema';

// Son N ölçümden Z-Score hesapla: |z|>2.5 WARNING, |z|>3.5 CRITICAL
const Z_SCORE_WINDOW = 20;
const Z_METRICS = ['cpuUsage', 'memoryUsage', 'packetLoss', 'latency', 'connectedUsers'] as const;
type ZMetric = typeof Z_METRICS[number];

async function checkZScore(
  stationId: string,
  currentMetric: any
): Promise<{ metric: ZMetric; severity: 'WARNING' | 'CRITICAL'; z: number }[]> {
  const history = await db
    .select()
    .from(metrics)
    .where(eq(metrics.stationId, stationId))
    .orderBy(desc(metrics.timestamp))
    .limit(Z_SCORE_WINDOW);

  if (history.length < 10) return []; // yetersiz veri

  const results: { metric: ZMetric; severity: 'WARNING' | 'CRITICAL'; z: number }[] = [];

  for (const key of Z_METRICS) {
    const vals = history.map(m => Number(m[key as keyof typeof m])).filter(v => !isNaN(v));
    if (vals.length < 10) continue;

    const mean = vals.reduce((s, v) => s + v, 0) / vals.length;
    const std  = Math.sqrt(vals.reduce((s, v) => s + (v - mean) ** 2, 0) / vals.length);
    if (std < 0.001) continue; // sabit değer, z-score anlamsız

    const current = Number(currentMetric[key]);
    if (isNaN(current)) continue;

    const z = Math.abs((current - mean) / std);
    if (z > 3.5) results.push({ metric: key, severity: 'CRITICAL', z });
    else if (z > 2.5) results.push({ metric: key, severity: 'WARNING', z });
  }

  return results;
}

async function insertAlarmIfNew(
  stationId: string,
  metricName: string,
  severity: 'WARNING' | 'CRITICAL',
  message: string
): Promise<void> {
  const fiveMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
  const existing = await db.query.alarms.findFirst({
    where: and(
      eq(alarms.stationId, stationId),
      eq(alarms.metricName, metricName),
      eq(alarms.status, 'OPEN'),
      gte(alarms.createdAt, fiveMinsAgo)
    )
  });

  if (!existing) {
    await db.insert(alarms).values({ stationId, metricName, severity, message });
    console.log(`🚨 ALARM: İstasyon ${stationId} | ${metricName} (${severity}) | ${message}`);
  } else if (existing.severity === 'WARNING' && severity === 'CRITICAL') {
    await db.update(alarms)
      .set({ severity: 'CRITICAL', message: `Durum Kötüleşti: ${message}` })
      .where(eq(alarms.id, existing.id));
  }
}

export const checkAnomalies = async (metric: any) => {
  try {
    const thresholds = await db.select().from(thresholdConfigs).where(eq(thresholdConfigs.isActive, 1));
    const detectedAnomalies: { metric: string; severity: string; value: number }[] = [];

    // ── 1. Threshold Kontrolü ─────────────────────────────────────────
    for (const config of thresholds) {
      const { metricName, warningThreshold, criticalThreshold, direction } = config;

      let currentValue: number | undefined;
      if (metricName === 'connectedUsers_high' || metricName === 'connectedUsers_low') {
        currentValue = Number(metric.connectedUsers);
      } else {
        currentValue = Number(metric[metricName]);
      }
      if (currentValue === undefined || isNaN(currentValue)) continue;

      let severity: 'WARNING' | 'CRITICAL' | null = null;
      const warnNum = Number(warningThreshold);
      const critNum = Number(criticalThreshold);

      if (direction === 'above') {
        if (currentValue >= critNum) severity = 'CRITICAL';
        else if (currentValue >= warnNum) severity = 'WARNING';
      } else if (direction === 'below') {
        if (currentValue <= critNum) severity = 'CRITICAL';
        else if (currentValue <= warnNum) severity = 'WARNING';
      }

      if (severity) {
        const actualName = metricName.startsWith('connectedUsers') ? 'connectedUsers' : metricName;
        detectedAnomalies.push({ metric: actualName, severity, value: currentValue });
        await insertAlarmIfNew(
          metric.stationId,
          actualName,
          severity,
          `[THRESHOLD] ${actualName} = ${currentValue} (Limit: ${severity === 'CRITICAL' ? critNum : warnNum})`
        );
      }
    }

    // ── 2. Z-Score Kontrolü (Bonus) ───────────────────────────────────
    const zResults = await checkZScore(metric.stationId, metric);
    for (const { metric: mName, severity, z } of zResults) {
      const alreadyDetected = detectedAnomalies.some(a => a.metric === mName);
      if (!alreadyDetected) {
        detectedAnomalies.push({ metric: mName, severity, value: Number(metric[mName]) });
        await insertAlarmIfNew(
          metric.stationId,
          mName,
          severity,
          `[Z-SCORE] ${mName} anormal sapma: z=${z.toFixed(2)} (${severity === 'CRITICAL' ? '|z|>3' : '|z|>2'})`
        );
      }
    }

    // ── 3. Korelasyon: CPU + Latency (Bonus) ─────────────────────────
    const hasCpu     = detectedAnomalies.find(a => a.metric === 'cpuUsage');
    const hasLatency = detectedAnomalies.find(a => a.metric === 'latency');
    if (hasCpu && hasLatency) {
      await insertAlarmIfNew(
        metric.stationId,
        'correlation_bottleneck',
        'CRITICAL',
        `[KORELASYON] Darboğaz! CPU (${hasCpu.value}%) + Gecikme (${hasLatency.value}ms) eş zamanlı yüksek.`
      );
      detectedAnomalies.push({ metric: 'correlation_bottleneck', severity: 'CRITICAL', value: 0 });
    }

    // ── 4. İstasyon Durumu Güncelle ───────────────────────────────────
    await updateStationStatus(metric.stationId, detectedAnomalies);

  } catch (error) {
    console.error('[Anomaly Detector] Error:', error);
  }
};

async function updateStationStatus(
  stationId: string,
  anomalies: { metric: string; severity: string; value: number }[]
) {
  const isDown     = anomalies.some(a => a.metric === 'connectedUsers' && a.value === 0);
  const hasCritical = anomalies.some(a => a.severity === 'CRITICAL');
  const hasWarning  = anomalies.some(a => a.severity === 'WARNING');

  const newStatus: 'ACTIVE' | 'WARNING' | 'CRITICAL' | 'OFFLINE' =
    isDown ? 'OFFLINE' :
    hasCritical ? 'CRITICAL' :
    hasWarning  ? 'WARNING'  : 'ACTIVE';

  await db.update(stations).set({ status: newStatus }).where(eq(stations.id, stationId));
}
