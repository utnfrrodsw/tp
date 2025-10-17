import { Router } from 'express';
import { sanitizeRubroInput, findAll, findOne, add, update, remove } from './rubros.controler.js';
import { validatorSchema } from '../middlewares/validator.middleware.js';
import { createRubroSchema, updateRubroSchema } from '../schema/rubros.validator.js';

export const RubrosRouter = Router();

RubrosRouter.get('/', findAll);
RubrosRouter.get('/:id', findOne);
RubrosRouter.post('/', validatorSchema(createRubroSchema), sanitizeRubroInput, add);
RubrosRouter.put('/:id', validatorSchema(updateRubroSchema), sanitizeRubroInput, update);
RubrosRouter.patch('/:id', validatorSchema(updateRubroSchema), sanitizeRubroInput, update);
RubrosRouter.delete('/:id', remove);
