// src/controllers/permiso.controller.ts
import { Request, Response } from 'express';
import { MikroORM } from '@mikro-orm/core';
import { Permiso, TipoPermiso } from '../entities/permiso.entity';

export const getPermisos = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const permisos = await orm.em.find(Permiso, {});
  res.json(permisos);
};

export const getPermisoById = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const permiso = await orm.em.findOne(Permiso, { id: +req.params.id });
  if (!permiso) return res.status(404).json({ error: 'Permiso no encontrado' });
  res.json(permiso);
};

export const createPermiso = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const { tipo, descripcion } = req.body;

  if (!tipo || !descripcion) {
    return res.status(400).json({ error: 'Tipo y descripción son requeridos' });
  }

  const permiso = orm.em.create(Permiso, {
    tipo,
    descripcion
  });

  await orm.em.persistAndFlush(permiso);
  res.status(201).json(permiso);
};

export const updatePermiso = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const permiso = await orm.em.findOne(Permiso, { id: +req.params.id });
  if (!permiso) return res.status(404).json({ error: 'Permiso no encontrado' });

  orm.em.assign(permiso, req.body);
  await orm.em.flush();
  res.json(permiso);
};

export const deletePermiso = async (req: Request, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const permiso = await orm.em.findOne(Permiso, { id: +req.params.id });
  if (!permiso) return res.status(404).json({ error: 'Permiso no encontrado' });

  await orm.em.removeAndFlush(permiso);
  res.json({ mensaje: 'Permiso eliminado' });
};
