// src/controllers/lista.controller.ts
import { Request, Response } from 'express';
import { MikroORM } from '@mikro-orm/mysql';
import { Lista } from '../entities/lista.entity';

export const getListas = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const listas = await orm.em.find(Lista, {});
  res.json(listas);
};

export const getListaById = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const lista = await orm.em.findOne(Lista, { id: +req.params.id });
  if (!lista) return res.status(404).json({ error: 'No encontrada' });
  res.json(lista);
};

export const createLista = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const lista = orm.em.create(Lista, req.body);
  await orm.em.persistAndFlush(lista);
  res.status(201).json(lista);
};

export const updateLista = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const lista = await orm.em.findOne(Lista, { id: +req.params.id });
  if (!lista) return res.status(404).json({ error: 'No encontrada' });
  orm.em.assign(lista, req.body);
  await orm.em.flush();
  res.json(lista);
};

export const deleteLista = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const lista = await orm.em.findOne(Lista, { id: +req.params.id });
  if (!lista) return res.status(404).json({ error: 'No encontrada' });
  await orm.em.removeAndFlush(lista);
  res.json({ mensaje: 'Eliminada' });
};
