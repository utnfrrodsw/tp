import { X, RefreshCw } from 'lucide-react';
import { type Order, type Status_History } from '@/types/types';
import EquipmentMiniDescriptiveCard from '@/components/EquipmentComponent/EquipmentMiniDescriptiveCard/EquipmentMiniDescriptiveCard';
import StatusHistoryTimeline from '@/components/Status/StatusHistoryTimeLine/StatusHistoryTimeLine';
import ActionButton from '@/components/Common/Buttons/ActionButton';
import styles from './OrderDescription.module.css';
import EquipmentDetailModal from '@/components/EquipmentComponent/EquipmentDetailModal/EquipmentDetailModal';
import { useState, useEffect } from 'react';
import { eventBus, EVENTS } from '@/lib/eventBus';
import { formatDocumentNumber } from '@/lib/utils';

export interface OrderDescriptionProps {
  order: Order;
  onClose?: () => void;
  onUpdateStatus?: () => void;
  onClickStatusEntry?: (id_status_history: string) => void;
  updatingStatus?: boolean;
}

// Type guard: verificamos en runtime que el payload realmente tiene forma de
// Status_History antes de confiar en él (el eventBus es genérico, no tipado por evento).
function isStatusHistory(payload: unknown): payload is Status_History {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'id_status_history' in payload &&
    'id_order' in payload &&
    'status' in payload
  );
}

const OrderDescription = ({
  order,
  onClose,
  onUpdateStatus,
  onClickStatusEntry,
  updatingStatus = false,
}: OrderDescriptionProps) => {
  const [statusHistory, setStatusHistory] = useState<Status_History[]>(order.statusHistory ?? []);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);

  const clientName = order.equipment?.client?.clientName ?? 'Cliente sin asignar';

  // Si cambia la orden que muestra el panel (el padre pasó otra), reseteamos
  // el historial local para no arrastrar el de la orden anterior.
  useEffect(() => {
    setStatusHistory(order.statusHistory ?? []);
  }, [order.id_order, order.statusHistory]);

  // Escucha global de cambios de estado (emitidos, por ejemplo, desde UpdateStatusModal)
  useEffect(() => {
    const unsubscribe = eventBus.on(EVENTS.statusChanged, (payload) => {
      if (!isStatusHistory(payload)) return;
      if (payload.id_order !== order.id_order) return;

      setStatusHistory((prev) => {
        if (prev.some((h) => h.id_status_history === payload.id_status_history)) {
          return prev; // ya lo tenemos, evita duplicar
        }
        return [payload, ...prev];
      });
    });

    return unsubscribe;
  }, [order.id_order]);

  // StatusHistoryTimeline espera un `order`; le pasamos una copia con el
  // historial local (ya actualizado por el evento) en vez del de la prop original.
  const orderWithLiveHistory: Order = { ...order, statusHistory };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <span className={styles.orderId}>{formatDocumentNumber("#ORD",order.nroOrder, {padLength:4})}</span>
          <span className={styles.clientName}>{clientName}</span>
        </div>

        {onClose && (
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <section className={styles.section}>
        <span className={styles.sectionLabel}>Equipo y Falla</span>
        <div className={styles.equipmentSlot}>
          {order.equipment && (
            <EquipmentMiniDescriptiveCard
              equipment={order.equipment}
              reason={
                order.equipment.failures
                  ?.filter((f) => f.status === 'diagnosticada')
                  .map((f) => f.failureType?.failureDescription)
                  .filter((desc): desc is string => Boolean(desc))
                  .join(', ') || undefined
              }
              onClick={() => setShowEquipmentModal(true)}
            />
          )}
        </div>
      </section>

      <section className={styles.section}>
        <StatusHistoryTimeline
          order={orderWithLiveHistory}
          title="Historial de Estados"
          onClickStatus={onClickStatusEntry}
        />
      </section>

      {onUpdateStatus && (
        <div className={styles.footer}>
          <ActionButton
            label="Actualizar Estado"
            icon={<RefreshCw size={18} />}
            onClick={onUpdateStatus}
            variant="neutral"
            loading={updatingStatus}
            fullWidth
          />
        </div>
      )}

      {showEquipmentModal && order.equipment && (
        <EquipmentDetailModal
          open={showEquipmentModal}
          onClose={() => setShowEquipmentModal(false)}
          equipment={order.equipment}
        />
      )}
    </div>
  );
};

export default OrderDescription;