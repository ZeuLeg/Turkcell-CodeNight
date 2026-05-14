import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';

const router = Router();
router.post('/login', login);

export default router;
router.post('/register', register);
