import type { Order, Status_History, EnumOrderStatus } from "@/types/types";
import styles from './OrderCard.module.css'
import {  formatDate, formatDocumentNumber } from "@/lib/utils"
export interface OrderCardProps {
  order: Order;
  onClick?: (id_order: string) => void;
}

const STATUS_META: Record<EnumOrderStatus, { label: string; tone: 'info' | 'warning' | 'success' | 'danger' }> = {
  recibido:      { label: 'Recibido',         tone: 'info' },
  diagnostico:   { label: 'En diagnóstico',    tone: 'warning' },
  presupuestado: { label: 'Presupuestado',     tone: 'info' },
  aprobado:      { label: 'Aprobado',          tone: 'warning' },
  reparacion:    { label: 'En reparación',     tone: 'warning' },
  listo:         { label: 'Listo para retirar',tone: 'success' },
  entregado:     { label: 'Entregado',         tone: 'success' },
  cancelado:     { label: 'Cancelado',         tone: 'danger' },
};

function getLatestStatus(history?: Status_History[]) {
  if (!history || history.length === 0) return null;
  return [...history].sort(
    (a, b) => new Date(b.dateOfChange).getTime() - new Date(a.dateOfChange).getTime()
  )[0];
}


function formatMoney(value?: number | null) {
  if (value === null || value === undefined) return null;
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);
}

const OrderCard = ({ order, onClick }: OrderCardProps) => {
  const equipmentLabel = order.equipment
    ? `${order.equipment.brand ?? ''} ${order.equipment.model ?? ''}`.trim()
    : `Equipo #${order.id_equipment}`;

  const equipmentType = order.equipment?.tipo_equipment;
  const clientLabel = order.user?.userName ?? 'Sin asignar';
  const clickable = typeof onClick === 'function';

  const latestStatus = getLatestStatus(order.statusHistory);
  const statusMeta = latestStatus ? STATUS_META[latestStatus.status] : null;

  const isDelivered = Boolean(order.deliveryDate);
  const isOverdue =
    !isDelivered &&
    Boolean(order.estimatedDate) &&
    new Date(order.estimatedDate!).getTime() < Date.now();

  const entryDate = formatDate(order.dateOfEntry);
  const estimatedDate = formatDate(order.estimatedDate);
  const total = formatMoney(order.totalCharged);

  return (
    <div
      className={`${styles.card} ${clickable ? styles.clickable : ''}`}
      onClick={clickable ? () => onClick!(order.id_order) : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      <div className={styles.stub}>
        <span className={styles.stubLabel}>ORDEN</span>
        <span className={styles.stubNumber}>#{formatDocumentNumber("ORD",order.nroOrder,{includeYear:true, date: order.dateOfEntry, padLength:3})}</span>
      </div>

      <div className={styles.divider} />

      <div className={styles.body}>
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <span className={styles.equipment}>{equipmentLabel}</span>
            {equipmentType && <span className={styles.equipmentType}>{equipmentType}</span>}
          </div>

          {statusMeta && (
            <span className={`${styles.statusPill} ${styles[statusMeta.tone]}`}>
              <span className={styles.statusDot} />
              {statusMeta.label}
            </span>
          )}
        </div>

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <span className={styles.metaLabel}>Cliente</span>
            {clientLabel}
          </span>

          <span className={styles.metaItem}>
            <span className={styles.metaLabel}>Ingreso</span>
            {entryDate ?? '—'}
          </span>

          {estimatedDate && (
            <span className={`${styles.metaItem} ${isOverdue ? styles.overdue : ''}`}>
              <span className={styles.metaLabel}>{isOverdue ? 'Vencido' : 'Estimado'}</span>
              {estimatedDate}
            </span>
          )}

          {total && (
            <span className={styles.metaItem}>
              <span className={styles.metaLabel}>Total</span>
              {total}
            </span>
          )}
        </div>

        {latestStatus?.comment && (
          <p className={styles.comment}>“{latestStatus.comment}”</p>
        )}
      </div>

      {order.equipmentPhotoUrl && (
        <div className={styles.photoWrap}>
          <img src={order.equipmentPhotoUrl} alt={equipmentLabel} className={styles.photo} />
        </div>
      )}
    </div>
  );
};

export default OrderCard;