// src/components/layout/Filters/fields/SelectFilter.tsx
import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FilterField } from './FilterField';
import styles from '../Filters.module.css';

export interface FilterOption<T extends string = string> {
  value: T;
  label: string;
}

interface SelectFilterProps<T extends string> {
  label: string;
  value: T | undefined;
  onChange: (value: T | undefined) => void;
  options: FilterOption<T>[];
  placeholder?: string;
}

export const SelectFilter = <T extends string>({
  label,
  value,
  onChange,
  options,
  placeholder = 'Todos',
}: SelectFilterProps<T>) => {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value) + 1);
  const listOptions = [{ value: '' as T | '', label: placeholder }, ...options];
  const selectedLabel = listOptions[selectedIndex]?.label ?? placeholder;

  const chooseOption = (index: number) => {
    onChange(listOptions[index].value || undefined);
    setOpen(false);
  };

  return (
    <FilterField label={label}>
      <div className={styles.filterSelectBox}>
        <button
          type="button"
          className={styles.filterSelectTrigger}
          role="combobox"
          aria-label={label}
          aria-expanded={open}
          aria-controls={listId}
          aria-haspopup="listbox"
          aria-activedescendant={open ? `${listId}-option-${activeIndex}` : undefined}
          onClick={() => {
            setActiveIndex(selectedIndex);
            setOpen((current) => !current);
          }}
          onBlur={() => setOpen(false)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              if (!open) {
                setOpen(true);
                setActiveIndex(selectedIndex);
              } else {
                setActiveIndex((index) => Math.min(index + 1, listOptions.length - 1));
              }
            } else if (event.key === 'ArrowUp') {
              event.preventDefault();
              if (!open) {
                setOpen(true);
                setActiveIndex(selectedIndex);
              } else {
                setActiveIndex((index) => Math.max(index - 1, 0));
              }
            } else if (event.key === 'Enter' && open) {
              event.preventDefault();
              chooseOption(activeIndex);
            } else if (event.key === 'Escape') {
              setOpen(false);
            }
          }}
        >
          <span className={value ? undefined : styles.filterSelectPlaceholder}>{selectedLabel}</span>
          <ChevronDown
            size={15}
            aria-hidden="true"
            className={`${styles.filterChevron} ${open ? styles.filterChevronOpen : ''}`}
          />
        </button>
        {open && (
          <ul id={listId} className={styles.filterOptions} role="listbox" aria-label={label}>
            {listOptions.map((option, index) => (
              <li
                id={`${listId}-option-${index}`}
                key={option.value || '__all'}
                role="option"
                aria-selected={option.value === (value ?? '')}
                className={`${styles.filterOption} ${index === activeIndex ? styles.filterOptionActive : ''} ${option.value === (value ?? '') ? styles.filterOptionCurrent : ''}`}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => chooseOption(index)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </FilterField>
  );
};
