// src/controllers/contenidoLista.controller.ts
import { Request, Response } from 'express';
import { MikroORM } from '@mikro-orm/mysql';
import { ContenidoLista } from '../entities/contenidoLista.entity.js';

export const getContenidoLista = async (req: Request, res: Response): Promise<void> => {
  const orm = req.app.get('orm') as MikroORM;
  const listaId = +req.params.listaId;
  const contenidos = await orm.em.find(ContenidoLista, { lista: listaId });
  res.json(contenidos);
};

export const addLibroALista = async (req: Request, res: Response): Promise<void> => {
  const orm = req.app.get('orm') as MikroORM;
  const contenido = orm.em.create(ContenidoLista, req.body);
  await orm.em.persistAndFlush(contenido);
  res.status(201).json(contenido);
};

export const removeLibroDeLista = async (req: Request, res: Response): Promise<void> => {
  const orm = req.app.get('orm') as MikroORM;
  const listaId = +req.params.listaId;
  const libroId = +req.params.libroId;

  const contenido = await orm.em.findOne(ContenidoLista, { lista: listaId, libro: libroId });
  if (!contenido) {
    res.status(404).json({ error: 'No encontrado' });
    return;
  }

  await orm.em.removeAndFlush(contenido);
  res.json({ mensaje: 'Eliminado' });
};
