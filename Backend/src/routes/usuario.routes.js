import { Router } from 'express';
import * as usuarioController from '../controllers/usuario.controller';
import { authMiddleware } from '../middleware/auth.middleware'; // Asegúrate de importar el middleware correctamente
const router = Router();
// Definir las rutas para los usuarios y aplicar el middleware de autenticación
router.get('/', authMiddleware, usuarioController.getUsuarios); // La ruta ahora requerirá autenticación
export { router as usuarioRoutes };
