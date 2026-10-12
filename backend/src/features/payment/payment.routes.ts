// Rutas del pago de membresías, montadas en /api/payments.
//
//   POST /api/payments/checkout  arranca el pago de un plan, logueado
//   POST /api/payments/confirm   confirma el pago al volver del checkout, logueado
//   POST /api/payments/sync      busca un pago aprobado sin registrar, logueado
//   POST /api/payments/webhook   aviso de MercadoPago, PÚBLICO
//   GET  /api/payments/mine      mi historial de pagos, logueado
//   GET  /api/payments/stats     métricas del dashboard de administración, ADMIN
//
// El webhook es la única ruta del sistema sin requireAuth, y tiene que serlo: la
// llama un servidor de MercadoPago, que no tiene ni puede tener un token nuestro.
// Que sea pública no la vuelve insegura, porque no le cree nada a quien la llama:
// del aviso solo saca un id de pago y después le pregunta a MercadoPago, con
// nuestro access token, si ese pago existe y si está aprobado (ver
// payment.service.confirmPayment). Un POST inventado no activa ninguna membresía.
//
// Tampoco lleva validate(), por el mismo motivo: rechazar un aviso con formato
// raro lo dejaría reintentando para siempre (ver payment.schema.ts).
//
// No hay PATCH ni DELETE: un pago es un hecho que ya pasó y no se edita ni se
// borra. Es el registro contable del sistema, y de él depende el historial que ve
// el usuario.
import { Router } from 'express';
import { rateLimit } from '../../shared/middlewares/rate-limit';
import { requireAuth } from '../../shared/middlewares/require-auth';
import { requireRole } from '../../shared/middlewares/require-role';
import { validate } from '../../shared/middlewares/validate';
import { paymentController } from './payment.controller';
import { confirmPaymentSchema, createCheckoutSchema, paymentStatsQuerySchema } from './payment.schema';

export const paymentRouter = Router();

paymentRouter.post(
  '/checkout',
  requireAuth,
  validate({ body: createCheckoutSchema }),
  paymentController.createCheckout
);

paymentRouter.post(
  '/confirm',
  requireAuth,
  validate({ body: confirmPaymentSchema }),
  paymentController.confirm
);

// Cada llamada consulta a MercadoPago: el límite evita que una pestaña recargada
// sin parar le gaste el cupo a la API.
paymentRouter.post(
  '/sync',
  requireAuth,
  rateLimit({ windowMs: 60_000, max: 10 }),
  paymentController.sync
);

// Cada aviso hace una consulta a MercadoPago con nuestro access token: el límite
// evita que alguien lo use para gastar nuestro cupo de la API o llenar el log.
// 60 por minuto está muy por encima de lo que manda MercadoPago de verdad.
paymentRouter.post(
  '/webhook',
  rateLimit({ windowMs: 60_000, max: 60 }),
  paymentController.webhook
);

paymentRouter.get('/mine', requireAuth, paymentController.getMine);

paymentRouter.get(
  '/stats',
  requireAuth,
  requireRole('ADMIN'),
  validate({ query: paymentStatsQuerySchema }),
  paymentController.stats
);
