import { Router } from 'express';
import { findAll, findOne, sanitizeInput, add, update, remove } from './Pedido.controller.js';
import { isAuthenticated } from '../../middlewares/auth.middleware';
export const pedidoRouter = Router();
// Rutas públicas (no requieren autenticación)
pedidoRouter.get('/', findAll);
pedidoRouter.get('/:id', findOne);
// Rutas protegidas (requieren autenticación)
pedidoRouter.post('/', isAuthenticated, sanitizeInput, add);
pedidoRouter.put('/:id', isAuthenticated, sanitizeInput, update);
pedidoRouter.delete('/:id', isAuthenticated, remove);
//# sourceMappingURL=Pedido.routes.js.map