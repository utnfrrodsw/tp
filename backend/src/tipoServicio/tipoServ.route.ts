import { Router } from 'express';
import {
  findAll,
  findAllWithTareas,
  findOne,
  add,
  update,
  remove,
} from './tipoServ.controler.js';
import { validateBody, validateParams } from '../utils/apiMiddleware.js';
import {
  createTipoServicioSchema,
  updateTipoServicioSchema,
  idParamValidation,
} from './tipoServicio.schemas.js';

export const serviceTypeRouter = Router();

serviceTypeRouter.get('/', findAll);
serviceTypeRouter.get('/With-Tareas', findAllWithTareas);
serviceTypeRouter.get('/:id', validateParams(idParamValidation), findOne);
serviceTypeRouter.post(
  '/',
  validateBody(createTipoServicioSchema), // Elimina validateParams, ya que no se necesita un ID
  add
);
serviceTypeRouter.put(
  '/:id',
  validateParams(idParamValidation),
  validateBody(updateTipoServicioSchema),
  update
);
serviceTypeRouter.patch(
  '/:id',
  validateParams(idParamValidation),
  validateBody(updateTipoServicioSchema),
  update
);
serviceTypeRouter.delete('/:id', validateParams(idParamValidation), remove);
serviceTypeRouter.delete('/:id', validateParams(idParamValidation), remove);
