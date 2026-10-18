// src/components/EntityHeader/ToolbarButton.tsx
import type { ButtonHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';
import styles from './EntityHeader.module.css';

interface ToolbarButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  icon?: LucideIcon;
  variant?: 'default' | 'primary' | 'danger';
}

const VARIANT_CLASS = {
  default: '',
  primary: styles.btnPrimary,
  danger: styles.btnDanger,
} as const;

export const ToolbarButton = ({
  icon: Icon,
  variant = 'default',
  children,
  ...rest
}: ToolbarButtonProps) => (
  <button type="button" className={`${styles.btn} ${VARIANT_CLASS[variant]}`} {...rest}>
    {Icon && <Icon size={15} />}
    {children}
  </button>
);