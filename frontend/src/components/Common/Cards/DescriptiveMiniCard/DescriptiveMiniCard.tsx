// DescriptiveMiniCard.tsx
import { type LucideIcon } from 'lucide-react';
import styles from './DescriptiveMiniCard.module.css';

export type DescriptiveCardTone = 'neutral' | 'info' | 'warning' | 'success' | 'danger';

export interface DescriptiveMiniCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: DescriptiveCardTone;
  onClick?: () => void;
}

const DescriptiveMiniCard = ({
  label,
  value,
  icon: Icon,
  tone = 'neutral',
  onClick,
}: DescriptiveMiniCardProps) => {
  const clickable = typeof onClick === 'function';

  return (
    <div
      className={`${styles.card} ${styles[tone]} ${clickable ? styles.clickable : ''}`}
      onClick={clickable ? onClick : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      <div className={styles.info}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{value}</span>
      </div>

      <span className={styles.iconWrap}>
        <Icon size={20} className={styles.icon} />
      </span>
    </div>
  );
};

export default DescriptiveMiniCard;