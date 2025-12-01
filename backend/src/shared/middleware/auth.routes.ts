// routes/auth.routes.ts
import { Router, Request } from 'express';
import { verifyToken } from './auth.middleware.js';
import { orm } from '../db/orm.js';
import { Usuario } from '../../usuario/usuario.entity.js';

interface JWTPayload {
  id: number;
  rol: 'cliente' | 'prestador';
}
interface AuthRequest extends Request {
  user?: JWTPayload;
  mail?: string;
}

const router = Router();

// Endpoint que usa React para verificar si está autenticado
router.get('/verificar', verifyToken, async (req: AuthRequest, res) => {
  if (req.user === undefined) {
    res.json({
      user: null,
    });
  } else {
    try {
      // Buscar el usuario completo en la base de datos
      const em = orm.em.fork();
      const usuario = await em.findOne(Usuario, { id: req.user.id });

      if (!usuario) {
        res.json({
          user: null,
        });
        return;
      }

      res.json({
        user: {
          id: usuario.id,
          rol: req.user.rol,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.mail,
          mail: usuario.mail,
          foto: usuario.foto,
          // Campos de Stripe
          stripeAccountId: usuario.stripeAccountId,
          onboardingStatus: usuario.onboardingStatus,
          chargesEnabled: usuario.chargesEnabled,
          payoutsEnabled: usuario.payoutsEnabled,
        },
      });
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      res.status(500).json({
        user: null,
        error: 'Error interno del servidor',
      });
    }
  }
});

export default router;
