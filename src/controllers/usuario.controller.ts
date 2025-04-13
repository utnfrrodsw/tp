// src/controllers/usuario.controller.ts
import { Request, Response } from 'express';
import { Usuario } from '../entities/usuario.entity';
import { MikroORM } from '@mikro-orm/core';

export const getUsuarios = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const usuarios = await orm.em.find(Usuario, {});
  res.json(usuarios);
};

export const getUsuarioById = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const usuario = await orm.em.findOne(Usuario, { id: parseInt(req.params.id) });
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(usuario);
};

export const createUsuario = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const nuevoUsuario = orm.em.create(Usuario, req.body);
  await orm.em.persistAndFlush(nuevoUsuario);
  res.status(201).json(nuevoUsuario);
};

export const updateUsuario = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const usuario = await orm.em.findOne(Usuario, { id: parseInt(req.params.id) });
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
  orm.em.assign(usuario, req.body);
  await orm.em.flush();
  res.json(usuario);
};

export const deleteUsuario = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const usuario = await orm.em.findOne(Usuario, { id: parseInt(req.params.id) });
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
  await orm.em.removeAndFlush(usuario);
  res.json({ mensaje: 'Usuario eliminado' });
};
