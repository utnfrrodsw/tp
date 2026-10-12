// Resuelve quién es el usuario de una request a partir de su token.
//
// El token prueba QUIÉN es el usuario, pero no alcanza para saber qué puede hacer
// HOY: su rol y su estado pueden haber cambiado después de que se emitió (un ADMIN
// lo suspendió, le bajó el rol a FREE, etc.), y el token vive JWT_EXPIRES_IN días.
// Por eso, además de verificar la firma, se lee el usuario de la base en cada
// request. Es una consulta por clave primaria, muy barata.
//
// Importa la entidad User y no un repositorio de una feature: shared/ no puede
// depender de features/ (ver la nota de jwt.ts).
import { User } from '../../entities';
import { ForbiddenError, UnauthorizedError } from '../errors/app-error';
import { TokenPayload, verifyToken } from './jwt';

/** Mismo mensaje que usa auth.service para una cuenta suspendida. */
const SUSPENDED_MESSAGE = 'Tu cuenta está suspendida. Escribinos si creés que se trata de un error.';

/**
 * Verifica el token y devuelve el usuario con el rol que tiene AHORA en la base.
 * @param token el JWT recibido en el header Authorization.
 * @returns id y rol actual del usuario.
 * @throws 401 si el token es inválido o el usuario ya no existe; 403 si está suspendido.
 */
export async function resolveSessionUser(token: string): Promise<TokenPayload> {
  let payload: TokenPayload;
  try {
    payload = verifyToken(token);
  } catch {
    // Se agrupan todos los motivos de falla (vencido, firma inválida, texto
    // cualquiera) en un mismo 401: detallar el motivo solo le sirve a un atacante.
    throw new UnauthorizedError('Tu sesión expiró o no es válida. Iniciá sesión de nuevo.');
  }

  const user = await User.findByPk(payload.id_user, { attributes: ['id_user', 'rol', 'state'] });

  if (!user) {
    throw new UnauthorizedError('Tu sesión expiró o no es válida. Iniciá sesión de nuevo.');
  }

  if (user.state === 'suspended') throw new ForbiddenError(SUSPENDED_MESSAGE);

  // El rol sale de la base y no del token: así un cambio de rol hecho por un
  // ADMIN vale desde la request siguiente, sin esperar a que el token venza.
  return { id_user: user.id_user, rol: user.rol };
}
