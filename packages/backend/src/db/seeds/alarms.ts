import { db } from '../../config/db';
import { alarms, stations, users } from '../schema';
import { eq } from 'drizzle-orm';

const METRIC_MESSAGES: Record<string, { warning: string; critical: string }> = {
  cpu_usage: {
    warning: 'CPU kullanımı %85 eşiğini aştı',
    critical: 'CPU kullanımı %95 kritik seviyesinde',
  },
  memory_usage: {
    warning: 'Bellek kullanımı %80 eşiğini aştı',
    critical: 'Bellek kullanımı %92 kritik seviyesinde, OOM riski var',
  },
  packet_loss: {
    warning: 'Paket kaybı %2 uyarı eşiğini geçti',
    critical: 'Paket kaybı %8 kritik seviyede, servis kalitesi düşüyor',
  },
  latency: {
    warning: 'Gecikme 80ms uyarı eşiğini aştı',
    critical: 'Gecikme 150ms kritik seviyede, kullanıcı deneyimi etkileniyor',
  },
  rssi: {
    warning: 'RSSI -90 dBm uyarı eşiğinin altına düştü',
    critical: 'RSSI -105 dBm kritik seviyede, sinyal çok zayıf',
  },
};

function hoursAgo(h: number): Date {
  return new Date(Date.now() - h * 60 * 60 * 1000);
}

export const seedAlarms = async () => {
  console.log('[Seed] Alarmlar veritabanına yazılıyor...');

  // Fetch real station IDs
  const allStations = await db.select({ id: stations.id, code: stations.code }).from(stations);
  if (allStations.length === 0) throw new Error('Önce istasyonları seed edin (seedStations)');

  // Fetch saha mühendisi IDs for assignedTo
  const sahaUsers = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(eq(users.role, 'FIELD_ENGINEER'));

  const saha1Id = sahaUsers[0]?.id ?? null;
  const saha2Id = sahaUsers[1]?.id ?? null;

  // Pick 12 stations spread across the list
  const pick = (i: number) => allStations[i % allStations.length].id;

  const rows: (typeof alarms.$inferInsert)[] = [
    // ── OPEN alarms (fresh, unassigned) ──────────────────────────────
    {
      stationId: pick(0),
      metricName: 'cpu_usage',
      severity: 'CRITICAL',
      status: 'OPEN',
      message: METRIC_MESSAGES.cpu_usage.critical,
      createdAt: hoursAgo(1),
    },
    {
      stationId: pick(1),
      metricName: 'packet_loss',
      severity: 'CRITICAL',
      status: 'OPEN',
      message: METRIC_MESSAGES.packet_loss.critical,
      createdAt: hoursAgo(2),
    },
    {
      stationId: pick(2),
      metricName: 'memory_usage',
      severity: 'WARNING',
      status: 'OPEN',
      message: METRIC_MESSAGES.memory_usage.warning,
      createdAt: hoursAgo(3),
    },
    {
      stationId: pick(3),
      metricName: 'latency',
      severity: 'WARNING',
      status: 'OPEN',
      message: METRIC_MESSAGES.latency.warning,
      createdAt: hoursAgo(4),
    },
    {
      stationId: pick(4),
      metricName: 'rssi',
      severity: 'CRITICAL',
      status: 'OPEN',
      message: METRIC_MESSAGES.rssi.critical,
      createdAt: hoursAgo(5),
    },

    // ── ACKNOWLEDGED alarms ───────────────────────────────────────────
    {
      stationId: pick(5),
      metricName: 'cpu_usage',
      severity: 'WARNING',
      status: 'ACKNOWLEDGED',
      message: METRIC_MESSAGES.cpu_usage.warning,
      assignedTo: saha1Id,
      createdAt: hoursAgo(8),
    },
    {
      stationId: pick(6),
      metricName: 'packet_loss',
      severity: 'WARNING',
      status: 'ACKNOWLEDGED',
      message: METRIC_MESSAGES.packet_loss.warning,
      assignedTo: saha2Id,
      createdAt: hoursAgo(10),
    },

    // ── IN_PROGRESS alarms ────────────────────────────────────────────
    {
      stationId: pick(7),
      metricName: 'rssi',
      severity: 'CRITICAL',
      status: 'IN_PROGRESS',
      message: METRIC_MESSAGES.rssi.critical,
      assignedTo: saha1Id,
      createdAt: hoursAgo(12),
    },
    {
      stationId: pick(8),
      metricName: 'latency',
      severity: 'CRITICAL',
      status: 'IN_PROGRESS',
      message: METRIC_MESSAGES.latency.critical,
      assignedTo: saha2Id,
      createdAt: hoursAgo(14),
    },
    {
      stationId: pick(9),
      metricName: 'memory_usage',
      severity: 'CRITICAL',
      status: 'IN_PROGRESS',
      message: METRIC_MESSAGES.memory_usage.critical,
      assignedTo: saha1Id,
      createdAt: hoursAgo(16),
    },

    // ── RESOLVED alarms ───────────────────────────────────────────────
    {
      stationId: pick(10),
      metricName: 'cpu_usage',
      severity: 'CRITICAL',
      status: 'RESOLVED',
      message: METRIC_MESSAGES.cpu_usage.critical,
      assignedTo: saha2Id,
      resolutionNote: 'Yüksek CPU tüketen süreç tespit edilip yeniden başlatıldı. Servis normale döndü.',
      createdAt: hoursAgo(24),
      resolvedAt: hoursAgo(22),
    },
    {
      stationId: pick(11),
      metricName: 'packet_loss',
      severity: 'CRITICAL',
      status: 'RESOLVED',
      message: METRIC_MESSAGES.packet_loss.critical,
      assignedTo: saha1Id,
      resolutionNote: 'Fiber bağlantı kesintisi giderildi. Paket kaybı %0.1 seviyesine indi.',
      createdAt: hoursAgo(36),
      resolvedAt: hoursAgo(33),
    },
    {
      stationId: pick(12),
      metricName: 'rssi',
      severity: 'WARNING',
      status: 'RESOLVED',
      message: METRIC_MESSAGES.rssi.warning,
      assignedTo: saha2Id,
      resolutionNote: 'Anten yönü düzeltildi. RSSI -78 dBm değerine yükseldi.',
      createdAt: hoursAgo(48),
      resolvedAt: hoursAgo(46),
    },
    {
      stationId: pick(13),
      metricName: 'memory_usage',
      severity: 'WARNING',
      status: 'RESOLVED',
      message: METRIC_MESSAGES.memory_usage.warning,
      assignedTo: saha1Id,
      resolutionNote: 'Bellek sızıntısına yol açan yazılım güncellemesi yapıldı.',
      createdAt: hoursAgo(72),
      resolvedAt: hoursAgo(70),
    },
  ];

  await db.insert(alarms).values(rows);

  const counts = rows.reduce<Record<string, number>>((acc, r) => {
    const s = r.status as string;
    acc[s] = (acc[s] ?? 0) + 1;
    return acc;
  }, {});

  console.log(
    `[Seed] ✓ ${rows.length} alarm eklendi — ` +
    Object.entries(counts).map(([s, n]) => `${n}×${s}`).join(', ')
  );
};
