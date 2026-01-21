// DEBUG: Endpoint para consultar vendedor de una camiseta
import express from 'express';
import type { Router } from 'express';
import { CamisetaController } from '../controllers/CamisetaController';
import authMiddleware from '../middleware/auth';

const router: Router = express.Router();

// 🎯 CRUD básico + filtros para REGULARIDAD
router.get('/', CamisetaController.getAll);
router.get('/stats', CamisetaController.stats);
router.get('/seleccion', authMiddleware, CamisetaController.getSeleccion);
router.get('/:id', CamisetaController.getOne);
router.post('/', CamisetaController.create);
router.post('/by-ids', CamisetaController.getByIds); // ✅ NUEVO ENDPOINT
router.put('/:id', CamisetaController.update);
router.delete('/:id', authMiddleware, CamisetaController.delete);

// 🚀 CASO DE USO para REGULARIDAD
router.post('/publicar', authMiddleware, CamisetaController.publicarParaVenta);

export default router;
