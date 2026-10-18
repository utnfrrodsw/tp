import React from 'react';
import { X, ChevronRight, Pencil } from 'lucide-react';
import styles from './DetailModal.module.css'; // <-- Importamos los estilos

export type DetailFieldType = 'text' | 'email' | 'phone' | 'date' | 'currency' | 'badge' | 'custom';
export type BadgeTone = 'active' | 'inactive' | 'pending' | 'danger' | 'info';

export interface DetailFieldConfig<T = any> {
  name:Extract<keyof T, string> | (string & {});
  label: string;
  type?: DetailFieldType;
  badgeTone?: (value: any, data: T) => BadgeTone;
  format?: (value: any, data: T) => React.ReactNode;
  hidden?: (data: T) => boolean;
  getValue?: (item: T)=> React.ReactNode;
  column?: 1 | 2;
}

export interface DetailItemConfig<I = any> {
  getKey: (item: I) => string | number;
  icon?: React.ReactNode | ((item: I) => React.ReactNode);
  primary: (item: I) => string;
  secondary?: (item: I) => string;
  onClick?: (item: I) => void;
}

export interface DetailModalAction<T = any> {
  label: string;
  icon?: React.ReactNode;
  onClick: (data: T) => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

export interface DetailModalProps<T = any, I = any> {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  data: T;
  fields: DetailFieldConfig<T>[];
  statusField?: keyof T & string;
  statusTone?: (value: any, data: T) => BadgeTone;
  statusLabel?: (value: any, data: T) => string;
  listTitle?: string;
  items?: I[];
  itemConfig?: DetailItemConfig<I>;
  emptyItemsLabel?: string;
  actions?: DetailModalAction<T>[];
  cancelLabel?: string;
  onCancel?: () => void;
  compact?: boolean;
  zIndex?: number;
  children?: React.ReactNode;
  hideFooter?: boolean;
}

const TONE_STYLES: Record<BadgeTone, { bg: string; text: string }> = {
  active: { bg: '#1e3a8a', text: '#ffffff' },
  inactive: { bg: '#9ca3af', text: '#ffffff' },
  pending: { bg: '#d97706', text: '#ffffff' },
  danger: { bg: '#dc2626', text: '#ffffff' },
  info: { bg: '#0284c7', text: '#ffffff' },
};

// Mapeo a las clases de CSS Modules
const ACTION_CLASSES: Record<string, string> = {
  primary: styles.actionPrimary,
  secondary: styles.actionSecondary,
  danger: styles.actionDanger,
};

// ============================================================================
// SUBCOMPONENTES
// ============================================================================

function Badge({ label, tone = 'active' }: { label: string; tone?: BadgeTone }) {
  const style = TONE_STYLES[tone] ?? TONE_STYLES.active;
  return (
    <span
      className={styles.badgeBase}
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {label}
    </span>
  );
}
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}
function FieldValue<T>({ field, data }: { field: DetailFieldConfig<T>; data: T }) {
  const raw = field.getValue
    ? field.getValue(data)
    : getNestedValue(data, field.name);

  if (field.format) return <>{field.format(raw, data)}</>;

  if (field.type === 'badge') {
    const tone = field.badgeTone ? field.badgeTone(raw, data) : 'info';
    return <Badge label={String(raw ?? '—')} tone={tone} />;
  }

  if (raw === undefined || raw === null || raw === '') {
    return <span className={styles.fieldEmpty}>—</span>;
  }

  return <>{String(raw)}</>;
}

