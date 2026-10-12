// Lógica de negocio de la autenticación: registro, inicio de sesión y datos del
// usuario logueado. No conoce req ni res; recibe datos ya validados y devuelve
// objetos planos, o lanza un error de negocio que traduce el errorHandler.
import bcrypt from 'bcryptjs';
import { User } from '../../entities';
import { signToken } from '../../shared/auth/jwt';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '../../shared/errors/app-error';
import { ProfileColor, UserRole, UserState } from '../../shared/types/enums';
import { authRepository } from './auth.repository';
import { LoginInput, RegisterInput } from './auth.schema';

// Costo del hash de bcrypt, el mismo que usa el seed del usuario admin.
// 10 es el valor habitual: lento como para frenar un ataque por fuerza bruta,
// rápido como para no trabar el login.
const SALT_ROUNDS = 10;

// Hash de una contraseña cualquiera, calculado una sola vez al cargar el módulo.
// El login lo compara cuando el email no existe, para que esa respuesta tarde lo
// mismo que la de un email registrado (ver login()).
const DUMMY_HASH = bcrypt.hashSync('contraseña-de-relleno', SALT_ROUNDS);

/** Vista pública de un usuario: es lo único que sale en las respuestas de la API. */
type PublicUser = {
  id_user: number;
  username: string;
  email: string;
  rol: UserRole;
  state: UserState;
  url_avatar: string | null;
  url_banner: string | null;
  banner_position: number;
  profile_color: ProfileColor | null;
  registration_date: Date;
};

/**
 * Mensaje de una cuenta dada de baja. Es un 403 y no un 401: las credenciales
 * están bien, lo que pasa es que la cuenta está suspendida.
 */
const suspendedAccountError = () =>
  new ForbiddenError(
    'Tu cuenta está suspendida. Escribinos si creés que se trata de un error.'
  );

/** Respuesta de register y login: el usuario y su token recién emitido. */
type AuthResult = {
  user: PublicUser;
  token: string;
};

/**
 * Arma la vista pública de un usuario.
 *
 * Se listan los campos uno por uno a propósito: en el login el usuario se trae con
 * el scope withPassword, así que devolverlo entero filtraría el hash. Enumerar los
 * campos es la garantía de que eso no pueda pasar por descuido.
 */
function toPublicUser(user: User): PublicUser {
  return {
    id_user: user.id_user,
    username: user.username,
    email: user.email,
    rol: user.rol,
    state: user.state,
    url_avatar: user.url_avatar ?? null,
    url_banner: user.url_banner ?? null,
    banner_position: user.banner_position ?? 50,
    profile_color: user.profile_color ?? null,
    registration_date: user.registration_date,
  };
}

export const authService = {
  /**
   * Da de alta una cuenta nueva y la deja logueada.
   * @param data username, email y contraseña en texto plano, ya validados por Zod.
   * @returns el usuario creado y su token.
   */
  async register(data: RegisterInput): Promise<AuthResult> {
    // Se chequea antes de insertar para poder decir exactamente qué campo está
    // repetido. La garantía real igual la dan los índices únicos de la tabla: si
    // dos registros entran al mismo tiempo, la base rechaza el segundo y el
    // errorHandler traduce ese error a un 409.
    if (await authRepository.findByEmail(data.email)) {
      throw new ConflictError('Ya existe una cuenta registrada con ese email.');
    }

    if (await authRepository.findByUsername(data.username)) {
      throw new ConflictError('Ese nombre de usuario ya está en uso.');
    }

    const user = await authRepository.create({
      username: data.username,
      email: data.email,
      password: await bcrypt.hash(data.password, SALT_ROUNDS),
      // El rol NO se toma nunca de la request: todo registro público entra como
      // FREE. Se sube a PRO pagando, y a ADMIN solo desde el seed.
      rol: 'FREE',
    });

    return {
      user: toPublicUser(user),
      token: signToken({ id_user: user.id_user, rol: user.rol }),
    };
  },

  /**
   * Valida las credenciales y emite un token.
   * @param data email y contraseña en texto plano.
   * @returns el usuario y su token.
   */
  async login(data: LoginInput): Promise<AuthResult> {
    const user = await authRepository.findByEmailWithPassword(data.email);

    // Mismo mensaje si el email no existe y si la contraseña está mal: cualquier
    // diferencia le serviría a un atacante para averiguar qué emails están
    // registrados en el sistema.
    const invalidCredentials = new UnauthorizedError('El email o la contraseña son incorrectos.');

    // bcrypt se corre SIEMPRE, aunque el email no exista: si en ese caso se
    // respondiera al instante, medir cuánto tarda el login alcanzaría para saber
    // qué emails están registrados, por más que el mensaje sea el mismo.
    const passwordMatches = await bcrypt.compare(data.password, user?.password ?? DUMMY_HASH);
    if (!user || !passwordMatches) throw invalidCredentials;

    // Recién acá se avisa que la cuenta está suspendida: si se chequeara antes de
    // la contraseña, cualquiera podría averiguar qué emails están registrados.
    if (user.state === 'suspended') throw suspendedAccountError();

    return {
      user: toPublicUser(user),
      token: signToken({ id_user: user.id_user, rol: user.rol }),
    };
  },

  /**
   * Emite un token nuevo con el rol actualizado del usuario.
   *
   * El backend ya no depende del rol del token para autorizar (requireAuth lo
   * relee de la base, ver shared/auth/session.ts), pero el token y el usuario que
   * guarda el frontend sí lo llevan: cuando alguien paga y pasa a PRO, pedir un
   * token nuevo es lo que deja al frontend al día sin obligarlo a cerrar sesión y
   * volver a entrar.
   *
   * No es una "renovación" de la sesión en el sentido de estirar su vencimiento
   * indefinidamente: se emite contra un token que todavía es válido, y el nuevo
   * dura lo mismo que cualquier otro (JWT_EXPIRES_IN).
   *
   * @param id_user id que viene dentro del token verificado.
   * @returns el usuario y su token recién emitido.
   */
  async refresh(id_user: number): Promise<AuthResult> {
    const user = await authRepository.findById(id_user);

    if (!user) throw new NotFoundError('El usuario');

    // Mismo chequeo que getProfile: una cuenta suspendida no puede seguir
    // operando aunque su token siga siendo válido.
    if (user.state === 'suspended') throw suspendedAccountError();

    return {
      user: toPublicUser(user),
      token: signToken({ id_user: user.id_user, rol: user.rol }),
    };
  },

  /**
   * Devuelve los datos del usuario dueño de un token.
   *
   * El frontend lo usa al arrancar, cuando recupera el token del storage: así se
   * entera de si sigue siendo válido y trae el rol actualizado, en vez de confiar
   * en lo que tenga guardado el navegador.
   *
   * @param id_user id que viene dentro del token verificado.
   * @returns la vista pública del usuario.
   */
  async getProfile(id_user: number): Promise<PublicUser> {
    const user = await authRepository.findById(id_user);

    if (!user) throw new NotFoundError('El usuario');

    // El token de una cuenta suspendida sigue siendo válido hasta que vence, así
    // que la baja se chequea acá: el frontend llama a /auth/me al abrir la app y
    // este 403 lo saca de la sesión.
    if (user.state === 'suspended') throw suspendedAccountError();

    return toPublicUser(user);
  },
};
