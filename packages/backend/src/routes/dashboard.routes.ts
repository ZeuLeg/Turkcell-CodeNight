import { Router } from 'express';
import { getStations, getAlarms } from '../controllers/dashboard.controller';

const router = Router();
router.get('/stations', getStations);
router.get('/alarms', getAlarms);

export default router;