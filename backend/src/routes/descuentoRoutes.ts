import express from 'express';
import { DescuentoController } from '../controllers/DescuentoController';
import authMiddleware from '../middleware/auth'; // ✅ IMPORTAR

const router: express.Router = express.Router();

// Rutas públicas (sin autenticación)
router.get('/validar/:codigo', DescuentoController.validarCodigo);

// Rutas protegidas (requieren autenticación)
router.get('/', authMiddleware, DescuentoController.getAll); // ✅ AGREGAR authMiddleware
router.get('/:id', authMiddleware, DescuentoController.getById); // ✅ AGREGAR authMiddleware
router.post('/', authMiddleware, DescuentoController.create); // ✅ AGREGAR authMiddleware
router.put('/:id', authMiddleware, DescuentoController.update); // ✅ AGREGAR authMiddleware
router.delete('/:id', authMiddleware, DescuentoController.delete); // ✅ AGREGAR authMiddleware

export default router;
