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

export const createUsuario = async (req: Request, res: Response) => {
  try {
    const orm = req.app.get('orm') as MikroORM;
    const { email, username, password } = req.body;

    // Validar que no exista usuario con el mismo email
    const usuarioExistente = await orm.em.findOne(Usuario, { email });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const nuevoUsuario = orm.em.create(Usuario, { email, username, password });

    // Encriptar contraseña si el método está definido en la entidad Usuario
    if (nuevoUsuario.hashPassword) {
      await nuevoUsuario.hashPassword();
    }

    await orm.em.persistAndFlush(nuevoUsuario);

    res.status(201).json({ message: 'Usuario creado', usuario: nuevoUsuario });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Error desconocido' });
  }
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
