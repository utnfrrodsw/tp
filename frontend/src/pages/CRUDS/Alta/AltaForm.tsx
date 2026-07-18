import { useState } from 'react';
import { eventBus } from './../../../lib/eventBus';
import styles from './AltaForm.module.css';


// ─── Field config ────────────────────────────────────────────────────────────

export type FieldType = 'text' | 'email' | 'number' | 'tel' | 'password' | 'select';

export interface SelectOption {
  value: string;
  label: string;
}

export interface FieldConfig {
  name: string;
  label: string;
  type?: FieldType;
  placeholder?: string;
  required?: boolean;
  prefix?: string;          
  min?: number;
  step?: number;
  minLength?: number;
  maxLength?: number;
  options?: SelectOption[];
  validate?: (value: string) => string | undefined; 
}


export interface AltaFormProps {

  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  fields: FieldConfig[];  
  endpoint: string;
  method?: 'POST' | 'PUT' | 'PATCH';
  submitLabel?: string;
  successMessage?: string;
  entityEvent?: string;
  onSuccess?: (responseData?: unknown) => void;
  resetOnSuccess?: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

function buildInitialState(fields: FieldConfig[]): Record<string, string> {
  return Object.fromEntries(fields.map(f => [f.name, '']));
}

function runValidations(
  fields: FieldConfig[],
  formData: Record<string, string>
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const field of fields) {
    const value = formData[field.name] ?? '';
    const trimmed = value.trim();

    if (field.required && !trimmed) {
      errors[field.name] = `${field.label} es obligatorio.`;
      continue;
    }

    if (field.minLength && trimmed.length < field.minLength) {
      errors[field.name] = `${field.label} debe tener al menos ${field.minLength} caracteres.`;
      continue;
    }

    if (field.maxLength && trimmed.length > field.maxLength) {
      errors[field.name] = `${field.label} no puede superar ${field.maxLength} caracteres.`;
      continue;
    }

    if (field.type === 'email' && trimmed) {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(trimmed)) {
        errors[field.name] = 'El email no tiene un formato válido.';
        continue;
      }
    }

    if (field.type === 'number' && trimmed) {
      const num = Number(trimmed);
      if (isNaN(num)) {
        errors[field.name] = `${field.label} debe ser un número válido.`;
        continue;
      }
      if (field.min !== undefined && num < field.min) {
        errors[field.name] = `${field.label} debe ser mayor o igual a ${field.min}.`;
        continue;
      }
    }

    if (field.type === 'tel' && trimmed) {
      const telRe = /^[0-9+\-\s()]{6,20}$/;
      if (!telRe.test(trimmed)) {
        errors[field.name] = 'El teléfono no tiene un formato válido.';
        continue;
      }
    }

    // Validación custom del campo (tiene prioridad sobre todo lo anterior si se usa)
    if (field.validate) {
      const customError = field.validate(value);
      if (customError) {
        errors[field.name] = customError;
      }
    }
  }

  return errors;
}

function buildPayload(
  fields: FieldConfig[],
  formData: Record<string, string>
): Record<string, string | number> {
  const payload: Record<string, string | number> = {};
  for (const field of fields) {
    const value = formData[field.name] ?? '';
    payload[field.name] =
      field.type === 'number' ? parseFloat(value) : value.trim();
  }
  return payload;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AltaForm({
  title,
  subtitle,
  icon,
  fields,
  endpoint,
  method = 'POST',
  submitLabel = 'Crear',
  successMessage = 'Registro creado correctamente.',
  entityEvent,
  onSuccess,
  resetOnSuccess = true,
}: AltaFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>(
    buildInitialState(fields)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => { const next = { ...prev }; delete next[name]; return next; });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = runValidations(fields, formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay token de sesión.');

      const decoded = parseJwt(token);
      if (!decoded?.id_user) throw new Error('Token inválido o expirado.');

      const baseUrl = `http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}`;

      const response = await fetch(`${baseUrl}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(buildPayload(fields, formData)),
      });

      // 409 → conflicto de duplicado en el primer campo por convención
      if (response.status === 409) {
        setErrors({ [fields[0].name]: `Ya existe un registro con ese ${fields[0].label.toLowerCase()}.` });
        return;
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || `Error del servidor: ${response.status}`);
      }

      const responseData = await response.json().catch(() => undefined);

      setSuccess(true);
      if (resetOnSuccess) setFormData(buildInitialState(fields));
      if (entityEvent) eventBus.emit(entityEvent, responseData);
      onSuccess?.(responseData);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setErrors({ _general: err instanceof Error ? err.message : 'Error desconocido.' });
    } finally {
      setLoading(false);
    }
  };

  // ─── Default icon ──────────────────────────────────────────────────────────
  const defaultIcon = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.iconWrap}>{icon ?? defaultIcon}</div>
          <div>
            <h2 className={styles.title}>{title}</h2>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>

        {/* Error general */}
        {errors._general && (
          <div className={styles.alertError}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            {errors._general}
          </div>
        )}

        {/* Éxito */}
        {success && (
          <div className={styles.alertSuccess}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {successMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className={styles.form}>
          {fields.map(field => (
            <div
              key={field.name}
              className={`${styles.field} ${errors[field.name] ? styles.fieldError : ''}`}
            >
              <label className={styles.label} htmlFor={field.name}>
                {field.label}
                {field.required && <span className={styles.required}>*</span>}
              </label>

            {field.type === 'select' ? (
              <select
                id={field.name}
                name={field.name}
                className={styles.input}
                value={formData[field.name]}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">{field.placeholder ?? 'Seleccioná una opción...'}</option>
                {field.options?.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : field.prefix ? (
              <div className={styles.inputWrapper}>
                <span className={styles.prefix}>{field.prefix}</span>
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type ?? 'text'}
                  min={field.min}
                  step={field.step}
                  className={`${styles.input} ${styles.inputWithPrefix}`}
                  placeholder={field.placeholder ?? ''}
                  value={formData[field.name]}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="off"
                />
              </div>
            ) : (
              <input
                id={field.name}
                name={field.name}
                type={field.type ?? 'text'}
                min={field.min}
                step={field.step}
                className={styles.input}
                placeholder={field.placeholder ?? ''}
                value={formData[field.name]}
                onChange={handleChange}
                disabled={loading}
                autoComplete="off"
              />
            )}

              {errors[field.name] && (
                <span className={styles.errorMsg}>{errors[field.name]}</span>
              )}
            </div>
          ))}

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? (
              <>
                <span className={styles.spinner} />
                Guardando...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                {submitLabel}
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}