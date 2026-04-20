import { Request, Response } from 'express';
import { MikroORM } from '@mikro-orm/core';
import { Categoria } from '../entities/categoria.entity';

export const getCategorias = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const categorias = await orm.em.find(Categoria, {}, { populate: ['libros'] });
  const categoriasWithCount = categorias.map(categoria => ({
    ...categoria,
    librosCount: categoria.libros.length
  }));
  res.json(categoriasWithCount);
};

export const getCategoriaById = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const categoria = await orm.em.findOne(Categoria, { id: +req.params.id });
  if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
  res.json(categoria);
};

export const createCategoria = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const categoria = orm.em.create(Categoria, req.body);
  await orm.em.persistAndFlush(categoria);
  res.status(201).json(categoria);
};

export const updateCategoria = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const categoria = await orm.em.findOne(Categoria, { id: +req.params.id });
  if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });

  orm.em.assign(categoria, req.body);
  await orm.em.flush();
  res.json(categoria);
};

export const deleteCategoria = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const categoria = await orm.em.findOne(Categoria, { id: +req.params.id });
  if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });

  await orm.em.removeAndFlush(categoria);
  res.json({ mensaje: 'Categoría eliminada' });
};
