import { Router } from 'express';
import { findall, findone, add, update, remove } from './tarea.controler.js';
import {
  tareaBaseSchema,
  createTareaValidation,
  updateTareaValidation,
  idParamValidation,
} from './tarea.schemas.js';
import { validateBody, validateParams } from '../utils/apiMiddleware.js';

export const tareaRouter = Router();

// ==================== GET ROUTES ====================
tareaRouter.get('/', findall);
tareaRouter.get('/:id', validateParams(idParamValidation), findone);

// ==================== POST ROUTES ====================
tareaRouter.post('/', validateBody(createTareaValidation), add);

// ==================== PUT/PATCH ROUTES ====================
tareaRouter.put(
  '/:id',
  validateBody(updateTareaValidation),
  validateParams(idParamValidation),
  update
);

tareaRouter.patch(
  '/:id',
  validateBody(updateTareaValidation),
  validateParams(idParamValidation),
  update
);

// ==================== DELETE ROUTES ====================
tareaRouter.delete('/:id', validateParams(idParamValidation), remove);
