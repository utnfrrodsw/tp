import { Request, Response } from 'express';

import {
  serializeTablero,
  listTableros,
  getTableroById,
  createTablero,
  updateTablero,
  deleteTablero,
  addServicioToTablero,
  removeServicioFromTablero
} from '../services/tablero.service.js';

import type { CreateTableroDto, UpdateTableroDto, AddServicioToTableroDto } from '../dtos/tablero.dto.js';
import { respondWithError, sendApiError } from '../../../shared/api-error.js';
import { obtenerAuth } from '../../../middlewares/authorization.js';

export const getTableros = async (req: Request, res: Response) => {
  try {
    const resultados = await listTableros(obtenerAuth(req)!.userId);
    res.json({ tableros: resultados.map(({ tablero, guardados }) => serializeTablero(tablero, guardados)) });
  } catch (error) {
    console.error('Error al listar tableros:', error);
    sendApiError(res, error, 'Error al obtener los tableros');
  }
};

export const crearTablero = async (
  req: Request<{}, {}, CreateTableroDto>,
  res: Response
) => {
  try {
    const tablero = await createTablero(obtenerAuth(req)!.userId, req.body);
    if (!tablero) {
      respondWithError(res, 404, 'NOT_FOUND', 'Cliente o evento no disponible');
      return;
    }
    res.status(201).json({ tablero: serializeTablero(tablero) });
  } catch (error) {
    console.error('Error al crear tablero:', error);
    sendApiError(res, error, 'Error al crear el tablero');
  }
};

export const getTablero = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const resultado = await getTableroById(id, obtenerAuth(req)!.userId);
    if (!resultado) {
      respondWithError(res, 404, 'NOT_FOUND', 'Tablero no encontrado');
      return;
    }
    res.json({ tablero: serializeTablero(resultado.tablero, resultado.guardados) });
  } catch (error) {
    console.error('Error al obtener tablero:', error);
    sendApiError(res, error, 'Error al obtener el tablero');
  }
};

export const actualizarTablero = async (
  req: Request<{ id: string }, {}, UpdateTableroDto>,
  res: Response
) => {
  const id = Number(req.params.id);

  try {
    const resultado = await updateTablero(id, obtenerAuth(req)!.userId, req.body);
    if (resultado === 'TABLERO_NOT_FOUND') {
      respondWithError(res, 404, 'NOT_FOUND', 'Tablero no encontrado');
      return;
    }
    if (resultado === 'EVENTO_NOT_FOUND') {
      respondWithError(res, 404, 'NOT_FOUND', 'Evento no disponible');
      return;
    }
    res.json({ tablero: serializeTablero(resultado.tablero, resultado.guardados) });
  } catch (error) {
    console.error('Error al editar tablero:', error);
    sendApiError(res, error, 'Error al editar el tablero');
  }
};

export const borrarTablero = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const eliminado = await deleteTablero(id, obtenerAuth(req)!.userId);
    if (!eliminado) {
      respondWithError(res, 404, 'NOT_FOUND', 'Tablero no encontrado');
      return;
    }
    res.status(204).end();
  } catch (error) {
    console.error('Error al borrar tablero:', error);
    sendApiError(res, error, 'Error al borrar el tablero');
  }
};

export const agregarServicioATablero = async (
  req: Request<{ id: string }, {}, AddServicioToTableroDto>,
  res: Response
) => {
  const id = Number(req.params.id);

  try {
    const resultado = await addServicioToTablero(id, obtenerAuth(req)!.userId, req.body.servicioId);
    if (resultado === 'TABLERO_NOT_FOUND') {
      respondWithError(res, 404, 'NOT_FOUND', 'Tablero no encontrado');
      return;
    }
    if (resultado === 'SERVICIO_NOT_FOUND') {
      respondWithError(res, 404, 'NOT_FOUND', 'Servicio no disponible');
      return;
    }
    if (resultado === 'ALREADY_SAVED') {
      respondWithError(res, 409, 'CONFLICT', 'El servicio ya está en este tablero');
      return;
    }
    res.status(201).json({ message: 'Servicio agregado al tablero' });
  } catch (error) {
    console.error('Error al guardar servicio:', error);
    sendApiError(res, error, 'Error al guardar el servicio');
  }
};

export const quitarServicioDeTablero = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const servicioId = Number(req.params.servicioId);

  try {
    const eliminado = await removeServicioFromTablero(id, obtenerAuth(req)!.userId, servicioId);
    if (!eliminado) {
      respondWithError(res, 404, 'NOT_FOUND', 'Servicio no encontrado en el tablero');
      return;
    }
    res.status(204).end();
  } catch (error) {
    console.error('Error al quitar servicio:', error);
    sendApiError(res, error, 'Error al quitar el servicio');
  }
};
