// Sección "Planes" del panel de administración: lista los planes de membresía y
// permite cambiar el precio del plan pago, que es lo único editable de un plan.
//
// Los planes son dos y fijos (Free y Pro, los crea el seed): el sistema busca el
// Pro por su nombre y la página /pro está armada para esos dos, así que no hay
// alta, baja ni cambio de nombre o descripción. El backend lo restringe igual.
//
// Concentra el estado y las llamadas a la API, y delega el dibujo en PlanForm y
// PlanAdminTable. Vive en la feature membership y no en la feature user para que
// el panel (AdminPage) solo tenga que montarla, igual que GenreAdminSection.
import { useState } from 'react';
import { Alert } from '../../../../core/components/Alert';
import { Card } from '../../../../core/components/Card';
import { FormModal } from '../../../../core/components/FormModal';
import { RefreshableBody } from '../../../../core/components/RefreshableBody';
import { useFetch } from '../../../../core/hooks/useFetch';
import { getErrorMessage } from '../../../../core/utils/errorHandler';
import { membershipService } from '../../services/membershipService';
import type { Plan } from '../../models/Membership';
import { PlanForm } from '../PlanForm';
import { PlanAdminTable } from '../PlanAdminTable';
import './PlanAdminSection.scss';

/**
 * Pasa el precio de un plan al texto que muestra el campo, con el punto como
 * separador decimal, que es lo que la API espera de vuelta. Los centavos se
 * escriben completos: 1750.5 se muestra "1750.50", porque "1750.5" se lee como
 * otro precio.
 *
 * @param plan plan que se está editando.
 */
function toAmountText(plan: Plan): string {
  return Number.isInteger(plan.amount) ? String(plan.amount) : plan.amount.toFixed(2);
}

export const PlanAdminSection = () => {
  const { data, isLoading, error, reload: loadPlans } = useFetch(() =>
    membershipService.listPlans()
  );
  const plans = data ?? [];

  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Plan al que se le está cambiando el precio: si es null, el modal está cerrado.
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  // Error del guardado. Se muestra DENTRO del modal: afuera quedaría tapado por
  // el propio formulario.
  const [formError, setFormError] = useState<string | null>(null);

  /** Abre el modal para cambiar el precio de un plan. */
  const handleEditPrice = (plan: Plan) => {
    setEditingPlan(plan);
    setFormError(null);
    setFeedback(null);
  };

  /** Guarda el precio nuevo y recarga la tabla. Devuelve si salió bien. */
  const handleSubmit = async (amount: number): Promise<boolean> => {
    if (!editingPlan) return false;

    setIsSubmitting(true);
    setFormError(null);

    try {
      await membershipService.updatePlanPrice(editingPlan.id, amount);
      // Cambiar el precio no toca lo ya cobrado: cada pago quedó registrado con
      // el importe del momento. Se aclara acá porque es lo primero que se
      // pregunta al editar un plan que ya tiene suscriptores.
      setFeedback(
        `Se actualizó el precio de "${editingPlan.name}". Rige para las próximas compras: los pagos ya registrados no se modifican.`
      );
      await loadPlans();
      setEditingPlan(null);
      return true;
    } catch (err) {
      // El modal queda abierto con el precio escrito, para poder corregirlo.
      setFormError(getErrorMessage(err));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // La Card exterior es la que le da el marco al panel, igual que en
    // AdminMusicPanel y AdminUsersPanel. No es decorativa: los campos del
    // formulario tienen el mismo color que el fondo de la página, así que sin
    // este fondo más claro detrás se vuelven invisibles.
    <Card
      title="Planes de membresía"
      subtitle="Precio de los planes que se ofrecen en la página Pro."
    >
      <div className="plan-admin">
        {error && <Alert tone="error">{error}</Alert>}
        {feedback && <Alert tone="success">{feedback}</Alert>}

        <RefreshableBody
          isLoading={isLoading}
          loadingMessage="Cargando planes..."
          isEmpty={plans.length === 0}
          empty={
            <p className="plan-admin__empty">
              No hay planes cargados. Se crean con el seed: npm run seed:plans.
            </p>
          }
        >
          <PlanAdminTable plans={plans} onEditPrice={handleEditPrice} />
        </RefreshableBody>

        {/* La key remonta el formulario al pasar de un plan a otro, para que
            arranque con el precio del plan elegido. */}
        <FormModal
          isOpen={editingPlan !== null}
          title={editingPlan ? `Precio de "${editingPlan.name}"` : ''}
          error={formError}
          isBusy={isSubmitting}
          onClose={() => setEditingPlan(null)}
        >
          {editingPlan && (
            <PlanForm
              key={editingPlan.id}
              initialAmount={toAmountText(editingPlan)}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
              onCancel={() => setEditingPlan(null)}
            />
          )}
        </FormModal>
      </div>
    </Card>
  );
};
