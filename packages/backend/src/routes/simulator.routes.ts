import { Router } from 'express';
import { controlSimulator, injectAnomaly } from '../controllers/simulator.controller';

const router = Router();

// Specific routes must come before the dynamic /:action route
router.post('/inject', injectAnomaly);
router.post('/inject-anomaly', injectAnomaly);
router.post('/:action', controlSimulator);

export default router;