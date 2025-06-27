import { Request, Response } from 'express';
import { MikroORM } from '@mikro-orm/mysql';
import { Reaccion } from '../entities/reaccion.entity';

export const addOrUpdateReaccion = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const { usuarioId, resenaId, tipo } = req.body;

  if (!usuarioId || !resenaId || !tipo) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  let reaccion = await orm.em.findOne(Reaccion, {
    usuario: usuarioId,
    resena: resenaId,
  });

  if (reaccion) {
    reaccion.tipo = tipo;
    reaccion.fecha = new Date();
  } else {
    reaccion = orm.em.create(Reaccion, {
      usuario: usuarioId,
      resena: resenaId,
      tipo,
      fecha: new Date(),
    });
    await orm.em.persist(reaccion);
  }

  await orm.em.flush();
  res.status(201).json(reaccion);
};

export const getReaccionesPorResena = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const resenaId = +req.params.resenaId;

  const reacciones = await orm.em.find(Reaccion, { resena: resenaId }, { populate: ['usuario'] });
  res.json(reacciones);
};

export const deleteReaccion = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const { usuarioId, resenaId } = req.params;

  const reaccion = await orm.em.findOne(Reaccion, {
    usuario: +usuarioId,
    resena: +resenaId,
  });

  if (!reaccion) {
    return res.status(404).json({ error: 'Reacción no encontrada' });
  }

  await orm.em.removeAndFlush(reaccion);
  res.json({ mensaje: 'Reacción eliminada' });
};
