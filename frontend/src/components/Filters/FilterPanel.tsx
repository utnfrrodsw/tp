// src/components/layout/Filters/FilterPanel.tsx
import type { ReactNode } from 'react';
import styles from './Filters.module.css';

interface FilterPanelProps {
  children: ReactNode;
  open: boolean;
}

export const FilterPanel = ({ children, open }: FilterPanelProps) => {
  if (!open) return null;

  return <div className={styles.panel}>{children}</div>;
};
