// src/components/layout/Filters/fields/DateFilter.tsx
import { FilterField } from './FilterField';
import styles from '../Filters.module.css';

interface DateFilterProps {
  label: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}

export const DateFilter = ({ label, value, onChange }: DateFilterProps) => (
  <FilterField label={label}>
    <input
      type="date"
      className={styles.filterSelect}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value || undefined)}
    />
  </FilterField>
);
