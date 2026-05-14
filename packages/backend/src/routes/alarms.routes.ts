import { Router } from 'express';
import { resolveAlarm, acknowledgeAlarm, assignAlarm, getAllAlarmsFiltered } from '../controllers/alarms.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Endpoint: PATCH /api/v1/alarms/:alarmId/resolve
router.patch('/:alarmId/resolve', requireAuth, resolveAlarm);

export default router;
router.get('/', getAllAlarmsFiltered);
router.patch('/:id/acknowledge', requireAuth, requireRole(['NOC']), acknowledgeAlarm);
router.patch('/:id/assign', requireAuth, requireRole(['NOC']), assignAlarm);
router.patch('/:id/resolve', requireAuth, requireRole(['NOC', 'FIELD_ENGINEER']), resolveAlarm); // For compatibility with :id
