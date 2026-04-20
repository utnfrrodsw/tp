import { Router } from 'express';
import { getStats, getDetailedStats } from '../controllers/stats.controller';

const router = Router();

// Ruta pública para estadísticas básicas (HeroSection)
router.get('/', getStats);

// Ruta para estadísticas detalladas (puede requerir autenticación más adelante)
router.get('/detailed', getDetailedStats);

export { router as statsRoutes };
