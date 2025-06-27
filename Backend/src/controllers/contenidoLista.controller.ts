// src/controllers/contenidoLista.controller.ts
import { Request, Response } from 'express';
import { MikroORM } from '@mikro-orm/mysql';
import { ContenidoLista } from '../entities/contenidoLista.entity';
import { Lista } from '../entities/lista.entity';
import { Libro } from '../entities/libro.entity';

export const getContenidoLista = async (req: Request, res: Response): Promise<void> => {
  const orm = req.app.get('orm') as MikroORM;
  const listaId = +req.params.listaId;

  const contenidos = await orm.em.find(ContenidoLista, 
    { lista: { id: listaId } }, 
    { populate: ['libro'] }
  );
  res.json(contenidos);
};

export const addLibroALista = async (req: Request, res: Response): Promise<void> => {
  const orm = req.app.get('orm') as MikroORM;
  const { listaId, libroId } = req.body;

  if (!listaId || !libroId) {
    res.status(400).json({ error: 'Faltan listaId o libroId' });
    return;
  }

  const lista = await orm.em.findOne(Lista, { id: listaId });
  if (!lista) {
    res.status(404).json({ error: 'Lista no encontrada' });
    return;
  }

  const libro = await orm.em.findOne(Libro, { id: libroId });
  if (!libro) {
    res.status(404).json({ error: 'Libro no encontrado' });
    return;
  }

  const existente = await orm.em.findOne(ContenidoLista, { lista: { id: listaId }, libro: { id: libroId } });
  if (existente) {
    res.status(400).json({ error: 'El libro ya está en la lista' });
    return;
  }

  const contenido = orm.em.create(ContenidoLista, { lista, libro });
  await orm.em.persistAndFlush(contenido);

  res.status(201).json(contenido);
};

export const removeLibroDeLista = async (req: Request, res: Response): Promise<void> => {
  const orm = req.app.get('orm') as MikroORM;
  const listaId = +req.params.listaId;
  const libroId = +req.params.libroId;

  const contenido = await orm.em.findOne(ContenidoLista, { lista: { id: listaId }, libro: { id: libroId } });
  if (!contenido) {
    res.status(404).json({ error: 'No encontrado' });
    return;
  }

  await orm.em.removeAndFlush(contenido);
  res.json({ mensaje: 'Eliminado' });
};
