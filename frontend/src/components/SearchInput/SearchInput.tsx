// src/components/layout/SearchInput/SearchInput.tsx
import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import styles from './SearchInput.module.css';

interface SearchInputProps {
  onSearch: (text: string) => void;
  placeholder?: string;
  defaultValue?: string;
  loading?: boolean;
  minChars?: number;
  debounceMs?: number;
}

export default function SearchInput({
  onSearch,
  placeholder = 'Buscar...',
  defaultValue = '',
  loading = false,
  minChars = 1,
  debounceMs = 300,
}: SearchInputProps) {
  const [text, setText] = useState(defaultValue);

  const pushSearch = useDebouncedCallback((value: string) => {
    const trimmed = value.trim();
    if (trimmed.length > 0 && trimmed.length < minChars) return;
    onSearch(trimmed);
  }, debounceMs);

  const handleChange = (value: string) => {
    setText(value);
    pushSearch(value);
  };

  return (
    <div className={styles.searchBox}>
      <Search className={styles.searchIcon} size={16} />

      <input
        className={styles.searchInput}
        type="text"
        placeholder={placeholder}
        value={text}
        onChange={(e) => handleChange(e.target.value)}
      />

      {loading && <span className={styles.spinner} />}

      {text && (
        <button
          type="button"
          className={styles.clearBtn}
          aria-label="Limpiar búsqueda"
          onClick={() => handleChange('')}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}