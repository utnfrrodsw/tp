// src/controllers/editorial.controller.ts
import { Request, Response, RequestHandler } from 'express';
import { MikroORM } from '@mikro-orm/mysql';
import { Editorial } from '../entities/editorial.entity';

export const getEditoriales: RequestHandler = async (req, res) => {
  const orm = req.app.get('orm') as MikroORM;
  const editoriales = await orm.em.find(Editorial, {});
  res.json(editoriales);
};

export const getEditorialById: RequestHandler = async (req, res) => {
  const orm = req.app.get('orm') as MikroORM;
  const editorial = await orm.em.findOne(Editorial, { id: +req.params.id });
  if (!editorial) {
    res.status(404).json({ error: 'No encontrada' });
    return;
  }
  res.json(editorial);
};

export const createEditorial: RequestHandler = async (req, res) => {
  const orm = req.app.get('orm') as MikroORM;
  const editorial = orm.em.create(Editorial, req.body);
  await orm.em.persistAndFlush(editorial);
  res.status(201).json(editorial);
};

export const updateEditorial: RequestHandler = async (req, res) => {
  const orm = req.app.get('orm') as MikroORM;
  const editorial = await orm.em.findOne(Editorial, { id: +req.params.id });
  if (!editorial) {
    res.status(404).json({ error: 'No encontrada' });
    return;
  }
  orm.em.assign(editorial, req.body);
  await orm.em.flush();
  res.json(editorial);
};

export const deleteEditorial: RequestHandler = async (req, res) => {
  const orm = req.app.get('orm') as MikroORM;
  const editorial = await orm.em.findOne(Editorial, { id: +req.params.id });
  if (!editorial) {
    res.status(404).json({ error: 'No encontrada' });
    return;
  }
  await orm.em.removeAndFlush(editorial);
  res.json({ mensaje: 'Eliminada' });
};
