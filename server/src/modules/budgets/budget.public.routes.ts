import { Router } from "express";
import prisma from "@/database/prisma.js";
import { validate } from "@/middlewares/validation.middleware.js";
import { idSchema } from "@/shared/common.schema.js";
import { registerBudgetSchema, modifyBudgetSchema, budgetQuerySchema } from "./budget.schema.js";
import { BudgetController } from "./budget.controller.js";
import { BudgetService } from "./budget.service.js";
import { BudgetRepository } from "./budget.repository.js";
import { AddedCostRepository } from "@/modules/addedCosts/addedcost.repository.js"
import { StatusService } from "@/modules/status/status.service.js";
import { StatusHistoryRepository } from "@/modules/status/status.repository.js";
import { OrderRepository } from "@/modules/orders/order.repository.js";
// NOTA: ajustá esta ruta al archivo real de tu middleware de auth
// (el mismo que usamos en status.routes.ts).
import authenticate from "@/middlewares/authenticate.middleware.js";

const budgetRepo = new BudgetRepository(prisma);
const addedCostRepo = new AddedCostRepository(prisma);
const orderRepo = new OrderRepository(prisma);
const statusRepo = new StatusHistoryRepository(prisma);
const statusService = new StatusService(statusRepo, orderRepo, budgetRepo);

const ctrl = new BudgetController(
    new BudgetService(budgetRepo, addedCostRepo, statusService)
);

const publicRouter = Router();
publicRouter.post('/:token/respond', ctrl.handleResponse);
publicRouter.get('/:token', ctrl.getBudgetByToken);

export default publicRouter;