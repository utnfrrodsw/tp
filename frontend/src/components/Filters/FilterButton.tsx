// src/components/layout/Filters/FilterButton.tsx
import styles from './Filters.module.css';
import { Eraser } from 'lucide-react';

interface FilterButtonProps {
  activeCount: number;
  open: boolean;
  onToggle: () => void;
  onClear: () => void;
}

export const FilterButton = ({ activeCount, open, onToggle, onClear }: FilterButtonProps) => (
  <div className={`${styles.filterBtnWrapper} ${activeCount > 0 ? styles.filterBtnWrapperActive : ''}`}>
    <button
      type="button"
      className={`${styles.filterBtn} ${activeCount > 0 ? styles.filterBtnActive : ''}`}
      aria-expanded={open}
      onClick={onToggle}
    >
      <span className={styles.filterIcon} aria-hidden="true" />
      Filtros
      {activeCount > 0 && <span className={styles.filterBadge}>{activeCount}</span>}
    </button>
    <button
      type="button"
      className={styles.clearFiltersControl}
      aria-label="Limpiar filtros"
      aria-hidden={activeCount === 0}
      title="Limpiar filtros"
      tabIndex={activeCount > 0 ? 0 : -1}
      disabled={activeCount === 0}
      onClick={onClear}
    >
      <Eraser size={16} />
    </button>
  </div>
);
