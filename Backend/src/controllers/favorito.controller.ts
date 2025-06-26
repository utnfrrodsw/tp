import { Request, Response } from 'express';
import { MikroORM } from '@mikro-orm/mysql';
import { Favorito } from '../entities/favorito.entity';

export const getFavoritos = async (req: Request, res: Response): Promise<void> => {
  const orm = req.app.get('orm') as MikroORM;
  const favoritos = await orm.em.find(Favorito, {});
  res.json(favoritos);
};

export const addFavorito = async (req: Request, res: Response): Promise<void> => {
  const orm = req.app.get('orm') as MikroORM;
  const favorito = orm.em.create(Favorito, req.body);
  await orm.em.persistAndFlush(favorito);
  res.status(201).json(favorito);
};

export const deleteFavorito = async (req: Request, res: Response): Promise<void> => {
  const orm = req.app.get('orm') as MikroORM;

  const usuarioId = +req.params.usuarioId;
  const libroId = +req.params.libroId;

  const favorito = await orm.em.findOne(Favorito, {
    usuario: { id: usuarioId },
    libro: { id: libroId }
  });

  if (!favorito) {
    res.status(404).json({ error: 'No encontrado' });
    return;
  }

  await orm.em.removeAndFlush(favorito);
  res.json({ mensaje: 'Eliminado' });
};
