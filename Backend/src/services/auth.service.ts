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
    rol: usuario.rol,
  };
  return jwt.sign(payload, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1h' });
};

// Registro de usuario (crear cuenta)
export const registerUser = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  try {
    const orm = req.app.get('orm');
    const usuario = orm.em.create(Usuario, { email, username, password });
    // Removed manual password hashing call; handled by entity hook
    await orm.em.persistAndFlush(usuario);

    // Generate tokens
    const token = generateToken(usuario);
    const refreshToken = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '7d' });
    usuario.refreshToken = refreshToken;
    await orm.em.persistAndFlush(usuario);

    res.status(201).json({ message: 'Usuario registrado exitosamente', token, refreshToken });
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
    const refreshToken = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '7d' });
    usuario.refreshToken = refreshToken;
    await orm.em.persistAndFlush(usuario);

    res.json({ message: 'Inicio de sesión exitoso', token, refreshToken });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Error desconocido' });
  }
};
