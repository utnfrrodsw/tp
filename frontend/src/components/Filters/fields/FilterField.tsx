// src/components/layout/Filters/fields/FilterField.tsx
import type { ReactNode } from 'react';
import styles from '../Filters.module.css';

interface FilterFieldProps {
  label: string;
  children: ReactNode;
}

// El label envuelve al control, así queda asociado sin necesitar ids
export const FilterField = ({ label, children }: FilterFieldProps) => (
  <label className={styles.filterField}>
    <span className={styles.filterLabel}>{label}</span>
    {children}
  </label>
);
