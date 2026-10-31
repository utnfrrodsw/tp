import type { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { getOrm } from '../config/orm.js';
import { User } from '../entities/usuario.js';
import { respondWithError } from '../shared/api-error.js';

export type AccessRole = User['rol'];

type Auth = { userId: number; role: AccessRole };

// Como ya no ampliamos el tipo Request de Express, leemos/escribimos
// req.auth con un casteo a any en estas dos funciones.
export function obtenerAuth(req: Request): Auth | undefined {
  return (req as any).auth;
}

function guardarAuth(req: Request, auth: Auth) {
  (req as any).auth = auth;
}

const accessRoles: AccessRole[] = ['cliente', 'empresa', 'administrador'];

export const authenticate: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    token = authHeader.slice(7).trim();
  }

  const secret = process.env.JWT_SECRET;

  if (!token) {
    respondWithError(res, 401, 'UNAUTHENTICATED', 'Iniciá sesión para acceder a este recurso');
    return;
  }
  if (!secret) {
    next(new Error('JWT_SECRET no está configurado'));
    return;
  }

  try {
    const payload = jwt.verify(token, secret);

    // El token viene mal formado (no es el objeto que esperamos)
    if (typeof payload === 'string') {
      respondWithError(res, 401, 'UNAUTHENTICATED', 'La sesión no es válida');
      return;
    }

    // El id de usuario tiene que ser un número entero positivo
    const idComoTexto = payload.sub;
    if (typeof idComoTexto !== 'string' || !/^\d+$/.test(idComoTexto)) {
      respondWithError(res, 401, 'UNAUTHENTICATED', 'La sesión no es válida');
      return;
    }

    const idUsuario = Number(idComoTexto);
    if (!Number.isSafeInteger(idUsuario) || idUsuario <= 0) {
      respondWithError(res, 401, 'UNAUTHENTICATED', 'La sesión no es válida');
      return;
    }

    // El rol que viene en el token tiene que ser uno de los roles válidos
    const rolDelToken = payload.rol as AccessRole;
    if (!accessRoles.includes(rolDelToken)) {
      respondWithError(res, 401, 'UNAUTHENTICATED', 'La sesión no es válida');
      return;
    }

    guardarAuth(req, {
      userId: idUsuario,
      role: rolDelToken
    });
    next();
  } catch {
    respondWithError(res, 401, 'UNAUTHENTICATED', 'La sesión expiró o no es válida');
  }
};

// Devuelve un middleware que solo deja pasar a los roles indicados.
// Por ejemplo: requireRoles('administrador') o requireRoles('cliente', 'empresa')
export function requireRoles(...allowedRoles: AccessRole[]): RequestHandler {
  function verificarRol(req: Request, res: Response, next: NextFunction) {
    const auth = obtenerAuth(req);
    if (!auth) {
      respondWithError(res, 401, 'UNAUTHENTICATED', 'Iniciá sesión para acceder a este recurso');
      return;
    }
    if (!allowedRoles.includes(auth.role)) {
      respondWithError(res, 403, 'FORBIDDEN', 'No tenés permisos para realizar esta operación');
      return;
    }
    next();
  }

  return verificarRol;
}

export const requireOwnUserId: RequestHandler = (req, res, next) => {
  const suppliedId = req.query.usuarioId ?? req.body?.usuarioId;
  const userId = Number(suppliedId);

  if (!suppliedId || !Number.isSafeInteger(userId) || userId <= 0) {
    respondWithError(res, 400, 'VALIDATION_ERROR', 'El usuario indicado debe ser un ID entero positivo');
    return;
  }
  if (userId !== obtenerAuth(req)?.userId) {
    respondWithError(res, 403, 'FORBIDDEN', 'No podés acceder a los datos de otro usuario');
    return;
  }
  next();
};

export const ensureActiveUser: RequestHandler = async (req, res, next) => {
  try {
    const auth = obtenerAuth(req);
    const user = await getOrm().em.fork().findOne(User, { id: auth?.userId });
    if (!user || !user.activo || user.rol !== auth?.role) {
      respondWithError(res, 403, 'FORBIDDEN', 'La cuenta está inactiva o sus permisos cambiaron');
      return;
    }
    next();
  } catch (error) {
    next(error);
  }
};