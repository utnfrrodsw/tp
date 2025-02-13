import { Router } from 'express';
import { findAll, findOne, sanitizeInput, add } from './Pedido.controller.js';
import { isAuthenticated, isAdmin } from '../../middlewares/auth.middleware';

export const pedidoRouter = Router();

// Rutas públicas (no requieren autenticación)

pedidoRouter.get('/', findAll);
pedidoRouter.get('/:id', findOne);