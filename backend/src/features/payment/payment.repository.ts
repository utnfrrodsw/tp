// Acceso a datos de la feature payment: consultas a la tabla payments. Es la
// única capa que habla con Sequelize.
//
// Ojo con la diferencia: este archivo guarda los pagos en NUESTRA base;
// payment.gateway.ts es el que habla con MercadoPago.
import { Transaction } from 'sequelize';
import { Payment, Plan, Subscription, User } from '../../entities';
import { PaymentState } from '../../shared/types/enums';

/** Suscripción a la que pertenece un pago, con el plan que se cobró. */
export type PaymentSubscription = {
  id_subscription: number;
  subscription_date: Date;
  end_date: Date | null;
  plan?: { id_plan: number; name: string };
  /** Solo lo trae la consulta del dashboard: quién compró. */
  user?: { id_user: number; username: string };
};

/**
 * Pago tal como sale de este repositorio, con la suscripción que pagó cuando la
 * consulta la trajo. Igual que en las otras features, la relación se declara acá
 * y no en la entidad, que es compartida por todo el sistema.
 */
export type PaymentWithSubscription = Payment & {
  subscription?: PaymentSubscription;
};

/** Datos del alta de un pago. */
type CreatePaymentData = {
  amount: number;
  state: PaymentState;
  /** Id del pago en MercadoPago. Es la clave que evita registrarlo dos veces. */
  id_gateway: string;
  id_subscription: number;
};

// La suscripción y su plan viajan con el pago porque el historial del perfil
// muestra "Plan Pro — $3500 — 12/08/2026": sin el plan, sería solo un importe.
const subscriptionInclude = {
  model: Subscription,
  as: 'subscription',
  attributes: ['id_subscription', 'subscription_date', 'end_date'],
  include: [{ model: Plan, as: 'plan', attributes: ['id_plan', 'name'] }],
};

export const paymentRepository = {
  /**
   * Busca un pago por su id de MercadoPago.
   *
   * Es la consulta que hace idempotente todo el circuito: si el pago ya está
   * registrado, el aviso que acaba de llegar es un duplicado y no hay que volver
   * a activar nada. La columna tiene un índice único (payments_id_gateway_unique),
   * así que además de rápida es la garantía de que no puedan entrar dos.
   */
  findByGatewayId: async (
    id_gateway: string,
    transaction?: Transaction
  ): Promise<PaymentWithSubscription | null> => {
    const payment = await Payment.findOne({ where: { id_gateway }, transaction });
    return payment as PaymentWithSubscription | null;
  },

  /** Los pagos de un usuario, del más nuevo al más viejo. */
  findAllByUser: async (id_user: number): Promise<PaymentWithSubscription[]> => {
    const payments = await Payment.findAll({
      // El pago no guarda el usuario: cuelga de la suscripción, que sí lo tiene.
      // El include con `required: true` hace el INNER JOIN que filtra por dueño.
      include: [{ ...subscriptionInclude, where: { id_user }, required: true }],
      order: [['payment_date', 'DESC']],
    });

    return payments as PaymentWithSubscription[];
  },

  /**
   * Todos los pagos aprobados, del más nuevo al más viejo, con el plan y el
   * usuario que compró. Es la única consulta del dashboard de administración:
   * los totales, la curva mensual y las últimas ventas se arman en el service a
   * partir de esta lista.
   *
   * Hoy todo pago guardado es 'approved' (los rechazos no dejan fila, ver
   * payment.service), pero se filtra igual: el dashboard mide plata cobrada, y
   * si mañana se guardaran otros estados no tendría que cambiar.
   */
  findApprovedForStats: async (): Promise<PaymentWithSubscription[]> => {
    const payments = await Payment.findAll({
      where: { state: 'approved' },
      attributes: ['id_transaction', 'amount', 'payment_date', 'state'],
      include: [
        {
          ...subscriptionInclude,
          include: [
            ...subscriptionInclude.include,
            { model: User, as: 'user', attributes: ['id_user', 'username'] },
          ],
        },
      ],
      order: [['payment_date', 'DESC']],
    });

    return payments as PaymentWithSubscription[];
  },

  /** Cambia el estado de un pago ya registrado (hoy, solo para anularlo por reembolso). */
  updateState: async (
    payment: PaymentWithSubscription,
    state: PaymentState,
    transaction?: Transaction
  ): Promise<void> => {
    await payment.update({ state }, { transaction });
  },

  create: async (
    data: CreatePaymentData,
    transaction?: Transaction
  ): Promise<PaymentWithSubscription> => {
    const payment = await Payment.create(data, { transaction });
    return payment as PaymentWithSubscription;
  },
};
