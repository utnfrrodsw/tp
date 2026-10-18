import { useMemo } from 'react';
import { type Order } from '@/types/types';
import StatusMiniDescriptiveCard from '@/components/Status/StatusMiniDescriptiveCard/StatusMiniDescriptiveCard';
import styles from './StatusHistoryTimeLine.module.css';

export interface StatusHistoryTimelineProps {
  order: Order;
  title?: string;
  onClickStatus?: (id_status_history: string) => void;
}

const StatusHistoryTimeline = ({
  order,
  title = 'Historial de Estados',
  onClickStatus,
}: StatusHistoryTimelineProps) => {
  // Más reciente primero
  const sortedHistory = useMemo(
    () =>
      [...(order.statusHistory ?? [])].sort(
        (a, b) => new Date(b.dateOfChange).getTime() - new Date(a.dateOfChange).getTime()
      ),
    [order.statusHistory]
  );

  if (sortedHistory.length === 0) {
    return (
      <div className={styles.wrap}>
        <span className={styles.title}>{title}</span>
        <p className={styles.emptyText}>Todavía no hay cambios de estado registrados.</p>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <span className={styles.title}>{title}</span>

      <div className={styles.timeline}>
        {sortedHistory.map((entry, index) => {
          const isFirst = index === 0;
          const isLast = index === sortedHistory.length - 1;

          return (
            <div key={entry.id_status_history} className={styles.item}>
              <div className={styles.trackColumn}>
                <span className={`${styles.dot} ${isFirst ? styles.dotActive : ''}`} />
                {!isLast && <span className={styles.line} />}
              </div>

              <div className={styles.cardSlot}>
                <StatusMiniDescriptiveCard
                  statusHistory={entry}
                  active={isFirst}
                  onClick={onClickStatus}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusHistoryTimeline;