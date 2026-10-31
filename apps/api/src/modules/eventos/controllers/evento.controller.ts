import { Request, Response } from 'express';

import {
  listEventos,
  getEventoById,
  createEvento,
  updateEvento,
  deleteEvento
} from '../services/evento.service.js';

import type { CreateEventoDto, UpdateEventoDto } from '../dtos/evento.dto.js';
import { respondWithError, sendApiError } from '../../../shared/api-error.js';
import { obtenerAuth } from '../../../middlewares/authorization.js';


export const getEventos = async (req: Request, res: Response) => {
  try {
    const eventos = await listEventos(obtenerAuth(req)?.role === 'administrador');
    res.json({ eventos });
  } catch (error) {
    sendApiError(res, error, 'Error al obtener los eventos');
  }
};

export const getEvento = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const evento = await getEventoById(id);

    if (!evento || (evento.draft && obtenerAuth(req)?.role !== 'administrador')) {
      return respondWithError(res, 404, 'NOT_FOUND', 'Evento no encontrado');
    }

    res.json({ evento });
  } catch (error) {
    sendApiError(res, error, 'Error al obtener el evento');
  }
};

export const crearEvento = async (
  req: Request<{}, {}, CreateEventoDto>,
  res: Response
) => {
  const { nombre, descripcion, imagen, draft } = req.body;

  try {
    const evento = await createEvento({ nombre, descripcion, imagen, draft });
    res.status(201).json({ message: 'Evento creado correctamente', evento });
  } catch (error) {
    sendApiError(res, error, 'Error al crear el evento');
  }
};

export const actualizarEvento = async (
  req: Request<{ id: string }, {}, UpdateEventoDto>,
  res: Response
) => {
  const id = Number(req.params.id);

  try {
    const evento = await updateEvento(id, req.body);

    if (!evento) {
      return respondWithError(res, 404, 'NOT_FOUND', 'Evento no encontrado');
    }

    res.json({ message: 'Evento actualizado correctamente', evento });
  } catch (error) {
    sendApiError(res, error, 'Error al actualizar el evento');
  }
};

export const borrarEvento = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const eliminado = await deleteEvento(id);

    if (!eliminado) {
      return respondWithError(res, 404, 'NOT_FOUND', 'Evento no encontrado');
    }

    res.json({ message: 'Evento eliminado correctamente' });
  } catch (error) {
    sendApiError(res, error, 'Error al eliminar el evento');
  }
};
