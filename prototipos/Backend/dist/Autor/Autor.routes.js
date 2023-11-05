import { Router } from 'express';
import { findAll, findOne, sanitizeInput, add, remove, update } from './Autor.controller.js';
export const autorRouter = Router();
autorRouter.get('/', findAll);
autorRouter.get('/:id', findOne);
autorRouter.post('/', sanitizeInput, add);
autorRouter.put('/:nombre', sanitizeInput, update);
autorRouter.patch('/:nombre', sanitizeInput, update);
autorRouter.delete('/:id', remove);
//# sourceMappingURL=Autor.routes.js.map