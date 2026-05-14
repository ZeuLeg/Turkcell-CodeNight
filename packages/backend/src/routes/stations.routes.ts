import { Router } from 'express';
import { db } from '../config/db';
import { stations } from '../db/schema';
import { eq } from 'drizzle-orm'; from 'express';
import { insertMetric, getStationMetrics, getLatestMetric } from '../controllers/metrics.controller';

const router = Router();

// Yüksel'in simülatöründen gelen veriler buraya POST edilecek
router.post('/:stationId/metrics', insertMetric);

export default router;
router.get('/', async (req, res) => {
  const allStations = await db.select().from(stations);
  res.json({ success: true, data: allStations });
});

router.get('/:id', async (req, res) => {
  const station = await db.query.stations.findFirst({ where: eq(stations.id, req.params.id) });
  res.json({ success: true, data: station });
});

router.get('/:stationId/metrics', getStationMetrics);
router.get('/:stationId/metrics/latest', getLatestMetric);
