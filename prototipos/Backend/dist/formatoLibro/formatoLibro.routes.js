import { Router } from 'express';
import { findAll, findOne, sanitizeInput, add, remove, update } from './formatoLibro.controller.js';
export const formatoRouter = Router();
formatoRouter.get('/', findAll);
formatoRouter.get('/:id', findOne);
formatoRouter.post('/', sanitizeInput, add);
formatoRouter.put('/:id', sanitizeInput, update);
formatoRouter.patch('/:id', sanitizeInput, update);
formatoRouter.delete('/:id', remove);
//# sourceMappingURL=formatoLibro.routes.js.map