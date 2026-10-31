import { Router } from 'express';

import {
  login,
  register
} from '../controllers/auth.controller.js';
import { validateRequest } from '../../../shared/request-validation.js';
import { requestSchemas } from '../../../shared/request-schemas.js';
import { ensureOrm } from '../../../middlewares/ensure-orm.js';

const router = Router();

router.post('/login', validateRequest(requestSchemas.login), ensureOrm, login);

router.post('/register', validateRequest(requestSchemas.register), ensureOrm, register);

export default router;