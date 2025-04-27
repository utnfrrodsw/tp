// src/routes/usuario.routes.ts
import { Router } from 'express';
import * as auth from '../controllers/auth.controller.'; // Importar correctamente el controlador de auth

const router = Router();

// Ruta de login
router.post('/login', authController.login); // Asegúrate de que `login` esté exportada en el controlador

// Ruta para obtener un nuevo access token usando el refresh token
router.post('/refresh-token', authController.refreshToken); // Asegúrate de que `refreshToken` esté exportada en el controlador

export { router as usuarioRoutes };
