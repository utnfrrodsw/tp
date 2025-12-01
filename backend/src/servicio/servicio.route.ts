import { Router } from 'express';
import {
  validateBody,
  validateParams,
  validateQuery,
  authenticateToken,
} from '../utils/apiMiddleware.js';
import {
  createServicioValidation,
  updateServicioValidation,
  upsertServicioValidation,
  idParamValidation,
  usuarioIdParamValidation,
  userTaskParamsValidation,
  servicioQueryValidation,
} from './servicio.schemas.js';
import {
  findall,
  findone,
  add,
  update,
  remove,
  getByUser,
  upsertByUserAndTask,
  deleteByUserAndTask,
  deactivateByUserAndTask,
} from './servicio.controler.js';

export const servicioRouter = Router();

// ==================== POST ROUTES ====================
servicioRouter.post('/', validateBody(createServicioValidation), add);

servicioRouter.post(
  '/upsert',
  validateBody(upsertServicioValidation),
  upsertByUserAndTask
);

// ==================== GET ROUTES ====================
servicioRouter.get('/', validateQuery(servicioQueryValidation), findall);

servicioRouter.get('/:id', validateParams(idParamValidation), findone);

servicioRouter.get(
  '/user/:usuarioId',
  validateParams(usuarioIdParamValidation),
  getByUser
);

// ==================== PUT ROUTES ====================
servicioRouter.put(
  '/:id',
  validateParams(idParamValidation),
  validateBody(updateServicioValidation),
  update
);

// ==================== PATCH ROUTES ====================
servicioRouter.patch(
  '/:id',
  validateParams(idParamValidation),
  validateBody(updateServicioValidation),
  update
);

servicioRouter.patch(
  '/user/:usuarioId/task/:tareaId/deactivate',
  validateParams(userTaskParamsValidation),
  deactivateByUserAndTask
);

// ==================== DELETE ROUTES ====================
servicioRouter.delete('/:id', validateParams(idParamValidation), remove);

servicioRouter.delete(
  '/user/:usuarioId/task/:tareaId',
  validateParams(userTaskParamsValidation),
  deleteByUserAndTask
);
