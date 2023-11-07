import { Router } from 'express';
import { findAll, findOne, sanitizeInput, add, remove, update, obtenerDescripcionesCategoria } from './Categoria.controller.js';
export const categoriaRouter = Router();
// Otros
categoriaRouter.get('/descripciones', obtenerDescripcionesCategoria);
categoriaRouter.get('/', findAll);
categoriaRouter.get('/:id', findOne);
categoriaRouter.post('/', sanitizeInput, add);
categoriaRouter.put('/:id', sanitizeInput, update);
categoriaRouter.patch('/:id', sanitizeInput, update);
categoriaRouter.delete('/:id', remove);
//# sourceMappingURL=Categoria.routes.js.map