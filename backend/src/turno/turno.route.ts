import { Router } from 'express';
import {
  findall,
  findone,
  add,
  update,
  remove,
  getTurnosByUserId,
  getTurnosByPrestadorId,
  getTurnsPerDay,
  addWithCookie,
} from './turno.controler.js';
import {
  validateBody,
  validateParams,
  validateQuery,
  authenticateToken,
} from '../utils/apiMiddleware.js';
import {
  TurnoQuerySchema,
  TurnoCreateSchema,
  TurnoUpdateSchema,
  TurnoIdSchema,
  turnoQuerySchemaDash,
} from './turno.schemas.js';
export const turnoRouter = Router();

turnoRouter.get('/', findall);

turnoRouter.get(
  '/byUser/:cantItemsPerPage?/:currentPage?/:selectedValueShow?/:selectedValueOrder?',
  authenticateToken,
  validateParams(TurnoQuerySchema),
  getTurnosByUserId
);

turnoRouter.get(
  '/byPrestador/:id/:cantItemsPerPage?/:currentPage?/:selectedValueShow?/:selectedValueOrder?/:searchQuery?',
  validateParams(turnoQuerySchemaDash),
  getTurnosByPrestadorId
);

turnoRouter.get(
  '/turnosPorDia/:id/:date',
  validateParams(TurnoIdSchema),
  getTurnsPerDay
);

turnoRouter.get('/:id', validateParams(TurnoIdSchema), findone);

turnoRouter.post('/', validateBody(TurnoCreateSchema), add);

turnoRouter.post(
  '/cookie',
  authenticateToken,
  validateBody(TurnoCreateSchema),
  addWithCookie
);

turnoRouter.put(
  '/:id',
  validateParams(TurnoIdSchema),
  validateBody(TurnoUpdateSchema),
  update
);

turnoRouter.patch(
  '/:id',
  validateParams(TurnoIdSchema),
  validateBody(TurnoUpdateSchema),
  update
);

turnoRouter.delete('/:id', validateParams(TurnoIdSchema), remove);
