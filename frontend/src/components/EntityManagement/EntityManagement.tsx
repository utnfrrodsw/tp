// src/components/EntityManagement/EntityManagement.tsx
import { useState, type ComponentProps, type ComponentType } from 'react';
import type { QueryKey } from '@tanstack/react-query';
import { usePagination } from '@/hooks/usePagination';
import { EntityHeader, ToolbarButton, type ViewMode } from '@/components/EntityHeader';
import { SearchBarV2 } from '@/components/SearchBarV2/SearchBarV2';
import DataTable, { type ColumnConfig } from '@/components/Common/DataTable/DataTable';
import DataCard from '@/components/Common/DataCard/DataCard';
import type { BaseQuery, PaginatedResponse } from '@/types/pagination';
import styles from './EntityManagement.module.css';
import type { LucideIcon } from 'lucide-react';



export interface EntityConfig<T extends object, Q extends BaseQuery> {
  title: string;
  queryKey: QueryKey;
  queryFn: (query: Q, signal: AbortSignal) => Promise<PaginatedResponse<T>>;
  idField: keyof T;
  columns: ColumnConfig<T>[];
  actions?: ActionConfig<T>[];
  onItemClick?: (item: T, helpers: EntityHelpers) => void;
  card: { titleField: keyof T; descriptionField?: keyof T, imageField?: keyof T, };
  searchPlaceholder?: string;
  filterKeys?: (keyof Q)[];
  initialQuery?: Q;
}

export interface EntityHelpers {
  clearSelection: () => void;
}

export interface ActionConfig<T extends object> {
  label: string;
  icon?: LucideIcon;
  variant?: ComponentProps<typeof ToolbarButton>['variant'];
  selection?: 0 | 1 | 'multiple';
  onClick: (items: T[], helpers: EntityHelpers) => void;
}

export interface FiltersProps<Q extends BaseQuery> {
  query: Q;
  updateQuery: (patch: Partial<Q>) => void;
}

interface EntityManagementProps<T extends object, Q extends BaseQuery> {
  config: EntityConfig<T, Q>;
  Filters?: ComponentType<FiltersProps<Q>>;
}

export function EntityManagement<T extends object, Q extends BaseQuery>({
  config,
  Filters,
}: EntityManagementProps<T, Q>) {
  const { title, queryKey, queryFn, idField, columns, actions, onItemClick, card, searchPlaceholder, filterKeys, initialQuery } = config;

  const [selectedId, setSelectedId] = useState<T[keyof T]>();
  const [selectedIds, setSelectedIds] = useState<T[keyof T][]>([]);
  const [view, setView] = useState<ViewMode>('list');

  const pagination = usePagination<T, Q>({
    queryKey,
    queryFn,
    initialQuery: initialQuery ?? ({ page: 1, limit: 10 } as Q),
  });

  const { items, query, updateQuery, isLoading, isFetching, error } = pagination;


  const clearSelection = () => {
    setSelectedId(undefined);
    setSelectedIds([]);
  };
  const helpers: EntityHelpers = { clearSelection };

  const selectedItems =
    selectedIds.length > 0
      ? items.filter((item) => selectedIds.includes(item[idField]))
      : items.filter((item) => selectedId !== undefined && item[idField] === selectedId);

  const handleSelect = (item: T, fromCheckbox = false) => {
    const id = item[idField];

    if (fromCheckbox || selectedIds.length > 0) {
      setSelectedId(undefined);
      setSelectedIds((current) =>
        current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
      );
      return;
    }

    if (selectedId === id) {
      setSelectedId(undefined);
      return;
    }
    setSelectedId(id);
    onItemClick?.(item, helpers);
  };

  return (
    <div className={styles.page}>
      <EntityHeader title={title} view={view} onViewChange={setView}>
        {actions && actions.map((action) =>
          <ToolbarButton
            key={action.label}
            icon={action.icon}
            variant={action.variant}
            disabled={
              action.selection === 1
                ? selectedItems.length !== 1
                : action.selection === 'multiple'
                  ? selectedItems.length === 0
                  : false
            }
            onClick={() => action.onClick(selectedItems, helpers)}
          >
            {action.label}
          </ToolbarButton>

        )}
      </EntityHeader>

      <SearchBarV2
        pagination={pagination}
        searchPlaceholder={searchPlaceholder}
        filterKeys={filterKeys}>
        {Filters ? <Filters query={query} updateQuery={updateQuery} /> : undefined}
      </SearchBarV2>

      {isLoading ? (
        <p>Cargando datos...</p>
      ) : error ? (
        <p>{error.message}</p>
      ) : (
        <div className={isFetching ? styles.fetching : undefined}>
          {view === 'list' ? (
            <DataTable
              data={items}
              idField={idField}
              columns={columns}
              selectedId={selectedId}
              selectedIds={selectedIds}
              onRowClick={(item) => handleSelect(item)}
              onSelectItem={(item) => handleSelect(item, true)}
            />
          ) : (
            <DataCard
              data={items}
              idField={idField}
              titleField={card.titleField}
              descriptionField={card.descriptionField}
              imageField={card.imageField}
              fields={columns.filter((c) => c.key !== card.titleField && c.key !== card.descriptionField && c.key !== card.imageField)}
              selectedId={selectedId}
              selectedIds={selectedIds}
              onCardClick={(item) => handleSelect(item)}
              onSelectItem={(item) => handleSelect(item, true)}
            />
          )}
        </div>
      )}
    </div>
  );
}