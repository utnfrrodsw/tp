import express, { Request, Response, Router, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { MikroORM, wrap } from '@mikro-orm/core';
import { Usuario } from '../entities/Usuario';
import { AuthUser } from '../types/auth';

const router: Router = express.Router();

// --- Configuración / validaciones iniciales ---
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET no configurado. Define la variable de entorno JWT_SECRET y reinicia la aplicación.');

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const JWT_ISSUER = process.env.JWT_ISSUER || 'mi-app';
const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || '10');
const JWT_USE_COOKIE = process.env.JWT_USE_COOKIE === 'true';
const COOKIE_NAME = process.env.JWT_COOKIE_NAME || 'token';

const ALLOWED_ROLES = ['usuario', 'administrador'];

function createToken(payload: object, subject?: string) {
  const opts: SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
    issuer: JWT_ISSUER,
    subject: subject,
    algorithm: 'HS256' as SignOptions['algorithm'],
  } as SignOptions;
  return jwt.sign(payload as any, JWT_SECRET as string, opts);
}

// --- Helpers simples de validación / sanitización ---
function isValidEmail(v: any): v is string {
  return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function sanitizeString(v: any): string | undefined {
  if (typeof v !== 'string') return undefined;
  const t = v.trim();
  return t === '' ? undefined : t;
}

// --- Middleware exportable para proteger rutas ---

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = (req.headers.authorization || '') as string;
  if (!header.startsWith('Bearer ')) return res.status(401).json({
    success: false,
    message: 'No autorizado: token requerido.',
    error: 'Token requerido',
    code: 'TOKEN_REQUIRED'
  });
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET as string) as any;
    const id = typeof payload.id === 'number' ? payload.id : Number(payload.id ?? payload.sub);
    req.user = { id, rol: payload.rol, email: payload.email || '' } as AuthUser;
    return next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado: token inválido.',
      error: 'Token inválido',
      code: 'TOKEN_INVALID'
    });
  }
}

