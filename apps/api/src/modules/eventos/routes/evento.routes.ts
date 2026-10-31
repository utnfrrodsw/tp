import { Router } from 'express';

import {
  getEventos,
  getEvento,
  crearEvento,
  actualizarEvento,
  borrarEvento
} from '../controllers/evento.controller.js';
import { validateRequest } from '../../../shared/request-validation.js';
import { requestSchemas } from '../../../shared/request-schemas.js';
import { ensureOrm } from '../../../middlewares/ensure-orm.js';
import { authenticate, ensureActiveUser, requireRoles } from '../../../middlewares/authorization.js';

const router = Router();

router.get('/', authenticate, requireRoles('cliente', 'empresa', 'administrador'), ensureOrm, ensureActiveUser, getEventos);
router.get('/:id', authenticate, requireRoles('cliente', 'empresa', 'administrador'), validateRequest(requestSchemas.idParams), ensureOrm, ensureActiveUser, getEvento);
router.post('/', authenticate, requireRoles('administrador'), validateRequest(requestSchemas.createEvento), ensureOrm, ensureActiveUser, crearEvento);
router.put('/:id', authenticate, requireRoles('administrador'), validateRequest(requestSchemas.updateEvento), ensureOrm, ensureActiveUser, actualizarEvento);
router.delete('/:id', authenticate, requireRoles('administrador'), validateRequest(requestSchemas.idParams), ensureOrm, ensureActiveUser, borrarEvento);

export default router;
