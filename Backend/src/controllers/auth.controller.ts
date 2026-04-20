import { Request, Response } from 'express';
import { MikroORM } from '@mikro-orm/mysql';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { promisify } from 'util';
import crypto from 'crypto';
import { Usuario } from '../entities/usuario.entity';
import { PasswordResetToken } from '../entities/passwordResetToken.entity';
import jwtConfig from '../shared/jwt.config';
import { StringValue } from 'ms';
import { registerUser } from '../services/auth.service';
import { sendPasswordReset } from '../services/email.service';
import {
  validateLoginCredentials,
  validatePasswordResetRequest,
  validatePasswordResetData,
  validateRefreshToken,
  AUTH_MESSAGES,
  sanitizeEmail
} from '../utils/authValidationHelpers';

// Función auxiliar para generar un token de acceso
const generateToken = (user: Usuario): string => {
  if (!jwtConfig.secret) {
    throw new Error('JWT secret not configured');
  }

  const signOptions: SignOptions = {
    expiresIn: jwtConfig.expiresIn as StringValue,
  };

  return jwt.sign(
    { id: user.id, email: user.email, username: user.username, rol: user.rol },
    jwtConfig.secret,
    signOptions
  );
};

// Función auxiliar para verificar el refresh token como Promise
const verifyToken = (token: string, secret: string): Promise<JwtPayload> =>
  new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err || typeof decoded !== 'object' || !decoded) {
        return reject(err);
      }
      resolve(decoded as JwtPayload);
    });
  });

// Login de usuario
export const loginUser = async (req: Request, res: Response) => {
  try {
    const orm = req.app.get('orm') as MikroORM;
    const { email, password } = req.body;

    // ✅ Validar credenciales usando helper
    const validation = validateLoginCredentials({ email, password });
    if (!validation.isValid) {
      return res.status(validation.statusCode || 400).json({ error: validation.error });
    }

    const user = await orm.em.findOne(Usuario, { email: sanitizeEmail(email) });
    if (!user) {
      return res.status(401).json({ error: AUTH_MESSAGES.INVALID_CREDENTIALS });
    }

    const validPassword = await user.validatePassword(password);
    if (!validPassword) {
      return res.status(401).json({ error: AUTH_MESSAGES.INVALID_CREDENTIALS });
    }

    const token = generateToken(user);

    const refreshToken = jwt.sign(
      { id: user.id },
      jwtConfig.secret!,
      { expiresIn: '7d' }
    );

    user.refreshToken = refreshToken;
    await orm.em.persistAndFlush(user);

    res.json({ token, refreshToken, message: AUTH_MESSAGES.LOGIN_SUCCESS });
  } catch (error) {
    res.status(500).json({ error: AUTH_MESSAGES.SERVER_ERROR });
  }
};

// Renovar token con refresh token
export const refreshTokenUser = async (req: Request, res: Response) => {
  try {
    const orm = req.app.get('orm') as MikroORM;
    const { refreshToken } = req.body;

    // ✅ Validar refresh token usando helper
    const validation = validateRefreshToken(refreshToken);
    if (!validation.isValid) {
      return res.status(validation.statusCode || 400).json({ error: validation.error });
    }

    let decoded: JwtPayload;
    try {
      decoded = await verifyToken(refreshToken, jwtConfig.secret!);
    } catch {
      return res.status(401).json({ error: AUTH_MESSAGES.TOKEN_INVALID });
    }

    const user = await orm.em.findOne(Usuario, { id: decoded.id });
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ error: AUTH_MESSAGES.TOKEN_INVALID });
    }

    const newAccessToken = generateToken(user);
    res.json({ token: newAccessToken });
  } catch (error) {
    res.status(500).json({ error: AUTH_MESSAGES.SERVER_ERROR });
  }
};

/**
 * Solicitar recuperación de contraseña
 * Genera un token y envía email con enlace de reseteo
 */
export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const orm = req.app.get('orm') as MikroORM;
    const em = orm.em.fork();
    const { email } = req.body;

    // ✅ Validar solicitud usando helper
    const validation = validatePasswordResetRequest({ email });
    if (!validation.isValid) {
      return res.status(validation.statusCode || 400).json({ error: validation.error });
    }

    const sanitizedEmail = sanitizeEmail(email);
    const user = await em.findOne(Usuario, { email: sanitizedEmail });
    
    // Por seguridad, siempre responder con éxito aunque el usuario no exista
    if (!user) {
      return res.json({ message: AUTH_MESSAGES.PASSWORD_RESET_SENT });
    }

    // Generar token aleatorio seguro
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Crear registro de token
    const passwordResetToken = new PasswordResetToken(user, resetToken);
    await em.persistAndFlush(passwordResetToken);

    // Enviar email
    try {
      await sendPasswordReset(sanitizedEmail, resetToken, user.nombre);
    } catch (emailError) {
      console.error('Error al enviar email de reseteo:', emailError);
      // No fallar si el email no se puede enviar
    }

    return res.json({ message: AUTH_MESSAGES.PASSWORD_RESET_SENT });
  } catch (error: any) {
    console.error('Error en requestPasswordReset:', error);
    return res.status(500).json({ error: AUTH_MESSAGES.SERVER_ERROR });
  }
};

/**
 * Restablecer contraseña con token
 */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const orm = req.app.get('orm') as MikroORM;
    const em = orm.em.fork();
    const { token, newPassword } = req.body;

    // ✅ Validar datos usando helper
    const validation = validatePasswordResetData({ token, newPassword });
    if (!validation.isValid) {
      return res.status(validation.statusCode || 400).json({ error: validation.error });
    }

    // Buscar token válido
    const resetToken = await em.findOne(PasswordResetToken, 
      { token, usado: false },
      { populate: ['usuario'] }
    );

    if (!resetToken) {
      return res.status(400).json({ error: AUTH_MESSAGES.TOKEN_USED });
    }

    // Verificar que no haya expirado
    if (resetToken.fechaExpiracion < new Date()) {
      return res.status(400).json({ error: AUTH_MESSAGES.TOKEN_INVALID });
    }

    // Actualizar contraseña del usuario
    const user = resetToken.usuario;
    user.password = newPassword; // El entity debería tener un hook para hashear
    
    // Marcar token como usado
    resetToken.usado = true;

    await em.persistAndFlush([user, resetToken]);

    return res.json({ message: AUTH_MESSAGES.PASSWORD_RESET_SUCCESS });
  } catch (error: any) {
    console.error('Error en resetPassword:', error);
    return res.status(500).json({ error: AUTH_MESSAGES.SERVER_ERROR });
  }
};

export { registerUser };
