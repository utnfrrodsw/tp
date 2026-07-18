import styles from './ClientCard.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ClientCardProps {
  id_cliente: number;
  nombre: string;
  dni_cuit: string;
  telefono: string;
  mail: string;
  fecha_registro: string;
  activo: boolean;
  /** Nombre de la categoría de cliente, ej: "VIP CLIENT" */
  categoryClientName?: string;
  /** Última reparación (fecha), viene de las órdenes */
  lastRepair?: string;
  /** Tags adicionales (ej: dispositivos reparados) */
  tags?: string[];
  onClick?: (id: number) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(nombre: string): string {
  return nombre
    .split(' ')
    .slice(0, 2)
    .map(n => n[0]?.toUpperCase() ?? '')
    .join('');
}

// Genera un color de avatar consistente según el nombre
const AVATAR_COLORS = [
  { bg: '#fde8d8', text: '#e8825a' },
  { bg: '#dceefb', text: '#5dade2' },
  { bg: '#fde8f5', text: '#c070a0' },
  { bg: '#d8f5e8', text: '#4caf80' },
  { bg: '#f5f0d8', text: '#b8a040' },
];

function getAvatarColor(nombre: string) {
  const idx = nombre.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ClientCard({
  id_cliente,
  nombre,
  dni_cuit,
  telefono,
  lastRepair,
  categoryClientName,
  tags = [],
  activo,
  onClick,
}: ClientCardProps) {
  const initials = getInitials(nombre);
  const avatarColor = getAvatarColor(nombre);

  return (
    <div
      className={`${styles.card} ${!activo ? styles.inactive : ''}`}
      onClick={() => onClick?.(id_cliente)}
    >
      {/* ── Header ── */}
      <div className={styles.header}>
        <div
          className={styles.avatar}
          style={{ background: avatarColor.bg, color: avatarColor.text }}
        >
          {initials}
        </div>
        <div className={styles.identity}>
          <h3 className={styles.nombre}>{nombre}</h3>
          <span className={styles.dni}>DNI: {dni_cuit}</span>
        </div>
      </div>

      {/* ── Info ── */}
      <div className={styles.infoBox}>
        {lastRepair && (
          <div className={styles.infoRow}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/>
              <polyline points="12 6 12 12 8 14"/>
            </svg>
            <span>Last Repair: {formatDate(lastRepair)}</span>
          </div>
        )}
        <div className={styles.infoRow}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.71 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.58 2.81.71A2 2 0 0 1 22 16.92z"/>
          </svg>
          <span>{telefono}</span>
        </div>
      </div>

      {/* ── Tags ── */}
      {(categoryClientName || tags.length > 0) && (
        <div className={styles.tags}>
          {categoryClientName && (
            <span className={`${styles.tag} ${styles.tagCategory}`}>
              {categoryClientName.toUpperCase()}
            </span>
          )}
          {tags.map(tag => (
            <span key={tag} className={styles.tag}>
              {tag.toUpperCase()}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
