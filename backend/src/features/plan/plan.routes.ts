// Rutas de los planes de membresía, montadas en /api/plans.
//
//   GET    /api/plans      listado de los planes, PÚBLICO
//   GET    /api/plans/:id  ficha de un plan, PÚBLICO
//   PATCH  /api/plans/:id  cambia el precio de un plan pago, solo ADMIN
//
// Los planes son dos y fijos (Free y Pro, los crea el seed): el sistema los busca
// por nombre y la página /pro está armada para ellos. Por eso no hay alta, baja ni
// cambio de nombre o descripción: lo único que el ADMIN puede tocar es el precio.
// Como el permiso depende solo del rol, lo resuelve entero requireRole.
//
// Las dos lecturas son públicas porque la página /pro es lo primero que ve
// alguien que todavía no tiene cuenta, y es justamente donde hay que mostrarle
// cuánto sale la membresía. Un plan es un nombre, un precio y una descripción
// pensada para publicarse: no hay nada que proteger.
import { Router } from 'express';
import { requireAuth } from '../../shared/middlewares/require-auth';
import { requireRole } from '../../shared/middlewares/require-role';
import { validate } from '../../shared/middlewares/validate';
import { planController } from './plan.controller';
import { planIdParamSchema, updatePlanPriceSchema } from './plan.schema';

export const planRouter = Router();

planRouter.get('/', planController.list);

planRouter.get('/:id', validate({ params: planIdParamSchema }), planController.getById);

planRouter.patch(
  '/:id',
  requireAuth,
  requireRole('ADMIN'),
  validate({ params: planIdParamSchema, body: updatePlanPriceSchema }),
  planController.updatePrice
);
