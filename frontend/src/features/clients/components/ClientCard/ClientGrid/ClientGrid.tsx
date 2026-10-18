import ClientCard from '../ClientCard/ClientCard';
import type { ClientCardProps } from '../ClientCard/ClientCard';
import styles from './ClientGrid.module.css';

interface ClientGridProps {
  clients: ClientCardProps[];
  onCardClick?: (id: string) => void;
  onAddClick?: () => void;
  columns?: 2 | 3 | 4;
}

export default function ClientGrid({ clients, onCardClick, onAddClick, columns }: ClientGridProps) {
  return (
    <div className={`${styles.grid} ${styles[`cols${columns}`]}`}>
      {clients.map(client => (
        <ClientCard
          key={client.id_client}
          {...client}
          onClick={onCardClick}
        />
      ))}

      <div className={styles.addCard} onClick={onAddClick}>
        <span className={styles.addIcon}>+</span>
        <span className={styles.addLabel}>Add Another Contact</span>
      </div>
    </div>
  );
}