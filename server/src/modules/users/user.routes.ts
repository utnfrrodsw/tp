import { modifyUserSchema, userQuerySchema } from './user.schema.js';
import { UserController } from "./user.controller.js";
import { UserRepository } from "./user.repository.js";
import { UserService } from "./user.service.js";
import { idSchema } from '@/shared/common.schema.js';
import { validate } from '@/middlewares/validation.middleware.js';
import { Router } from 'express';
import prisma from '@/database/prisma.js';

const ctrl = new UserController(
    new UserService(
        new UserRepository(
            prisma
        )))

const router = Router();

router.get('/', validate({query: userQuerySchema}),ctrl.getAllUsers)

router.post('/', ctrl.createUser);

router.get('/:id', validate({ params: idSchema }), ctrl.getOneUser);

router.put('/:id', validate({ params: idSchema, body: modifyUserSchema }), ctrl.modifyUser);

router.patch('/:id', validate({ params: idSchema, body: modifyUserSchema }), ctrl.modifyUser);

router.delete('/:id', validate({ params: idSchema }), ctrl.deleteUser);

export default router;