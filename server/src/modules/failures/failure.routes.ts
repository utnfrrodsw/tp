import { Router } from 'express'
import { createFailuresSchema, modifyFailureSchema } from './failure.schema.js';
import { validate } from '@/middlewares/validation.middleware.js';
import { idSchema } from '@/shared/common.schema.js';
import { FailureController } from './failure.controller.js';
import { FailureService } from './failure.service.js';
import { FailureRepository } from './failure.repository.js';
import { BudgetService } from '@/modules/budgets/budget.service.js';
import { BudgetRepository } from '@/modules/budgets/budget.repository.js';
import { AddedCostRepository } from '@/modules/addedCosts/addedcost.repository.js';
import { StatusService } from '@/modules/status/status.service.js';
import { StatusHistoryRepository } from '@/modules/status/status.repository.js';
import { OrderRepository } from '@/modules/orders/order.repository.js';
import prisma from '@/database/prisma.js';

const budgetRepo = new BudgetRepository(prisma);
const addedCostRepo = new AddedCostRepository(prisma);
const orderRepo = new OrderRepository(prisma);
const statusRepo = new StatusHistoryRepository(prisma);
const statusService = new StatusService(statusRepo, orderRepo, budgetRepo);
const budgetService = new BudgetService(budgetRepo, addedCostRepo, statusService);

const ctrl = new FailureController(
    new FailureService(
        new FailureRepository(prisma),
        budgetService,
    )
);

const router = Router();

router.post("/", validate({ body: createFailuresSchema }), ctrl.createFailures);

router.get('/ofOrder/:id', validate({ params: idSchema }), ctrl.getFailuresOfOrder);

router.get("/ofOrder/:id_order/total", ctrl.getTotalByOrder);

router.put('/:id', validate({params: idSchema,body: modifyFailureSchema}), ctrl.modifyFailure);

router.delete('/:id', validate({params: idSchema}), ctrl.deleteFailure)

export default router;