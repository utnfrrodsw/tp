import { modifyClientTypeSchema, newClientTypeSchema, clientTypeQuerySchema } from "./clientType.schema.js";
import { ClientTypeController } from "./clientType.controller.js"
import { ClientTypeRepository } from "./clientType.repository.js"
import { ClientTypeService } from "./clientType.service.js"
import { validate } from "@/middlewares/validation.middleware.js";
import { idSchema } from "@/shared/common.schema.js";
import { Router } from "express";
import prisma from "@/database/prisma.js";

const ctrl = new ClientTypeController(
    new ClientTypeService(
        new ClientTypeRepository(
            prisma
        )))

const router = Router()

router.post('/', validate({ body: newClientTypeSchema }), ctrl.newClientType);

router.get('/', validate({ query: clientTypeQuerySchema }), ctrl.getAllClientTypes);

router.get('/:id', validate({ params: idSchema }), ctrl.getOneClientTypes);

router.delete('/:id', validate({ params: idSchema }), ctrl.deleteClientType);

router.put('/:id', validate({ params: idSchema, body: modifyClientTypeSchema }), ctrl.modifyClientType);

export default router;
