import { Router } from 'express';
import { findAll, findOne, sanitizeInput, add, remove, update } from './Provincia.controller.js';

export const provinciaRouter = Router();

provinciaRouter.get('/', findAll);
provinciaRouter.get('/:id', findOne);
provinciaRouter.post('/', sanitizeInput, add);
provinciaRouter.put('/:id', sanitizeInput, update);
provinciaRouter.delete('/:id', remove);

export default provinciaRouter;