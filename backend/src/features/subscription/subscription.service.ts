// Lógica de negocio de las membresías: cuál es la vigente de un usuario y cómo se
// activa una nueva. No conoce req ni res.
//
// La membresía Pro es un PAGO ÚNICO: se paga una vez y el acceso no vence. Eso
// saca del circuito el vencimiento (no hay nada que expire) y la renovación (no
// hay nada que renovar), y deja la baja en manos del ADMIN, que la aplica
// cambiándole el rol al usuario desde el CRUD de usuarios.
//
// Este service es el ÚNICO lugar donde cambia el rol de un usuario por motivos de
// membresía. La regla que sostiene todo el circuito es:
//
//   el rol del usuario refleja su suscripción vigente.
//
// Por eso activar una suscripción y cambiar el rol van siempre juntos y dentro de
// una transacción: si se guardara solo una de las dos cosas, quedaría un Pro sin
// suscripción o un Free que pagó.
//
// El rol ADMIN queda afuera de esa regla: no se compra ni se pierde con una
// membresía, se asigna desde el seed o desde el panel. Un ADMIN puede tener una
// suscripción como cualquiera, pero su rol no lo determina ella.
import { Transaction } from 'sequelize';
import { NotFoundError } from '../../shared/errors/app-error';
import { SubscriptionState, UserRole } from '../../shared/types/enums';
import { planRepository, PlanWithSubscriptions } from '../plan/plan.repository';
import { subscriptionRepository, SubscriptionWithPlan } from './subscription.repository';
import { ListSubscriptionsQuery } from './subscription.schema';

/**
 * Nombre del plan pago. El id NO se hardcodea porque depende de en qué orden se
 * corrió el seed; el nombre, en cambio, es parte del modelo de negocio y tiene un
 * índice único que garantiza que haya uno solo.
 */
export const PRO_PLAN_NAME = 'Pro';

/** Vista pública de una suscripción: es lo que sale en el perfil y en el panel. */
type PublicSubscription = {
  id_subscription: number;
  plan: { id_plan: number; name: string; amount: number } | null;
  /**
   * null solo en la suscripción "genérica" que arma getMine() para un PRO
   * asignado a mano por un admin: no hay ninguna fila real, así que tampoco hay
   * una fecha de alta que mostrar. El frontend la usa para distinguir una
   * membresía comprada de un Pro asignado a mano.
   */
  subscription_date: Date | null;
  end_date: Date | null;
  state: SubscriptionState;
  /** El usuario dueño de la suscripción. Solo lo llena el listado de ADMIN. */
  user?: { id_user: number; username: string; email: string } | null;
};

/**
 * "Mi membresía": la vigente y todo el historial.
 * `current` es null en un usuario que nunca contrató nada, que es el caso de
 * cualquiera recién registrado.
 */
type MyMembership = {
  current: PublicSubscription | null;
  history: PublicSubscription[];
};

/** Arma la vista pública de una suscripción. */
function toPublicSubscription(subscription: SubscriptionWithPlan): PublicSubscription {
  return {
    id_subscription: subscription.id_subscription,
    plan: subscription.plan
      ? {
          id_plan: subscription.plan.id_plan,
          name: subscription.plan.name,
          // El getter de la entidad ya lo devuelve como número: la columna es un
          // DECIMAL y sin él llegaría como string.
          amount: subscription.plan.amount,
        }
      : null,
    subscription_date: subscription.subscription_date,
    end_date: subscription.end_date ?? null,
    state: subscription.state,
    ...(subscription.user && {
      user: {
        id_user: subscription.user.id_user,
        username: subscription.user.username,
        email: subscription.user.email,
      },
    }),
  };
}

/**
 * Suscripción "genérica" para un usuario PRO por rol que no tiene ninguna fila
 * real en `subscription` (se lo asignó un admin a mano desde el CRUD de
 * usuarios, en vez de salir de un pago). Sin esto, el panel de membresía lo
 * mostraría como Free a pesar de que sus beneficios Pro ya están activos.
 *
 * Lleva el plan Pro real (nombre y monto), pero ninguna fecha: no hay alta ni
 * vencimiento reales que mostrar, y no se inventan.
 */
async function buildRoleOnlyProSubscription(): Promise<PublicSubscription> {
  const plan = await subscriptionService.getProPlan();
  return {
    id_subscription: 0,
    plan: { id_plan: plan.id_plan, name: plan.name, amount: plan.amount },
    subscription_date: null,
    end_date: null,
    state: 'active',
  };
}

