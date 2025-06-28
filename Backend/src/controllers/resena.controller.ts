import { Request, Response } from 'express';
import { MikroORM } from '@mikro-orm/mysql';
import { Resena } from '../entities/resena.entity';
import { Libro } from '../entities/libro.entity';
import { Usuario } from '../entities/usuario.entity';

import * as BadWordsFilter from 'bad-words';

const Filter = (BadWordsFilter as any).default || BadWordsFilter;
const filter = new Filter();


export const getResenas = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const resenas = await orm.em.find(Resena, {}, { populate: ['usuario', 'libro'] });
  res.json(resenas);
};

export const getResenaById = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const resena = await orm.em.findOne(Resena, { id: +req.params.id }, { populate: ['usuario', 'libro'] });
  if (!resena) return res.status(404).json({ error: 'Reseña no encontrada' });
  res.json(resena);
};

export const createResena = async (req: Request, res: Response) => {
  try {
    const orm = req.app.get('orm') as MikroORM;
    const { comentario, estrellas, libroId } = req.body;

    const usuarioPayload = req.user;
    if (!usuarioPayload) return res.status(401).json({ error: 'Usuario no autenticado' });

    const usuario = await orm.em.findOne(Usuario, { id: usuarioPayload.id });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    const libro = await orm.em.findOne(Libro, { id: libroId });
    if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });

    const comentarioLimpio = filter.clean(comentario);

    const nuevaResena = orm.em.create(Resena, {
      comentario: comentarioLimpio,
      estrellas,
      fechaResena: new Date(),
      libro,
      usuario,
    });

    await orm.em.persistAndFlush(nuevaResena);
    res.status(201).json({ message: 'Reseña creada', resena: nuevaResena });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Error al crear la reseña',
    });
  }
};

export const updateResena = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const resena = await orm.em.findOne(Resena, { id: +req.params.id });
  if (!resena) return res.status(404).json({ error: 'Reseña no encontrada' });

  if (req.body.comentario) {
    req.body.comentario = filter.clean(req.body.comentario);
  }

  orm.em.assign(resena, req.body);
  await orm.em.persistAndFlush(resena);
  res.json({ message: 'Reseña actualizada', resena });
};

export const deleteResena = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const resena = await orm.em.findOne(Resena, { id: +req.params.id });
  if (!resena) return res.status(404).json({ error: 'Reseña no encontrada' });

  await orm.em.removeAndFlush(resena);
  res.json({ message: 'Reseña eliminada' });
};
