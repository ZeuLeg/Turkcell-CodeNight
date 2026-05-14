import { Router } from 'express';
import { login, register, requestOtp, verifyOtp, refreshAccessToken } from '../controllers/auth.controller';
import { requireBody } from '../middleware/validate.middleware';

const router = Router();

router.post('/login',       requireBody('email', 'password'), login);
router.post('/register',    requireBody('email', 'password'), register);
router.post('/refresh',     requireBody('refreshToken'),      refreshAccessToken);
router.post('/request-otp', requireBody('phone'),             requestOtp);
router.post('/verify-otp',  requireBody('phone', 'otp'),      verifyOtp);

export default router;
