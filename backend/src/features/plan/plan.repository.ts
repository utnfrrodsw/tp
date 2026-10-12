// Acceso a datos de la feature plan: consultas a la tabla plan. Es la única capa
// que habla con Sequelize.
import { Plan, Subscription } from '../../entities';
import { SubscriptionState } from '../../shared/types/enums';

/**
 * Suscripción reducida a lo mínimo: alcanza para contar cuántos usuarios compró
 * cada plan, que es lo que muestra el panel de administración.
 */
export type PlanSubscription = {
  id_subscription: number;
  state: SubscriptionState;
};

/**
 * Plan tal como sale de este repositorio: con las suscripciones que lo apuntan,
 * cuando la consulta las trajo.
 *
 * `subscriptions` no está declarada en plan.entity.ts porque las entidades son
 * compartidas por todas las features y no se tocan desde una sola. Se la agrega
 * acá, que es la capa que sabe cómo está armada la consulta.
 */
export type PlanWithSubscriptions = Plan & {
  subscriptions?: PlanSubscription[];
};

// Las suscripciones viajan con cada plan para poder contar sus suscriptores. Se
// piden solo dos columnas: traer las suscripciones enteras sería arrastrar todo
// el padrón sin usarlo.
const subscriptionsInclude = {
  model: Subscription,
  as: 'subscriptions',
  attributes: ['id_subscription', 'state'],
};

export const planRepository = {
  // Ordenados por monto: deja el Free primero y el Pro después, que es el orden
  // en el que la página de venta muestra las tarjetas.
  findAll: async (): Promise<PlanWithSubscriptions[]> => {
    const plans = await Plan.findAll({
      include: [subscriptionsInclude],
      order: [['amount', 'ASC']],
    });

    return plans as PlanWithSubscriptions[];
  },

  findById: async (id_plan: number): Promise<PlanWithSubscriptions | null> => {
    const plan = await Plan.findByPk(id_plan, {
      include: [subscriptionsInclude],
    });

    return plan as PlanWithSubscriptions | null;
  },

  // Busca un plan por su nombre exacto. Lo usa el checkout para resolver cuál es
  // el plan Pro sin tener su id hardcodeado en el código.
  findByName: async (name: string): Promise<PlanWithSubscriptions | null> => {
    const plan = await Plan.findOne({ where: { name } });
    return plan as PlanWithSubscriptions | null;
  },

  /** Guarda el precio nuevo de un plan. */
  updateAmount: async (
    plan: PlanWithSubscriptions,
    amount: number
  ): Promise<PlanWithSubscriptions> => {
    // update() devuelve la misma instancia, así que conserva lo que ya había
    // traído el include.
    await plan.update({ amount });
    return plan;
  },
};
