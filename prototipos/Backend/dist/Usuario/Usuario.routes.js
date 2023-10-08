import { Router } from 'express';
import { findAll, findOne, sanitizeInput, add, remove, update } from './Usuario.controler.js';
export const usuarioRouter = Router();
usuarioRouter.get('/', findAll);
usuarioRouter.get('/:id', findOne);
usuarioRouter.post('/', sanitizeInput, add);
usuarioRouter.put('/:name', sanitizeInput, update);
usuarioRouter.patch('/:name', sanitizeInput, update);
usuarioRouter.delete('/:id', remove);
//# sourceMappingURL=Usuario.routes.js.map