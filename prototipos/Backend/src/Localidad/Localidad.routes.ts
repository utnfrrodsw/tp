import { Router } from 'express';
import { findAll, findOne, sanitizeInput, add, remove, update, getLocalidadesByProvincia } from './Localidad.controller.js';

export const localidadRouter = Router();

// Otras rutas
localidadRouter.get('/localidades', getLocalidadesByProvincia);

localidadRouter.get('/', findAll);
localidadRouter.get('/:id', findOne);
localidadRouter.post('/', sanitizeInput, add);
localidadRouter.put('/:id', sanitizeInput, update);
localidadRouter.patch('/:id', sanitizeInput, update);
localidadRouter.delete('/:id', remove);

export default localidadRouter;