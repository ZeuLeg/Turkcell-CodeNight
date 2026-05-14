import { Router } from 'express';
import { resolveAlarm, acknowledgeAlarm, assignAlarm, getAllAlarmsFiltered } from '../controllers/alarms.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.get('/', requireAuth, getAllAlarmsFiltered);
router.patch('/:id/acknowledge', requireAuth, requireRole(['NOC', 'ADMIN']), acknowledgeAlarm);
router.patch('/:id/assign', requireAuth, requireRole(['NOC', 'ADMIN']), assignAlarm);
router.patch('/:id/resolve', requireAuth, requireRole(['NOC', 'FIELD_ENGINEER', 'ADMIN']), resolveAlarm);

export default router;
