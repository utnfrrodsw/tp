import { Router } from 'express';
import { findAll, findOne, sanitizeInput, add, remove, update, getAutores, getNombreCompleto, getPerfil } from './Autor.controller.js';

export const autorRouter = Router();

// Otras rutas
autorRouter.get('/autores', getAutores);
autorRouter.get('/nombre-completo/:id', getNombreCompleto);
autorRouter.get('/perfil/:id', getPerfil);

autorRouter.get('/', findAll)
autorRouter.get('/:id', findOne)
autorRouter.post('/', sanitizeInput, add)
autorRouter.put('/:id', sanitizeInput, update)
autorRouter.patch('/:id', sanitizeInput, update)
autorRouter.delete('/:id', remove)
