import { getOrm } from '../../../config/orm.js';
import { User } from '../../../entities/usuario.js';

export const listUsuariosByRol = async (rol?: string): Promise<User[]> => {
  const em = getOrm().em.fork();

  const rolValido = rol as 'cliente' | 'administrador' | 'empresa' | undefined;
  return em.find(User, rolValido ? { rol: rolValido } : {}, { orderBy: { nombre: 'ASC' } });
};

// Alimenta el autocompletado del buscador del cliente: sólo empresas operativas.
export const listEmpresasActivas = async (): Promise<User[]> => {
  const em = getOrm().em.fork();

  return em.find(User, { rol: 'empresa', activo: true }, { orderBy: { nombre: 'ASC' } });
};

export const setUsuarioActivo = async (id: number, activo: boolean): Promise<User | null> => {
  const em = getOrm().em.fork();

  const usuario = await em.findOne(User, { id });

  if (!usuario) return null;

  usuario.activo = activo;
  await em.flush();

  return usuario;
};

// Trae un usuario por id, lo usamos para que la empresa vea su propio perfil (y su plan)
export const getUsuarioById = async (id: number): Promise<User | null> => {
  const em = getOrm().em.fork();

  return em.findOne(User, { id });
};

// Cambia el plan de la empresa. Lo llamamos cuando Mercado Pago confirma el pago del plan Pro.
export const setUsuarioPlan = async (id: number, plan: 'gratis' | 'pro'): Promise<User | null> => {
  const em = getOrm().em.fork();

  const usuario = await em.findOne(User, { id });

  if (!usuario) return null;

  usuario.plan = plan;
  await em.flush();

  return usuario;
};
