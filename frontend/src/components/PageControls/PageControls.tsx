import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { LimitInput } from './LimitInput/LimitInput';
import styles from './PageControls.module.css';

interface PageControlsProps {
  page: number;
  onPageChange: (page: number) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
  total: number;
}

const SUGGESTIONS = [5, 10, 25, 50, 100, 250, 500, 1000];


const getSuggestions = (total: number, limit: number): number[] => {
  const target = Math.max(total, limit);
  const firstCovering = SUGGESTIONS.findIndex((n) => n >= target);
  const list = firstCovering === -1 ? SUGGESTIONS : SUGGESTIONS.slice(0, firstCovering + 1);

  return list.includes(limit) ? list : [...list, limit].sort((a, b) => a - b);
};

export const PageControls = ({
  page,
  onPageChange,
  limit,
  onLimitChange,
  total,
}: PageControlsProps) => {
  const totalPages = Math.max(1, Math.ceil(total / limit));


  const commitPage = (input: HTMLInputElement) => {
    const value = parseInt(input.value, 10);
    const next = Number.isNaN(value) ? page : Math.min(Math.max(1, value), totalPages);

    if (next === page) input.value = String(page);
    else onPageChange(next);
  };

  return (
    <div className={styles.controls}>
      <LimitInput
        value={limit}
        onChange={onLimitChange}
        suggestions={getSuggestions(total, limit)}
        max={SUGGESTIONS[SUGGESTIONS.length - 1]}
        total={total}
      />

      <div className={styles.nav}>
        <button
          type="button"
          className={`${styles.navBtn} ${styles.first}`}
          aria-label="Primera página"
          onClick={() => onPageChange(1)}
          disabled={page <= 1}
        >
          <ChevronsLeft size={12} />
        </button>

        <button
          type="button"
          className={`${styles.navBtn} ${styles.prev}`}
          aria-label="Página anterior"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft size={12} />
        </button>

        <input
          key={page}
          className={styles.pageInput}
          type="text"
          inputMode="numeric"
          aria-label="Número de página"
          defaultValue={page}
          disabled={totalPages <= 1}
          onBlur={(e) => commitPage(e.currentTarget)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitPage(e.currentTarget);
          }}
        />

        <button
          type="button"
          className={`${styles.navBtn} ${styles.next}`}
          aria-label="Página siguiente"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          <ChevronRight size={12} />
        </button>

        <button
          type="button"
          className={`${styles.navBtn} ${styles.last}`}
          aria-label="Última página"
          onClick={() => onPageChange(totalPages)}
          disabled={page >= totalPages}
        >
          <ChevronsRight size={12} />
        </button>
      </div>
    </div>
  );
};

