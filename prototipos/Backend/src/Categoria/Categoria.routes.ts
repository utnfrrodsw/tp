import { Router } from 'express';
import { findAll, findOne, sanitizeInput, add, remove, update, obtenerDescripcionesCategoria, getDescripcion } from './Categoria.controller.js';

export const categoriaRouter = Router();

// Otros
categoriaRouter.get('/descripciones', obtenerDescripcionesCategoria);
categoriaRouter.get('/descripcion/:id', getDescripcion);

categoriaRouter.get('/', findAll);
categoriaRouter.get('/:id', findOne);
categoriaRouter.post('/', sanitizeInput, add);
categoriaRouter.put('/:id', sanitizeInput, update);
categoriaRouter.patch('/:id', sanitizeInput, update);
categoriaRouter.delete('/:id', remove);