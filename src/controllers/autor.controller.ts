// src/controllers/autor.controller.ts
import { Request, Response } from 'express';
import { Autor } from '../entities/autor.entity';
import { MikroORM } from '@mikro-orm/core';

export const getAutores = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const autores = await orm.em.find(Autor, {});
  res.json(autores);
};
