import { Router } from 'express';
import {
  getUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario
} from '../controllers/usuario.controller';

const router = Router();

router.get('/', getUsuarios);
router.get('/:id', getUsuarioById);
router.put('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);

export { router as usuarioRoutes };

// src/routes/usuario.routes.ts
//import { Router } from 'express';
//import { login, refreshToken } from '../controllers/usuario.controller'; // ✅ Ruta correcta

//const router = Router();

//router.post('/login', login);
//router.post('/refresh-token', refreshToken);

//export { router as usuarioRoutes };
