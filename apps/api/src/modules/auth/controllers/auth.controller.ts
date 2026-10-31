import { Request, Response } from 'express';
import {
  findUserByCredentials,
  createUser
} from '../services/auth.service.js';

import type { LoginDto } from '../dtos/login.dto.js';
import type { RegisterDto } from '../dtos/register.dto.js';
import jwt from 'jsonwebtoken';
import { respondWithError, sendApiError } from '../../../shared/api-error.js';

const issueToken = (id: number, rol: string) => {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET no está configurado');
  return jwt.sign({ rol }, process.env.JWT_SECRET, { subject: String(id), expiresIn: '12h' });
};


// LOGIN
export const login = async (
  req: Request<{}, {}, LoginDto>,
  res: Response
) => {

  const { email, password } = req.body;

  try {
    const user = await findUserByCredentials(email, password);

    if (!user) {
      return respondWithError(res, 401, 'UNAUTHENTICATED', 'Credenciales inválidas');
    }

    if (!user.activo) {
      return respondWithError(res, 403, 'FORBIDDEN', 'Tu cuenta fue suspendida por un administrador. Contactá a soporte para más información.');
    }

    res.json({
      message: 'Inicio de sesión exitoso',
      token: issueToken(user.id, user.rol),
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        creadoEn: user.creadoEn
      }
    });

  } catch (error) {
    sendApiError(res, error, 'Error al iniciar sesión');
  }
};


// REGISTRO
export const register = async (
  req: Request<{}, {}, RegisterDto>,
  res: Response
) => {

  const {
    nombre,
    email,
    password,
    role,
    zona,
    cuit,
    telefono
  } = req.body;

  try {
    const user = await createUser(
      nombre,
      email,
      password,
      role,
      role === 'empresa' ? { zona: zona!, cuit: Number(cuit), telefono: Number(telefono) } : undefined
    );

    res.status(201).json({
      message: 'Usuario creado correctamente',
      token: issueToken(user.id, user.rol),
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        creadoEn: user.creadoEn
      }
    });

  } catch (error) {
    sendApiError(res, error, 'Error al crear el usuario');
  }
};