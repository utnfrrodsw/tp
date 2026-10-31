import { getOrm } from '../../../config/orm.js';
import { Servicio } from '../../../entities/servicio.js';
import { Categoria } from '../../../entities/categoria.js';
import { User } from '../../../entities/usuario.js';
import type { CreateServicioDto, UpdateServicioDto } from '../dtos/servicio.dto.js';
import { ApiError } from '../../../shared/api-error.js';


// Lista los servicios de una empresa

export const listServiciosByUsuario = async (
  usuarioId: number
): Promise<Servicio[]> => {
  const em = getOrm().em.fork();

  return em.find(
    Servicio,
    { usuario: usuarioId },
    {
      populate: ['categoria', 'usuario'],
      orderBy: { creadoEn: 'DESC' }
    }
  );
};


// Busca servicios publicados por nombre, usado desde la pantalla del cliente

export const buscarServiciosPorNombre = async (
  nombre: string,
  zona = '',
  empresa = ''
): Promise<Servicio[]> => {
  const em = getOrm().em.fork();

  // Armo el filtro del usuario (empresa) paso a paso
  const filtroUsuario: any = {
    rol: 'empresa',
    activo: true
  };
  if (zona) {
    filtroUsuario.zona = { $ilike: `%${zona}%` };
  }
  if (empresa) {
    filtroUsuario.nombre = { $ilike: `%${empresa}%` };
  }

  // Armo el filtro completo de la búsqueda
  // Solo se muestran los servicios que ya estan "publicado" (el admin los aprobo)
  const filtro: any = {
    estado: 'publicado',
    usuario: filtroUsuario
  };
  if (nombre) {
    filtro.nombre = { $ilike: `%${nombre}%` };
  }

  return em.find(
    Servicio,
    filtro,
    {
      populate: ['categoria', 'usuario'],
      orderBy: { nombre: 'ASC' }
    }
  );
};


// Busca servicios publicados por categoría, usado desde la pantalla del cliente

export const buscarServiciosPorCategoria = async (
  categoriaId: number
): Promise<Servicio[]> => {
  const em = getOrm().em.fork();

  return em.find(
    Servicio,
    {
      categoria: categoriaId,
      estado: 'publicado',
      usuario: { rol: 'empresa', activo: true }
    },
    {
      populate: ['categoria', 'usuario'],
      orderBy: { nombre: 'ASC' }
    }
  );
};


// Lista los servicios que estan esperando que el administrador los revise

export const listServiciosEnRevision = async (): Promise<Servicio[]> => {
  const em = getOrm().em.fork();

  return em.find(
    Servicio,
    { estado: 'revision' },
    {
      populate: ['categoria', 'usuario'],
      orderBy: { creadoEn: 'ASC' }
    }
  );
};


// Obtiene un servicio por id

export const getServicioById = async (
  id: number
): Promise<Servicio | null> => {
  const em = getOrm().em.fork();

  return em.findOne(
    Servicio,
    { id },
    { populate: ['categoria'] }
  );
};


// Crea un servicio nuevo

export const createServicio = async (
  data: CreateServicioDto
): Promise<Servicio> => {
  const em = getOrm().em.fork();

  const categoria = await em.findOne(Categoria, {
    id: data.categoriaId
  });

  if (!categoria) {
    throw new ApiError(404, 'NOT_FOUND', 'La categoría indicada no existe');
  }

  const usuario = await em.findOne(User, {
    id: data.usuarioId
  });

  if (!usuario) {
    throw new ApiError(404, 'NOT_FOUND', 'El usuario indicado no existe');
  }

  const servicio = em.create(Servicio, {
    nombre: data.nombre,
    descripcion: data.descripcion,
    imagen: data.imagen,
    categoria,
    usuario,
    estado: data.estado ?? 'borrador',
    creadoEn: new Date()
  });

  await em.persist(servicio).flush();

  return servicio;
};


// Actualiza un servicio existente

export const updateServicio = async (
  id: number,
  usuarioId: number,
  data: UpdateServicioDto
): Promise<Servicio | null> => {
  const em = getOrm().em.fork();

  const servicio = await em.findOne(Servicio, {
    id,
    usuario: usuarioId
  });

  if (!servicio) {
    return null;
  }

  if (data.nombre !== undefined) {
    servicio.nombre = data.nombre;
  }

  if (data.descripcion !== undefined) {
    servicio.descripcion = data.descripcion;
  }

  if (data.imagen !== undefined) {
    servicio.imagen = data.imagen;
  }

  if (data.estado !== undefined) {
    // La empresa nunca puede publicar un servicio por su cuenta, eso lo valida
    // el schema de zod (solo permite 'borrador' o 'revision'), pero lo volvemos
    // a chequear aca por las dudas.
    if (data.estado === 'publicado') {
      throw new ApiError(403, 'FORBIDDEN', 'Las empresas no pueden publicar un servicio directamente, esperá a que el administrador lo apruebe');
    }
    servicio.estado = data.estado;
  }

  if (data.categoriaId !== undefined) {
    const categoria = await em.findOne(Categoria, {
      id: data.categoriaId
    });

    if (!categoria) {
      throw new ApiError(404, 'NOT_FOUND', 'La categoría indicada no existe');
    }

    servicio.categoria = categoria;
  }

  await em.flush();

  return servicio;
};


// Borra un servicio

export const deleteServicio = async (
  id: number,
  usuarioId: number
): Promise<boolean> => {
  const em = getOrm().em.fork();

  const servicio = await em.findOne(Servicio, {
    id,
    usuario: usuarioId
  });

  if (!servicio) {
    return false;
  }

  await em.remove(servicio).flush();

  return true;
};


// El administrador aprueba el servicio que esta en revision y lo publica

export const aprobarServicio = async (
  id: number
): Promise<Servicio | null> => {
  const em = getOrm().em.fork();

  const servicio = await em.findOne(Servicio, { id });

  if (!servicio) {
    return null;
  }

  servicio.estado = 'publicado';
  await em.flush();

  return servicio;
};


// El administrador deniega el servicio que esta en revision: se borra directamente

export const denegarServicio = async (
  id: number
): Promise<boolean> => {
  const em = getOrm().em.fork();

  const servicio = await em.findOne(Servicio, { id });

  if (!servicio) {
    return false;
  }

  await em.remove(servicio).flush();

  return true;
};
