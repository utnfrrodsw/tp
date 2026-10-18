import { Router } from "express";
import prisma from "@/database/prisma.js";
import { validate } from "@/middlewares/validation.middleware.js";
import { idSchema } from "@/shared/common.schema.js";
import { registerAddedCostSchema, modifyAddedCostSchema, addedCostQuerySchema } from "./addedcost.schema.js";
import { AddedCostController } from "./addedcost.controller.js";
import { AddedCostService } from "./addedcost.service.js";
import { AddedCostRepository } from "./addedcost.repository.js";
import { BudgetService } from "@/modules/budgets/budget.service.js";
import { BudgetRepository } from "@/modules/budgets/budget.repository.js"
import { StatusService } from "@/modules/status/status.service.js";
import { StatusHistoryRepository } from "@/modules/status/status.repository.js";
import { OrderRepository } from "@/modules/orders/order.repository.js";

const addedCostRepo = new AddedCostRepository(prisma);
const budgetRepo = new BudgetRepository(prisma);
const orderRepo = new OrderRepository(prisma);
const statusRepo = new StatusHistoryRepository(prisma);
const statusService = new StatusService(statusRepo, orderRepo, budgetRepo);
const budgetService = new BudgetService(budgetRepo, addedCostRepo, statusService);

const ctrl = new AddedCostController(
    new AddedCostService(addedCostRepo, budgetService)
);

const router = Router();

router.get('/', validate({ query: addedCostQuerySchema }), ctrl.getAllAddedCosts);

router.get('/ofBudget/:id_budget/total', ctrl.getTotalByBudget);

router.get('/ofBudget/:id', validate({ params: idSchema }), ctrl.getAddedCostsOfBudget);

router.get('/:id', validate({ params: idSchema }), ctrl.getOneAddedCost);

router.post('/', validate({ body: registerAddedCostSchema }), ctrl.registerAddedCost);

router.put('/:id', validate({ params: idSchema, body: modifyAddedCostSchema }), ctrl.modifyAddedCost);

router.delete('/:id', validate({ params: idSchema }), ctrl.deleteAddedCost);



export default router;
