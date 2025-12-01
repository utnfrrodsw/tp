import { Request, Response } from 'express';
import { Horario } from './horario.entity.js';

import { orm } from '../shared/db/orm.js';
const em = orm.em;

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
    console.log('Valor de req.params.usuario:', req.params.usuario); // Depuración
    const userId = Number.parseInt(req.params.usuario);
    // Check if userId is valid
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'ID de usuario inválido' });
    }
    const horario = await em.find(Horario, { usuario: userId });
    res.status(200).json({ message: 'horario encontrado', data: horario });
  } catch (error: any) {
    res.status(500).json({ message: 'Error 500', error: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const newHorario = em.create(Horario, req.body); // Cambiado de req.body.sanitizeHorarioInput a req.body
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
    em.assign(updateHorario, req.body); // Asigna los datos enviados en el cuerpo
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

// Batch update de horarios para un usuario
async function updateBatchByUser(req: Request, res: Response) {
  try {
    const usuarioId = Number.parseInt(req.params.usuarioId);
    if (isNaN(usuarioId)) {
      return res.status(400).json({ message: 'ID de usuario inválido' });
    }
    const horariosInput = req.body;
    if (!Array.isArray(horariosInput)) {
      return res.status(400).json({ message: 'El body debe ser un array de horarios' });
    }
    
    for (const h of horariosInput) {
      if (!(h.horaDesde === '00:00:00' && h.horaHasta === '00:00:00')) {
        if (h.horaDesde >= h.horaHasta) {
          return res.status(400).json({ message: `La hora desde debe ser menor que la hora hasta para el día ${h.diaSemana}` });
        }
      }
    }
    
    const horariosActuales = await em.find(Horario, { usuario: usuarioId });
    // Actualizar o crear cada horario
    for (const h of horariosInput) {
      let horario = horariosActuales.find(ha => ha.diaSemana === h.diaSemana);
      if (horario) {
        horario.horaDesde = h.horaDesde;
        horario.horaHasta = h.horaHasta;
      } else {
        horario = em.create(Horario, {
          usuario: usuarioId,
          diaSemana: h.diaSemana,
          horaDesde: h.horaDesde,
          horaHasta: h.horaHasta
        });
      }
    }
    await em.flush();
    const horariosFinales = await em.find(Horario, { usuario: usuarioId });
    res.status(200).json({ message: 'Horarios actualizados', data: horariosFinales });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findManyByUser, add, update, remove, updateBatchByUser };
