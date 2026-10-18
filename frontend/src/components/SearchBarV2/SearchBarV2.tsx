// src/components/SearchBarV2/SearchBarV2.tsx
import { FilterButton, FilterPanel } from '@/components/Filters';
import { useState, type ReactNode } from 'react';
import type { UsePaginationResult } from '@/hooks/usePagination';
import type { BaseQuery } from '@/types/pagination';
import { PageControls } from '@/components/PageControls/PageControls';
import SearchInput from '@/components/SearchInput/SearchInput';
import Wrapper from '@/components/Wrapper/Wrapper';

type SearchBarV2Pagination<Q extends BaseQuery> = Pick<
  UsePaginationResult<unknown, Q>,
  'query' | 'metadata' | 'setPage' | 'updateQuery' | 'isFetching'
>;

interface SearchBarV2Props<Q extends BaseQuery> {
  pagination: SearchBarV2Pagination<Q>;   // antes era un objeto escrito a mano
  searchPlaceholder?: string;
  filterKeys?: (keyof Q)[];
  children?: ReactNode;
}

export function SearchBarV2<Q extends BaseQuery>({
  pagination,
  searchPlaceholder = 'Buscar...',
  filterKeys = [],
  children,
}: SearchBarV2Props<Q>) {
  const { query, metadata, setPage, updateQuery, isFetching } = pagination;
  const [open, setOpen] = useState(false);

  const activeCount = filterKeys.filter((key) => Boolean(query[key])).length;

  const clearFilters = () =>
    updateQuery(Object.fromEntries(filterKeys.map((key) => [key, undefined])) as Partial<Q>);

  return (
    <Wrapper>
      <SearchInput
        placeholder={searchPlaceholder}
        loading={isFetching}
        onSearch={(text) => updateQuery({ search: text || undefined } as Partial<Q>)}
      />

      {filterKeys.length > 0 && (
        <FilterButton
          activeCount={activeCount}
          open={open}
          onToggle={() => setOpen((o) => !o)}
          onClear={clearFilters}
        />
      )}

      {metadata && (
        <PageControls
          page={query.page ?? metadata.page}
          limit={query.limit ?? metadata.limit}
          total={metadata.total}
          onPageChange={setPage}
          onLimitChange={(limit) => updateQuery({ limit } as Partial<Q>)}
        />
      )}

      <FilterPanel open={open}>
        {children}
      </FilterPanel>
    </Wrapper>
  );
}