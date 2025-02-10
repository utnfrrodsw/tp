import { Router } from 'express';
import { findAll, findOne, sanitizeInput, add, remove, update, findByUsuario, findByLibro, getCalificacion, getComentario, getResenias } from './Resenia.controller.js';
export const reseniaRouter = Router();
reseniaRouter.get('/usuarios/:usuarioId', findByUsuario);
reseniaRouter.get('/libros/:libroId', findByLibro);
reseniaRouter.get('/comentario/:id', getComentario);
reseniaRouter.get('/calificacion/:id', getCalificacion);
reseniaRouter.get('/resenias', getResenias);
reseniaRouter.get('/', findAll);
reseniaRouter.get('/:id', findOne);
reseniaRouter.post('/', sanitizeInput, add);
reseniaRouter.put('/:id', sanitizeInput, update);
reseniaRouter.patch('/:id', sanitizeInput, update);
reseniaRouter.delete('/:id', remove);
//# sourceMappingURL=Resenia.routes.js.map