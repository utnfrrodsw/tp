import { Router } from 'express';
import { findAll, findOne, sanitizeInput, add, remove, update, findByUsuario, findByLibro } from './Pedido.controller.js';

export const pedidoRouter = Router();

pedidoRouter.get('/usuarios/:usuarioId', findByUsuario);
pedidoRouter.get('/libros/:libroId', findByLibro);

pedidoRouter.get('/', findAll);
pedidoRouter.get('/:id', findOne);
pedidoRouter.post('/', sanitizeInput, add);
pedidoRouter.put('/:id', sanitizeInput, update);
pedidoRouter.patch('/:id', sanitizeInput, update);
pedidoRouter.delete('/:id', remove);