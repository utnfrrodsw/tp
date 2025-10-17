import { Router } from 'express';
import { sanitizeCiudadInput, findAll, findOne, add, update, remove } from './ciudad.controler.js';
import { validatorSchema } from '../middlewares/validator.middleware.js';
import { createCiudadSchema, updateCiudadSchema } from '../schema/ciudad.validator.js';

export const CiudadRouter = Router();

CiudadRouter.get('/', findAll);
CiudadRouter.get('/:id', findOne);
CiudadRouter.post('/', validatorSchema(createCiudadSchema), sanitizeCiudadInput, add);
CiudadRouter.put('/:id', validatorSchema(updateCiudadSchema), sanitizeCiudadInput, update);
CiudadRouter.patch('/:id', validatorSchema(updateCiudadSchema), sanitizeCiudadInput, update);
CiudadRouter.delete('/:id', remove);