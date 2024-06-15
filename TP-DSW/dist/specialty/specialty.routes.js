import { Router } from 'express';
import { sanitizeSpecialtyInput, findAll, findOne, add, update, remove, } from './specialty.controller.js';
export const specialtyRouter = Router();
specialtyRouter.get('/', findAll);
specialtyRouter.get('/:id', findOne);
specialtyRouter.post('/', sanitizeSpecialtyInput, add);
specialtyRouter.put('/:id', sanitizeSpecialtyInput, update);
specialtyRouter.patch('/:id', sanitizeSpecialtyInput, update);
specialtyRouter.delete('/:id', remove);
//# sourceMappingURL=specialty.routes.js.map