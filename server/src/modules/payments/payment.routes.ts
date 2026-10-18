import { Router } from "express";
import prisma from "@/database/prisma.js";
import { validate } from "@/middlewares/validation.middleware.js";
import { idSchema } from "@/shared/common.schema.js";
import { registerPaymentSchema, paymentQuerySchema } from "./payment.schema.js";
import { PaymentController } from "./payment.controller.js";
import { PaymentService } from "./payment.service.js";
import { PaymentRepository } from "./payment.repository.js";

const ctrl = new PaymentController(
    new PaymentService(new PaymentRepository(prisma))
);

const router = Router();

router.get('/', validate({ query: paymentQuerySchema }), ctrl.getAllPayments);

router.get('/ofBudget/:id', validate({ params: idSchema }), ctrl.getPaymentsOfBudget);

router.get('/:id', validate({ params: idSchema }), ctrl.getOnePayment);

router.post('/', validate({ body: registerPaymentSchema }), ctrl.registerPayment);

router.delete('/:id', validate({ params: idSchema }), ctrl.deletePayment);

export default router;
