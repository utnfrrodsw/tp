import { Router } from 'express';
import { findAll, findOne, sanitizeInput, add, remove, update, getEditoriales, getDescripcion, getImagen, findOneByDescripcion, getDireccion } from './Editorial.controller.js';

export const editorialRouter = Router();

editorialRouter.get('/editoriales', getEditoriales);
editorialRouter.get('/get-descripcion/:id', getDescripcion);
editorialRouter.get('/get-imagen/:id', getImagen);
editorialRouter.get('/get-direccion/:id', getDireccion);

editorialRouter.get('/descripcion/:descripcion', findOneByDescripcion);

editorialRouter.get('/', findAll)
editorialRouter.get('/:id', findOne)
editorialRouter.post('/', sanitizeInput, add)
editorialRouter.put('/:id', sanitizeInput, update)
editorialRouter.patch('/:id', sanitizeInput, update)
editorialRouter.delete('/:id', remove)