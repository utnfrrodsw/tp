import { Router } from 'express';
import prisma from '@/database/prisma.js';
import { validate } from '@/middlewares/validation.middleware.js';
import { idSchema } from '@/shared/common.schema.js';
import { registerStatusSchema, statusQuerySchema } from './status.schema.js';
import { StatusController } from './status.controller.js';
import { StatusService } from './status.service.js';
import { StatusHistoryRepository } from './status.repository.js';
import { OrderRepository } from '@/modules/orders/order.repository.js';
import authenticate from '@/middlewares/authenticate.middleware.js';
import { BudgetRepository } from '../budgets/budget.repository.js';

const statusRepo = new StatusHistoryRepository(prisma);
const orderRepo = new OrderRepository(prisma);
const budgetRepo = new BudgetRepository(prisma);

const ctrl = new StatusController(
  new StatusService(statusRepo, orderRepo, budgetRepo)
);

const router = Router();

router.get('/', validate({ query: statusQuerySchema }), ctrl.getAllStatus);

router.get('/ofOrder/:id', validate({ params: idSchema }), ctrl.getStatusOfOrder);

router.post('/', authenticate(), validate({ body: registerStatusSchema }), ctrl.registerStatus);

export default router;