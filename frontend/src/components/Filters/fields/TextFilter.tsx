// src/components/layout/Filters/fields/TextFilter.tsx
import { FilterField } from './FilterField';
import styles from '../Filters.module.css';

interface TextFilterProps {
  label: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
}

export const TextFilter = ({ label, value, onChange, placeholder }: TextFilterProps) => (
  <FilterField label={label}>
    <input
      type="text"
      className={styles.filterSelect}
      placeholder={placeholder}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value || undefined)}
    />
  </FilterField>
);
