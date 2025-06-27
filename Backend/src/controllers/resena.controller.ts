// src/controllers/resena.controller.ts
import { Request, Response } from 'express';
import { MikroORM } from '@mikro-orm/mysql';
import { Resena } from '../entities/resena.entity';
import { Usuario } from '../entities/usuario.entity';
import { Libro } from '../entities/libro.entity';
import Filter = require('bad-words');
import { QueryOrder } from '@mikro-orm/core';

const filter = new Filter();

export const getResenas = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const { libroId, usuarioId, ordenarPor } = req.query;

  const where: any = {};
  if (libroId) where.libro = +libroId;
  if (usuarioId) where.usuario = +usuarioId;

  const orderBy: { [P in keyof Resena]?: QueryOrder } = ordenarPor === 'estrellas'
    ? { estrellas: QueryOrder.desc }
    : { fechaResena: QueryOrder.desc };

  const resenas = await orm.em.find(Resena, where, {
    orderBy,
    populate: ['usuario', 'libro'],
  });

  res.json(resenas);
};

export const getPromedioEstrellas = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const libroId = +req.params.libroId;

  // Definimos tipo para resultado raw
  type PromedioResult = { promedio: string; cantidad: string };

  const qb = orm.em.createQueryBuilder(Resena, 'r');

  const result = await qb
    .select('AVG(r.estrellas) as promedio')
    .addSelect('COUNT(r.id) as cantidad')
    .where({ libro: libroId })
    .execute<PromedioResult[]>();

  if (!result.length) {
    return res.json({ promedio: 0, cantidad: 0 });
  }

  const promedio = parseFloat(result[0].promedio) || 0;
  const cantidad = parseInt(result[0].cantidad, 10) || 0;

  res.json({ promedio, cantidad });
};

export const getResenaById = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const resena = await orm.em.findOne(Resena, { id: +req.params.id }, { populate: ['usuario', 'libro'] });
  if (!resena) return res.status(404).json({ error: 'No encontrada' });
  res.json(resena);
};

export const createResena = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const { comentario, estrellas, usuario, libro } = req.body;

  if (!comentario || comentario.trim() === '') return res.status(400).json({ error: 'Comentario requerido' });
  if (estrellas < 1 || estrellas > 5) return res.status(400).json({ error: 'Estrellas debe estar entre 1 y 5' });

  const comentarioFiltrado = filter.clean(comentario);
  const resena = orm.em.create(Resena, {
    comentario: comentarioFiltrado,
    estrellas,
    fechaResena: new Date(),
    usuario,
    libro,
  });

  await orm.em.persistAndFlush(resena);
  res.status(201).json(resena);
};

export const updateResena = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const resena = await orm.em.findOne(Resena, { id: +req.params.id });
  if (!resena) return res.status(404).json({ error: 'No encontrada' });

  const { comentario, estrellas } = req.body;
  if (comentario !== undefined) {
    if (comentario.trim() === '') return res.status(400).json({ error: 'Comentario requerido' });
    resena.comentario = filter.clean(comentario);
  }
  if (estrellas !== undefined) {
    if (estrellas < 1 || estrellas > 5) return res.status(400).json({ error: 'Estrellas debe estar entre 1 y 5' });
    resena.estrellas = estrellas;
  }

  await orm.em.flush();
  res.json(resena);
};

export const deleteResena = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const resena = await orm.em.findOne(Resena, { id: +req.params.id });
  if (!resena) return res.status(404).json({ error: 'No encontrada' });

  await orm.em.removeAndFlush(resena);
  res.json({ mensaje: 'Eliminada' });
};
