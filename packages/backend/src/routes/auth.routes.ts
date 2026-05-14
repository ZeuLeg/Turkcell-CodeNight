import { Router } from 'express';
import { login, register, requestOtp, verifyOtp } from '../controllers/auth.controller';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);

export default router;
