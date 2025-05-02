// src/routes/usuario.routes.ts
import { Router } from 'express';
import { login, refreshToken } from '../controllers/auth.controller'; // Asegúrate de que las rutas sean correctas
const router = Router();
// Ruta de login
router.post('/login', login);
// Ruta para obtener un nuevo access token usando el refresh token
router.post('/refresh-token', refreshToken);
export { router as usuarioRoutes };
