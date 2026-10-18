import styles from './SmallClientCard.module.css'

export interface ClientMiniCardProps {
  id_client?: string;
  clientName: string;
  registrationYear: number | string;
  urlPicture?: string;
  onClick?: (id?: string) => void;
}

const AVATAR_COLORS = [
  { bg: '#dceefb', text: '#1d4ed8' },
  { bg: '#fde8d8', text: '#e8825a' },
  { bg: '#fde8f5', text: '#c070a0' },
  { bg: '#d8f5e8', text: '#4caf80' },
  { bg: '#f5f0d8', text: '#b8a040' },
];

function getInitials(nombre: string): string {
  return nombre
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('');
}

function getAvatarColor(nombre: string) {
  const idx = nombre.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

const ClientMiniCard = ({
  id_client,
  clientName,
  registrationYear,
  urlPicture,
  onClick,
}: ClientMiniCardProps) => {
  const initials = getInitials(clientName);
  const avatarColor = getAvatarColor(clientName);
  const clickable = typeof onClick === 'function';
  function formatDate(dateValue: number | string): string {
    if (!dateValue) return '';
    
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return String(dateValue);

    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }

  return (
    <div
      className={`${styles.card} ${clickable ? styles.clickable : ''}`}
      onClick={clickable ? () => onClick!(id_client) : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      {urlPicture ? (
        <img src={urlPicture} alt={clientName} className={styles.avatarImg} />
      ) : (
        <div
          className={styles.avatar}
          style={{ background: avatarColor.bg, color: avatarColor.text }}
        >
          {initials}
        </div>
      )}
      <div className={styles.info}>
        <span className={styles.name}>{clientName}</span>
        <span className={styles.subtitle}>
          Cliente desde {formatDate(registrationYear)}
        </span>
      </div>
    </div>
  );
};

export default ClientMiniCard;