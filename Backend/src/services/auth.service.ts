import jwt from 'jsonwebtoken';
import { Usuario } from '../entities/usuario.entity';
import { MikroORM } from '@mikro-orm/core';
import { Request, Response } from 'express';

// Función para generar el token JWT
const generateToken = (usuario: Usuario) => {
  const payload = {
    id: usuario.id,
    username: usuario.username,
    email: usuario.email,
  };
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
};

// Registro de usuario (crear cuenta)
export const registerUser = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  try {
    const orm = req.app.get('orm');
    const usuario = orm.em.create(Usuario, { email, username, password });
    await usuario.hashPassword();  // Encriptar la contraseña
    await orm.em.persistAndFlush(usuario);

    res.status(201).json({ message: 'Usuario registrado exitosamente', usuario });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Error desconocido' });
  }
};

// Login de usuario
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const orm = req.app.get('orm');
    const usuario = await orm.em.findOne(Usuario, { email });

    if (!usuario) {
      return res.status(400).json({ error: 'Credenciales incorrectas' });
    }

    // Verificar la contraseña
    const isValidPassword = await usuario.validatePassword(password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Credenciales incorrectas' });
    }

    // Generar el token JWT
    const token = generateToken(usuario);
    res.json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Error desconocido' });
  }
};
