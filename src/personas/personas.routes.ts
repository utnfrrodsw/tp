import { Router } from 'express';
import { sanitizePersonaInput, findAll, findOne, add, update, remove } from './personas.controler.js';
import { validatorSchema } from '../middlewares/validator.middleware.js';
import { registroSchema } from '../schema/personas.validator.js';

export const PersonasRouter = Router();

PersonasRouter.get('/', findAll);
PersonasRouter.get('/:id', findOne);
PersonasRouter.post('/', validatorSchema(registroSchema), sanitizePersonaInput, add);
PersonasRouter.put('/:id', validatorSchema(registroSchema), sanitizePersonaInput, update);
PersonasRouter.patch('/:id', validatorSchema(registroSchema.partial()), sanitizePersonaInput, update);
PersonasRouter.delete('/:id', remove);
