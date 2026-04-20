// src/routes/libro.routes.ts
import { Router } from 'express';
import {
  getLibros, getLibroById, getLibroBySlug, createLibro, updateLibro, deleteLibro,
  getLibrosByCategoria, getLibrosByEstrellasMinimas, getReviewsByBookIdController, searchLibros,
  getListasForLibro, getNuevosLanzamientos, getOrCreateLibroFromExternal
} from '../controllers/libro.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';

const router = Router();

router.get('/', getLibros);
router.get('/search', searchLibros);
router.get('/nuevos', getNuevosLanzamientos);
router.post('/ensure-exists/:externalId', getOrCreateLibroFromExternal); // NUEVO: Crear libro desde API externa
router.get('/slug/:slug', getLibroBySlug);
router.get('/categoria/:categoriaId', getLibrosByCategoria);
router.get('/estrellas', getLibrosByEstrellasMinimas);

// ✅ 3. AÑADE ESTA LÍNEA AQUÍ
router.get('/:externalId/listas', authenticateJWT, getListasForLibro);

router.get('/:id/reviews', getReviewsByBookIdController);
router.get('/:id', getLibroById);
router.post('/', authenticateJWT, requireAdmin, createLibro);
router.put('/:id', authenticateJWT, requireAdmin, updateLibro);
router.delete('/:id', authenticateJWT, requireAdmin, deleteLibro);

export { router as libroRoutes };