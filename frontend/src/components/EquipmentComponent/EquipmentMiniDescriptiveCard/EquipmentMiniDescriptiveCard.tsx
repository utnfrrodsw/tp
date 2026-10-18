// EquipmentMiniDescriptiveCard.tsx
import { Smartphone, Laptop, Monitor, Tablet, Watch, Wrench } from 'lucide-react';
import { type Equipment } from '@/types/types';
import styles from './EquipmentMiniDescriptiveCard.module.css';

export interface EquipmentMiniDescriptiveCardProps {
  equipment: Equipment;
  reason?: string; 
  onClick?: (id_equipment: string) => void;
}


const getEquipmentIcon = (tipo?: string) => {
  const key = tipo?.trim().toLowerCase() ?? '';

  if (key.includes('celular') || key.includes('phone')) return Smartphone;
  if (key.includes('notebook') || key.includes('laptop')) return Laptop;
  if (key.includes('pc') || key.includes('computadora') || key.includes('monitor')) return Monitor;
  if (key.includes('tablet')) return Tablet;
  if (key.includes('reloj') || key.includes('watch')) return Watch;

  return Wrench;
};

const EquipmentMiniDescriptiveCard = ({ equipment, reason, onClick }: EquipmentMiniDescriptiveCardProps) => {
  const clickable = typeof onClick === 'function';

  const title = `${equipment.brand ?? ''} ${equipment.model ?? ''}`.trim() || `Equipo #${equipment.id_equipment}`;
  const subtitle = reason ?? equipment.observations ?? equipment.tipo_equipment;

  const Icon = getEquipmentIcon(equipment.tipo_equipment);

  return (
    <div
      className={`${styles.card} ${clickable ? styles.clickable : ''}`}
      onClick={clickable ? () => onClick!(equipment.id_equipment) : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      <span className={styles.iconWrap}>
        <Icon size={18} className={styles.icon} />
      </span>

      <div className={styles.info}>
        <span className={styles.title}>{title}</span>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </div>
    </div>
  );
};

export default EquipmentMiniDescriptiveCard;