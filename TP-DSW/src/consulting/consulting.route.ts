import { Router } from 'express';
import {
    sanitizeConsultingInput,
    findAll,
    findOne,
    add,
    update,
    remove,
} from './consulting.controller.js';

export const consultingRouter = Router();

consultingRouter.get('/', findAll);
consultingRouter.get('/:id', findOne);
consultingRouter.post('/', sanitizeConsultingInput, add);
consultingRouter.put('/:id', sanitizeConsultingInput, update);
consultingRouter.patch('/:id', sanitizeConsultingInput, update);
consultingRouter.delete('/:id', remove);
