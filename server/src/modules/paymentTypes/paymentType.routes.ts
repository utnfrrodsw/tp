import { newPaymentTypeSchema, modifyTypePaymentSchema, typePaymentQuerySchema } from "./paymentType.schema.js";
import { PaymentTypeController } from "./paymentType.controller.js";
import { PaymentTypeRepository } from "./paymentType.repository.js";
import { PaymentTypeService } from "./paymentType.service.js";
import { Router } from "express";
import { validate } from "@/middlewares/validation.middleware.js";
import { idSchema } from "@/shared/common.schema.js";
import prisma from "@/database/prisma.js";

const ctrl = new PaymentTypeController(
    new PaymentTypeService(
        new PaymentTypeRepository(
            prisma
        )))

const router = Router();

router.post('/', validate({ body: newPaymentTypeSchema }), ctrl.newTypePayment);

router.get('/', validate({ query: typePaymentQuerySchema }), ctrl.getAllPaymentTypes);

router.get('/:id', validate({ params: idSchema }), ctrl.getOneTypePayment);

router.delete('/:id', validate({ params: idSchema }), ctrl.deleteTypePayment);

router.put('/:id', validate({ params: idSchema, body: modifyTypePaymentSchema }), ctrl.modifyTypePayment);

export default router;
