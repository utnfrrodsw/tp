import { Router } from 'express';
import {
  authenticate,
  ensureActiveUser,
  requireOwnUserId,
  requireRoles
} from '../../../middlewares/authorization.js';
import { ensureOrm } from '../../../middlewares/ensure-orm.js';
import { validateRequest } from '../../../shared/request-validation.js';
import { requestSchemas } from '../../../shared/request-schemas.js';
import {
  confirmarPlanPro,
  crearCheckoutPlanPro,
  crearPreferenciaPago,
  probarIntegracionMercadoPago
} from '../controllers/payment.controller.js';

const router = Router();

router.post(
  '/test',
  authenticate,
  requireRoles('empresa'),
  requireOwnUserId,
  ensureOrm,
  ensureActiveUser,
  probarIntegracionMercadoPago
);

router.post(
  '/plan-pro/preference',
  authenticate,
  requireRoles('empresa'),
  validateRequest(requestSchemas.createPlanProPreference),
  requireOwnUserId,
  ensureOrm,
  ensureActiveUser,
  crearCheckoutPlanPro
);

router.post(
  '/plan-pro/confirmar',
  authenticate,
  requireRoles('empresa'),
  validateRequest(requestSchemas.confirmarPlanPro),
  requireOwnUserId,
  ensureOrm,
  ensureActiveUser,
  confirmarPlanPro
);

router.post(
  '/preferences',
  authenticate,
  requireRoles('empresa'),
  validateRequest(requestSchemas.createPaymentPreference),
  requireOwnUserId,
  ensureOrm,
  ensureActiveUser,
  crearPreferenciaPago
);

export default router;
