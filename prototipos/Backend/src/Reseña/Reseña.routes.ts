import { Router } from 'express';
import { findAll, findOne, sanitizeInput, add, remove, update, findByUsuario, findByLibro, getCalificacion, getComentario, getReseñas } from './Reseña.controller.js';

export const reseñaRouter = Router();

reseñaRouter.get('/usuarios/:usuarioId', findByUsuario);
reseñaRouter.get('/libros/:libroId', findByLibro);
reseñaRouter.get('/comentario/:id', getComentario);
reseñaRouter.get('/calificacion/:id', getCalificacion);
reseñaRouter.get('/comentarios', getReseñas);



reseñaRouter.get('/', findAll);
reseñaRouter.get('/:id', findOne);
reseñaRouter.post('/', sanitizeInput, add);
reseñaRouter.put('/:id', sanitizeInput, update);
reseñaRouter.patch('/:id', sanitizeInput, update);
reseñaRouter.delete('/:id', remove);