import { Router } from 'express';
import { login, refreshToken } from '../controllers/auth.controller';  // Asegúrate de que las funciones existan

const router = Router();

router.post('/login', login);
router.post('/refresh-token', refreshToken);

export default router;

