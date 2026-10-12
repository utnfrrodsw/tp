// Controller de los pagos: traduce HTTP <-> service. No consulta la base ni arma
// respuestas de error a mano.
//
// En Express 5 no hace falta try/catch... salvo en el webhook, que es la
// excepción de todo el sistema y está explicada abajo.
import { Request, Response } from 'express';
import { UnauthorizedError } from '../../shared/errors/app-error';
import { paymentService } from './payment.service';
import { ConfirmPaymentInput, CreateCheckoutInput, PaymentStatsQuery } from './payment.schema';

/**
 * Saca el id del pago de un aviso de MercadoPago.
 *
 * Hay que buscarlo en varios lugares porque MercadoPago no manda siempre el mismo
 * formato: el aviso moderno trae `{ type: 'payment', data: { id } }` en el body,
 * el viejo manda `?topic=payment&id=...` en la query, y algunas integraciones
 * reciben `?type=payment&data.id=...`. Se aceptan los tres.
 *
 * @param req la request del webhook.
 * @returns el id del pago, o null si el aviso no es sobre un pago.
 */
function extractPaymentId(req: Request): string | null {
  const body = req.body as { type?: string; action?: string; data?: { id?: string | number } };
  const query = req.query as Record<string, string | undefined>;

  // Los avisos que no son de un pago (por ejemplo los de merchant_order) se
  // ignoran: llegan igual y no tienen nada que confirmar.
  const kind = body?.type ?? query.type ?? query.topic;
  if (kind && kind !== 'payment') return null;

  const id = body?.data?.id ?? query['data.id'] ?? query.id;

  return id ? String(id) : null;
}

export const paymentController = {
  async createCheckout(req: Request, res: Response): Promise<void> {
    // requireAuth ya dejó el usuario en req.user; el chequeo es para TypeScript,
    // que no puede saber que la ruta lleva ese middleware adelante.
    if (!req.user) throw new UnauthorizedError();

    const { id_plan } = req.validated.body as CreateCheckoutInput;
    const checkout = await paymentService.createCheckout(req.user.id_user, id_plan);

    // 201: la request creó una orden de pago en la pasarela.
    res.status(201).json(checkout);
  },

  /**
   * Confirmación desde la pantalla de retorno, cuando el usuario vuelve al sitio.
   *
   * Es el camino que hace que la demo funcione sin exponer la máquina a internet:
   * en desarrollo el webhook no llega a localhost, y sin esto la membresía nunca
   * se activaría.
   */
  async confirm(req: Request, res: Response): Promise<void> {
    const { payment_id } = req.validated.body as ConfirmPaymentInput;
    const result = await paymentService.confirmPayment(payment_id);
    res.status(200).json(result);
  },

  /**
   * Respaldo de la confirmación: busca en MercadoPago un pago aprobado del
   * usuario logueado que no se haya registrado (ver paymentService.syncMine).
   */
  async sync(req: Request, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();

    const result = await paymentService.syncMine(req.user.id_user);
    res.status(200).json(result);
  },

  /**
   * Webhook de MercadoPago. Es la única ruta pública que escribe en la base, y la
   * única con try/catch.
   *
   * El try/catch está porque MercadoPago interpreta cualquier respuesta que no
   * sea 2xx como "no le llegó" y reintenta el aviso durante días. Si un pago con
   * la referencia rota devolviera 400, MercadoPago lo reintentaría para siempre
   * sin que el resultado cambie nunca. Entonces: se registra el problema en el
   * log del servidor, que es donde lo vamos a ver nosotros, y se le contesta 200
   * igual para que deje de insistir.
   *
   * Que esto sea seguro depende de confirmPayment(), que no le cree nada a quien
   * avisa: consulta el pago contra MercadoPago antes de tocar la base.
   */
  async webhook(req: Request, res: Response): Promise<void> {
    const paymentId = extractPaymentId(req);

    if (!paymentId) {
      // Un aviso que no es de un pago. Nada que hacer, pero hay que contestarle.
      res.status(200).json({ received: true });
      return;
    }

    try {
      const result = await paymentService.confirmPayment(paymentId);
      console.log('[webhook] Pago %s: %s', paymentId, result.message);
    } catch (error) {
      console.error('[webhook] No se pudo procesar el pago %s:', paymentId, error);
    }

    res.status(200).json({ received: true });
  },

  async getMine(req: Request, res: Response): Promise<void> {
    if (!req.user) throw new UnauthorizedError();

    const payments = await paymentService.getMine(req.user.id_user);
    res.status(200).json(payments);
  },

  /** Métricas del dashboard de administración. requireRole ya cortó a quien no es ADMIN. */
  async stats(req: Request, res: Response): Promise<void> {
    const { year } = req.validated.query as PaymentStatsQuery;
    const stats = await paymentService.adminStats(year);
    res.status(200).json(stats);
  },
};
