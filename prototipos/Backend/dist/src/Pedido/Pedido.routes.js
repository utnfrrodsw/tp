import { Router } from 'express';
import { findAll, findOne } from './Pedido.controller.js';
export const pedidoRouter = Router();
// Rutas públicas (no requieren autenticación)
pedidoRouter.get('/', findAll);
pedidoRouter.get('/:id', findOne);
//# sourceMappingURL=Pedido.routes.js.map