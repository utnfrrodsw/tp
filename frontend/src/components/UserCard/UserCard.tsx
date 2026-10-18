import styles from './UserCard.module.css';


export interface UserCardProps {
  id_user: string;
  userName: string;
  email: string;
  rol: string;
  status?: boolean;
  validationStatus?: boolean;
  urlPicture?: string;
  onClick?: (id: string) => void;
}



function getInitials(nombre: string): string {
  return nombre
    .split(' ')
    .slice(0, 2)
    .map(n => n[0]?.toUpperCase() ?? '')
    .join('');
}


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

const DEFAULT_PICTURE =
  'https://res.cloudinary.com/dcgvogduy/image/upload/v1778239413/taller-mecanico/j4fv1vtqqrhskyw0owms.png';


export default function UserCard({
  id_user,
  userName,
  email,
  rol,
  status = true,
  validationStatus = true,
  urlPicture,
  onClick,
}: UserCardProps) {
  const initials = getInitials(userName);
  const avatarColor = getAvatarColor(userName);
  const hasCustomPicture = !!urlPicture && urlPicture !== DEFAULT_PICTURE;

  return (
    <div
      className={`${styles.card} ${!status ? styles.inactive : ''}`}
      onClick={() => onClick?.(id_user)}
    >
      <div className={styles.header}>
        {hasCustomPicture ? (
          <img src={urlPicture} alt={userName} className={styles.avatarImg} />
        ) : (
          <div
            className={styles.avatar}
            style={{ background: avatarColor.bg, color: avatarColor.text }}
          >
            {initials}
          </div>
        )}
        <div className={styles.identity}>
          <h3 className={styles.nombre}>{userName}</h3>
          <span className={styles.email}>{email}</span>
        </div>
      </div>

      
      <div className={styles.infoBox}>
        <div className={styles.infoRow}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span>Rol: {rol}</span>
        </div>
        <div className={styles.infoRow}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {validationStatus ? (
              <>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </>
            ) : (
              <>
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </>
            )}
          </svg>
          <span>{validationStatus ? 'Cuenta validada' : 'Pendiente de validación'}</span>
        </div>
      </div>

      {/* ── Tags ── */}
      <div className={styles.tags}>
        <span className={`${styles.tag} ${styles.tagCategory}`}>
          {rol.toUpperCase()}
        </span>
        {!validationStatus && (
          <span className={`${styles.tag} ${styles.tagWarning}`}>
            SIN VALIDAR
          </span>
        )}
      </div>
    </div>
  );
}