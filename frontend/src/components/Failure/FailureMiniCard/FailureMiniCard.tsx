import styles from './FailureMiniCard.module.css';
import { type Failure } from '@/types/types';
import { formatRelativeTime } from '@/lib/utils'
import { type DetailFieldConfig, DetailModal } from "@/components/Modals/DetailModal";
import { useState, useEffect } from "react";
import FailureForm, { type NuevaFalla } from '../FailureForm/FailureForm';
import { BACKEND_URL } from "@/lib/config";
import { EVENTS, eventBus } from '@/lib/eventBus';

export type EnumFailureStatus = 'DIAGNOSTICADA' | 'RESUELTA';
interface FailureExt extends Omit<Failure, 'failureType'> {
  failureType?: {
    id_failure_type: string;
    failureDescription: string;
    estimatedImport?: number;
  };
}

const STATUS_CONFIG: Record<EnumFailureStatus, { label: string; className: string }> = {
  DIAGNOSTICADA: { label: 'Diagnosticada', className: 'inProgress' },
  RESUELTA: { label: 'Resuelta', className: 'resolved' },
};

export interface FailureMiniCardProps {
  failure: Failure;
  onUpdated?: (updated: Failure) => void;
  onDeleted?: (id_failure: string) => void;
}

const failureFields: DetailFieldConfig<FailureExt>[] = [
  { name: 'id_failure', label: 'ID de la falla' },
  { name: 'failureType.failureDescription', label: 'Tipo de falla', getValue: (failure) => failure.failureType?.failureDescription ?? 'Sin especificar' },
  { name: 'description', label: 'Descripción de la falla' },
  { name: 'status', label: 'Estado de la falla' },
  { name: 'dateOfFailure', label: 'Fecha de Registro', format: (value) => formatRelativeTime(value as string | Date) },
  {
    name: 'failureType.estimatedImport', label: 'Importe estimado',
    getValue: (failure) => failure.failureType?.estimatedImport ?? 'Sin especificar',
    format: (value) => {
      const num = typeof value === 'string' ? parseFloat(value) : value;
      return typeof num === 'number' && !isNaN(num)
        ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(num)
        : 'Sin especificar';
    },
  }
]

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);

const FailureMiniCard = ({ failure, onDeleted }: FailureMiniCardProps) => {
  const [showFailureDetailModal, setShowFailureDetailModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [formData, setFormData] = useState<Failure>(failure);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(failure);
  }, [failure]);

  const statusKey = String(failure.status).toUpperCase() as EnumFailureStatus;
  const statusInfo = STATUS_CONFIG[statusKey] ?? {
    label: String(failure.status),
    className: 'pending',
  };

  const title = failure.failureType?.failureDescription ?? 'Falla reportada';

  const updateFailure = async (falla: NuevaFalla) => {
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/failures/${falla.id_failure}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id_failure_type: falla.id_failure_type,
          description: falla.description,
        }),
      });
      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.message || "Error al actualizar la falla");
      }
      setIsEditing(false);
      setShowFailureDetailModal(false);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Error al actualizar la falla");
    } finally {
      setSaving(false);
    }
  };

  const deleteFailure = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/failures/${failure.id_failure}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.message || "Error al eliminar la falla");
      }

      // Fallback optimista: por si el backend todavía no emite el evento
      // de WebSocket al eliminar. Si lo emite, este mismo cliente va a
      // recibir el evento también, pero eliminar dos veces la misma key
      // del array no rompe nada (el segundo simplemente no encuentra nada
      // para filtrar).
      onDeleted?.(failure.id_failure);
      eventBus.emit(EVENTS.failureDeleted, { id_failure: failure.id_failure, id_order: failure.id_order });

      setConfirmingDelete(false);
      setShowFailureDetailModal(false);
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "Error al eliminar la falla");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className={`${styles.card} ${styles.clickable}`}
      onClick={() => setShowFailureDetailModal(true)}
      role="button"
      tabIndex={0}
    >
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <span className={`${styles.badge} ${styles[statusInfo.className]}`}>
          {statusInfo.label}
        </span>
      </div>

      <p className={styles.description}>{failure.description}</p>

      <div className={styles.footer}>
        <span className={styles.date}>{formatRelativeTime(failure.dateOfFailure)}</span>
        {failure.failureType?.estimatedImport !== undefined && (
          <span className={styles.amount}>
            {formatCurrency(failure.failureType.estimatedImport)}
          </span>
        )}
      </div>

      {showFailureDetailModal && (
        <DetailModal<Failure>
          open={showFailureDetailModal}
          onClose={() => {
            setIsEditing(false);
            setConfirmingDelete(false);
            setShowFailureDetailModal(false);
          }}
          title={
            confirmingDelete ? 'Eliminar Falla'
              : isEditing ? 'Editar Falla'
                : 'Detalle de la Falla'
          }
          data={isEditing ? formData : failure}
          fields={isEditing || confirmingDelete ? [] : failureFields}
          statusField={isEditing || confirmingDelete ? undefined : "status"}
          actions={
            isEditing || confirmingDelete
              ? []
              : [
                { label: 'Editar Falla', variant: 'secondary', onClick: () => setIsEditing(true) },
                { label: 'Eliminar Falla', variant: 'danger', onClick: () => setConfirmingDelete(true) },
              ]
          }
          hideFooter={isEditing || confirmingDelete}
        >
          {isEditing && (
            <>
              <FailureForm
                falla={{
                  id_failure: failure.id_failure,
                  id_failure_type: failure.id_failure_type,
                  description: failure.description,
                  failureDescription: failure.failureType?.failureDescription ?? "",
                }}
                onGuardar={updateFailure}
                onCancelar={() => setIsEditing(false)}
              />
              {saving && <p className={styles.savingText}>Guardando…</p>}
              {saveError && <p className={styles.error}>{saveError}</p>}
            </>
          )}

          {confirmingDelete && (
            <div className={styles.confirmDelete}>
              <p className={styles.confirmDeleteText}>
                ¿Seguro que querés eliminar esta falla? Esta acción no se puede deshacer.
              </p>
              {deleteError && <p className={styles.error}>{deleteError}</p>}
              <div className={styles.confirmDeleteActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setConfirmingDelete(false)}
                  disabled={deleting}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className={styles.deleteBtn}
                  onClick={deleteFailure}
                  disabled={deleting}
                >
                  {deleting ? "Eliminando…" : "Sí, eliminar"}
                </button>
              </div>
            </div>
          )}
        </DetailModal>
      )}
    </div>
  );
};

export default FailureMiniCard;