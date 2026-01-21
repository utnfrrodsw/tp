import express from 'express';
import { UsuarioController } from '../controllers/UsuarioController';
import authMiddleware from '../middleware/auth'; // ✅ CORREGIR: el archivo se llama auth.ts
import roleGuard from '../middleware/roleGuard'; // ✅ CORREGIR: export default

const router: express.Router = express.Router();

// 🎯 CRUD básico
router.get('/', UsuarioController.getAll);        // GET /api/usuarios
router.get('/:id', UsuarioController.getOne);     // GET /api/usuarios/1
router.post('/', UsuarioController.create);       // POST /api/usuarios
router.put('/:id', UsuarioController.update);     // PUT /api/usuarios/1
router.delete('/:id', UsuarioController.delete);  // DELETE /api/usuarios/1

// ✅ Ruta para toggle estado (solo admin)
router.put(
  '/:id/toggle-estado', 
  authMiddleware, 
  roleGuard(['administrador']), 
  UsuarioController.toggleEstado
);

export default router;
