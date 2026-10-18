import { Router } from "express";
import { ClientController } from "./client.controller.js";
import { ClientService } from "./client.service.js";
import { ClientRepository } from "./client.repository.js";
import prisma from "@/database/prisma.js";
import { validate } from "@/middlewares/validation.middleware.js";
import { createClientSchema, modifyClientSchema, clientQuerySchema } from "./client.schema.js";
import { idSchema } from "@/shared/common.schema.js";

const ctrl = new ClientController(
    new ClientService(
        new ClientRepository(
            prisma
        )
    )
);

const router = Router();

router.post('/', validate({ body: createClientSchema }), ctrl.createClient);

router.get('/', validate({ query: clientQuerySchema }), ctrl.getAllClients);

router.get('/:id', validate({ params: idSchema }), ctrl.getOneClient);

router.put('/:id', validate({ params: idSchema, body: modifyClientSchema }), ctrl.modifyClient);

router.delete('/:id', validate({ params: idSchema }), ctrl.deleteClient);

export default router;