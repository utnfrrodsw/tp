// src/controllers/seguimiento.controller.ts
import { Request, Response } from 'express';
import { MikroORM } from '@mikro-orm/mysql';
import { Seguimiento } from '../entities/seguimiento.entity';
import { Usuario } from '../entities/usuario.entity';
import { ActividadService } from '../services/actividad.service';
import { NotificacionService } from '../services/notificacion.service';

export const followUser = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const seguidorPayload = (req as any).user;
  const { seguidoId } = req.body;

  if (!seguidorPayload || !seguidorPayload.id) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }
  if (!seguidoId) {
    return res.status(400).json({ error: 'Falta el ID del usuario a seguir' });
  }
  if (seguidorPayload.id === seguidoId) {
    return res.status(400).json({ error: 'No puedes seguirte a ti mismo' });
  }

  const seguidor = await orm.em.findOne(Usuario, { id: seguidorPayload.id });
  const seguido = await orm.em.findOne(Usuario, { id: seguidoId });
  if (!seguidor || !seguido) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  const existente = await orm.em.findOne(Seguimiento, { seguidor: seguidor.id, seguido: seguido.id });
  if (existente) {
    return res.status(400).json({ error: 'Ya sigues a este usuario' });
  }

  const nuevoSeguimiento = orm.em.create(Seguimiento, {
    seguidor,
    seguido,
    fechaSeguido: new Date(),
  });
  await orm.em.persistAndFlush(nuevoSeguimiento);

  // Crear registro de actividad
  try {
    const actividadService = new ActividadService(orm);
    await actividadService.crearActividadSeguimiento(seguidorPayload.id);
  } catch (actividadError) {
    console.error('Error al crear registro de actividad:', actividadError);
    // No fallar el seguimiento si falla el registro de actividad
  }

  // Crear notificación para el usuario seguido
  try {
    const notificacionService = new NotificacionService(orm.em);
    await notificacionService.notificarNuevoSeguidor(
      seguido.id,
      seguidor.nombre || 'Un usuario',
      seguidor.id
    );
  } catch (notifError) {
    console.error('Error al crear notificación:', notifError);
    // No fallar el seguimiento si falla la notificación
  }

  res.status(201).json({ message: `Ahora sigues a ${seguido.username}` });
};

export const unfollowUser = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const seguidorPayload = (req as any).user;
  const seguidoId = Number(req.params.seguidoId);

  if (!seguidorPayload || !seguidorPayload.id) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }

  const seguimiento = await orm.em.findOne(Seguimiento, {
    seguidor: seguidorPayload.id,
    seguido: seguidoId,
  });

  if (!seguimiento) {
    return res.status(404).json({ error: 'No estás siguiendo a este usuario' });
  }

  await orm.em.removeAndFlush(seguimiento);
  res.json({ message: 'Dejaste de seguir al usuario' });
};

export const getSeguidores = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const seguidoId = Number(req.params.usuarioId);

  const seguidores = await orm.em.find(Seguimiento, { seguido: seguidoId }, { populate: ['seguidor'] });
  const usuariosSeguidores = seguidores.map(s => s.seguidor);

  res.json(usuariosSeguidores);
};

export const getSeguidos = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const seguidorPayload = (req as any).user;

  if (!seguidorPayload || !seguidorPayload.id) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }

  const seguidos = await orm.em.find(Seguimiento, { seguidor: seguidorPayload.id }, { populate: ['seguido'] });
  const usuariosSeguidos = seguidos.map(s => s.seguido);

  res.json(usuariosSeguidos);
};

export const getFollowCounts = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const userId = Number(req.params.userId);

  const seguidoresCount = await orm.em.count(Seguimiento, { seguido: userId });
  const siguiendoCount = await orm.em.count(Seguimiento, { seguidor: userId });

  res.json({ seguidores: seguidoresCount, siguiendo: siguiendoCount });
};

// Verificar si el usuario actual sigue a otro usuario
export const verificarSeguimiento = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const seguidorPayload = (req as any).user;
  const usuarioId = Number(req.params.usuarioId);

  if (!seguidorPayload || !seguidorPayload.id) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }

  const seguimiento = await orm.em.findOne(Seguimiento, {
    seguidor: seguidorPayload.id,
    seguido: usuarioId,
  });

  res.json({ isSiguiendo: !!seguimiento });
};

// Verificar si sigue a un usuario (alternativa con seguidoId)
export const isFollowing = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const seguidorPayload = (req as any).user;
  const seguidoId = Number(req.params.seguidoId);

  if (!seguidorPayload || !seguidorPayload.id) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }

  const seguimiento = await orm.em.findOne(Seguimiento, {
    seguidor: seguidorPayload.id,
    seguido: seguidoId,
  });

  res.json({ isFollowing: !!seguimiento });
};
