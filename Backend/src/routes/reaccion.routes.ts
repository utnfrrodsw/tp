// src/routes/reaccion.routes.ts
import { Router } from 'express';
import { getReaccionesByResena, addOrUpdateReaccion, deleteReaccion } from '../controllers/reaccion.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

// Público - obtener reacciones
router.get('/resena/:resenaId', getReaccionesByResena);

// Protegidos - requieren autenticación
router.post('/', authenticateJWT, addOrUpdateReaccion);
router.delete('/:usuarioId/:resenaId', authenticateJWT, deleteReaccion);

export { router as reaccionRoutes };
