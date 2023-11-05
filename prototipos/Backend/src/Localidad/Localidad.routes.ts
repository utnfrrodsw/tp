import { Router } from 'express';
import { findAll, findOne, sanitizeInput, add, remove, update } from './Localidad.controller.js';

export const localidadRouter = Router();

localidadRouter.get('/', findAll);
localidadRouter.get('/:id', findOne);
localidadRouter.post('/', sanitizeInput, add);
localidadRouter.put('/:id', sanitizeInput, update);
localidadRouter.patch('/:id', sanitizeInput, update);
localidadRouter.delete('/:id', remove);

export default localidadRouter;