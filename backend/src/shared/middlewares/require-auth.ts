// Middleware de autenticación.
//
// Se usa en las rutas que exigen estar logueado, antes del controller:
//
//   router.get('/me', requireAuth, userController.me);
//
// Espera el token en el header estándar `Authorization: Bearer <token>`.
// Si el token es válido y la cuenta sigue activa, deja en req.user el id y el rol
// ACTUAL del usuario (leído de la base, ver shared/auth/session.ts). Si no, corta
// con 401 (sin sesión válida) o 403 (cuenta suspendida).
//
// Es async: en Express 5 una promesa rechazada en un middleware llega sola al
// errorHandler, igual que en los controllers.
import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/app-error';
import { resolveSessionUser } from '../auth/session';

const BEARER_PREFIX = 'Bearer ';

export async function requireAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const header = req.headers.authorization;

  if (!header || !header.startsWith(BEARER_PREFIX)) {
    next(new UnauthorizedError());
    return;
  }

  const token = header.slice(BEARER_PREFIX.length).trim();

  try {
    req.user = await resolveSessionUser(token);
    next();
  } catch (error) {
    next(error);
  }
}
