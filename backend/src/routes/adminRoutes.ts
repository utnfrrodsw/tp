import express from 'express';
import type { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import authMiddleware from '../middleware/auth';
import roleGuard from '../middleware/roleGuard';

const router: Router = express.Router();

// ✅ CONECTAR MÉTODOS ESTÁTICOS CON MIDDLEWARE DE ADMIN
const adminAuth = [authMiddleware, roleGuard(['administrador'])];

router.get('/dashboard', ...adminAuth, AdminController.getDashboard);
router.get('/usuarios', ...adminAuth, AdminController.gestionarUsuarios);
router.put('/usuarios/:id/toggle-estado', ...adminAuth, AdminController.toggleEstadoUsuario);
router.get('/reportes/ventas', ...adminAuth, AdminController.reporteVentas);

export default router;
