// src/controllers/usuario.controller.ts
import { Response } from 'express';
import { Usuario } from '../entities/usuario.entity';
import { RequestWithOrm } from '../types/express.d';

export const getUsuarios = async (req: RequestWithOrm, res: Response) => {
  const orm = req.app.get('orm');
  const usuarios = await orm.em.find(Usuario, {});
  res.json(usuarios);
};

export const getUsuarioById = async (req: RequestWithOrm, res: Response) => {
  const orm = req.app.get('orm');
  const usuario = await orm.em.findOne(Usuario, { id: parseInt(req.params.id) });
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(usuario);
};

export const updateUsuario = async (req: RequestWithOrm, res: Response) => {
  const orm = req.app.get('orm');
  const usuario = await orm.em.findOne(Usuario, { id: parseInt(req.params.id) });
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

  orm.em.assign(usuario, req.body);
  await orm.em.persistAndFlush(usuario);
  res.json({ message: 'Usuario actualizado', usuario });
};

export const deleteUsuario = async (req: RequestWithOrm, res: Response) => {
  const orm = req.app.get('orm');
  const usuario = await orm.em.findOne(Usuario, { id: parseInt(req.params.id) });
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

  await orm.em.removeAndFlush(usuario);
  res.json({ message: 'Usuario eliminado' });
};
