// src/routes/feed.routes.ts
import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { getFeed, invalidarCacheFeed } from '../controllers/feed.controller';

const router = Router();

// GET /api/feed - Obtiene el feed de actividades de seguidos
// Query params: limit, offset, tipos (ej: tipos=resena,favorito)
router.get('/', authenticateJWT, getFeed);

// DELETE /api/feed/cache - Invalida el caché del feed
router.delete('/cache', authenticateJWT, invalidarCacheFeed);

export { router as feedRoutes };