export const subscriptionService = {
  /**
   * La membresía vigente de un usuario.
   *
   * Con el pago único no hay vencimiento que aplicar: una membresía activa lo
   * sigue siendo hasta que un ADMIN la dé de baja. La lectura es, entonces, una
   * lectura y nada más.
   *
   * @param id_user usuario dueño de la membresía, sacado del token.
   * @returns la suscripción vigente, o null si no tiene ninguna.
   */
  async getActive(id_user: number): Promise<SubscriptionWithPlan | null> {
    return subscriptionRepository.findActiveByUser(id_user);
  },

  /**
   * "Mi membresía": la vigente más el historial completo.
   * @param id_user usuario sacado del token.
   * @param currentRole rol actual, para resolver el caso del PRO asignado a mano.
   */
  async getMine(id_user: number, currentRole: UserRole): Promise<MyMembership> {
    const current = await subscriptionService.getActive(id_user);
    const history = await subscriptionRepository.findAllByUser(id_user);

    return {
      // Sin fila real: si el rol es PRO igual (asignado a mano por un admin), se
      // arma la genérica en vez de mostrarlo como Free. Ver
      // buildRoleOnlyProSubscription().
      current: current
        ? toPublicSubscription(current)
        : currentRole === 'PRO'
          ? await buildRoleOnlyProSubscription()
          : null,
      history: history.map(toPublicSubscription),
    };
  },

  /**
   * Activa la membresía de un usuario y lo deja como PRO.
   *
   * Es el corazón del CUU de upgrade, y lo llama el circuito de pago una vez que
   * la pasarela confirmó la operación. Recibe la transacción desde afuera porque
   * el pago se registra en la misma: o queda todo (suscripción + rol + pago) o no
   * queda nada.
   *
   * La suscripción nace SIN `end_date`: es un pago único y el acceso no vence.
   *
   * Si quedara una suscripción anterior activa, se pasa a 'cancelled' dentro de
   * la misma transacción. Es lo que garantiza que haya UNA SOLA activa por
   * usuario: MySQL no soporta índices únicos parciales, así que esa regla no la
   * puede sostener la base y la tiene que sostener este código (ver la nota en
   * subscription.entity.ts). Con el pago único ese caso solo se da si un ADMIN
   * bajó al usuario a FREE y este volvió a comprar.
   *
   * @param id_user usuario que contrató.
   * @param id_plan plan contratado.
   * @param transaction la transacción abierta por quien llama.
   * @returns la suscripción recién activada.
   */
  async activate(
    id_user: number,
    id_plan: number,
    transaction: Transaction
  ): Promise<SubscriptionWithPlan> {
    const previous = await subscriptionRepository.findActiveByUser(id_user, transaction);
    if (previous) {
      await subscriptionRepository.updateState(previous, 'cancelled', transaction);
    }

    const subscription = await subscriptionRepository.create({ id_user, id_plan }, transaction);

    await subscriptionRepository.updateUserRole(id_user, 'PRO', transaction);

    return subscription;
  },

  /**
   * Cancela la suscripción activa de un usuario, sin tocar su rol. No hace nada
   * si no tiene ninguna (el caso del PRO asignado a mano, sin fila real).
   *
   * La usa userService.update cuando un ADMIN le cambia el rol a FREE a un
   * usuario que era PRO: mantiene sincronizada la fila de subscription con el
   * rol nuevo, dentro de la misma transacción. Es el ÚNICO camino a una baja:
   * con el pago único el usuario no puede darse de baja solo (no habría nada que
   * ganar, porque el acceso ya está pago y no se reembolsa) y la membresía
   * tampoco vence por sí misma.
   *
   * No valida quién pide la baja: ese chequeo (ser ADMIN) ya lo hizo userService
   * antes de llamarla.
   */
  async cancelForUser(id_user: number, transaction: Transaction): Promise<void> {
    const active = await subscriptionRepository.findActiveByUser(id_user, transaction);
    if (active) {
      await subscriptionRepository.updateState(active, 'cancelled', transaction);
    }
  },

  /**
   * Revoca la membresía que pagó un pago reembolsado o contracargado: cancela la
   * suscripción y devuelve al usuario a FREE (un ADMIN conserva su rol, ver
   * subscriptionRepository.updateUserRole).
   *
   * Sin esto, alguien podría pagar, quedar PRO, pedir la devolución de la plata y
   * seguir siendo PRO para siempre, porque el acceso no vence.
   *
   * @param id_subscription suscripción que había activado el pago.
   * @param transaction la transacción abierta por quien llama.
   */
  async revoke(id_subscription: number, transaction: Transaction): Promise<void> {
    const subscription = await subscriptionRepository.findById(id_subscription, transaction);
    if (!subscription || subscription.state !== 'active') return;

    await subscriptionRepository.updateState(subscription, 'cancelled', transaction);
    await subscriptionRepository.updateUserRole(subscription.id_user, 'FREE', transaction);
  },

  /**
   * Listado de todas las suscripciones del sistema. Solo ADMIN, que es lo que
   * corta requireRole en la ruta.
   * @param filters id_user y state que hayan llegado por query string.
   */
  async list(filters: ListSubscriptionsQuery): Promise<PublicSubscription[]> {
    const subscriptions = await subscriptionRepository.findAll({
      id_user: filters.id_user,
      state: filters.state,
    });

    return subscriptions.map(toPublicSubscription);
  },

  /**
   * Busca el plan Pro por su nombre. Lo usa el checkout para saber qué se está
   * cobrando sin tener el id hardcodeado.
   * @throws 404 si el seed de planes no se corrió.
   */
  async getProPlan(): Promise<PlanWithSubscriptions> {
    const plan = await planRepository.findByName(PRO_PLAN_NAME);

    if (!plan) {
      throw new NotFoundError(
        `El plan "${PRO_PLAN_NAME}". Hay que correr el seed de planes (npm run seed:plans)`
      );
    }

    return plan;
  },
};
