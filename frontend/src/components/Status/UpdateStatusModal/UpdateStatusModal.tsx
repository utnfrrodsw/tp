import { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { type Order, type EnumOrderStatus, type Status_History } from '@/types/types';
import ActionButton from '@/components/Common/Buttons/ActionButton';
import styles from './UpdateStatusModal.module.css';
import BACKEND_URL from '@/lib/config';
import { useAuth } from '@/lib/AuthContext';
import { EVENTS, eventBus } from '@/lib/eventBus';
import Diagnostic from './Diagnostic/Diagnostic';
import Budget from './Budget/Budget';
import { getBlockReason } from '@/lib/statusRules';


const STATUS_LABELS: Record<EnumOrderStatus, string> = {
  recibido: 'Recibido',
  diagnostico: 'Diagnóstico',
  presupuestado: 'Presupuestado',
  aprobado: 'Aprobado',
  reparacion: 'Reparación',
  listo: 'Listo',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

// Título del campo de comentario según el estado elegido. Los estados que
// no están acá caen en el label genérico "Comentarios".
const COMMENT_LABELS: Partial<Record<EnumOrderStatus, string>> = {
  diagnostico: 'Comentarios del Diagnóstico',
  presupuestado: 'Comentarios del Presupuesto',
  reparacion: 'Comentarios de la Reparación',
  listo: 'Comentarios de Entrega',
};

const ALL_STATUSES = Object.keys(STATUS_LABELS) as EnumOrderStatus[];

function getCurrentStatus(history?: Status_History[]): EnumOrderStatus | null {
  if (!history || history.length === 0) return null;
  const latest = [...history].sort(
    (a, b) => new Date(b.dateOfChange).getTime() - new Date(a.dateOfChange).getTime()
  )[0];
  return latest.status;
}

export interface UpdateStatusModalProps {
  open: boolean;
  order: Order;
  onClose: () => void;
  onConfirm: (createdStatusHistory: Status_History) => void | Promise<void>;
  targetStatus?: EnumOrderStatus;
  direction?: 'advance' | 'retreat';
}

const UpdateStatusModal = ({ open, order, onClose, onConfirm, targetStatus, direction }: UpdateStatusModalProps) => {
  const currentStatus = useMemo(
    () => getCurrentStatus(order.statusHistory),
    [order.statusHistory]
  );

  // Antes se filtraban los estados ya usados en el historial, lo que
  // impedía volver a un estado anterior (ej. de "presupuestado" de nuevo
  // a "diagnostico"). Ahora se puede elegir cualquiera — todavía no hay
  // una máquina de estados que valide qué transiciones son válidas, eso
  // queda para más adelante.

  const [selectedStatus, setSelectedStatus] = useState<EnumOrderStatus | undefined>(undefined);
  const [comment, setComment] = useState('');
  const [notifyClient] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { user } = useAuth();

  if (!open) return null;

  const isFixed = targetStatus !== undefined;
  const isRetreat = direction === 'retreat';
  // Fijo desde afuera, o el que eligió el técnico en el select
  const status = targetStatus ?? selectedStatus;
  const blockReason = status ? getBlockReason(order, status) : null;
  const canSubmit = status !== undefined && !submitting && !blockReason;
  const commentLabel = status ? (COMMENT_LABELS[status] ?? 'Comentarios') : 'Comentarios';

  const title = !isFixed
    ? 'Actualizar Estado de Orden'
    : isRetreat
      ? `Volver a "${STATUS_LABELS[targetStatus]}"`
      : `Avanzar a "${STATUS_LABELS[targetStatus]}"`;
  const handleConfirm = async () => {
    if (!canSubmit || !status) return;

    setSubmitting(true);
    setErrorMessage(null);

    const payload = {
      id_order: order.id_order,
      status,
      id_user: user?.id_user,
      comment: comment.trim() ? comment.trim() : null,
      notifyClient,
    };

    try {
      const res = await fetch(`${BACKEND_URL}/api/status/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        throw new Error(errorBody?.message ?? `Error ${res.status} al actualizar el estado`);
      }

      const createdStatusHistory: Status_History = await res.json();

      eventBus.emit(EVENTS.statusChanged, createdStatusHistory);

      await onConfirm(createdStatusHistory);
      onClose();
    } catch (e) {
      console.error('Error en la actualización de estado', e);
      setErrorMessage(
        e instanceof Error ? e.message : 'No se pudo actualizar el estado. Intentá de nuevo.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={() => !submitting && onClose()}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar modal">
            <X size={18} />
          </button>
        </div>

        {isRetreat && (
          <p className={styles.warning}>
            Vas a retroceder el estado de la orden. El cambio queda registrado en el historial.
          </p>
        )}

        {/* El select solo existe en modo libre */}
        {!isFixed && (
          <div className={styles.field}>
            <label className={styles.label} htmlFor="new-status">Nuevo Estado</label>
            <select
              id="new-status"
              className={styles.select}
              value={selectedStatus ?? ''}
              onChange={(e) => setSelectedStatus(e.target.value as EnumOrderStatus)}
              disabled={submitting}
            >
              <option value="" disabled>Seleccioná un estado...</option>
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                  {s === currentStatus ? ' (actual)' : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {!isRetreat && (
          <div className={styles.field}>
            {status === 'diagnostico' && <Diagnostic order={order} />}
            {status === 'presupuestado' && <Budget order={order} />}
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.label} htmlFor="status-comment">{commentLabel}</label>
          <textarea
            id="status-comment"
            className={styles.textarea}
            rows={3}
            placeholder="Agregá una observación sobre este cambio de estado (opcional)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={submitting}
          />
        </div>

        {/*
        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={notifyClient}
            onChange={(e) => setNotifyClient(e.target.checked)}
            disabled={submitting}
          />
          Notificar al Cliente
        </label>
           */}

        {blockReason && <p className={styles.warning}>{blockReason}</p>}
        {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}

        <div className={styles.actions}>
          <ActionButton
            label={isRetreat ? 'Confirmar retroceso' : 'Confirmar Cambio'}
            icon={null}
            variant={isRetreat ? 'danger' : 'primary'}
            fullWidth
            disabled={!canSubmit}
            loading={submitting}
            onClick={handleConfirm}
          />
          <ActionButton label="Cancelar" icon={null} variant="ghost" fullWidth onClick={onClose} disabled={submitting} />
        </div>
      </div>
    </div>
  );
};

export default UpdateStatusModal;