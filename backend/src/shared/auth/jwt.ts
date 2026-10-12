// Firma y verificación de los JWT que emite la API.
//
// Vive en shared/ y no dentro de la feature auth porque lo necesitan las dos
// puntas del circuito: el service de auth para emitir el token al registrarse o
// iniciar sesión, y el middleware requireAuth para verificarlo en cada request
// protegida. Si estuviera en la feature, un middleware compartido dependería de
// una feature, que es justo al revés de como tiene que ser.
import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { UserRole } from '../types/enums';

/** Algoritmo de firma: HMAC con SHA-256 y el JWT_SECRET como clave. */
const JWT_ALGORITHM = 'HS256';

/**
 * Datos que viajan dentro del token.
 *
 * Va lo mínimo indispensable para autorizar: quién es y qué rol tiene. El
 * contenido de un JWT NO está cifrado, cualquiera que tenga el token puede
 * leerlo; la firma solo garantiza que nadie lo haya modificado. Por eso acá
 * nunca va nada sensible (contraseñas, emails, datos de pago).
 */
export type TokenPayload = {
  id_user: number;
  rol: UserRole;
};

/**
 * Emite un token firmado para un usuario.
 * @param payload id y rol del usuario.
 * @returns el JWT como string, listo para mandar al frontend.
 */
export function signToken(payload: TokenPayload): string {
  // El cast hace falta porque los tipos de jsonwebtoken esperan una duración
  // literal ('7d', '1h', ...) y JWT_EXPIRES_IN llega del .env como string común.
  return jwt.sign(payload, env.auth.jwtSecret, {
    algorithm: JWT_ALGORITHM,
    expiresIn: env.auth.jwtExpiresIn,
  } as SignOptions);
}

/**
 * Verifica un token y devuelve su contenido.
 * @param token el JWT recibido en el header Authorization.
 * @returns el payload si el token es válido.
 * @throws si el token está vencido, mal firmado o adulterado (lo maneja requireAuth).
 */
export function verifyToken(token: string): TokenPayload {
  // Se fija el algoritmo: así un token que diga venir firmado con otro (por
  // ejemplo "none") se rechaza aunque la librería cambie su comportamiento.
  return jwt.verify(token, env.auth.jwtSecret, { algorithms: [JWT_ALGORITHM] }) as TokenPayload;
}
