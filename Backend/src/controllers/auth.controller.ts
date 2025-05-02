// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Usuario } from '../entities/usuario.entity';
import { MikroORM } from '@mikro-orm/core';

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;
  try {
    const orm = req.app.get('orm') as MikroORM;
    const usuario = await orm.em.findOne(Usuario, { email });

    if (!usuario) {
      return res.status(400).json({ error: 'Credenciales incorrectas' });
    }

    const isValidPassword = await usuario.validatePassword(password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Credenciales incorrectas' });
    }

    const token = generateToken(usuario); // Asegúrate de que generateToken esté definido
    return res.json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Error desconocido' });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<Response> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token es necesario' });
  }

  try {
    const decoded: any = jwt.verify(refreshToken, process.env.JWT_SECRET as string);
    const orm = req.app.get('orm') as MikroORM;
    const usuario = await orm.em.findOne(Usuario, { id: decoded.userId });

    if (!usuario) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const newAccessToken = jwt.sign(
      { userId: usuario.id, email: usuario.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    return res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({ error: 'Refresh token inválido o expirado' });
  }
};

const generateToken = (usuario: Usuario) => {
  const payload = {
    id: usuario.id,
    email: usuario.email,
  };
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
};
