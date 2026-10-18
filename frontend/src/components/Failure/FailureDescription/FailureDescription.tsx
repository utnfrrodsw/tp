import styles from "./FailureDescription.module.css";
import { useCallback, useEffect, useState } from "react";
import { BACKEND_URL } from "@/lib/config";
import { useAuth } from "@/lib/AuthContext";
import type { Failure_Type, PaginatedResponse} from "@/types/types";


  interface FailureDescriptionProps {
    description: string;
    onChangeDescription: (value: string) => void;
    selectedFailureType: string | null;
    onChangeSelectedFailureType: (id: string | null) => void;
    placeholder?: string;
  }

const FailureDescription = ({
  description,
  onChangeDescription,
  selectedFailureType,
  onChangeSelectedFailureType,
  placeholder = "Describí los síntomas, cuándo ocurren y reparaciones previas...",
}: FailureDescriptionProps) => {
  const [tiposFallas, setTiposFallas] = useState<Failure_Type[]>([]);
  const { isAuth, loading: authLoading } = useAuth();

  const findCategories = useCallback(async () => {
    try {
      const result = await fetch(`${BACKEND_URL}/api/failure-types/`, {
        method: "GET",
        credentials: "include",
      });

      if (result.status === 404) {
        setTiposFallas([]);
        return;
      }

      if (!result.ok) throw new Error(`Error ${result.status}`);

      const response: PaginatedResponse<Failure_Type> = await result.json();
      setTiposFallas(response.data); 
    } catch (error) {
      console.error("Error al buscar tipos de falla:", error);
      setTiposFallas([]);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && isAuth) {
      findCategories();
    }
  }, [authLoading, isAuth, findCategories]);

  // Click en un tag: lo selecciona. Si ya estaba seleccionado, lo deselecciona (toggle off).
  const handleTagClick = (id: string) => {
    if (selectedFailureType === id) {
      onChangeSelectedFailureType(null);
    } else {
      onChangeSelectedFailureType(id);
    }
  };

  return (
    <div className={styles.card}>
      <textarea
        className={styles.textarea}
        placeholder={placeholder}
        rows={3}
        value={description}
        onChange={(e) => onChangeDescription(e.target.value)}
      />

      <div className={styles.tagsSection}>
        <span className={styles.tagsLabel}>Tipo de falla</span>
        <div className={styles.tagsGrid}>
          {tiposFallas.map((falla) => {
            const seleccionado = selectedFailureType === falla.id_failure_type;
            return (
              <button
                key={falla.id_failure_type}
                type="button"
                className={`${styles.tag} ${seleccionado ? styles.tagSelected : ""}`}
                onClick={() => handleTagClick(falla.id_failure_type)}
              >
                {falla.failureDescription}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FailureDescription;