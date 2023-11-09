import { Router } from 'express';
import { findAll, findOne, sanitizeInput, add, remove, update, findByEditorial, findByAutor, findByCategoria, findByFormatoLibro } from './Libro.controller.js';

export const libroRouter = Router();

// Otros
libroRouter.get('/editoriales/:editorialId', findByEditorial);
libroRouter.get('/autores/:autorId', findByAutor);
libroRouter.get("/categorias/:categoriaId", findByCategoria);
libroRouter.get("/formatos/:formatoId", findByFormatoLibro);

libroRouter.get('/', findAll);
libroRouter.get('/:id', findOne);
libroRouter.post('/', sanitizeInput, add);
libroRouter.put('/:id', sanitizeInput, update);
libroRouter.patch('/:id', sanitizeInput, update);
libroRouter.delete('/:id', remove);