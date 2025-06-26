// src/controllers/saga.controller.ts
import { Request, Response } from 'express';
import { MikroORM } from '@mikro-orm/mysql';
import { Saga } from '../entities/saga.entity';

export const getSagas = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const sagas = await orm.em.find(Saga, {});
  res.json(sagas);
};

export const getSagaById = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const saga = await orm.em.findOne(Saga, { id: +req.params.id });
  if (!saga) return res.status(404).json({ error: 'No encontrada' });
  res.json(saga);
};

export const createSaga = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const saga = orm.em.create(Saga, req.body);
  await orm.em.persistAndFlush(saga);
  res.status(201).json(saga);
};

export const updateSaga = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const saga = await orm.em.findOne(Saga, { id: +req.params.id });
  if (!saga) return res.status(404).json({ error: 'No encontrada' });
  orm.em.assign(saga, req.body);
  await orm.em.flush();
  res.json(saga);
};

export const deleteSaga = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const saga = await orm.em.findOne(Saga, { id: +req.params.id });
  if (!saga) return res.status(404).json({ error: 'No encontrada' });
  await orm.em.removeAndFlush(saga);
  res.json({ mensaje: 'Eliminada' });
};
