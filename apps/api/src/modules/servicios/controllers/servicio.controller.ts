import { Request, Response } from 'express';

import {
  listServiciosByUsuario,
  buscarServiciosPorNombre,
  buscarServiciosPorCategoria,
  createServicio,
  updateServicio,
  deleteServicio,
  listServiciosEnRevision,
  aprobarServicio,
  denegarServicio
} from '../services/servicio.service.js';

import type {
  CreateServicioDto,
  UpdateServicioDto
} from '../dtos/servicio.dto.js';
import { respondWithError, sendApiError } from '../../../shared/api-error.js';


const serializeServicio = (servicio: {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  estado: 'borrador' | 'revision' | 'publicado';
  creadoEn: Date;
  categoria: {
    id: number;
    nombre: string;
  };
  usuario: {
    id: number;
    nombre: string;
    telefono?: number;
    zona?: string;
  };
}) => ({
  id: servicio.id,
  nombre: servicio.nombre,
  descripcion: servicio.descripcion,
  imagen: servicio.imagen,
  estado: servicio.estado,
  creadoEn: servicio.creadoEn,
  categoria: {
    id: servicio.categoria.id,
    nombre: servicio.categoria.nombre
  },
  // Datos de contacto públicos de la empresa dueña del servicio.
  empresa: {
    id: servicio.usuario.id,
    nombre: servicio.usuario.nombre,
    telefono: servicio.usuario.telefono,
    zona: servicio.usuario.zona
  }
});


export const getServicios = async (
  req: Request,
  res: Response
) => {
  const usuarioId = Number(req.query.usuarioId);

  try {
    const servicios = await listServiciosByUsuario(usuarioId);

    res.json({
      servicios: servicios.map(serializeServicio)
    });
  } catch (error) {
    sendApiError(res, error, 'Error al obtener los servicios');
  }
};


export const buscarServicios = async (
  req: Request,
  res: Response
) => {
  const nombre = String(req.query.nombre ?? '').trim();
  const zona = String(req.query.zona ?? '').trim();
  const empresa = String(req.query.empresa ?? '').trim();

  try {
    const servicios = await buscarServiciosPorNombre(nombre, zona, empresa);

    res.json({
      servicios: servicios.map(serializeServicio)
    });
  } catch (error) {
    sendApiError(res, error, 'Error al buscar los servicios');
  }
};


export const buscarServiciosCategoria = async (
  req: Request,
  res: Response
) => {
  const categoriaId = Number(req.params.categoriaId);

  try {
    const servicios = await buscarServiciosPorCategoria(categoriaId);

    res.json({
      servicios: servicios.map(serializeServicio)
    });
  } catch (error) {
    sendApiError(res, error, 'Error al buscar los servicios por categoría');
  }
};


export const crearServicio = async (
  req: Request<{}, {}, CreateServicioDto>,
  res: Response
) => {
  const {
    nombre,
    descripcion,
    imagen,
    categoriaId,
    usuarioId,
    estado
  } = req.body;

  try {
    const servicio = await createServicio({
      nombre,
      descripcion,
      imagen,
      categoriaId: Number(categoriaId),
      usuarioId: Number(usuarioId),
      estado
    });

    res.status(201).json({
      message: 'Servicio creado correctamente',
      servicio: serializeServicio(servicio)
    });
  } catch (error) {
    sendApiError(res, error, 'Error al crear el servicio');
  }
};


export const actualizarServicio = async (
  req: Request<
    { id: string },
    {},
    UpdateServicioDto & { usuarioId: number }
  >,
  res: Response
) => {
  const id = Number(req.params.id);
  const { usuarioId, ...data } = req.body;

  try {
    const servicio = await updateServicio(
      id,
      Number(usuarioId),
      data
    );

    if (!servicio) {
      return respondWithError(res, 404, 'NOT_FOUND', 'Servicio no encontrado');
    }

    res.json({
      message: 'Servicio actualizado correctamente',
      servicio: serializeServicio(servicio)
    });
  } catch (error) {
    sendApiError(res, error, 'Error al actualizar el servicio');
  }
};


export const borrarServicio = async (
  req: Request,
  res: Response
) => {
  const id = Number(req.params.id);

  const usuarioId = Number(
    req.query.usuarioId ?? req.body?.usuarioId
  );

  if (!Number.isSafeInteger(usuarioId) || usuarioId <= 0) {
    return respondWithError(res, 400, 'VALIDATION_ERROR', 'El parámetro "usuarioId" es requerido y debe ser un entero positivo');
  }

  try {
    const eliminado = await deleteServicio(
      id,
      usuarioId
    );

    if (!eliminado) {
      return respondWithError(res, 404, 'NOT_FOUND', 'Servicio no encontrado');
    }

    res.json({
      message: 'Servicio eliminado correctamente'
    });
  } catch (error) {
    sendApiError(res, error, 'Error al eliminar el servicio');
  }
};


// Lista los servicios que estan en estado "revision", para que el admin los vea

export const getServiciosEnRevision = async (
  _req: Request,
  res: Response
) => {
  try {
    const servicios = await listServiciosEnRevision();

    res.json({
      servicios: servicios.map(serializeServicio)
    });
  } catch (error) {
    sendApiError(res, error, 'Error al obtener los servicios en revisión');
  }
};


// El admin aprueba un servicio en revision: pasa a "publicado"

export const aprobarServicioAdmin = async (
  req: Request,
  res: Response
) => {
  const id = Number(req.params.id);

  try {
    const servicio = await aprobarServicio(id);

    if (!servicio) {
      return respondWithError(res, 404, 'NOT_FOUND', 'Servicio no encontrado');
    }

    res.json({
      message: 'Servicio aprobado y publicado correctamente',
      servicio: serializeServicio(servicio)
    });
  } catch (error) {
    sendApiError(res, error, 'Error al aprobar el servicio');
  }
};


// El admin deniega un servicio en revision: se borra directamente

export const denegarServicioAdmin = async (
  req: Request,
  res: Response
) => {
  const id = Number(req.params.id);

  try {
    const eliminado = await denegarServicio(id);

    if (!eliminado) {
      return respondWithError(res, 404, 'NOT_FOUND', 'Servicio no encontrado');
    }

    res.json({
      message: 'Servicio denegado y eliminado correctamente'
    });
  } catch (error) {
    sendApiError(res, error, 'Error al denegar el servicio');
  }
};
