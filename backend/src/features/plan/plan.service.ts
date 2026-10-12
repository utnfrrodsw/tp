// Lógica de negocio de los planes de membresía: listado, ficha y cambio de precio.
// No conoce req ni res; recibe datos ya validados y lanza errores de negocio que
// traduce el errorHandler.
//
// Los planes son dos y fijos (Free y Pro, los crea el seed), así que no hay alta,
// baja ni cambio de nombre: el sistema busca el Pro por su nombre y la página /pro
// está armada para esos dos. Lo único editable es el precio del plan pago, y solo
// lo puede hacer un ADMIN, que es lo que corta requireRole en la ruta.
import { BadRequestError, NotFoundError } from '../../shared/errors/app-error';
import { planRepository, PlanWithSubscriptions } from './plan.repository';

/**
 * Vista pública de un plan: es lo que sale en el listado, en la ficha y en el
 * cambio de precio.
 *
 * `subscribers` es un conteo y no la lista de suscripciones: el panel de
 * administración lo muestra para saber cuánta gente compró cada plan. Devolver
 * quiénes son sería filtrar el padrón de usuarios en un endpoint público.
 */
type PublicPlan = {
  id_plan: number;
  name: string;
  amount: number;
  description: string | null;
  subscribers: number;
};

/**
 * Arma la vista pública de un plan.
 * @param plan plan de la base, con sus suscripciones si la consulta las trajo.
 */
function toPublicPlan(plan: PlanWithSubscriptions): PublicPlan {
  return {
    id_plan: plan.id_plan,
    name: plan.name,
    // El getter de la entidad ya lo devuelve como número: la columna es un
    // DECIMAL y sin él llegaría como string.
    amount: plan.amount,
    description: plan.description ?? null,
    subscribers: (plan.subscriptions ?? []).length,
  };
}

/**
 * Busca el plan por id o corta con 404 si no existe. La usan las operaciones que
 * reciben un :id en la URL.
 */
async function findExisting(id_plan: number): Promise<PlanWithSubscriptions> {
  const plan = await planRepository.findById(id_plan);
  if (!plan) throw new NotFoundError('El plan');
  return plan;
}

export const planService = {
  /** Lista los planes de membresía del sistema, del más barato al más caro. */
  async list(): Promise<PublicPlan[]> {
    const plans = await planRepository.findAll();
    return plans.map(toPublicPlan);
  },

  /** Ficha de un plan puntual. */
  async getById(id_plan: number): Promise<PublicPlan> {
    const plan = await findExisting(id_plan);
    return toPublicPlan(plan);
  },

  /**
   * Cambia el precio de un plan pago.
   *
   * Cambiar el monto NO afecta a las suscripciones ya cobradas: cada pago quedó
   * registrado en PAYMENTS con el importe que se cobró en ese momento (ver
   * payment.entity.ts). El monto del plan es el precio de la próxima
   * contratación, no el de las anteriores.
   *
   * @param id_plan plan a modificar.
   * @param amount precio nuevo, ya validado (mayor a cero).
   * @throws 400 si el plan es el gratuito: ponerle precio lo convertiría en otro
   *   plan pago, que la página de venta no sabe mostrar.
   */
  async updatePrice(id_plan: number, amount: number): Promise<PublicPlan> {
    const plan = await findExisting(id_plan);

    if (plan.amount <= 0) {
      throw new BadRequestError(`El plan "${plan.name}" es gratuito: su precio no se modifica.`);
    }

    const updated = await planRepository.updateAmount(plan, amount);
    return toPublicPlan(updated);
  },
};
