// src/controllers/categoria.controller.ts
import { Request, Response } from 'express';
import { Categoria } from '../entities/categoria.entity';
import { MikroORM } from '@mikro-orm/core';

export const getCategorias = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const categorias = await orm.em.find(Categoria, {});
  res.json(categorias);
};
