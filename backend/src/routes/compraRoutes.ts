import { Router } from 'express';
import { CompraController } from '../controllers/CompraController';
import authMiddleware from '../middleware/auth';
import roleGuard from '../middleware/roleGuard';

const router = Router();

router.get('/', authMiddleware, roleGuard(['administrador']), CompraController.getAll);
router.get('/:id', authMiddleware, CompraController.getById);
router.get('/usuario/:usuarioId', authMiddleware, CompraController.getByUsuario);
router.post('/', authMiddleware, CompraController.create);
router.put('/:id', authMiddleware, CompraController.update);
router.delete('/:id', authMiddleware, CompraController.delete);
router.post('/:id/confirmar', authMiddleware, CompraController.confirmar);

export default router;
