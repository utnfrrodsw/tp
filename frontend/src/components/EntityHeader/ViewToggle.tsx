// src/components/EntityHeader/ViewToggle.tsx
import { LayoutGrid, List } from 'lucide-react';
import styles from './EntityHeader.module.css';

export type ViewMode = 'list' | 'cards';

interface ViewToggleProps {
  value: ViewMode;
  onChange: (view: ViewMode) => void;
}

const OPTIONS = [
  { mode: 'list', label: 'Ver como lista', icon: List },
  { mode: 'cards', label: 'Ver como tarjetas', icon: LayoutGrid },
] as const;

export const ViewToggle = ({ value, onChange }: ViewToggleProps) => (
  <div className={styles.toggle} role="group" aria-label="Tipo de vista">
    {OPTIONS.map(({ mode, label, icon: Icon }) => (
      <button
        key={mode}
        type="button"
        className={`${styles.toggleBtn} ${value === mode ? styles.toggleBtnActive : ''}`}
        aria-pressed={value === mode}
        aria-label={label}
        title={label}
        onClick={() => onChange(mode)}
      >
        <Icon size={16} />
      </button>
    ))}
  </div>
);