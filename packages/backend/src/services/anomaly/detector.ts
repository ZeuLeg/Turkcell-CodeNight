import { and, eq, gte } from 'drizzle-orm';
import { db } from '../../config/db';
import { alarms, thresholdConfigs } from '../../db/schema';

export const checkAnomalies = async (metric: any) => {
  try {
    // 1. Veritabanından aktif eşik değerlerini çek
    const thresholds = await db.select().from(thresholdConfigs).where(eq(thresholdConfigs.isActive, 1));

    for (const config of thresholds) {
      const { metricName, warningThreshold, criticalThreshold, direction } = config;

      // Gelen metrikteki eşleşen değeri bul (connectedUsers_high vs mapping)
      let currentValue: number | undefined;
      if (metricName === 'connectedUsers_high' || metricName === 'connectedUsers_low') {
        currentValue = Number(metric.connectedUsers);
      } else {
        currentValue = Number(metric[metricName]);
      }

      if (currentValue === undefined || isNaN(currentValue)) continue;

      let severity: 'WARNING' | 'CRITICAL' | null = null;
      let isAnomaly = false;

      const warnNum = Number(warningThreshold);
      const critNum = Number(criticalThreshold);

      // 2. Yön bazlı (above/below) eşik kontrolü
      if (direction === 'above') {
        if (currentValue >= critNum) { severity = 'CRITICAL'; isAnomaly = true; }
        else if (currentValue >= warnNum) { severity = 'WARNING'; isAnomaly = true; }
      } else if (direction === 'below') {
        if (currentValue <= critNum) { severity = 'CRITICAL'; isAnomaly = true; }
        else if (currentValue <= warnNum) { severity = 'WARNING'; isAnomaly = true; }
      }

      // 3. Alarm Üretimi ve 5 Dakika Kuralı
      if (isAnomaly && severity) {
        const actualMetricName = metricName.startsWith('connectedUsers') ? 'connectedUsers' : metricName;
        const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);

        // Son 5 dk içinde AÇIK alarm var mı?
        const existingAlarm = await db.query.alarms.findFirst({
          where: and(
            eq(alarms.stationId, metric.stationId),
            eq(alarms.metricName, actualMetricName),
            eq(alarms.status, 'OPEN'),
            gte(alarms.createdAt, fiveMinsAgo)
          )
        });

        if (!existingAlarm) {
          await db.insert(alarms).values({
            stationId: metric.stationId,
            metricName: actualMetricName,
            severity: severity,
            message: `${actualMetricName} eşik değerini aştı: ${currentValue} (Limit: ${severity === 'CRITICAL' ? critNum : warnNum})`,
          });
          console.log(`🚨 ALARM: İstasyon ${metric.stationId} | ${actualMetricName} = ${currentValue} (${severity})`);
        } else if (existingAlarm.severity === 'WARNING' && severity === 'CRITICAL') {
          // Mevcut uyarıyı kritik seviyeye güncelle
          await db.update(alarms)
            .set({ severity: 'CRITICAL', message: `Durum Kötüleşti: ${actualMetricName} = ${currentValue}` })
            .where(eq(alarms.id, existingAlarm.id));
        }
      }
    }
  } catch (error) {
    console.error('[Anomaly Detector] Error:', error);
  }
};