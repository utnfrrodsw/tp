import { type Order, type Status_History, type EnumOrderStatus } from "@/types/types";
import styles from './OrderMiniCard.module.css';
import { formatDocumentNumber, formatDate} from "@/lib/utils";

const STATUS_CONFIG: Record<EnumOrderStatus, { label: string; className: string }> = {
  recibido:      { label: 'Recibido',      className: 'pending' },
  diagnostico:   { label: 'Diagnóstico',   className: 'inProgress' },
  presupuestado: { label: 'Presupuestado', className: 'quoted' },
  aprobado:      { label: 'Aprobado',      className: 'approved' },
  reparacion:    { label: 'Reparación',    className: 'inProgress' },
  listo:         { label: 'Listo',         className: 'resolved' },
  entregado:     { label: 'Entregado',     className: 'delivered' },
  cancelado:     { label: 'Cancelado',     className: 'cancelled' },
};

export interface OrderMiniCardProps {
  order: Order;
  onClick?: (id_order: string) => void;
}


const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);

// Busca el status_history cuya fecha esté más cerca de "ahora" (no necesariamente el último por orden de array)
const getCurrentStatus = (history?: Status_History[]): Status_History | null => {
  if (!history || history.length === 0) return null;

  const now = Date.now();

  return history.reduce((closest, current) => {
    const closestDiff = Math.abs(new Date(closest.dateOfChange).getTime() - now);
    const currentDiff = Math.abs(new Date(current.dateOfChange).getTime() - now);
    return currentDiff < closestDiff ? current : closest;
  });
};

const OrderMiniCard = ({ order, onClick }: OrderMiniCardProps) => {
  const clickable = typeof onClick === 'function';

  const currentStatus = getCurrentStatus(order.statusHistory);
  const statusInfo = currentStatus
    ? STATUS_CONFIG[currentStatus.status]
    : { label: 'Sin estado', className: 'pending' };

  const equipmentLabel = order.equipment
    ? `${order.equipment.brand ?? ''} ${order.equipment.model ?? ''}`.trim()
    : `Equipo #${order.id_equipment}`;

  const clientLabel = order.user?.userName;
  const hasAmount = order.totalCharged !== null && order.totalCharged !== undefined;

  return (
    <div
      className={`${styles.card} ${clickable ? styles.clickable : ''}`}
      onClick={clickable ? () => onClick!(order.id_order) : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <span className={styles.orderId} title={String(order.nroOrder)}>{formatDocumentNumber("ORD",order.nroOrder)}</span>
          <span className={styles.equipment} title={equipmentLabel}>{equipmentLabel}</span>
        </div>
        <span className={`${styles.badge} ${styles[statusInfo.className]}`}>
          {statusInfo.label}
        </span>
      </div>

      {order.observations && (
        <p className={styles.failure}>{order.observations}</p>
      )}

      <div className={styles.footer}>
        <div className={styles.footerLeft}>
          {clientLabel && <span className={styles.client}>{clientLabel}</span>}
          <span className={styles.date}>{formatDate(order.dateOfEntry)}</span>
        </div>
        {hasAmount && (
          <span className={styles.amount}>{formatCurrency(order.totalCharged as number)}</span>
        )}
      </div>
    </div>
  );
};

export default OrderMiniCard;