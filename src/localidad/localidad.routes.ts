import { Router } from 'express';
import { sanitizeLocalidadInput, findAll, findOne, add, update, remove } from './localidad.controler.js';
import { validatorSchema } from '../middlewares/validator.middleware.js';
import { createLocalidadSchema, updateLocalidadSchema } from '../schema/localidad.validator.js';

export const LocalidadRouter = Router();

LocalidadRouter.get('/', findAll);
LocalidadRouter.get('/:id', findOne);
LocalidadRouter.post('/', validatorSchema(createLocalidadSchema), sanitizeLocalidadInput, add);
LocalidadRouter.put('/:id', validatorSchema(updateLocalidadSchema), sanitizeLocalidadInput, update);
LocalidadRouter.patch('/:id', validatorSchema(updateLocalidadSchema), sanitizeLocalidadInput, update);
LocalidadRouter.delete('/:id', remove);
