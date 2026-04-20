// src/routes/auth.routes.ts
import { Router } from 'express';
import { loginUser, registerUser } from '../services/auth.service';
import { refreshTokenUser, requestPasswordReset, resetPassword } from '../controllers/auth.controller';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshTokenUser);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

export { router as authRoutes };
