// Acceso a datos de la feature subscription: consultas a la tabla subscription
// para la membresía de cada usuario. Es la única capa que habla con Sequelize.
//
// Varios métodos reciben una `transaction` opcional. La necesita el circuito de
// pago: cancelar la membresía anterior, crear la nueva y subir el rol del usuario
// tienen que pasar todas juntas o ninguna (ver subscription.service.activate).
import { Op, Transaction } from 'sequelize';
import { Plan, Subscription, User } from '../../entities';
import { SubscriptionState, UserRole } from '../../shared/types/enums';

/** Plan de una suscripción, reducido a lo que se muestra en la pantalla. */
export type SubscriptionPlan = {
  id_plan: number;
  name: string;
  amount: number;
};

/** Usuario de una suscripción. Solo lo trae el listado de administración. */
export type SubscriptionUser = {
  id_user: number;
  username: string;
  email: string;
};

/**
 * Suscripción tal como sale de este repositorio, con el plan al que apunta y,
 * en el listado de administración, con su usuario.
 *
 * Ninguna de las dos está declarada en subscription.entity.ts porque las
 * entidades son compartidas por todas las features y no se tocan desde una sola.
 * Se agregan acá, que es la capa que sabe cómo está armada la consulta.
 */
export type SubscriptionWithPlan = Subscription & {
  plan?: SubscriptionPlan;
  user?: SubscriptionUser;
};

/** Datos del alta de una suscripción. */
type CreateSubscriptionData = {
  id_user: number;
  id_plan: number;
  /**
   * Fecha de vencimiento. Se omite —queda NULL— en una membresía que no vence,
   * que hoy es siempre: el plan Free no vence y el Pro es un pago único.
   */
  end_date?: Date | null;
};

/** Filtros del listado de administración. */
type SubscriptionFilters = {
  id_user?: number;
  state?: SubscriptionState;
};

// El plan viaja siempre con la suscripción: sin él, "tu membresía" sería un id y
// una fecha. Se piden solo tres columnas porque la descripción del plan es para
// la página de venta, no para el detalle de la membresía.
const planInclude = {
  model: Plan,
  as: 'plan',
  attributes: ['id_plan', 'name', 'amount'],
};

// El usuario solo lo trae el listado de administración, que es una tabla de
// "quién está suscripto a qué". En "mi membresía" sería redundante: el usuario es
// el del token.
const userInclude = {
  model: User,
  as: 'user',
  attributes: ['id_user', 'username', 'email'],
};

export const subscriptionRepository = {
  /**
   * La membresía vigente de un usuario, o null si no tiene ninguna activa.
   *
   * Es la consulta más frecuente del sistema y la resuelve el índice
   * ix_subscription_user_state declarado en la entidad.
   */
  findActiveByUser: async (
    id_user: number,
    transaction?: Transaction
  ): Promise<SubscriptionWithPlan | null> => {
    const subscription = await Subscription.findOne({
      where: { id_user, state: 'active' },
      include: [planInclude],
      transaction,
    });

    return subscription as SubscriptionWithPlan | null;
  },

  /**
   * Todas las suscripciones de un usuario, de la más nueva a la más vieja.
   * Es el historial de membresías que se muestra en el perfil.
   */
  findAllByUser: async (id_user: number): Promise<SubscriptionWithPlan[]> => {
    const subscriptions = await Subscription.findAll({
      where: { id_user },
      include: [planInclude],
      order: [['subscription_date', 'DESC']],
    });

    return subscriptions as SubscriptionWithPlan[];
  },

  /** Listado de administración, con el usuario y el plan de cada suscripción. */
  findAll: async (filters: SubscriptionFilters = {}): Promise<SubscriptionWithPlan[]> => {
    const subscriptions = await Subscription.findAll({
      // Los filtros que no vinieron quedan en undefined, y Sequelize los ignora:
      // sin ninguno, el where es "todas".
      where: {
        ...(filters.id_user !== undefined && { id_user: filters.id_user }),
        ...(filters.state !== undefined && { state: filters.state }),
      },
      include: [planInclude, userInclude],
      order: [['subscription_date', 'DESC']],
    });

    return subscriptions as SubscriptionWithPlan[];
  },

  /**
   * Cuántas membresías activas hay en total. Como una membresía solo nace de un
   * pago, es la cantidad de usuarios que compraron Pro y lo conservan (los Pro
   * asignados a mano por un admin no tienen fila).
   */
  countActive: (): Promise<number> => Subscription.count({ where: { state: 'active' } }),

  create: async (
    data: CreateSubscriptionData,
    transaction?: Transaction
  ): Promise<SubscriptionWithPlan> => {
    const subscription = await Subscription.create(
      {
        id_user: data.id_user,
        id_plan: data.id_plan,
        end_date: data.end_date ?? null,
        state: 'active',
      },
      { transaction }
    );

    return subscription as SubscriptionWithPlan;
  },

  /** Cambia el estado de una suscripción (hoy, siempre a 'cancelled'). */
  updateState: async (
    subscription: SubscriptionWithPlan,
    state: SubscriptionState,
    transaction?: Transaction
  ): Promise<SubscriptionWithPlan> => {
    await subscription.update({ state }, { transaction });
    return subscription;
  },

  /**
   * Cambia el rol de un usuario.
   *
   * Es la tabla `users`, que es de otra feature, y aun así vive acá a propósito:
   * el rol y la suscripción son dos caras del mismo hecho ("este usuario es Pro")
   * y tienen que cambiar dentro de la misma transacción. Si esta escritura
   * estuviera en el repositorio de user, la transacción tendría que cruzar el
   * límite de dos features y cualquier corte dejaría a alguien pagando un plan
   * cuyos beneficios no tiene, o al revés.
   *
   * Nunca toca a un ADMIN: su rol no sale de una membresía (ver
   * subscription.service). Sin este filtro, un ADMIN que comprara Pro quedaría
   * degradado a PRO, y uno que pidiera el reembolso, a FREE.
   */
  updateUserRole: async (
    id_user: number,
    rol: UserRole,
    transaction?: Transaction
  ): Promise<void> => {
    await User.update({ rol }, { where: { id_user, rol: { [Op.ne]: 'ADMIN' } }, transaction });
  },

  /** Busca una suscripción por su id, o null si no existe. */
  findById: async (
    id_subscription: number,
    transaction?: Transaction
  ): Promise<SubscriptionWithPlan | null> => {
    const subscription = await Subscription.findByPk(id_subscription, { transaction });
    return subscription as SubscriptionWithPlan | null;
  },
};
