import { Router } from 'express';
import { findAll, findOne, sanitizeInput, add, remove, update, findByUsuario } from './Comentario.controller.js';

export const comentarioRouter = Router();

comentarioRouter.get('/usuarios/:usuarioId', findByUsuario);

comentarioRouter.get('/', findAll);
comentarioRouter.get('/:id', findOne);
comentarioRouter.post('/', sanitizeInput, add);
comentarioRouter.put('/:id', sanitizeInput, update);
comentarioRouter.patch('/:id', sanitizeInput, update);
comentarioRouter.delete('/:id', remove);