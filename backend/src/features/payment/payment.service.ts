// Lógica de negocio del pago de una membresía: arrancar el checkout y confirmar
// el resultado. No conoce req ni res.
//
// La membresía Pro se cobra UNA SOLA VEZ: el pago no se repite y el acceso no
// vence. Eso hace que el circuito de abajo se recorra una vez por usuario, y que
// createCheckout() corte de entrada a quien ya la tenga.
//
// El circuito completo del CUU de upgrade:
//
//   1. El usuario aprieta "Pasarme a Pro"  -> createCheckout() arma la orden en
//      MercadoPago y devuelve el link. Todavía NO se guarda nada en la base: un
//      checkout empezado no es una membresía.
//   2. Paga en MercadoPago.
//   3. MercadoPago avisa. Puede avisar por DOS caminos, y los dos terminan en
//      confirmPayment():
//        - el webhook, que es el aviso servidor-a-servidor;
//        - la pantalla de retorno, cuando el navegador del usuario vuelve al sitio.
//      Los dos pueden llegar, en cualquier orden, o puede llegar uno solo. Por eso
//      confirmPayment() es idempotente: el segundo en llegar no duplica nada.
//   4. confirmPayment() le pregunta a MercadoPago cómo terminó el pago y, si está
//      aprobado, activa la membresía y registra el pago EN UNA TRANSACCIÓN.
//
// Por qué se persiste solo el pago aprobado: PAYMENTS.id_subscription es NOT NULL,
// así que un pago no puede existir sin una suscripción, y SUBSCRIPTION no tiene un
// estado 'pending' donde dejarla esperando. Guardar los rechazos obligaría a crear
// una suscripción que nunca estuvo vigente. Un rechazo, entonces, no deja fila: el
// usuario lo ve en la pantalla de retorno y puede volver a intentar.
import { env } from '../../shared/config/env';
import { sequelize } from '../../shared/db/sequelize';
import { BadRequestError, NotFoundError } from '../../shared/errors/app-error';
import { USER_ROLES, UserRole } from '../../shared/types/enums';
import { planRepository } from '../plan/plan.repository';
// El dashboard necesita contar membresías activas; se le pregunta al repositorio
// de suscripciones igual que se le pregunta al de usuarios (ver review.service).
import { subscriptionRepository } from '../subscription/subscription.repository';
import { subscriptionService } from '../subscription/subscription.service';
import { userRepository } from '../user/user.repository';
import { parseExternalReference, paymentGateway } from './payment.gateway';
import { paymentRepository, PaymentWithSubscription } from './payment.repository';

/** Estado con el que MercadoPago informa un pago aceptado. */
const APPROVED_STATUS = 'approved';

/** Estados con los que MercadoPago informa que la plata volvió al comprador. */
const REVERSED_STATUSES = ['refunded', 'charged_back'];

/** Lo que devuelve el arranque del checkout: a dónde mandar al usuario. */
type CheckoutResult = {
  checkoutUrl: string;
  preferenceId: string;
};

/**
 * Resultado de confirmar un pago. `applied` distingue los dos finales felices:
 * true  -> este llamado activó la membresía;
 * false -> el pago ya estaba registrado (llegó el aviso duplicado) o no se aprobó.
 */
type ConfirmResult = {
  applied: boolean;
  status: string;
  message: string;
};

/** Vista pública de un pago: es lo que sale en el historial del perfil. */
type PublicPayment = {
  id_transaction: number;
  amount: number;
  payment_date: Date;
  state: string;
  plan: string | null;
};

/** Una venta en la lista "Últimas ventas" del dashboard. */
type RecentSale = {
  id_transaction: number;
  amount: number;
  payment_date: Date;
  username: string | null;
  plan: string | null;
};

/**
 * Métricas del dashboard de administración.
 *
 * Con el pago único no hay ingresos recurrentes que medir (ni MRR ni bajas): lo
 * que se mide son VENTAS. Cuánto se cobró, cuándo, y qué parte de los usuarios
 * compró.
 */
