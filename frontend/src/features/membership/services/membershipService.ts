// Servicio de la membresía: centraliza las llamadas HTTP a /api/plans,
// /api/subscriptions y /api/payments, y mapea las respuestas crudas a los modelos
// de models/Membership.
//
// Son tres prefijos de la API en un solo servicio a propósito: para el usuario
// "mi membresía" es una sola cosa, y partir esto en tres archivos obligaría a
// cada pantalla a importar tres servicios para armar una pantalla.
import { httpClient } from '../../../core/services/httpClient';
import { Payment, Plan, Subscription } from '../models/Membership';
import type {
  CheckoutApiResponse,
  ConfirmApiResponse,
  MembershipApiResponse,
  PaymentApiResponse,
  PlanApiResponse,
  SubscriptionApiResponse,
} from '../models/Membership';
import { RecentSale, RevenueStats } from '../models/RevenueStats';
import type { RevenueStatsApiResponse } from '../models/RevenueStats';

/** "Mi membresía": la vigente y el historial, ya como modelos. */
export type Membership = {
  current: Subscription | null;
  history: Subscription[];
};


/** Pasa un plan del JSON de la API al modelo. */
function toPlan(data: PlanApiResponse): Plan {
  return new Plan(data.id_plan, data.name, data.amount, data.description, data.subscribers);
}

/**
 * Pasa una suscripción del JSON de la API al modelo.
 * Las fechas llegan como texto ISO y se convierten acá: el resto de la app
 * trabaja siempre con Date.
 */
function toSubscription(data: SubscriptionApiResponse): Subscription {
  return new Subscription(
    data.id_subscription,
    data.plan?.id_plan ?? null,
    data.plan?.name ?? null,
    data.plan?.amount ?? 0,
    data.subscription_date ? new Date(data.subscription_date) : null,
    data.end_date ? new Date(data.end_date) : null,
    data.state
  );
}

/** Pasa un pago del JSON de la API al modelo. */
function toPayment(data: PaymentApiResponse): Payment {
  return new Payment(
    data.id_transaction,
    data.amount,
    new Date(data.payment_date),
    data.state,
    data.plan
  );
}

/** Pasa las métricas del dashboard del JSON de la API al modelo. */
function toRevenueStats(data: RevenueStatsApiResponse): RevenueStats {
  return new RevenueStats(
    data.year,
    data.available_years,
    data.revenue.total_all_time,
    data.revenue.total_year,
    data.revenue.sales_year,
    data.revenue.average_ticket,
    data.monthly,
    data.users.total,
    data.users.by_role.map((row) => ({ role: row.rol, count: row.count })),
    data.users.pro_paid,
    data.users.pro_assigned,
    data.users.conversion,
    data.recent_sales.map(
      (sale) =>
        new RecentSale(
          sale.id_transaction,
          sale.amount,
          new Date(sale.payment_date),
          sale.username,
          sale.plan
        )
    )
  );
}

export const membershipService = {
  /** Los planes del sistema. Es una lectura pública: no hace falta sesión. */
  async listPlans(): Promise<Plan[]> {
    const data = await httpClient.get<PlanApiResponse[]>('/plans');
    return data.map(toPlan);
  },

  /**
   * Cambia el precio de un plan pago: es lo único editable de un plan. El
   * backend lo restringe a ADMIN y rechaza tocar el plan gratuito.
   * @param id plan a modificar.
   * @param amount precio nuevo, ya como número.
   */
  async updatePlanPrice(id: number, amount: number): Promise<Plan> {
    const data = await httpClient.patch<PlanApiResponse>(`/plans/${id}`, { amount });
    return toPlan(data);
  },

  /** Mi membresía vigente y mi historial de suscripciones. */
  async getMyMembership(): Promise<Membership> {
    const data = await httpClient.get<MembershipApiResponse>('/subscriptions/mine');
    return {
      current: data.current ? toSubscription(data.current) : null,
      history: data.history.map(toSubscription),
    };
  },

  /** Mi historial de pagos. */
  async getMyPayments(): Promise<Payment[]> {
    const data = await httpClient.get<PaymentApiResponse[]>('/payments/mine');
    return data.map(toPayment);
  },

  /**
   * Arranca el pago de un plan.
   * @param planId plan que se quiere contratar.
   * @returns la URL de MercadoPago a la que hay que mandar al usuario.
   */
  async startCheckout(planId: number): Promise<string> {
    const data = await httpClient.post<CheckoutApiResponse>('/payments/checkout', {
      id_plan: planId,
    });
    return data.checkoutUrl;
  },

  /**
   * Confirma un pago al volver de MercadoPago.
   * @param paymentId el payment_id que MercadoPago deja en la URL de retorno.
   * @returns si la membresía quedó activada y el mensaje a mostrar.
   */
  async confirmPayment(paymentId: string): Promise<ConfirmApiResponse> {
    return httpClient.post<ConfirmApiResponse>('/payments/confirm', {
      payment_id: paymentId,
    });
  },

  /**
   * Métricas del dashboard de administración. Solo ADMIN: la API corta con 403
   * a cualquier otro rol aunque alguien fuerce la URL.
   * @param year año elegido; sin él, la API usa el año en curso.
   */
  async getRevenueStats(year?: number): Promise<RevenueStats> {
    const query = year === undefined ? '' : `?year=${year}`;
    const data = await httpClient.get<RevenueStatsApiResponse>(`/payments/stats${query}`);
    return toRevenueStats(data);
  },
};
