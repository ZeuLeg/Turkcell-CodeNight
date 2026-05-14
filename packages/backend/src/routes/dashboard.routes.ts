import { Router } from 'express';
import { db } from '../config/db';
import { stations, alarms } from '../db/schema';
import { getStations, getAlarms } from '../controllers/dashboard.controller';
import { ne } from 'drizzle-orm';

const router = Router();

router.get('/stations', getStations);
router.get('/alarms', getAlarms);

router.get('/summary', async (_req, res) => {
  const allStations = await db.select().from(stations);
  const allAlarms = await db.select().from(alarms);
  const activeAlarms = allAlarms.filter(a => a.status !== 'RESOLVED');
  res.json({
    success: true,
    data: {
      totalStations: allStations.length,
      activeAlarms: activeAlarms.length,
      criticalAlarms: activeAlarms.filter(a => a.severity === 'CRITICAL').length,
      offlineStations: allStations.filter(s => s.status === 'OFFLINE').length,
    },
  });
});

// GET /api/v1/dashboard/regions
// Bölge bazında istasyon ve alarm özeti
router.get('/regions', async (_req, res) => {
  const allStations = await db.select().from(stations);
  const activeAlarms = await db
    .select({ id: alarms.id, stationId: alarms.stationId, severity: alarms.severity })
    .from(alarms)
    .where(ne(alarms.status, 'RESOLVED'));

  // Alarm sayısını istasyon başına hesapla
  const alarmsByStation: Record<string, { total: number; critical: number }> = {};
  for (const a of activeAlarms) {
    if (!alarmsByStation[a.stationId]) alarmsByStation[a.stationId] = { total: 0, critical: 0 };
    alarmsByStation[a.stationId].total++;
    if (a.severity === 'CRITICAL') alarmsByStation[a.stationId].critical++;
  }

  // Bölgelere göre grupla
  const regionMap: Record<string, {
    stations: typeof allStations;
    totalAlarms: number;
    criticalAlarms: number;
  }> = {};

  for (const s of allStations) {
    if (!regionMap[s.region]) regionMap[s.region] = { stations: [], totalAlarms: 0, criticalAlarms: 0 };
    regionMap[s.region].stations.push(s);
    const counts = alarmsByStation[s.id];
    if (counts) {
      regionMap[s.region].totalAlarms += counts.total;
      regionMap[s.region].criticalAlarms += counts.critical;
    }
  }

  const data = Object.entries(regionMap).map(([name, r]) => {
    const activeCount = r.stations.filter(s => s.status === 'ACTIVE').length;
    const healthScore = r.stations.length > 0
      ? Math.round((activeCount / r.stations.length) * 100)
      : 100;
    return {
      name,
      stationCount: r.stations.length,
      healthScore,
      totalAlarms: r.totalAlarms,
      criticalAlarms: r.criticalAlarms,
      stations: r.stations.map(s => ({
        id: s.id,
        code: s.code,
        name: s.name,
        type: s.type,
        status: s.status,
        alarmCount: alarmsByStation[s.id]?.total ?? 0,
      })),
    };
  });

  res.json({ success: true, data });
});

export default router;
