import { Router } from 'express';
import { findAll, findOne, sanitizeInput, add, remove, update, findByUsuario } from './Reseña.controller.js';
export const reseñaRouter = Router();
reseñaRouter.get('/usuarios/:usuarioId', findByUsuario);
reseñaRouter.get('/', findAll);
reseñaRouter.get('/:id', findOne);
reseñaRouter.post('/', sanitizeInput, add);
reseñaRouter.put('/:id', sanitizeInput, update);
reseñaRouter.patch('/:id', sanitizeInput, update);
reseñaRouter.delete('/:id', remove);
//# sourceMappingURL=Rese%C3%B1a.routes.js.map