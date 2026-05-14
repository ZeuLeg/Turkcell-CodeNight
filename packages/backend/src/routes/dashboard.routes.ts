import { Router } from 'express';
import { db } from '../config/db';
import { stations, alarms } from '../db/schema';
import { getStations, getAlarms } from '../controllers/dashboard.controller';

const router = Router();
router.get('/stations', getStations);
router.get('/alarms', getAlarms);

export default router;
router.get('/summary', async (req, res) => {
  const allStations = await db.select().from(stations);
  const allAlarms = await db.select().from(alarms);
  const activeAlarms = allAlarms.filter(a => a.status !== 'RESOLVED');
  res.json({
    success: true,
    data: {
      totalStations: allStations.length,
      activeAlarms: activeAlarms.length,
      criticalAlarms: activeAlarms.filter(a => a.severity === 'CRITICAL').length
    }
  });
});
