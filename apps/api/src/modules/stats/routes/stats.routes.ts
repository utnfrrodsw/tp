import { Router } from 'express';

import { getAdminDashboardStats, getBusinessDashboardStats } from '../controllers/stats.controller.js';
import { validateRequest } from '../../../shared/request-validation.js';
import { requestSchemas } from '../../../shared/request-schemas.js';
import { ensureOrm } from '../../../middlewares/ensure-orm.js';
import { authenticate, ensureActiveUser, requireOwnUserId, requireRoles } from '../../../middlewares/authorization.js';

const router = Router();

router.get('/admin', authenticate, requireRoles('administrador'), ensureOrm, ensureActiveUser, getAdminDashboardStats);
router.get('/business', authenticate, requireRoles('empresa'), validateRequest(requestSchemas.businessStats), requireOwnUserId, ensureOrm, ensureActiveUser, getBusinessDashboardStats);

export default router;