type PublicPaymentStats = {
  year: number;
  /** Años con al menos un pago, más el actual. Del más nuevo al más viejo. */
  available_years: number[];
  revenue: {
    /** Todo lo cobrado desde siempre, sin importar el año elegido. */
    total_all_time: number;
    total_year: number;
    sales_year: number;
    /** Ingresos del año / ventas del año; 0 si no hubo ventas. */
    average_ticket: number;
  };
  /** Doce posiciones, de enero a diciembre del año elegido. */
  monthly: { month: number; revenue: number; sales: number }[];
  users: {
    /** Cuentas activas; las suspendidas no cuentan. */
    total: number;
    /** Siempre los tres roles, en el orden de USER_ROLES, aunque alguno tenga 0. */
    by_role: { rol: UserRole; count: number }[];
    /** Pro que pagaron: cada membresía activa nace de un pago. */
    pro_paid: number;
    /** Pro por rol sin pago detrás: se los asignó un admin a mano. */
    pro_assigned: number;
    /** Pro que pagaron sobre usuarios no admin, en porcentaje con un decimal. */
    conversion: number;
  };
  /** Las ventas más recientes, de cualquier año. */
  recent_sales: RecentSale[];
};

/** Cuántas ventas muestra la lista de últimas ventas del dashboard. */
const RECENT_SALES_SIZE = 8;

/**
 * Redondea un importe a centavos. Sumar decimales en punto flotante deja restos
 * como 7000.000000001; la columna es DECIMAL(10,2) y el total no puede ser más
 * preciso que lo que se guardó.
 */
function roundMoney(amount: number): number {
  return Math.round(amount * 100) / 100;
}

/** Suma los importes de una lista de pagos. */
function sumAmounts(payments: PaymentWithSubscription[]): number {
  return roundMoney(payments.reduce((total, payment) => total + payment.amount, 0));
}

/**
 * Ingresos y cantidad de ventas de cada mes de un año.
 * @param payments pagos de ese año, ya filtrados.
 * @returns doce posiciones: la 0 es enero y la 11 diciembre.
 */
function buildMonthly(payments: PaymentWithSubscription[]): PublicPaymentStats['monthly'] {
  const monthly = Array.from({ length: 12 }, (_, index) => ({
    month: index + 1,
    revenue: 0,
    sales: 0,
  }));

  for (const payment of payments) {
    const entry = monthly[new Date(payment.payment_date).getMonth()];
    entry.revenue += payment.amount;
    entry.sales += 1;
  }

  return monthly.map((entry) => ({ ...entry, revenue: roundMoney(entry.revenue) }));
}

/**
 * Los años que se pueden elegir en el dashboard: los que tuvieron al menos una
 * venta, más el actual aunque todavía no tenga ninguna. Mismo criterio que las
 * estadísticas avanzadas de review.service.
 */
function buildAvailableYears(payments: PaymentWithSubscription[], currentYear: number): number[] {
  const years = new Set<number>([currentYear]);
  for (const payment of payments) years.add(new Date(payment.payment_date).getFullYear());
  return [...years].sort((a, b) => b - a);
}

/** Arma una fila de "Últimas ventas". */
function toRecentSale(payment: PaymentWithSubscription): RecentSale {
  return {
    id_transaction: payment.id_transaction,
    amount: payment.amount,
    payment_date: payment.payment_date,
    username: payment.subscription?.user?.username ?? null,
    plan: payment.subscription?.plan?.name ?? null,
  };
}

/** Arma la vista pública de un pago. */
function toPublicPayment(payment: PaymentWithSubscription): PublicPayment {
  return {
    id_transaction: payment.id_transaction,
    // El getter de la entidad ya lo devuelve como número: la columna es un
    // DECIMAL y sin él llegaría como string.
    amount: payment.amount,
    payment_date: payment.payment_date,
    state: payment.state,
    plan: payment.subscription?.plan?.name ?? null,
  };
}

