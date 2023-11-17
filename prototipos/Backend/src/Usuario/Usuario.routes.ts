import { Router } from 'express';
import { findAll, findOne, sanitizeInput, add, remove, update, iniciarSesion } from './Usuario.controller.js';

export const usuarioRouter = Router();

// Otras rutas
usuarioRouter.post('/iniciar-sesion', iniciarSesion);

usuarioRouter.get('/', findAll)
usuarioRouter.get('/:id', findOne)
usuarioRouter.post('/', sanitizeInput, add)
usuarioRouter.put('/:id', sanitizeInput, update)
usuarioRouter.patch('/:id', sanitizeInput, update)
usuarioRouter.delete('/:id', remove)
