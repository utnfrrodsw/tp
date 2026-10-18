// SectionCard.tsx
import type { ReactNode } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from '@/components/ui/card';
import styles from './SectionCard.module.css';

export interface SectionCardProps {
  icon: ReactNode;
  /** true si el ícono es una <img> (aplica padding y object-fit) */
  iconIsImage?: boolean;
  title: string;
  description?: string;
  footer?: ReactNode;
  /** Footer con elementos separados a los extremos */
  footerBetween?: boolean;
  /** 'table' quita el padding superior y permite scroll horizontal */
  contentVariant?: 'default' | 'table';
  children: ReactNode;
}

export default function SectionCard({
  icon,
  iconIsImage = false,
  title,
  description,
  footer,
  footerBetween = false,
  contentVariant = 'default',
  children,
}: SectionCardProps) {
  return (
    <Card className={styles.card}>
      <CardHeader className={styles.cardHeader}>
        <div className={styles.sectionHeading}>
          <div className={`${styles.sectionIcon} ${iconIsImage ? styles.sectionIconImage : ''}`}>
            {icon}
          </div>
          <div>
            <CardTitle className={styles.cardTitle}>{title}</CardTitle>
            {description && (
              <CardDescription className={styles.cardDescription}>{description}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent
        className={`${styles.cardContent} ${contentVariant === 'table' ? styles.tableContent : ''}`}
      >
        {children}
      </CardContent>

      {footer && (
        <CardFooter className={`${styles.cardFooter} ${footerBetween ? styles.cardFooterBetween : ''}`}>
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}