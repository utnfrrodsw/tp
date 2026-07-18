import { useEffect, useState } from 'react';
import useDebounce from '@/components/useDebounce';
import { eventBus } from '@/lib/eventBus';
import type { FieldConfig } from './../Alta/AltaForm';
import styles from './ModForm.module.css';

// ─── Props ───────────────────────────────────────────────────────────────────

export interface ModFormProps<T extends object> {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  searchPlaceholder: string;
  /** Endpoint de búsqueda parcial, ej: "/failures/getPartialTypes" (se le agrega /:query) */
  searchEndpoint: string;
  /** Endpoint de modificación, ej: "/failures/modifyType" (se le agrega /:id) */
  modifyEndpoint: string;
  /** Key del campo que identifica unívocamente al registro, ej: "id_failure_type" */
  idField: keyof T;
  /** Key del campo que se muestra en la lista de resultados como preview */
  previewField?: keyof T;
  /** Función para combinar varios campos en el preview. Tiene prioridad sobre previewField. */
  previewFormat?: (item: T) => string;
  /** Campos editables del formulario (reutiliza el mismo FieldConfig de AltaForm) */
  fields: FieldConfig[];
  successMessage?: string;
  entityEvent?: string;
  onSuccess?: () => void;
  debounceMs?: number;
}

function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ModForm<T extends object>({
  title,
  subtitle,
  icon,
  searchPlaceholder,
  searchEndpoint,
  modifyEndpoint,
  idField,
  previewField,
  previewFormat,
  fields,
  successMessage = 'Modificado correctamente.',
  entityEvent,
  onSuccess,
  debounceMs = 800,
}: ModFormProps<T>) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, debounceMs);
  const [results, setResults] = useState<T[]>([]);
  const [selected, setSelected] = useState<T | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = `http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}`;

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const result = await fetch(
          `${baseUrl}${searchEndpoint}/${encodeURIComponent(debouncedQuery)}`,
          { method: 'GET' }
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
  }, [debouncedQuery, baseUrl, searchEndpoint]);

  const handleSelect = (item: T) => {
    setSelected(item);
    setSaved(false);
    setError(null);
  };

  const handleFieldChange = (field: FieldConfig, value: string) => {
    if (!selected) return;
    setSelected({
      ...selected,
      [field.name]: field.type === 'number' ? Number(value) : value,
    });
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay token de sesión.');

      const decoded = parseJwt(token);
      if (!decoded?.id_user) throw new Error('Token inválido o expirado.');

      const id = selected[idField];

      // Arma el payload solo con los campos editables definidos
      const payload: Record<string, unknown> = {};
      for (const field of fields) {
        payload[field.name] = (selected as Record<string, unknown>)[field.name];
      }

      const result = await fetch(`${baseUrl}${modifyEndpoint}/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!result.ok) {
        const data = await result.json().catch(() => ({}));
        throw new Error(data?.message || 'Error al modificar.');
      }

      setSaved(true);
      setSelected(null);
      setResults([]);
      setQuery('');

      if (entityEvent) eventBus.emit(entityEvent);
      onSuccess?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.modWrapper}>

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

      {/* Búsqueda */}
      <div className={styles.searchWrapper}>
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
            setSaved(false);
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

      {/* Formulario de edición */}
      {selected && (
        <div className={styles.detailCard}>
          <div className={styles.detailHeader}>
            <span className={styles.resultId}>#{String(selected[idField])}</span>
            <button className={styles.backButton} onClick={() => setSelected(null)} disabled={saving}>
              ← Volver
            </button>
          </div>

      {fields.map((field: FieldConfig) => (
        <div className={styles.detailRow} key={field.name}>
          <label className={styles.detailLabel} htmlFor={field.name}>
            {field.label}
          </label>

          {field.type === 'select' ? (
            <select
              id={field.name}
              className={styles.input}
              value={String((selected as Record<string, unknown>)[field.name] ?? '')}
              onChange={e => handleFieldChange(field, e.target.value)}
              disabled={saving}
            >
              <option value="">{field.placeholder ?? 'Seleccioná una opción...'}</option>
              {field.options?.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={field.name}
              type={field.type ?? 'text'}
              className={styles.input}
              min={field.min}
              step={field.step}
              value={String((selected as Record<string, unknown>)[field.name] ?? '')}
              onChange={e => handleFieldChange(field, e.target.value)}
              disabled={saving}
            />
          )}
        </div>
      ))}

          <div className={styles.actions}>
            <button className={styles.cancelButton} onClick={() => setSelected(null)} disabled={saving}>
              Cancelar
            </button>
            <button className={styles.saveButton} onClick={handleSave} disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      )}

      {/* Feedback guardado */}
      {saved && (
        <p className={styles.successMsg}>✓ {successMessage}</p>
      )}

    </div>
  );
}