import { Router } from 'express';
import { findAll, findOne, sanitizeInput, add, remove, update, iniciarSesion, getByUsername, findOneByEmail, cerrarSesion, getById, getNombre, getApellido, getEmail, getUsername, checkToken } from './Usuario.controller.js';

export const usuarioRouter = Router();

// Otras rutas
usuarioRouter.post('/iniciar-sesion', iniciarSesion);
usuarioRouter.post('/cerrar-sesion', cerrarSesion);
usuarioRouter.get('/username/:username', getByUsername);
usuarioRouter.get('/email/:email', findOneByEmail);
usuarioRouter.get('/get-nombre/', getNombre);
usuarioRouter.get('/get-apellido/', getApellido);
usuarioRouter.get('/get-email/', getEmail);
usuarioRouter.get('/get-username/', getUsername);
usuarioRouter.get('/check-token', checkToken)

usuarioRouter.get('/', findAll);
usuarioRouter.get('/:id', getById);
usuarioRouter.post('/', sanitizeInput, add);
usuarioRouter.put('/:id', sanitizeInput, update);
usuarioRouter.patch('/:id', sanitizeInput, update);
usuarioRouter.delete('/', remove);