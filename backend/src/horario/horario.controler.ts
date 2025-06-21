import { Request, Response, NextFunction } from 'express';
import { Horario } from './horario.entity.js';
import { request } from 'http';
import { orm } from '../shared/db/orm.js';
const em = orm.em;

function sanitizeHorarioInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizeHorarioInput = {
    id: req.body.id,
    diaSemana: req.body.diaSemana,
    horaDesde: req.body.horaDesde,
    horaHasta: req.body.horaHasta,
    usuario: req.body.usuario,
  };
  Object.keys(req.body.sanitizeHorarioInput).forEach((key) => {
    if (req.body.sanitizeHorarioInput[key] === undefined) {
      delete req.body.sanitizeHorarioInput[key];
    }
  });
  next();
}

async function findAll(req: Request, res: Response) {
  try {
    const horarios = await em.find(Horario, {}, { populate: ['usuario'] });
    res.status(200).json({ message: 'horarios encontrados', data: horarios });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findManyByUser(req: Request, res: Response) {
  try {
    const userId = Number.parseInt(req.params.usuario);
    // Check if userId is valid
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'ID de usuario inválido' });
    }
    const horario = await em.find(Horario, { usuario: userId });
    res.status(200).json({ message: 'horario encontrado', data: horario });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const newHorario = em.create(Horario, req.body.sanitizeHorarioInput);
    await em.flush();
    res.status(201).json({ message: 'Nuevo horario creado', data: newHorario });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const updateHorario = await em.findOneOrFail(Horario, { id });
    em.assign(updateHorario, req.body.sanitizeHorarioInput);
    await em.flush();
    res
      .status(200)
      .json({ message: 'Horario actualizado', data: updateHorario });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const horario = await em.findOneOrFail(Horario, { id });
    await em.removeAndFlush(horario);
    res.status(200).json({ message: 'Horario borrado', data: horario });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { sanitizeHorarioInput, findAll, findManyByUser, add, update, remove };
