import { Router } from 'express';
import * as usuarioController from '../controllers/usuario.controller';
const router = Router();
// Definir las rutas para los usuarios
router.get('/', usuarioController.getUsuarios);
export { router as usuarioRoutes };
