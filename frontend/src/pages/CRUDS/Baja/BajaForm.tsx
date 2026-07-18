import { useEffect, useState } from 'react';
import useDebounce from '@/components/useDebounce';
import { eventBus } from '@/lib/eventBus';
import styles from './BajaForm.module.css';

// ─── Field config para el detalle ────────────────────────────────────────────

export interface DetailFieldConfig {
  /** Key del objeto de la entidad, ej: "estimatedImport" */
  name: string;
  /** Label visible, ej: "Costo estimado" */
  label: string;
  /** Formateador opcional del valor (ej: moneda, porcentaje) */
  format?: (value: unknown) => string;
}

// ─── Props ───────────────────────────────────────────────────────────────────

export interface BajaFormProps<T extends object> {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  searchPlaceholder: string;
  /** Endpoint de búsqueda parcial, ej: "/failures/getPartialTypes" (se le agrega /:query) */
  searchEndpoint: string;
  /** Endpoint de borrado, ej: "/failures/deleteType" (se le agrega /:id) */
  deleteEndpoint: string;
  /** Key del campo que identifica unívocamente al registro, ej: "id_failure_type" */
  idField: keyof T;
  /** Key del campo que se muestra en la lista de resultados como preview, ej: "failureDescription" */
  previewField?: keyof T;
  /** Función para combinar varios campos en el preview, ej: (item) => `${item.pteDescuento}% / ${item.cantOrdenesPara} órdenes`. Tiene prioridad sobre previewField. */
  previewFormat?: (item: T) => string;
  /** Campos a mostrar en el detalle, en orden */
  detailFields: DetailFieldConfig[];
  /** Si la búsqueda requiere token (default true) */
  requiresAuth?: boolean;
  /** Nombre del evento a emitir en eventBus tras un borrado exitoso */
  entityEvent?: string;
  successMessage?: string;
  onSuccess?: () => void;
  /** Debounce en ms para la búsqueda (default 800) */
  debounceMs?: number;
}

function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

function formatValue(value: unknown): string {
  if (typeof value === 'number') {
    return value.toLocaleString('es-AR');
  }
  return String(value ?? '');
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function BajaForm<T extends object>({
  title,
  subtitle,
  icon,
  searchPlaceholder,
  searchEndpoint,
  deleteEndpoint,
  idField,
  previewField,
  previewFormat,
  detailFields,
  requiresAuth = true,
  entityEvent,
  successMessage = 'Eliminado correctamente.',
  onSuccess,
  debounceMs = 800,
}: BajaFormProps<T>) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, debounceMs);
  const [results, setResults] = useState<T[]>([]);
  const [selected, setSelected] = useState<T | null>(null);
  const [deleted, setDeleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = `http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}`;

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const headers: Record<string, string> = {};
        if (requiresAuth) {
          const token = localStorage.getItem('token');
          if (token) headers.Authorization = `Bearer ${token}`;
        }

        const result = await fetch(
          `${baseUrl}${searchEndpoint}/${encodeURIComponent(debouncedQuery)}`,
          { method: 'GET', headers }
        );

        if (result.status === 404) {
          setResults([]);
          return;
        }

        const data = await result.json();
        setResults(data);
      } catch (e) {
        console.error(e);
        setError('Error al buscar.');
      }
    };

    fetchResults();
  }, [debouncedQuery, baseUrl, searchEndpoint, requiresAuth]);

  const handleSelect = (item: T) => {
    setSelected(item);
    setDeleted(false);
    setError(null);
  };

  const handleDelete = async () => {
    if (!selected) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay token de sesión.');

      const decoded = parseJwt(token);
      if (!decoded?.id_user) throw new Error('Token inválido o expirado.');

      const id = selected[idField];

      const result = await fetch(`${baseUrl}${deleteEndpoint}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!result.ok) {
        const data = await result.json().catch(() => ({}));
        throw new Error(data?.message || 'Error al eliminar.');
      }

      setResults(prev => prev.filter(r => r[idField] !== id));
      setSelected(null);
      setDeleted(true);
      setError(null);

      if (entityEvent) eventBus.emit(entityEvent);
      onSuccess?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido.');
    }
  };

  return (
    <div style={{ width: '100%' }} className={styles.bajaWrapper}>

      {(title || subtitle) && (
        <div className={styles.header}>
          {icon && <div className={styles.iconWrap}>{icon}</div>}
          <div>
            {title && <h2 className={styles.title}>{title}</h2>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>
      )}

      {error && <p className={styles.errorMsg}>{error}</p>}

      {/* Input de búsqueda */}
      <div className={styles.searchWrapper} style={{ width: '100%' }}>
        <svg
          className={styles.searchIcon}
          width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className={styles.searchInput}
          type="text"
          placeholder={searchPlaceholder}
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setSelected(null);
            setDeleted(false);
            setError(null);
          }}
        />
      </div>

      {/* Lista de resultados */}
      {results.length > 0 && !selected && (
        <ul className={styles.resultsList}>
          {results.map((r) => (
            <li
              key={String(r[idField])}
              className={styles.resultItem}
              onClick={() => handleSelect(r)}
            >
              <span className={styles.resultId}>#{String(r[idField])}</span>
              <span className={styles.resultDesc}>
                {previewFormat ? previewFormat(r) : String(r[previewField as keyof T])}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Detalle del seleccionado */}
      {selected && (
        <div className={styles.detailCard}>
          <div className={styles.detailHeader}>
            <span className={styles.resultId}>#{String(selected[idField])}</span>
            <button className={styles.backButton} onClick={() => setSelected(null)}>
              ← Volver
            </button>
          </div>

          {detailFields.map(field => (
            <div className={styles.detailRow} key={field.name}>
              <span className={styles.detailLabel}>{field.label}</span>
              <span className={styles.detailValue}>
                {field.format
                  ? field.format(selected[field.name as keyof T])
                  : formatValue(selected[field.name as keyof T])}
              </span>
            </div>
          ))}

          <button className={styles.deleteButton} onClick={handleDelete}>
            Eliminar
          </button>
        </div>
      )}

      {/* Feedback eliminación */}
      {deleted && (
        <p className={styles.successMsg}>✓ {successMessage}</p>
      )}

    </div>
  );
}