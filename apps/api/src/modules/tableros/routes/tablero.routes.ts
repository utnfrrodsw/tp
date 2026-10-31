import { Router } from 'express';

import {
  getTableros,
  crearTablero,
  getTablero,
  actualizarTablero,
  borrarTablero,
  agregarServicioATablero,
  quitarServicioDeTablero
} from '../controllers/tablero.controller.js';
import { validateRequest } from '../../../shared/request-validation.js';
import { requestSchemas } from '../../../shared/request-schemas.js';
import { ensureOrm } from '../../../middlewares/ensure-orm.js';
import { authenticate, ensureActiveUser, requireRoles } from '../../../middlewares/authorization.js';

const router = Router();

router.use(authenticate, requireRoles('cliente'));

router.get('/', ensureOrm, ensureActiveUser, getTableros);
router.post('/', validateRequest(requestSchemas.createTablero), ensureOrm, ensureActiveUser, crearTablero);
router.get('/:id', validateRequest(requestSchemas.tableroIdParam), ensureOrm, ensureActiveUser, getTablero);
router.put('/:id', validateRequest(requestSchemas.updateTablero), ensureOrm, ensureActiveUser, actualizarTablero);
router.delete('/:id', validateRequest(requestSchemas.tableroIdParam), ensureOrm, ensureActiveUser, borrarTablero);
router.post('/:id/servicios', validateRequest(requestSchemas.addServicioToTablero), ensureOrm, ensureActiveUser, agregarServicioATablero);
router.delete('/:id/servicios/:servicioId', validateRequest(requestSchemas.removeServicioFromTablero), ensureOrm, ensureActiveUser, quitarServicioDeTablero);

export default router;
