import { Router } from 'express';
import { obtenerLibros, obtenerLibroPorId, addGoogleBook } from '../controllers/googleBooks.controller';
import { requireAdmin } from '../middleware/admin.middleware';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.get('/buscar', obtenerLibros);
router.get('/:id', obtenerLibroPorId);
router.post('/add', authenticateJWT, requireAdmin, addGoogleBook);

export default router;
