import { db } from '../../config/db';
import { metrics, stations } from '../schema';

// Sabit seed ile tekrarlanabilir rastgele sayı üretici (gerçekçi görünüm için)
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function clamp(val: number, min: number, max: number, decimals = 2): string {
  return Math.max(min, Math.min(max, val)).toFixed(decimals);
}

export const seedMetrics = async () => {
  console.log('[Seed] Metrikler veritabanına yazılıyor...');

  const allStations = await db.select({ id: stations.id, capacity: stations.capacity }).from(stations);
  if (allStations.length === 0) throw new Error('Önce istasyonları seed edin (seedStations)');

  // Son 24 saat, her 30 dakikada bir → 48 veri noktası / istasyon
  const INTERVAL_MS = 30 * 60 * 1000;
  const POINTS = 48;
  const now = Date.now();

  const BATCH_SIZE = 200;
  let totalInserted = 0;
  let batch: (typeof metrics.$inferInsert)[] = [];

  for (let si = 0; si < allStations.length; si++) {
    const station = allStations[si];
    const rand = seededRandom(si * 9973 + 1337);

    // Her istasyona özgü "normal" taban değerleri
    const baseCpu    = 30 + rand() * 35;   // 30–65%
    const baseMem    = 40 + rand() * 30;   // 40–70%
    const baseLoss   = rand() * 1.5;       // 0–1.5%
    const baseLatency= 20 + rand() * 40;   // 20–60ms
    const baseRssi   = -65 - rand() * 25;  // -65 to -90 dBm

    for (let p = 0; p < POINTS; p++) {
      const ts = new Date(now - (POINTS - 1 - p) * INTERVAL_MS);

      // Gün içi yük dalgalanması (pik saat 09-18)
      const hour = ts.getHours();
      const peakFactor = hour >= 9 && hour <= 18 ? 1.3 : 0.8;

      // Küçük gürültü
      const noise = () => (rand() - 0.5) * 10;

      const cpu     = baseCpu * peakFactor + noise();
      const mem     = baseMem * peakFactor * 0.7 + noise() * 0.5;
      const loss    = baseLoss + rand() * 0.5;
      const latency = baseLatency * peakFactor + noise() * 2;
      const rssi    = baseRssi + noise() * 0.3;
      const users   = Math.round(
        (station.capacity * (0.2 + (peakFactor - 0.8) * 0.4) + (rand() - 0.5) * 50)
      );

      batch.push({
        stationId:      station.id,
        timestamp:      ts,
        cpuUsage:       clamp(cpu,     0, 100),
        memoryUsage:    clamp(mem,     0, 100),
        packetLoss:     clamp(loss,    0,  20),
        latency:        clamp(latency, 1, 500),
        rssi:           clamp(rssi,  -120, -40),
        connectedUsers: Math.max(0, users),
      });

      if (batch.length >= BATCH_SIZE) {
        await db.insert(metrics).values(batch);
        totalInserted += batch.length;
        batch = [];
      }
    }
  }

  if (batch.length > 0) {
    await db.insert(metrics).values(batch);
    totalInserted += batch.length;
  }

  console.log(
    `[Seed] ✓ ${totalInserted} metrik eklendi ` +
    `(${allStations.length} istasyon × ${POINTS} veri noktası)`
  );
};