export const paymentService = {
  /**
   * Arranca el pago de un plan: crea la orden en MercadoPago y devuelve el link
   * del checkout.
   *
   * @param id_user usuario que quiere contratar, sacado del token.
   * @param id_plan plan elegido.
   * @returns la URL a la que hay que mandar al usuario.
   */
  async createCheckout(id_user: number, id_plan: number): Promise<CheckoutResult> {
    const plan = await planRepository.findById(id_plan);
    if (!plan) throw new NotFoundError('El plan');

    // El plan gratuito no se cobra: mandar a alguien a pagar $0 haría que
    // MercadoPago rechace la preference con un error que no se entiende.
    if (plan.amount <= 0) {
      throw new BadRequestError(
        `El plan "${plan.name}" no tiene costo, así que no hace falta pagarlo.`
      );
    }

    const user = await userRepository.findById(id_user);
    if (!user) throw new NotFoundError('El usuario');

    // La membresía es un PAGO ÚNICO: quien ya la tiene no tiene nada que volver
    // a comprar. Se corta acá, antes de armar la preference, para que nadie
    // pague dos veces por el mismo acceso. Un ADMIN no se toma como Pro por su
    // rol: su rol no sale de una membresía, así que puede contratarla igual.
    const active = await subscriptionService.getActive(id_user);
    if (active) {
      throw new BadRequestError('Ya tenés la membresía Pro activa: es un pago único.');
    }

    return paymentGateway.createPreference({
      title: `Musicboxd — Membresía ${plan.name}`,
      amount: plan.amount,
      externalReference: `${id_user}:${id_plan}`,
      payerEmail: user.email,
    });
  },

  /**
   * Confirma un pago contra MercadoPago y, si está aprobado, activa la membresía.
   *
   * Es el único lugar donde una membresía se vuelve efectiva, y lo llaman los dos
   * caminos de aviso (webhook y pantalla de retorno). Tres cuidados que lo hacen
   * seguro:
   *
   *  - NO confía en quien avisa. El aviso solo trae un id; el estado del pago se
   *    consulta contra MercadoPago con nuestro access token. Si no fuera así,
   *    cualquiera podría hacerse PRO mandando un POST inventado al webhook.
   *  - Es idempotente. Si el pago ya está registrado, no vuelve a activar nada;
   *    y aunque dos avisos entraran a la vez, el índice único de id_gateway
   *    haría fallar al segundo antes de duplicar la membresía.
   *  - Es todo o nada. La suscripción, el rol del usuario y el pago se guardan en
   *    una transacción.
   *
   * @param gatewayPaymentId id del pago en MercadoPago.
   * @returns si este llamado aplicó la membresía, y el estado informado.
   */
  async confirmPayment(gatewayPaymentId: string): Promise<ConfirmResult> {
    const payment = await paymentGateway.getPayment(gatewayPaymentId);

    if (!payment) {
      throw new NotFoundError('El pago informado');
    }

    // Un pago que se devolvió (reembolso o contracargo) tiene que sacar la
    // membresía que había dado; si no, alguien podría pagar, quedar PRO y pedir la
    // plata de vuelta.
    if (REVERSED_STATUSES.includes(payment.status)) {
      return paymentService.revokeReversed(payment.id, payment.status);
    }

    if (payment.status !== APPROVED_STATUS) {
      // Ni error ni activación: el pago existe pero no prosperó. La pantalla de
      // retorno usa este estado para explicarle al usuario qué pasó.
      return {
        applied: false,
        status: payment.status,
        message: 'El pago todavía no está aprobado, así que la membresía sigue igual.',
      };
    }

    // ¿Ya lo habíamos registrado? Pasa siempre que lleguen los dos avisos.
    const existing = await paymentRepository.findByGatewayId(payment.id);
    if (existing) {
      return {
        applied: false,
        status: payment.status,
        message: 'Este pago ya estaba registrado y la membresía ya estaba activa.',
      };
    }

    const { id_user, id_plan } = parseExternalReference(payment.externalReference);

    // La referencia sola no alcanza: cualquier pago aprobado en nuestra cuenta de
    // MercadoPago con el formato "x:y" activaría una membresía. Se exige además
    // que el plan exista y que se haya cobrado su precio, en nuestra moneda.
    const plan = await planRepository.findById(id_plan);
    if (!plan) throw new NotFoundError('El plan del pago');

    if (payment.currency !== env.mercadopago.currency || payment.amount < plan.amount) {
      throw new BadRequestError('El importe del pago no corresponde al precio del plan.');
    }

    await sequelize.transaction(async (t) => {
      // Activar crea la suscripción —sin vencimiento, porque es un pago único—
      // y deja al usuario como PRO. Todo eso vive en subscription.service, que
      // es el dueño de la regla "el rol refleja la suscripción vigente".
      const subscription = await subscriptionService.activate(id_user, id_plan, t);

      await paymentRepository.create(
        {
          // El importe que se guarda es el que COBRÓ la pasarela, no el precio
          // que tiene hoy el plan: si mañana cambia, el historial tiene que
          // seguir mostrando lo que se pagó en su momento.
          amount: payment.amount,
          state: 'approved',
          id_gateway: payment.id,
          id_subscription: subscription.id_subscription,
        },
        t
      );
    });

    return {
      applied: true,
      status: payment.status,
      message: '¡Listo! Tu membresía Pro quedó activa.',
    };
  },

  /**
   * Anula un pago que MercadoPago informó como devuelto y revoca la membresía
   * que había activado, todo en una transacción. Si el pago nunca se registró o
   * ya estaba anulado, no hace nada: el aviso puede llegar repetido.
   *
   * @param gatewayPaymentId id del pago en MercadoPago.
   * @param status estado informado ('refunded' o 'charged_back').
   */
  async revokeReversed(gatewayPaymentId: string, status: string): Promise<ConfirmResult> {
    const existing = await paymentRepository.findByGatewayId(gatewayPaymentId);

    if (!existing || existing.state !== 'approved') {
      return { applied: false, status, message: 'No había una membresía activa por este pago.' };
    }

    await sequelize.transaction(async (t) => {
      await paymentRepository.updateState(existing, 'cancelled', t);
      await subscriptionService.revoke(existing.id_subscription, t);
    });

    return { applied: true, status, message: 'El pago se devolvió y la membresía Pro se dio de baja.' };
  },

  /**
   * Historial de pagos de un usuario.
   * @param id_user usuario sacado del token.
   */
  async getMine(id_user: number): Promise<PublicPayment[]> {
    const payments = await paymentRepository.findAllByUser(id_user);
    return payments.map(toPublicPayment);
  },

  /**
   * Métricas del dashboard de administración: ventas de la membresía y usuarios
   * por plan. Solo ADMIN, que es lo que corta requireRole en la ruta.
   *
   * Todo sale de las tablas propias, así que un pago que entra por MercadoPago
   * aparece acá en la siguiente lectura, sin nada en el medio. Las tres
   * consultas son independientes y van en paralelo.
   *
   * @param year año elegido; sin él, el año en curso.
   */
  async adminStats(year?: number): Promise<PublicPaymentStats> {
    const [payments, roleCounts, proPaid] = await Promise.all([
      paymentRepository.findApprovedForStats(),
      userRepository.countActiveByRole(),
      subscriptionRepository.countActive(),
    ]);

    const currentYear = new Date().getFullYear();
    const selectedYear = year ?? currentYear;
    const yearPayments = payments.filter(
      (payment) => new Date(payment.payment_date).getFullYear() === selectedYear
    );

    const totalYear = sumAmounts(yearPayments);

    // Los tres roles siempre, aunque alguno no tenga cuentas: así el gráfico y su
    // leyenda no cambian de forma según los datos.
    const byRole = USER_ROLES.map((rol) => ({
      rol,
      count: roleCounts.find((row) => row.rol === rol)?.count ?? 0,
    }));
    const countOf = (rol: UserRole) => byRole.find((row) => row.rol === rol)?.count ?? 0;

    const totalUsers = byRole.reduce((total, row) => total + row.count, 0);
    // Los admin no compran: tienen todo por su rol. Contarlos en la base de la
    // conversión la bajaría sin que haya un cliente real detrás.
    const buyers = totalUsers - countOf('ADMIN');

    return {
      year: selectedYear,
      available_years: buildAvailableYears(payments, currentYear),
      revenue: {
        total_all_time: sumAmounts(payments),
        total_year: totalYear,
        sales_year: yearPayments.length,
        average_ticket: yearPayments.length ? roundMoney(totalYear / yearPayments.length) : 0,
      },
      monthly: buildMonthly(yearPayments),
      users: {
        total: totalUsers,
        by_role: byRole,
        pro_paid: proPaid,
        // Nunca negativo: si un ADMIN compró Pro, su membresía cuenta como paga
        // pero su rol no es PRO.
        pro_assigned: Math.max(countOf('PRO') - proPaid, 0),
        conversion: buyers > 0 ? Math.round((proPaid / buyers) * 1000) / 10 : 0,
      },
      recent_sales: payments.slice(0, RECENT_SALES_SIZE).map(toRecentSale),
    };
  },
};
