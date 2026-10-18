import { Router } from 'express';
import authenticate from '@/middlewares/authenticate.middleware.js';
import { validate } from '@/middlewares/validation.middleware.js';
import type { Request, Response } from 'express';
import { AuthController } from './auth.controller.js';
import { UserService } from "@/modules/users/user.service.js";
import { UserRepository } from "@/modules/users/user.repository.js"
import prisma from '@/database/prisma.js';
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from './auth.schema.js';

const ctrl = new AuthController(
    new UserService(
        new UserRepository(
            prisma
        )
    )
)

const router = Router();

router.post('/register', validate({ body: registerSchema }), ctrl.registerUser);

router.post('/login', validate({ body: loginSchema }), ctrl.loginUser);

router.post('/logout', authenticate([]), ctrl.logout);

router.post('/refresh', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Refresh token endpoint not implemented yet' });
});

router.post('/forgot-password', validate({ body: forgotPasswordSchema }), ctrl.forgotPassword);

router.post('/reset-password/:token', validate({ body: resetPasswordSchema }), ctrl.resetPassword);

router.put('/validate/:token', ctrl.validateAccountController);

router.get('/me', authenticate([]), ctrl.getMe);

export default router;


