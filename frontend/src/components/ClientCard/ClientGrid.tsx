import ClientCard from './ClientCard';
import type { ClientCardProps } from './ClientCard';
import styles from './ClientGrid.module.css';

interface ClientGridProps {
  clients: ClientCardProps[];
  onCardClick?: (id: number) => void;
  onAddClick?: () => void;
}

export default function ClientGrid({ clients, onCardClick, onAddClick }: ClientGridProps) {
  return (
    <div className={styles.grid}>
      {clients.map(client => (
        <ClientCard
          key={client.id_cliente}
          {...client}
          onClick={onCardClick}
        />
      ))}

      {/* ── Add Another Contact ── */}
      <div className={styles.addCard} onClick={onAddClick}>
        <span className={styles.addIcon}>+</span>
        <span className={styles.addLabel}>Add Another Contact</span>
      </div>
    </div>
  );
}
