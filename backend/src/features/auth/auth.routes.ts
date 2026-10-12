// Rutas de autenticación, montadas en /api/auth.
//
//   POST /api/auth/register   alta de cuenta (siempre con rol FREE)
//   POST /api/auth/login      inicio de sesión, devuelve el token
//   POST /api/auth/refresh    token nuevo con el rol actualizado, logueado
//   GET  /api/auth/me         datos del usuario logueado
//
// /refresh existe porque el rol viaja dentro del token: al pasar a PRO hay que
// emitir uno nuevo para que el frontend se entere (ver auth.service).
//
// login y register llevan un límite de intentos por IP: es lo que frena a quien
// prueba contraseñas por fuerza bruta o crea cuentas en masa.
import { Router } from 'express';
import { rateLimit } from '../../shared/middlewares/rate-limit';
import { requireAuth } from '../../shared/middlewares/require-auth';
import { validate } from '../../shared/middlewares/validate';
import { authController } from './auth.controller';
import { loginSchema, registerSchema } from './auth.schema';

export const authRouter = Router();

// 10 intentos de login cada 15 minutos y 5 altas por hora, por IP: de sobra para
// una persona, poco para un script.
const loginLimit = rateLimit({ windowMs: 15 * 60_000, max: 10 });
const registerLimit = rateLimit({ windowMs: 60 * 60_000, max: 5 });

authRouter.post(
  '/register',
  registerLimit,
  validate({ body: registerSchema }),
  authController.register
);
authRouter.post('/login', loginLimit, validate({ body: loginSchema }), authController.login);
authRouter.post('/refresh', requireAuth, authController.refresh);
authRouter.get('/me', requireAuth, authController.me);
