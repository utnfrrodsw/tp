// src/controllers/actividad.controller.ts
import { Request, Response } from 'express';
import { MikroORM } from '@mikro-orm/core';
import { Actividad, TipoActividad } from '../entities/actividad.entity';
import { Usuario } from '../entities/usuario.entity';
import { Libro } from '../entities/libro.entity';
import { Resena } from '../entities/resena.entity';
import { Seguimiento } from '../entities/seguimiento.entity';

// Extendemos Request para tipar req.user con un payload que tiene id
interface AuthRequest extends Request {
  user?: { id: number; [key: string]: any };
}

export const getActividades = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const actividades = await orm.em.find(Actividad, {}, { populate: ['usuario', 'libro', 'resena'] });
  res.json(actividades);
};

export const getActividadById = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const actividad = await orm.em.findOne(Actividad, { id: +req.params.id }, { populate: ['usuario', 'libro', 'resena'] });
  if (!actividad) return res.status(404).json({ error: 'Actividad no encontrada' });
  res.json(actividad);
};

export const getActividadesByUsuario = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const usuarioId = +req.params.usuarioId;

  const usuario = await orm.em.findOne(Usuario, { id: usuarioId });
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

  const actividades = await orm.em.find(Actividad, { usuario: usuarioId }, { populate: ['libro', 'resena'] });
  res.json(actividades);
};

export const createActividad = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const { usuarioId, tipo, libroId, resenaId } = req.body;

  if (!usuarioId || !tipo) {
    return res.status(400).json({ error: 'Usuario ID y tipo son requeridos' });
  }

  const usuario = await orm.em.findOne(Usuario, { id: usuarioId });
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

  let libro = null;
  if (libroId) {
    libro = await orm.em.findOne(Libro, { id: libroId });
    if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });
  }

  let resena = null;
  if (resenaId) {
    resena = await orm.em.findOne(Resena, { id: resenaId });
    if (!resena) return res.status(404).json({ error: 'Reseña no encontrada' });
  }

  const actividad = orm.em.create(Actividad, {
    usuario,
    tipo,
    libro,
    resena,
    fecha: new Date()
  });

  await orm.em.persistAndFlush(actividad);
  res.status(201).json(actividad);
};

export const deleteActividad = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const actividad = await orm.em.findOne(Actividad, { id: +req.params.id });
  if (!actividad) return res.status(404).json({ error: 'Actividad no encontrada' });

  await orm.em.removeAndFlush(actividad);
  res.json({ mensaje: 'Actividad eliminada' });
};


