import styles from './ActionButton.module.css';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ActionButtonProps {
  label: string;
  onClick?: () => void;
  /** Ícono SVG a la izquierda del texto */
  icon?: React.ReactNode;
  variant?: 'primary' | 'danger' | 'success' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  /** Si se usa como link (ej: react-router) */
  href?: string;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

// ─── Default icons ────────────────────────────────────────────────────────────

const DEFAULT_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <line x1="19" y1="8" x2="19" y2="14"/>
    <line x1="22" y1="11" x2="16" y2="11"/>
  </svg>
);

// ─── Component ───────────────────────────────────────────────────────────────

export default function ActionButton({
  label,
  onClick,
  icon = DEFAULT_ICON,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  type = 'button',
}: ActionButtonProps) {
  return (
    <button
      type={type}
      className={[
        styles.btn,
        styles[variant],
        styles[size],
        fullWidth ? styles.fullWidth : '',
        loading ? styles.loading : '',
      ].join(' ')}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className={styles.spinner} />
      ) : (
        icon && <span className={styles.icon}>{icon}</span>
      )}
      <span className={styles.label}>{loading ? 'Cargando...' : label}</span>
    </button>
  );
}
