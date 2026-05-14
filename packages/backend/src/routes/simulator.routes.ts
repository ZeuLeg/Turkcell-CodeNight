import { Router } from 'express';
import { controlSimulator, injectAnomaly } from '../controllers/simulator.controller';

const router = Router();

// Endpoint: POST /api/v1/simulator/start veya /stop
router.post('/:action', controlSimulator);

// Endpoint: POST /api/v1/simulator/inject
router.post('/inject', injectAnomaly);

export default router;