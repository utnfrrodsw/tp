import bcrypt from 'bcryptjs';

import { getOrm } from '../../../config/orm.js';
import { User } from '../../../entities/usuario.js';

// Coste de bcrypt: cada +1 duplica el tiempo de cálculo, encareciendo la fuerza bruta.
const SALT_ROUNDS = 10;

export const hashPassword = (password: string): Promise<string> => bcrypt.hash(password, SALT_ROUNDS);


// Busca un usuario por email y verifica la contraseña contra el hash guardado
export const findUserByCredentials = async (
  email: string,
  password: string
): Promise<User | null> => {

  const em = getOrm().em.fork();

  const user = await em.findOne(User, { email });

  // Se compara igual aunque el usuario no exista, para que el tiempo de
  // respuesta no revele qué emails están registrados.
  const matches = await bcrypt.compare(password, user?.password ?? '');

  return user && matches ? user : null;
};


// Crea un nuevo usuario
export const createUser = async (
  nombre: string,
  email: string,
  password: string,
  role: 'cliente' | 'empresa',
  businessData?: { zona: string; cuit: number; telefono: number }
): Promise<User> => {

  const em = getOrm().em.fork();

  const user = em.create(User, {
    nombre: nombre,
    email,
    password: await hashPassword(password),
    rol: role,
    activo: true,
    plan: 'gratis',
    ...(businessData ?? {})
  });

  await em.persist(user).flush();

  return user;
};
