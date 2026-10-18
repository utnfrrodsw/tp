import { useState, useEffect } from "react";
import type { Failure, Order } from "@/types/types";
import FailureMiniCard from "@/components/Failure/FailureMiniCard/FailureMiniCard";
import { EVENTS, eventBus } from "@/lib/eventBus";
import styles from './Diagnostic.module.css'
import CautionIcon from "@/assets/caution.svg";
import ActionButton from "@/components/Common/Buttons/ActionButton";
import FailureForm, { type NuevaFalla } from "@/components/Failure/FailureForm/FailureForm";
import BACKEND_URL from "@/lib/config";

export type DiagnosticProps = {
  order: Order;
  onFailureUpdated?: (updated: Failure) => void;
};

const Diagnostic = ({ order, onFailureUpdated }: DiagnosticProps) => {
  const [failures, setFailures] = useState<Failure[]>(order.failures ?? []);
  const [addingFailure, setAddingFailure] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setFailures(order.failures ?? []);
  }, [order.failures]);

  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(null), 3000);
    return () => clearTimeout(t);
  }, [successMessage]);

  useEffect(() => {
    const handleFailureChanged = (payload: unknown) => {
      const changedFailure = payload as Failure;
      if (changedFailure.id_order !== order.id_order) return;

      setFailures((prev) => {
        const exists = prev.some((f) => f.id_failure === changedFailure.id_failure);
        return exists
          ? prev.map((f) => (f.id_failure === changedFailure.id_failure ? changedFailure : f))
          : [...prev, changedFailure];
      });
      onFailureUpdated?.(changedFailure);
    };

    eventBus.on(EVENTS.failureChanged, handleFailureChanged);
    return () => eventBus.off(EVENTS.failureChanged, handleFailureChanged);
  }, [order.id_order, onFailureUpdated]);
useEffect(() => {
    const handleFailureDeleted = (payload: unknown) => {
        const { id_failure, id_order } = payload as { id_failure: string; id_order: string };
        if (id_order !== order.id_order) return;

        setFailures((prev) => prev.filter((f) => f.id_failure !== id_failure));
    };

eventBus.on(EVENTS.failureDeleted, handleFailureDeleted);
    return () => eventBus.off(EVENTS.failureDeleted, handleFailureDeleted);
    }, [order.id_order]);

  const saveNewFailure = async (falla: NuevaFalla) => {
    setSaving(true);
    setSaveError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/failures`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify([
          {
            id_failure_type: falla.id_failure_type,
            id_order: order.id_order,
            failureDescription: falla.description,
          },
        ]),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.message ?? `Error ${response.status} al crear la falla`);
      }

      const body = await response.json();
      const created: Failure | undefined = body.failure ?? body.failures?.[0];

      if (created) {
        setFailures((prev) =>
          prev.some((f) => f.id_failure === created.id_failure) ? prev : [...prev, created]
        );
      }

      setSuccessMessage("Falla agregada con éxito.");
      setAddingFailure(false);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Error al crear la falla.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleWithIcon}>
        <img src={CautionIcon} alt="Icono de Fallas" className={styles.cardIconImg} />
        <p className={styles.cardTitleText}>
          {addingFailure ? "Agregando Falla" : "Fallas de la Orden"}
        </p>
      </div>

      {!addingFailure ? (
        <>
          {failures.length === 0 ? (
            <p className={styles.emptyText}>La orden no tiene fallas adjuntadas.</p>
          ) : (
            <div className={styles.list}>
              {failures.map((failure) => (
                <FailureMiniCard key={failure.id_failure} failure={failure} />
              ))}
            </div>
          )}

          {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

          <div>
            <ActionButton
            label="Agregar falla"
            icon={null}
            variant="neutral"
            onClick={() => setAddingFailure(true)}
          />
          </div>
        </>
      ) : (
        <div className={styles.formWrapper}>
          <FailureForm
            onGuardar={saveNewFailure}
            onCancelar={() => { setSaveError(null); setAddingFailure(false); }}
          />
          {saving && <p className={styles.savingText}>Guardando…</p>}
          {saveError && <p className={styles.errorMessage}>{saveError}</p>}
        </div>
      )}
    </div>
  );
};

export default Diagnostic;