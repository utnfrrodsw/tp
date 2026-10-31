import { Router } from 'express';

import { getEmpresas, getUsuario, getUsuarios, patchUsuarioActivo } from '../controllers/usuario.controller.js';
import { validateRequest } from '../../../shared/request-validation.js';
import { requestSchemas } from '../../../shared/request-schemas.js';
import { ensureOrm } from '../../../middlewares/ensure-orm.js';
import { authenticate, ensureActiveUser, requireRoles } from '../../../middlewares/authorization.js';

const router = Router();

router.get('/empresas', ensureOrm, getEmpresas);
router.get('/', authenticate, requireRoles('administrador'), validateRequest(requestSchemas.listUsuarios), ensureOrm, ensureActiveUser, getUsuarios);
router.get('/:id', authenticate, validateRequest(requestSchemas.idParams), ensureOrm, ensureActiveUser, getUsuario);
router.patch('/:id/activo', authenticate, requireRoles('administrador'), validateRequest(requestSchemas.setUsuarioActivo), ensureOrm, ensureActiveUser, patchUsuarioActivo);

export default router;
