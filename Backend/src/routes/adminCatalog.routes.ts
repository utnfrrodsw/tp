import { Router } from 'express';
import {
  getAdminCatalogAutores,
  getAdminCatalogLibros,
  updateAdminCatalogAutor,
  updateAdminCatalogAutorEstado,
  updateAdminCatalogLibro,
  updateAdminCatalogLibroEstado,
} from '../controllers/adminCatalog.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';

const router = Router();

router.get('/libros', authenticateJWT, requireAdmin, getAdminCatalogLibros);
router.put('/libros/:id', authenticateJWT, requireAdmin, updateAdminCatalogLibro);
router.patch('/libros/:id/estado', authenticateJWT, requireAdmin, updateAdminCatalogLibroEstado);

router.get('/autores', authenticateJWT, requireAdmin, getAdminCatalogAutores);
router.put('/autores/:id', authenticateJWT, requireAdmin, updateAdminCatalogAutor);
router.patch('/autores/:id/estado', authenticateJWT, requireAdmin, updateAdminCatalogAutorEstado);

export { router as adminCatalogRoutes };
