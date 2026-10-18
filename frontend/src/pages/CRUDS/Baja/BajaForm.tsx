import { useEffect, useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import { eventBus } from '@/lib/eventBus';
import { BACKEND_URL } from '@/lib/config';
import styles from './BajaForm.module.css';
import type { PaginatedResponse } from "@/types/types";

// ─── Field config para el detalle ────────────────────────────────────────────

export interface DetailFieldConfig {
  name: string;
  label: string;
  format?: (value: unknown) => string;
}

// ─── Props ───────────────────────────────────────────────────────────────────

export interface BajaFormProps<T extends object> {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  searchPlaceholder: string;
  searchEndpoint: string;
  deleteEndpoint: string;
  idField: keyof T;
  previewField?: keyof T;
  previewFormat?: (item: T) => string;
  detailFields: DetailFieldConfig[];
  requiresAuth?: boolean;
  entityEvent?: string;
  successMessage?: string;
  onSuccess?: () => void;
  debounceMs?: number;
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

  const baseUrl = BACKEND_URL;

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {

      try {
        // La búsqueda va como query string (?search=...), no como segmento
        // de ruta: el backend la valida con req.validated.query, no con
        // req.validated.params.
        const searchParams = new URLSearchParams({ search: debouncedQuery });
        const result = await fetch(
          `${baseUrl}${searchEndpoint}?${searchParams.toString()}`,
          { method: 'GET', credentials: 'include' });
        if (result.status === 404) {
          setResults([]);
          return;
        }

        const data: PaginatedResponse<T> | T[] = await result.json();
        // findAll devuelve { data, metadata }; soportamos también un array
        // plano por si algún endpoint todavía no está paginado.
        setResults(Array.isArray(data) ? data : data.data);
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

      const id = selected[idField];

      const result = await fetch(`${baseUrl}${deleteEndpoint}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
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
        <div className={styles.resultsContainer}>
          {/* Contador de resultados */}
          <span className={styles.resultsCount}>
            {results.length} {results.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
          </span>

          <ul className={styles.resultsList}>
            {results.map((r) => (
              <li
                key={String(r[idField])}
                className={styles.resultItem}
                onClick={() => handleSelect(r)}
              >
                <span className={styles.resultDesc}>
                  {previewFormat ? previewFormat(r) : String(r[previewField as keyof T])}
                </span>
              </li>
            ))}
          </ul>
        </div>
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