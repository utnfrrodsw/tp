import { Router } from 'express';
import { findAll, findOne, sanitizeInput, add, remove, update, getEditoriales, getNombreCompleto, getImagen } from './Editorial.controller.js';

export const editorialRouter = Router();

editorialRouter.get('/editoriales', getEditoriales);
editorialRouter.get('/nombre-completo/:id', getNombreCompleto);
editorialRouter.get('/imagen/:id', getImagen);

editorialRouter.get('/', findAll)
editorialRouter.get('/:id', findOne)
editorialRouter.post('/', sanitizeInput, add)
editorialRouter.put('/:id', sanitizeInput, update)
editorialRouter.patch('/:id', sanitizeInput, update)
editorialRouter.delete('/:id', remove)