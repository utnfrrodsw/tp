import { Request, Response } from 'express';
import { MikroORM } from '@mikro-orm/mysql';
import { Seguimiento } from '../entities/seguimiento.entity';

export const seguirUsuario = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const { seguidorId, seguidoId } = req.body;

  if (!seguidorId || !seguidoId) {
    return res.status(400).json({ error: 'Faltan IDs de usuarios' });
  }

  const seguimientoExistente = await orm.em.findOne(Seguimiento, {
    seguidor: seguidorId,
    seguido: seguidoId,
  });

  if (seguimientoExistente) {
    return res.status(400).json({ error: 'Ya estás siguiendo a este usuario' });
  }

  const seguimiento = orm.em.create(Seguimiento, {
    seguidor: seguidorId,
    seguido: seguidoId,
    fecha: new Date(),
  });

  await orm.em.persistAndFlush(seguimiento);
  res.status(201).json(seguimiento);
};

export const dejarDeSeguirUsuario = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const { seguidorId, seguidoId } = req.params;

  const seguimiento = await orm.em.findOne(Seguimiento, {
    seguidor: +seguidorId,
    seguido: +seguidoId,
  });

  if (!seguimiento) {
    return res.status(404).json({ error: 'Seguimiento no encontrado' });
  }

  await orm.em.removeAndFlush(seguimiento);
  res.json({ mensaje: 'Dejaste de seguir al usuario' });
};

export const getSeguidores = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const seguidoId = +req.params.usuarioId;

  const seguidores = await orm.em.find(Seguimiento, {
    seguido: seguidoId,
  }, { populate: ['seguidor'] });

  res.json(seguidores);
};

export const getSeguidos = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const seguidorId = +req.params.usuarioId;

  const seguidos = await orm.em.find(Seguimiento, {
    seguidor: seguidorId,
  }, { populate: ['seguido'] });

  res.json(seguidos);
};