export default function authRouter(orm: MikroORM): Router {
  router.post('/change-password', async (req: Request, res: Response) => {
    try {
      const em = orm.em.fork();
      const { usuarioId, contrasenaActual, contrasenaNueva } = req.body;
      if (!usuarioId || !contrasenaActual || !contrasenaNueva) {
        return res.status(400).json({
          success: false,
          message: 'Faltan datos para cambiar la contraseña',
          code: 'MISSING_DATA'
        });
      }
      const usuario = await em.findOne(Usuario, { id: usuarioId });
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
          code: 'USER_NOT_FOUND'
        });
      }
      const ok = await bcrypt.compare(contrasenaActual, (usuario as any).contrasena);
      if (!ok) {
        return res.status(401).json({
          success: false,
          message: 'La contraseña actual es incorrecta',
          code: 'WRONG_PASSWORD'
        });
      }
      (usuario as any).contrasena = await bcrypt.hash(contrasenaNueva, BCRYPT_SALT_ROUNDS);
      await em.persistAndFlush(usuario);
      return res.json({
        success: true,
        message: 'Contraseña actualizada correctamente'
      });
    } catch (error) {
      console.error('Error en /change-password:', error);
      return res.status(500).json({
        success: false,
        message: 'No se pudo cambiar la contraseña',
        code: 'CHANGE_PASSWORD_ERROR'
      });
    }
  });

  // Registro
  router.post('/register', async (req: Request, res: Response) => {
    try {
      const em = orm.em.fork();
      const nombre = sanitizeString(req.body.nombre);
      const apellido = sanitizeString(req.body.apellido);
      const emailRaw = sanitizeString(req.body.email);
      const contrasenaRaw = sanitizeString(req.body.contrasena);
      const direccion = sanitizeString(req.body.direccion);
      const telefono = sanitizeString(req.body.telefono);
      const rolRaw = sanitizeString(req.body.rol);

      if (!emailRaw || !contrasenaRaw) return res.status(400).json({
        success: false,
        message: 'No se pudo registrar: email y contraseña requeridos.',
        error: 'Datos obligatorios',
        code: 'INVALID_DATA'
      });

      const email = emailRaw;
      const email_normalized = emailRaw.toLowerCase().trim();

      if (!isValidEmail(email)) return res.status(400).json({
        success: false,
        message: 'No se pudo registrar: email inválido.',
        error: 'Email inválido',
        code: 'INVALID_DATA'
      });
      if (contrasenaRaw.length < 8) return res.status(400).json({
        success: false,
        message: 'No se pudo registrar: la contraseña debe tener al menos 8 caracteres.',
        error: 'Contraseña corta',
        code: 'INVALID_DATA'
      });

      const rol = rolRaw ?? 'usuario';
      if (rol && !ALLOWED_ROLES.includes(rol)) return res.status(400).json({
        success: false,
        message: 'No se pudo registrar: rol inválido.',
        error: 'Rol inválido',
        code: 'INVALID_DATA'
      });

      const exist = await em.findOne(Usuario, { email_normalized });
      if (exist) return res.status(409).json({
        success: false,
        message: 'No se pudo registrar: usuario ya existe.',
        error: 'Duplicado',
        code: 'DUPLICATE'
      });

      const hashed = await bcrypt.hash(contrasenaRaw, BCRYPT_SALT_ROUNDS);

      const user = em.create(Usuario, {nombre,apellido,email,email_normalized,contrasena: hashed,direccion,telefono,rol,} as any);

      try {
        await em.persistAndFlush(user);
      } catch (e: any) {
        const msg = String(e?.message || '');
        if (e?.code === '23505' || /unique/i.test(msg) || /UNIQUE constraint failed/i.test(msg)) {
          return res.status(409).json({
            success: false,
            message: 'No se pudo registrar: usuario ya existe.',
            error: 'Duplicado',
            code: 'DUPLICATE'
          });
        }
        throw e;
      }

      if (!(user as any).id || typeof (user as any).id !== 'number') {
        return res.status(500).json({
          success: false,
          message: 'No se pudo registrar: error interno.',
          error: 'Error interno',
          code: 'REGISTER_ERROR'
        });
      }

      const safeUser = wrap(user).toObject();
      delete (safeUser as any).contrasena;

      const token = createToken({ id: user.id, rol: user.rol }, String(user.id));
      const decoded = jwt.decode(token) as JwtPayload;
      const maxAge = decoded?.exp ? decoded.exp * 1000 - Date.now() : undefined;
      if (JWT_USE_COOKIE) {
        res.cookie(COOKIE_NAME, token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge,
  });
}

      return res.status(201).json({
        success: true,
        message: 'Registro realizado correctamente.',
        data: { 
          usuario: safeUser,
          token
        }
      });
    } catch (err) {
      console.error('POST /auth/register error:', err);
      return res.status(500).json({
        success: false,
        message: 'No se pudo registrar: error interno.',
        error: 'Error interno',
        code: 'REGISTER_ERROR'
      });
    }
  });

  // Login
  router.post('/login', async (req: Request, res: Response) => {
    try {
      const em = orm.em.fork();
      const emailRaw = sanitizeString(req.body.email);
      const contrasenaRaw = sanitizeString(req.body.contrasena);

      if (!emailRaw || !contrasenaRaw) return res.status(400).json({
        success: false,
        message: 'No se pudo iniciar sesión: email y contraseña requeridos.',
        error: 'Datos obligatorios',
        code: 'INVALID_DATA'
      });
      const email = emailRaw.toLowerCase();

      if (!isValidEmail(email)) return res.status(400).json({
        success: false,
        message: 'No se pudo iniciar sesión: email inválido.',
        error: 'Email inválido',
        code: 'INVALID_DATA'
      });

      const user = await em.findOne(Usuario, { email });
      if (!user) return res.status(401).json({
        success: false,
        message: 'No se pudo iniciar sesión: credenciales inválidas.',
        error: 'Credenciales inválidas',
        code: 'INVALID_CREDENTIALS'
      });

      const hashed = (user as any).contrasena;
      const ok = await bcrypt.compare(contrasenaRaw, hashed);
      if (!ok) return res.status(401).json({
        success: false,
        message: 'No se pudo iniciar sesión: credenciales inválidas.',
        error: 'Credenciales inválidas',
        code: 'INVALID_CREDENTIALS'
      });

      const token = createToken({ id: (user as any).id, rol: (user as any).rol }, String((user as any).id));

      const safeUser = wrap(user).toObject();
      delete (safeUser as any).contrasena;

      if (JWT_USE_COOKIE) {
        res.cookie(COOKIE_NAME, token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        });
      }

      return res.json({
        success: true,
        message: 'Inicio de sesión realizado correctamente.',
        data: {  // ✅ AGREGAR: envolver en 'data'
          usuario: safeUser,  // ✅ CAMBIAR: 'user' → 'usuario'
          token
        }
      });
    } catch (err) {
      console.error('POST /auth/login error:', err);
      return res.status(500).json({
        success: false,
        message: 'No se pudo iniciar sesión: error interno.',
        error: (err instanceof Error) ? err.message : 'unknown',
        code: 'LOGIN_ERROR'
      });
    }
  });

  return router;
}
