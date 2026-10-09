const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET no está definido en .env o tiene menos de 32 caracteres');
}

const isProduction = process.env.NODE_ENV === 'production';

const expiresMinutes = Number(process.env.JWT_EXPIRES_MINUTES) || 60;

const sameSite = (process.env.COOKIE_SAMESITE || 'lax').toLowerCase();
if (!['lax', 'strict', 'none'].includes(sameSite)) {
  throw new Error('COOKIE_SAMESITE debe ser lax, strict o none');
}

const allowedOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const COOKIE_NAME = 'token';

// SameSite=None solo es aceptado por los navegadores si la cookie es Secure
const cookieOptions = {
  httpOnly: true,
  secure: isProduction || sameSite === 'none',
  sameSite,
  path: '/'
};

const signToken = (usuario) =>
  jwt.sign({ rol: usuario.rol, tv: usuario.tokenVersion }, JWT_SECRET, {
    algorithm: 'HS256',
    subject: String(usuario.id),
    expiresIn: expiresMinutes * 60
  });

const verifyToken = (token) => jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });

const setAuthCookie = (res, usuario) => {
  res.cookie(COOKIE_NAME, signToken(usuario), {
    ...cookieOptions,
    maxAge: expiresMinutes * 60 * 1000
  });
};

const clearAuthCookie = (res) => res.clearCookie(COOKIE_NAME, cookieOptions);

module.exports = {
  COOKIE_NAME,
  allowedOrigins,
  verifyToken,
  setAuthCookie,
  clearAuthCookie
};
