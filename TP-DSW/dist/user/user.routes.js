import { Router } from 'express';
import { sanitizeUserInput, findAll, findOne, add, update, remove, } from './user.controller.js';
export const userRouter = Router();
userRouter.get('/', findAll);
userRouter.get('/:id', findOne);
userRouter.post('/', sanitizeUserInput, add);
userRouter.put('/:id', sanitizeUserInput, update);
userRouter.patch('/:id', sanitizeUserInput, update);
userRouter.delete('/:id', remove);
//# sourceMappingURL=user.routes.js.map