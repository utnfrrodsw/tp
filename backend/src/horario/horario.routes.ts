import { Router } from 'express';
import {
  findAll,
  findManyByUser,
  add,
  update,
  remove,
  updateBatchByUser,
} from './horario.controler.js';
import {
  idUserParamValidation,
  idParamValidation,
  updateHorarioValidation,
  horarioSchema,
} from './horario.schemas.js';
import { validateBody, validateParams } from '../utils/apiMiddleware.js';

export const horarioRouter = Router();

// ==================== GET ROUTES ====================
horarioRouter.get('/', findAll);

horarioRouter.get(
  '/:usuario',
  validateParams(idUserParamValidation),
  findManyByUser
);

// ==================== POST ROUTES ====================
horarioRouter.post('/', validateBody(horarioSchema), add);

// ==================== PUT/PATCH ROUTES ====================
horarioRouter.put(
  '/:id',
  validateBody(updateHorarioValidation),
  validateParams(idParamValidation),
  update
);

horarioRouter.patch(
  '/:id',
  validateBody(updateHorarioValidation),
  validateParams(idParamValidation),
  update
);

// ==================== DELETE ROUTES ====================
horarioRouter.delete('/:id', validateParams(idParamValidation), remove);

// ==================== PUT BATCH ROUTE ====================
horarioRouter.put(
  '/usuario/:usuarioId',
  updateBatchByUser
);
