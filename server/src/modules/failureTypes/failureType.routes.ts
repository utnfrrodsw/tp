import { newFailureTypeSchema, modifyFailureTypeSchema, failureTypeQuerySchema } from "./failureType.schema.js";
import { FailureTypeRepository } from "./failureType.repository.js";
import { FailureTypeController } from "./failureType.controller.js";
import { FailureTypeService } from "./failureType.service.js";
import { validate } from "@/middlewares/validation.middleware.js";
import { idSchema } from "@/shared/common.schema.js";
import { Router } from "express";
import prisma from "@/database/prisma.js";

const ctrl = new FailureTypeController(
    new FailureTypeService(
        new FailureTypeRepository(
            prisma
        )))

const router = Router();

router.post('/', validate({ body: newFailureTypeSchema }), ctrl.newFailureType);

router.get('/', validate({ query: failureTypeQuerySchema }), ctrl.getAllFailureType);

router.get('/:id', validate({ params: idSchema }), ctrl.getOneFailureType);

router.delete('/:id', validate({ params: idSchema }), ctrl.deleteFailureType);

router.put('/:id', validate({ params: idSchema, body: modifyFailureTypeSchema }), ctrl.modifyFailureType);

export default router;
