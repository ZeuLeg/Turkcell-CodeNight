import { Router } from 'express';
import { insertMetric } from '../controllers/metrics.controller';

const router = Router();

// Yüksel'in simülatöründen gelen veriler buraya POST edilecek
router.post('/:stationId/metrics', insertMetric);

export default router;