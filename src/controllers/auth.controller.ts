import { Request, Response } from 'express';
import { Usuario } from '../entities/usuario.entity';
import { MikroORM } from '@mikro-orm/core';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response): Promise<Response> => {
  const orm = req.app.get('orm') as MikroORM;
  const { nombre, email, password } = req.body;

  const username = email.split('@')[0]; // Lógica para generar el username

  const hashedPassword = await bcrypt.hash(password, 10);

  const nuevoUsuario = orm.em.create(Usuario, {
    username,
    nombre,
    email,
    password: hashedPassword,
  });

  await orm.em.persistAndFlush(nuevoUsuario);

  return res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  const orm = req.app.get('orm') as MikroORM;
  const { email, password } = req.body;

  const usuario = await orm.em.findOne(Usuario, { email });

  if (!usuario) {
    return res.status(400).json({ error: 'Credenciales inválidas' });
  }

  const validPassword = await bcrypt.compare(password, usuario.password);
  if (!validPassword) {
    return res.status(400).json({ error: 'Credenciales inválidas' });
  }

  const token = jwt.sign({ id: usuario.id, email: usuario.email }, 'your_jwt_secret', {
    expiresIn: '1h',
  });

  return res.json({ token });
};
