import { Router } from 'express';
import {
  validateBody,
  validateParams,
  validateQuery,
  authenticateToken,
} from '../utils/apiMiddleware.js';
import {
  createZonaValidation,
  updateZonaValidation,
  idParamValidation,
  updateByUserValidation,
} from './zona.schemas.js';
import {
  findAll,
  findOne,
  add,
  update,
  remove,
  findAllPerUser,
  updateByUser,
} from './zona.controller.js';

export const zonaRouter = Router();

// ==================== POST ROUTES ====================
zonaRouter.post('/', validateBody(createZonaValidation), add);

// ==================== GET ROUTES ====================
zonaRouter.get('/usuario/', authenticateToken, findAllPerUser);

zonaRouter.get('/:id', validateParams(idParamValidation), findOne);

zonaRouter.get('/', findAll);
// ==================== PUT ROUTES ====================
zonaRouter.put(
  '/:id',
  validateParams(idParamValidation),
  validateBody(updateZonaValidation),
  update
);

// Agrego la ruta PUT para que coincida con el frontend y la documentación
zonaRouter.put(
  '/updateByUser/:id',
  authenticateToken,
  validateParams(idParamValidation),
  validateBody(updateByUserValidation),
  updateByUser
);

// ==================== PATCH ROUTES ====================
zonaRouter.patch(
  '/:id',
  validateParams(idParamValidation),
  validateBody(updateZonaValidation),
  update
);

// ==================== DELETE ROUTES ====================
zonaRouter.delete('/:id', validateParams(idParamValidation), remove);
