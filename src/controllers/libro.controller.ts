// src/controllers/libro.controller.ts
import { Request, Response } from 'express';
import { Libro } from '../entities/libro.entity';
import { MikroORM } from '@mikro-orm/core';

export const getLibros = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const libros = await orm.em.find(Libro, {});
  res.json(libros);
};

export const getLibroById = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const libro = await orm.em.findOne(Libro, { id: parseInt(req.params.id) });
  if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });
  res.json(libro);
};

export const createLibro = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const nuevoLibro = orm.em.create(Libro, req.body);
  await orm.em.persistAndFlush(nuevoLibro);
  res.status(201).json(nuevoLibro);
};

export const updateLibro = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const libro = await orm.em.findOne(Libro, { id: parseInt(req.params.id) });
  if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });
  orm.em.assign(libro, req.body);
  await orm.em.flush();
  res.json(libro);
};

export const deleteLibro = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const libro = await orm.em.findOne(Libro, { id: parseInt(req.params.id) });
  if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });
  await orm.em.removeAndFlush(libro);
  res.json({ mensaje: 'Libro eliminado' });
};
