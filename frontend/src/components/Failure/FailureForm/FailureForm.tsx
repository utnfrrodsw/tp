import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./FailureForm.module.css";
import { BACKEND_URL } from "@/lib/config";
import { useAuth } from "@/lib/AuthContext";
import type { Failure_Type } from "@/types/types";
import ActionButton from "@/components/Common/Buttons/ActionButton";
import AltaTipoFalla from "@/pages/TipoFalla/AltaTipoFalla";
import { eventBus, EVENTS } from "@/lib/eventBus";

export interface NuevaFalla {
  id_failure?: string; // presente solo en edición, para identificar qué falla actualizar
  id_failure_type: string;
  description: string;
  failureDescription: string;
}

interface FailureFormProps {
  onGuardar: (falla: NuevaFalla) => void;
  onCancelar?: () => void;
  falla?: NuevaFalla; // si viene, el form arranca en modo edición precargado con estos datos
}

const FailureForm = ({ onGuardar, onCancelar, falla }: FailureFormProps) => {
  const isEditing = falla !== undefined;

  const [tipos, setTipos] = useState<Failure_Type[]>([]);
  const [query, setQuery] = useState(falla?.failureDescription ?? "");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Failure_Type | null>(null);
  const [description, setDescription] = useState(falla?.description ?? "");
  const [error, setError] = useState<string | null>(null);
  const { isAuth, loading: authLoading } = useAuth();
  const boxRef = useRef<HTMLDivElement>(null);
  const [registerFailureType, setRegisterFailureType] = useState(false);

  const fetchTipos = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/failure-types/`, { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();
      setTipos(data.data);
    } catch (e) {
      console.error("Error al traer tipos de falla:", e);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && isAuth) fetchTipos();
  }, [authLoading, isAuth, fetchTipos]);

  useEffect(() => {
    return eventBus.on(EVENTS.failureTypeChanged, () => {
      fetchTipos();
    });
  }, [fetchTipos]);


  useEffect(() => {
    if (isEditing && falla && tipos.length > 0 && !selected) {
      const match = tipos.find((t) => t.id_failure_type === falla.id_failure_type);
      if (match) setSelected(match);
    }
  }, [isEditing, falla, tipos, selected]);

  useEffect(() => {
    setQuery(falla?.failureDescription ?? "");
    setDescription(falla?.description ?? "");
    setSelected(null);
    setError(null);
  }, [falla?.id_failure]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (registerFailureType) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [registerFailureType]);

  useEffect(() => {
    if (!registerFailureType) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrarModalTipoFalla();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [registerFailureType]);

  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tipos;
    return tipos.filter((t) => t.failureDescription.toLowerCase().includes(q));
  }, [tipos, query]);

  const elegir = (t: Failure_Type) => {
    setSelected(t);
    setQuery(t.failureDescription);
    setOpen(false);
    setError(null);
  };

  const cerrarModalTipoFalla = () => {
    setRegisterFailureType(false);
    fetchTipos();
  };

  const guardar = () => {
    if (!selected) {
      setError("Elegí un tipo de falla.");
      return;
    }
    if (description.trim() === "") {
      setError("Agregá una descripción.");
      return;
    }
    onGuardar({
      id_failure: falla?.id_failure,
      id_failure_type: selected.id_failure_type,
      description: description.trim(),
      failureDescription: selected.failureDescription,
    });

    if (!isEditing) {
      setSelected(null);
      setQuery("");
      setDescription("");
    }
    setError(null);
  };

  return (
    <div className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>Tipo de falla</label>
        <div className={styles.combo} ref={boxRef}>
          <input
            className={styles.input}
            type="text"
            placeholder="Buscá el tipo de falla (ej: módulo roto)"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); setSelected(null); }}
            onFocus={() => setOpen(true)}
          />
          <ActionButton
            label="Agregar Tipo Falla"
            variant="ghost"
            onClick={() => setRegisterFailureType(true)}
            icon={null}
          />
          {open && (
            <ul className={styles.dropdown}>
              {filtrados.length === 0 ? (
                <li className={styles.empty}>No hay tipos que coincidan</li>
              ) : (
                filtrados.map((t) => (
                  <li key={t.id_failure_type} className={styles.option} onClick={() => elegir(t)}>
                    {t.failureDescription}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Descripción / síntomas</label>
        <textarea
          className={styles.textarea}
          rows={3}
          placeholder="Describí el problema: síntomas, cuándo ocurre, observaciones..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        {onCancelar && (
          <button type="button" className={styles.cancelBtn} onClick={onCancelar}>
            Cancelar
          </button>
        )}
        <button type="button" className={styles.saveBtn} onClick={guardar}>
          {isEditing ? "Guardar cambios" : "Guardar falla"}
        </button>
      </div>

      {registerFailureType && (
        <div
          className={styles.modalOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) cerrarModalTipoFalla();
          }}
        >
          <div className={styles.modalContent}>
            <button
              type="button"
              className={styles.modalClose}
              onClick={cerrarModalTipoFalla}
              aria-label="Cerrar"
            >
              ×
            </button>
            <AltaTipoFalla />
          </div>
        </div>
      )}
    </div>
  );
};

export default FailureForm;