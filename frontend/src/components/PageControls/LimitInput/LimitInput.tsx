// src/components/layout/LimitInput/LimitInput.tsx
import { useId, useState } from 'react';
import styles from './LimitInput.module.css';

interface LimitInputProps {
  value: number;
  total: number;
  onChange: (value: number) => void;
  suggestions: number[];
  max: number;
}

export const LimitInput = ({ value, total, onChange, suggestions, max }: LimitInputProps) => {
  const listId = useId();

  const [draft, setDraft] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const text = draft ?? String(value);

  const options = draft ? suggestions.filter((n) => String(n).startsWith(draft)) : suggestions;
  const showList = open && options.length > 0;

  const close = () => {
    setDraft(null);
    setOpen(false);
    setActive(-1);
  };

  const commit = (raw: string) => {
    const parsed = parseInt(raw, 10);
    const next = Number.isNaN(parsed) ? value : Math.min(Math.max(1, parsed), max);

    if (next !== value) onChange(next);
    close();
  };

  return (
    <div className={styles.box}>
      <input
        className={styles.input}
        style={{ width: `${Math.max(text.length, 1)}ch` }}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        role="combobox"
        aria-label="Registros por página"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        value={text}
        onFocus={(e) => {
          e.currentTarget.select();
          setOpen(true);
        }}
        onChange={(e) => {
          setDraft(e.target.value.replace(/\D/g, ''));
          setOpen(true);
          setActive(-1);
        }}
        onBlur={() => (draft !== null ? commit(draft) : close())}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setOpen(true);
            setActive((i) => Math.min(i + 1, options.length - 1));
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActive((i) => Math.max(i - 1, 0));
          } else if (e.key === 'Enter') {
            commit(active >= 0 ? String(options[active]) : text);
          } else if (e.key === 'Escape') {
            close();
          }
        }}
      />
      <span className={styles.total}>/{total}</span>

      {showList && (
        <ul id={listId} className={styles.list} role="listbox">
          {options.map((n, i) => (
            <li
              key={n}
              role="option"
              aria-selected={i === active}
              className={[
                styles.option,
                i === active && styles.optionActive,
                n === value && styles.optionCurrent,
              ]
                .filter(Boolean)
                .join(' ')}
              onMouseDown={(e) => {
                e.preventDefault();
                commit(String(n));
              }}
              onMouseEnter={() => setActive(i)}
            >
              {n}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};