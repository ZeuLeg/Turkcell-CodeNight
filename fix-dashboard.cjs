const fs = require('fs');

// Station metrics and summary
const metricsCtrlPath = 'packages/backend/src/controllers/metrics.controller.ts';
let metricsCtrl = fs.readFileSync(metricsCtrlPath, 'utf8');
if(!metricsCtrl.includes('export const getStationMetrics = ')){
  metricsCtrl += `
export const getStationMetrics = async (req: Request, res: Response) => {
  const { stationId } = req.params;
  const { from, to } = req.query;
  const metricsData = await db.query.metrics.findMany({
    where: eq(metrics.stationId, stationId),
    orderBy: (metrics, { desc }) => [desc(metrics.timestamp)],
    limit: 100 // Prevent loading huge amounts, but ideally use from/to
  });
  res.json({ success: true, data: metricsData });
};

export const getLatestMetric = async (req: Request, res: Response) => {
  const { stationId } = req.params;
  const latest = await db.query.metrics.findFirst({
    where: eq(metrics.stationId, stationId),
    orderBy: (metrics, { desc }) => [desc(metrics.timestamp)],
  });
  res.json({ success: true, data: latest });
};
`;
  fs.writeFileSync(metricsCtrlPath, metricsCtrl);
}

const stationsRoutesPath = 'packages/backend/src/routes/stations.routes.ts';
let stationsRoutes = fs.readFileSync(stationsRoutesPath, 'utf8');
if(!stationsRoutes.includes('getStationMetrics')){
  stationsRoutes = stationsRoutes.replace("import { insertMetric }", "import { insertMetric, getStationMetrics, getLatestMetric }");
  stationsRoutes = stationsRoutes.replace("import { Router }", "import { Router } from 'express';\nimport { db } from '../config/db';\nimport { stations } from '../db/schema';\nimport { eq } from 'drizzle-orm';");
  stationsRoutes += `
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
`;
  fs.writeFileSync(stationsRoutesPath, stationsRoutes);
}

// Write the summary endpoint to dashboard routes
const dRoutesPath = 'packages/backend/src/routes/dashboard.routes.ts';
let dRoutes = fs.readFileSync(dRoutesPath, 'utf8');
if(!dRoutes.includes('/summary')) {
  dRoutes = dRoutes.replace("import { Router } from 'express';", "import { Router } from 'express';\nimport { db } from '../config/db';\nimport { stations, alarms } from '../db/schema';");
  dRoutes += `
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
`;
  fs.writeFileSync(dRoutesPath, dRoutes);
}

console.log("Dashboard and stations script executed.");
