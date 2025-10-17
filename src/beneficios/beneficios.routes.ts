import { Router } from 'express';
import { sanitizeBeneficioInput, findAll, findOne, add, update, remove } from './beneficios.controler.js';
import { validatorSchema } from '../middlewares/validator.middleware.js';
import { createBeneficioSchema, updateBeneficioSchema } from '../schema/beneficios.validator.js';

export const BeneficiosRouter = Router();

BeneficiosRouter.get('/', findAll);
BeneficiosRouter.get('/:id', findOne);
BeneficiosRouter.post('/', validatorSchema(createBeneficioSchema), sanitizeBeneficioInput, add);
BeneficiosRouter.put('/:id', validatorSchema(updateBeneficioSchema), sanitizeBeneficioInput, update);
BeneficiosRouter.patch('/:id', validatorSchema(updateBeneficioSchema), sanitizeBeneficioInput, update);
BeneficiosRouter.delete('/:id', remove);
