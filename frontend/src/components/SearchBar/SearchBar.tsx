import { useEffect, useRef, useState } from 'react';
import useDebounce from '@/components/useDebounce';
import styles from './SearchBar.module.css';

// ─── Filter config ────────────────────────────────────────────────────────────

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'date';
  options?: FilterOption[]; // solo para type: 'select'
  placeholder?: string;
}

export interface ActiveFilters {
  [key: string]: string;
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface SearchBarProps {
  searchPlaceholder?: string;
  /** Endpoint de búsqueda, ej: "/clients/search" (recibe ?q=texto&filtro=valor) */
  searchEndpoint: string;
  /** Filtros disponibles en el dropdown */
  filters?: FilterConfig[];
  /** Callback con los resultados del fetch */
  onResults: (results: unknown[]) => void;
  /** Callback cuando se limpia la búsqueda */
  onClear?: () => void;
  debounceMs?: number;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function SearchBar({
  searchPlaceholder = 'Buscar...',
  searchEndpoint,
  filters = [],
  onResults,
  onClear,
  debounceMs = 600,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, debounceMs);

  const baseUrl = `http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}`;

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
    const hasQuery = debouncedQuery.trim().length > 0;
    const hasFilters = Object.values(activeFilters).some(v => v !== '');

    if (!hasQuery && !hasFilters) {
      onClear?.();
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams();

        if (debouncedQuery.trim()) params.set('q', debouncedQuery.trim());
        Object.entries(activeFilters).forEach(([key, value]) => {
          if (value) params.set(key, value);
        });

        const res = await fetch(`${baseUrl}${searchEndpoint}?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 404) { onResults([]); return; }
        if (!res.ok) throw new Error(`Error ${res.status}`);

        const data = await res.json();
        onResults(data);
      } catch (e) {
        console.error('SearchBar fetch error:', e);
        onResults([]);
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
        <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
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
            ✕
          </button>
        )}
      </div>

      {/* ── Filters button + dropdown ── */}
      {filters.length > 0 && (
        <div className={styles.filterWrapper} ref={dropdownRef}>
          <button
            className={`${styles.filterBtn} ${activeFilterCount > 0 ? styles.filterBtnActive : ''}`}
            onClick={() => setDropdownOpen(prev => !prev)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
              <line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
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