import { Router } from 'express';
import { controlSimulator, injectAnomaly, getSimulatorStatus } from '../controllers/simulator.controller';

const router = Router();

router.get('/status', getSimulatorStatus);
router.post('/inject', injectAnomaly);
router.post('/inject-anomaly', injectAnomaly);
router.post('/:action', controlSimulator);

export default router;
