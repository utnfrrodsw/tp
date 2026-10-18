import { useEffect, useRef, useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import { BACKEND_URL } from '@/lib/config';
import styles from './SearchBar.module.css';
import { X } from 'lucide-react';
import type { PaginatedResponse } from '@/types/types';

// ─── Filter config ────────────────────────────────────────────────────────────

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'date';
  options?: FilterOption[];
  placeholder?: string;
}

export interface ActiveFilters {
  [key: string]: string;
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface SearchBarProps<T> {
  searchPlaceholder?: string;
  searchEndpoint: string;
  filters?: FilterConfig[];
  showFilters?: boolean;
  onResults: (results: PaginatedResponse<T>) => void;
  onClear?: () => void;
  debounceMs?: number;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function SearchBar<T>({
  searchPlaceholder = 'Buscar...',
  searchEndpoint,
  filters = [],
  showFilters = true,
  onResults,
  onClear,
  debounceMs = 600,
}: SearchBarProps<T>) {
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, debounceMs);
  const baseUrl = BACKEND_URL;

  const emptyResponse = (): PaginatedResponse<T> => ({
    data: [],
    metadata: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
  });

  // Cerrar dropdown al clickear afuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch cuando cambia el query o los filtros
  useEffect(() => {
    const trimmedQuery = debouncedQuery.trim();
    const hasQuery = trimmedQuery.length > 0;
    const hasFilters = Object.values(activeFilters).some(v => v !== '');

    if (!hasQuery && !hasFilters) {
      onClear?.();
      return;
    }

    // 1. Evita disparar la petición con 1 solo carácter si no hay filtros activos (previene el 400)
    if (hasQuery && trimmedQuery.length < 2 && !hasFilters) {
      onResults(emptyResponse());
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();

        if (trimmedQuery) params.set('search', trimmedQuery);

        // 2. Agregar la metadata de paginación por defecto que espera el backend
        params.set('page', '1');
        params.set('limit', '10');

        Object.entries(activeFilters).forEach(([key, value]) => {
          if (value) params.set(key, value);
        });

        const res = await fetch(`${baseUrl}${searchEndpoint}?${params.toString()}`, {
          credentials: 'include',
        });

        if (res.status === 404) {
          onResults(emptyResponse());
          return;
        }
        if (!res.ok) throw new Error(`Error ${res.status}`);

        const data = await res.json();
        onResults(data);
      } catch (e) {
        console.error('SearchBar fetch error:', e);
        onResults(emptyResponse());
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery, activeFilters, baseUrl, searchEndpoint]);

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setActiveFilters({});
  };

  const activeFilterCount = Object.values(activeFilters).filter(v => v !== '').length;

  return (
    <div className={styles.wrapper}>
      {/* ── Search input ── */}
      <div className={styles.searchBox}>
        <span className={styles.searchIcon} aria-hidden="true" />
        <input
          className={styles.searchInput}
          type="text"
          placeholder={searchPlaceholder}
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {loading && <span className={styles.spinner} />}
        {query && (
          <button className={styles.clearBtn} onClick={() => { setQuery(''); onClear?.(); }}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* ── Filters button + dropdown (Ahora condicionado por showFilters) ── */}
      {showFilters && filters.length > 0 && (
        <div className={styles.filterWrapper} ref={dropdownRef}>
          <button
            className={`${styles.filterBtn} ${activeFilterCount > 0 ? styles.filterBtnActive : ''}`}
            onClick={() => setDropdownOpen(prev => !prev)}
          >
            <span className={styles.filterIcon} aria-hidden="true" />
            Filters
            {activeFilterCount > 0 && (
              <span className={styles.filterBadge}>{activeFilterCount}</span>
            )}
          </button>

          {/* ── Dropdown ── */}
          {dropdownOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHeader}>
                <span className={styles.dropdownTitle}>Filtros</span>
                {activeFilterCount > 0 && (
                  <button className={styles.clearFiltersBtn} onClick={clearFilters}>
                    Limpiar todo
                  </button>
                )}
              </div>

              <div className={styles.dropdownBody}>
                {filters.map(filter => (
                  <div className={styles.filterField} key={filter.key}>
                    <label className={styles.filterLabel}>{filter.label}</label>

                    {filter.type === 'select' ? (
                      <select
                        className={styles.filterSelect}
                        value={activeFilters[filter.key] ?? ''}
                        onChange={e => handleFilterChange(filter.key, e.target.value)}
                      >
                        <option value="">{filter.placeholder ?? 'Todos'}</option>
                        {filter.options?.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="date"
                        className={styles.filterSelect}
                        value={activeFilters[filter.key] ?? ''}
                        onChange={e => handleFilterChange(filter.key, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}