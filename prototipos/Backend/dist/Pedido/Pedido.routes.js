import { Router } from 'express';
import { findAll, findOne, sanitizeInput, add, remove, update, findByUsuario } from './Pedido.controller.js';
export const pedidoRouter = Router();
// Otros

pedidoRouter.get('/usuarios/:usuarioId', findByUsuario);

pedidoRouter.get('/', findAll);
pedidoRouter.get('/:id', findOne);
pedidoRouter.post('/', sanitizeInput, add);
pedidoRouter.put('/:id', sanitizeInput, update);
pedidoRouter.patch('/:id', sanitizeInput, update);
pedidoRouter.delete('/:id', remove);
