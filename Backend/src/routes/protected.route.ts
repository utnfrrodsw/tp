import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateJWT, (req, res) => {
  res.json({ message: 'Hola usuario autenticado' });
});

export { router as protectedRoutes };
