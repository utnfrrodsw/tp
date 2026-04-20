import { Router } from 'express';
import {
  obtenerNotificaciones,
  contarNoLeidas,
  marcarComoLeida,
  marcarTodasComoLeidas,
  eliminarNotificacion
} from '../controllers/notificacion.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateJWT);

// Obtener notificaciones del usuario
router.get('/', obtenerNotificaciones);

// Contar notificaciones no leídas
router.get('/count', contarNoLeidas);

// Marcar notificación como leída
router.patch('/:id/leida', marcarComoLeida);

// Marcar todas como leídas
router.patch('/marcar-todas-leidas', marcarTodasComoLeidas);

// Eliminar notificación
router.delete('/:id', eliminarNotificacion);

export { router as notificacionRoutes };
