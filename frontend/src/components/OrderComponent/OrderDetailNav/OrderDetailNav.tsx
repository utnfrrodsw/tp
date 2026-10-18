import { CreditCard } from "lucide-react";
import type { Order, EnumOrderStatus, EnumBudgetStatus } from "@/types/types";
import { formatDate, formatDocumentNumber } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import styles from "./OrderDetailNav.module.css";

// Mismo criterio de tono que venimos usando en OrderCard/OrderDirectory.
const STATUS_META: Record<EnumOrderStatus, { label: string; tone: 'info' | 'warning' | 'success' | 'danger' }> = {
  recibido:      { label: 'Recibido',           tone: 'info' },
  diagnostico:   { label: 'En diagnóstico',     tone: 'warning' },
  presupuestado: { label: 'Presupuestado',      tone: 'info' },
  aprobado:      { label: 'Aprobado',           tone: 'warning' },
  reparacion:    { label: 'En reparación',      tone: 'warning' },
  listo:         { label: 'Listo para retirar', tone: 'success' },
  entregado:     { label: 'Entregado',          tone: 'success' },
  cancelado:     { label: 'Cancelado',          tone: 'danger' },
};

const BUDGET_STATUS_META: Record<EnumBudgetStatus, { label: string; tone: 'info' | 'warning' | 'success' | 'danger' }> = {
  pendiente: { label: 'Presupuesto: pendiente', tone: 'warning' },
  aprobado:  { label: 'Presupuesto: aprobado',  tone: 'success' },
  rechazado: { label: 'Presupuesto: rechazado', tone: 'danger' },
};

// Heurística para el pill del medio: cuando la orden está en diagnóstico
// pero ya hay un presupuesto pendiente cargado, mostramos un estado
// compuesto en vez de solo "En diagnóstico". Si no se da ese caso puntual,
// se muestra la etiqueta simple de siempre.
function getOrderStatusLabel(order: Order): { label: string; tone: 'info' | 'warning' | 'success' | 'danger' } | null {
  if (!order.status) return null;

  if (order.status === 'diagnostico' && order.budget?.status === 'pendiente') {
    return { label: 'En diagnóstico / Presupuestando', tone: 'warning' };
  }

  return STATUS_META[order.status];
}

export interface OrderDetailNavProps {
  order: Order;
  /**
   * Texto descriptivo debajo del equipo (ej: resumen de fallas). No hay
   * un campo dedicado para esto en el schema — si no se pasa, esa parte
   * del título no se muestra.
   */
  subtitle?: string;
  /**
   * IMEI del equipo. Tu modelo Equipment actual no tiene este campo:
   * pasalo desde donde lo tengas guardado (observations, otra tabla,
   * etc.) hasta que decidas si conviene agregarlo al schema.
   */
  imei?: string;
}

const OrderDetailNav = ({ order, subtitle, imei }: OrderDetailNavProps) => {
  const equipmentLabel = order.equipment
    ? `${order.equipment.brand ?? ''} ${order.equipment.model ?? ''}`.trim()
    : `Equipo #${order.id_equipment}`;

  const clientLabel = order.equipment?.client?.clientName ?? 'Sin cliente';
  const entryDate = formatDate(order.dateOfEntry, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const orderStatus = getOrderStatusLabel(order);
  const budgetStatus = order.budget ? BUDGET_STATUS_META[order.budget.status] : null;
  const navigate = useNavigate();
  return (
    <div className={styles.wrap}>
      <div className={styles.main}>
        <div className={styles.pillsRow}>
          <span className={`${styles.pill} ${styles.info}`}>
            ORDEN {formatDocumentNumber('ORD', order.nroOrder)}
          </span>

          {orderStatus && (
            <span className={`${styles.pill} ${styles[orderStatus.tone]}`}>
              {orderStatus.label}
            </span>
          )}

          {budgetStatus && (
            <span className={`${styles.pill} ${styles[budgetStatus.tone]}`}>
              {budgetStatus.label}
            </span>
          )}
        </div>

        <h1 className={styles.title}>
          {equipmentLabel}
          {subtitle && <span className={styles.titleSeparator}> — {subtitle}</span>}
        </h1>

        <div className={styles.metaRow}>
          <span className={styles.metaItem}>
            <span className={styles.metaLabel}>Cliente</span>
            {clientLabel}
          </span>

          {imei && (
            <span className={styles.metaItem}>
              <span className={styles.metaLabel}>IMEI</span>
              {imei}
            </span>
          )}

          {entryDate && (
            <span className={styles.metaItem}>
              <span className={styles.metaLabel}>Ingreso</span>
              {entryDate}
            </span>
          )}
        </div>
      </div>

      {order.budget && (
        <div className={styles.budgetCard}>
          <span className={styles.budgetIcon}>
            <CreditCard size={18} />
          </span>
          <div className={styles.budgetInfo} role="button" onClick={() => {if (!order.budget?.id_budget) return;navigate(`/showBudget/${order.budget.id_budget}`);}}>
            <span className={styles.budgetLabel}>ID Presupuesto</span>
            <span className={styles.budgetCode}>
              {formatDocumentNumber('PRE', order.budget.nroBudget, {
                includeYear: true,
                date: order.dateOfEntry,
                padLength: 4,
              })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailNav;