// src/routes/recomendacion.routes.ts
import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { getRecomendaciones, invalidarCacheRecomendaciones } from '../controllers/recomendacion.controller';

const router = Router();

// GET /api/recomendaciones - Obtiene recomendaciones personalizadas
router.get('/', authenticateJWT, getRecomendaciones);

// DELETE /api/recomendaciones/cache - Invalida el caché de recomendaciones
router.delete('/cache', authenticateJWT, invalidarCacheRecomendaciones);

export { router as recomendacionRoutes };
