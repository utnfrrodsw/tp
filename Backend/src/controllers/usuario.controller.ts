import { Request, Response } from 'express';
import { MikroORM } from '@mikro-orm/mysql';
import { Usuario } from '../entities/usuario.entity';

export const getUsuarios = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const usuarios = await orm.em.find(Usuario, {});
  res.json(usuarios);
};

export const getUsuarioById = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const usuario = await orm.em.findOne(Usuario, { id: +req.params.id });
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(usuario);
};

export const updateUsuario = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const usuario = await orm.em.findOne(Usuario, { id: +req.params.id });
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

  orm.em.assign(usuario, req.body);
  await orm.em.persistAndFlush(usuario);
  res.json({ message: 'Usuario actualizado', usuario });
};

export const deleteUsuario = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const usuario = await orm.em.findOne(Usuario, { id: +req.params.id });
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

  await orm.em.removeAndFlush(usuario);
  res.json({ message: 'Usuario eliminado' });
};
