import { Request, Response } from 'express';
import { MikroORM } from '@mikro-orm/mysql';
import { Favorito } from '../entities/favorito.entity';

export const getFavoritos = async (req: Request, res: Response): Promise<void> => {
  const orm = req.app.get('orm') as MikroORM;
  const usuarioId = +req.params.usuarioId;

  if (!usuarioId) {
    res.status(400).json({ error: 'UsuarioId es requerido' });
    return;
  }

  const favoritos = await orm.em.find(Favorito, {
    usuario: { id: usuarioId }
  }, {
    populate: ['libro']
  });

  res.json(favoritos);
};

export const addFavorito = async (req: Request, res: Response): Promise<void> => {
  const orm = req.app.get('orm') as MikroORM;
  const { usuario, libro } = req.body;

  if (!usuario || !libro) {
    res.status(400).json({ error: 'usuario y libro son requeridos' });
    return;
  }

  // Validar que no exista ya el favorito
  const existente = await orm.em.findOne(Favorito, {
    usuario: { id: typeof usuario === 'object' ? usuario.id : usuario },
    libro: { id: typeof libro === 'object' ? libro.id : libro }
  });

  if (existente) {
    res.status(409).json({ error: 'Favorito ya existe' });
    return;
  }

  const favorito = orm.em.create(Favorito, {
    usuario,
    libro,
    fechaAgregado: new Date(),
  });

  await orm.em.persistAndFlush(favorito);
  res.status(201).json(favorito);
};

export const deleteFavorito = async (req: Request, res: Response): Promise<void> => {
  const orm = req.app.get('orm') as MikroORM;

  const usuarioId = +req.params.usuarioId;
  const libroId = +req.params.libroId;

  if (!usuarioId || !libroId) {
    res.status(400).json({ error: 'usuarioId y libroId son requeridos' });
    return;
  }

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
