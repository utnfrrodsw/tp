import { Router } from 'express';
import { getSagas, getSagaById, createSaga, updateSaga, deleteSaga } from '../controllers/saga.controller';
import { requireAdmin } from '../middleware/admin.middleware';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();
router.get('/', getSagas);
router.get('/:id', getSagaById);
router.post('/', authenticateJWT, requireAdmin, createSaga);
router.put('/:id', authenticateJWT, requireAdmin, updateSaga);
router.delete('/:id', authenticateJWT, requireAdmin, deleteSaga);

export { router as sagaRoutes };
