// src/routes/auth.routes.ts
import { Router } from 'express';
import { login, refreshToken } from '../controllers/auth.controller'; 

const router = Router();

router.post('/login', login); 
router.post('/refresh-token', refreshToken); 

export { router as authRoutes };
