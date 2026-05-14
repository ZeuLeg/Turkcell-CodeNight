import { Router } from 'express';
import { resolveAlarm } from '../controllers/alarms.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Endpoint: PATCH /api/v1/alarms/:alarmId/resolve
router.patch('/:alarmId/resolve', requireAuth, resolveAlarm);

export default router;