function AssociatedItemRow<I>({ item, config }: { item: I; config: DetailItemConfig<I> }) {
  const clickable = typeof config.onClick === 'function';
  const icon = typeof config.icon === 'function' ? config.icon(item) : config.icon;

  // Construcción limpia de clases condicionales
  const rowClassName = `${styles.itemRow} ${clickable ? styles.itemRowClickable : ''}`.trim();

  return (
    <div
      onClick={clickable ? () => config.onClick!(item) : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (clickable && (e.key === 'Enter' || e.key === ' ')) config.onClick!(item);
      }}
      className={rowClassName}
    >
      {icon && (
        <div className={styles.itemIconWrapper}>
          {icon}
        </div>
      )}
      <div className={styles.itemContent}>
        <div className={styles.itemPrimary}>
          {config.primary(item)}
        </div>
        {config.secondary && (
          <div className={styles.itemSecondary}>
            {config.secondary(item)}
          </div>
        )}
      </div>
      {clickable && <ChevronRight size={18} className={styles.chevron} />}
    </div>
  );
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export function DetailModal<T = any, I = any>({
  open,
  onClose,
  title,
  subtitle,
  icon,
  data,
  fields,
  statusField,
  statusTone,
  statusLabel,
  listTitle = 'Elementos asociados',
  items = [],
  itemConfig,
  emptyItemsLabel = 'No hay elementos asociados.',
  actions = [],
  cancelLabel = 'Cancelar',
  onCancel,
  compact = false,
  zIndex = 1000,
  hideFooter = false,
  children,
}: DetailModalProps<T, I>) {
  if (!open) return null;

  const visibleFields = fields.filter((f) => !f.hidden || !f.hidden(data));
    const leftCol = visibleFields.filter(
    (f, i) => (f.column !== undefined ? f.column : (i % 2 === 0 ? 1 : 2)) === 1
    );
    const rightCol = visibleFields.filter(
    (f, i) => (f.column !== undefined ? f.column : (i % 2 === 0 ? 1 : 2)) === 2
    );

  const statusValue = statusField ? (data as any)[statusField] : undefined;

  // Determinar tamaño de ancho del modal
    const modalSizeClass = compact ? styles['maxW-md'] : styles['maxW-lg'];

  return (
    <div className={styles.overlay}
      style={{zIndex}}
      onClick={(e) => e.stopPropagation()}>
      <div className={`${styles.modal} ${modalSizeClass}`}>
        
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            {icon && <span className={styles.headerIcon}>{icon}</span>}
            <div>
              <h2 className={styles.title}>{title}</h2>
              {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className={styles.closeButton}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
        {statusField && (
        <div className={`${styles.statusWrapper} ${styles.bodySection}`}>
            <Badge
            /* Si existe statusLabel lo usa, si no, cae en el comportamiento viejo */
            label={statusLabel ? statusLabel(statusValue, data) : String(statusValue ?? '')}
            tone={statusTone ? statusTone(statusValue, data) : 'active'}
            />
        </div>
        )}

        {visibleFields.length > 0 && (
          <div className={`${styles.grid} ${styles.bodySection}`}>
            <div className={styles.column}>
              {leftCol.map((f) => (
                <div key={f.name}>
                  <div className={styles.fieldLabel}>{f.label}</div>
                  <div className={styles.fieldValue}>
                    <FieldValue field={f} data={data} />
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.column}>
              {rightCol.map((f) => (
                <div key={f.name}>
                  <div className={styles.fieldLabel}>{f.label}</div>
                  <div className={styles.fieldValue}>
                    <FieldValue field={f} data={data} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

          {itemConfig && (
            <div className={styles.bodySection}>
              <h3 className={styles.listTitle}>{listTitle}</h3>
              <div className={styles.divider} />
              {items.length > 0 ? (
                <div className={styles.listWrapper}>
                  {items.map((item) => (
                    <AssociatedItemRow
                      key={itemConfig.getKey(item)}
                      item={item}
                      config={itemConfig}
                    />
                  ))}
                </div>
              ) : (
                <p className={styles.emptyLabel}>{emptyItemsLabel}</p>
              )}
            </div>
          )}
        {children && (
            <div className={styles.bodySection}>
              {children}
            </div>
          )}
        </div>

        {/* Footer */}
        {!hideFooter && (
        <div className={styles.footer}>
          <button
            onClick={onCancel ?? onClose}
            className={styles.cancelButton}
          >
            {cancelLabel}
          </button>
          {actions.map((action, i) => {
            const variantClass = ACTION_CLASSES[action.variant ?? 'primary'] ?? styles.actionPrimary;
            return (
              <button
                key={i}
                onClick={() => action.onClick(data)}
                className={`${styles.actionButton} ${variantClass}`}
              >
                {action.icon ?? (action.variant === 'primary' && <Pencil size={15} />)}
                {action.label}
              </button>
            );
          })}
        </div>
        )}    
      </div>
      
    </div>

  );
}

export default DetailModal;

