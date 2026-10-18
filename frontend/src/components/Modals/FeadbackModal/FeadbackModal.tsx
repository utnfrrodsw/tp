import { useEffect } from 'react';
import type { ComponentType } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import styles from './FeadbackModal.module.css';

export type FeedbackType = 'success' | 'error' | 'warning' | 'info';

export interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
  type: FeedbackType;
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  cancelLabel?: string;
  autoCloseMs?: number;
  closeOnOverlayClick?: boolean;
}

const TYPE_CONFIG: Record<
  FeedbackType,
  { icon: ComponentType<{ size?: number }>; defaultTitle: string; className: string }
> = {
  success: { icon: CheckCircle2, defaultTitle: 'Éxito', className: styles.success },
  error:   { icon: XCircle,      defaultTitle: 'Error', className: styles.error },
  warning: { icon: AlertTriangle, defaultTitle: 'Advertencia', className: styles.warning },
  info:    { icon: Info,         defaultTitle: 'Información', className: styles.info },
};

const FeedbackModal = ({
  open,
  onClose,
  type,
  title,
  message,
  actionLabel,
  onAction,
  cancelLabel = 'Cerrar',
  autoCloseMs,
  closeOnOverlayClick = true,
}: FeedbackModalProps) => {
  useEffect(() => {
    if (!open || !autoCloseMs) return;
    const timer = setTimeout(() => onClose(), autoCloseMs);
    return () => clearTimeout(timer);
  }, [open, autoCloseMs, onClose]);

  if (!open) return null;

  const { icon: Icon, defaultTitle, className } = TYPE_CONFIG[type];
  const resolvedTitle = title ?? defaultTitle;

  return (
    <div
      className={styles.overlay}
      onClick={() => {
        if (closeOnOverlayClick) onClose();
      }}
    >
      <div
        className={`${styles.modal} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className={styles.closeButton}
        >
          <X size={18} />
        </button>

        <div className={styles.iconWrapper}>
          <Icon size={32} />
        </div>

        <h2 className={styles.title}>{resolvedTitle}</h2>
        <p className={styles.message}>{message}</p>

        <div className={styles.footer}>
          {onAction && actionLabel && (
            <button
              onClick={() => {
                onAction();
              }}
              className={styles.actionButton}
            >
              {actionLabel}
            </button>
          )}
          <button
            onClick={onClose}
            className={styles.cancelButton}
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;