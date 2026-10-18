import { keepPreviousData, useQuery, type QueryKey, type UseQueryOptions, } from "@tanstack/react-query";
import type { PaginatedResponse, BaseQuery } from "../types/pagination";
import { useCallback, useState } from "react";

type ExtraOptions<T> = Omit<
  UseQueryOptions<PaginatedResponse<T>, Error>,
  "queryKey" | "queryFn" | "placeholderData"
>;

interface Options<T, Q extends BaseQuery> extends ExtraOptions<T> {
  queryKey: QueryKey;
  queryFn: (query: Q, signal: AbortSignal) => Promise<PaginatedResponse<T>>;
  initialQuery?: Q;
}

export const usePagination = <T, Q extends BaseQuery = BaseQuery>({
  queryKey,
  queryFn,
  initialQuery,
  ...options
}: Options<T, Q>) => {
  const [query, setQuery] = useState<Q>(initialQuery ?? ({} as Q));

  const result = useQuery({
    queryKey: [...queryKey, query],
    queryFn: ({ signal }) => queryFn(query, signal),
    placeholderData: keepPreviousData,
    ...options,
  });

  const setPage = useCallback(
    (page: number) => setQuery((q) => ({ ...q, page })),
    []
  );

  const updateQuery = useCallback(
    (patch: Partial<Q>) => setQuery((q) => ({ ...q, ...patch, page: 1 })),
    []
  );

  return {
    items: result.data?.data ?? [],
    metadata: result.data?.metadata,
    query,
    setPage,
    updateQuery,
    isLoading: result.isPending,
    isFetching: result.isFetching,
    isPlaceholderData: result.isPlaceholderData,
    error: result.error,
    refetch: result.refetch,
  };
}

export type UsePaginationResult<T, Q extends BaseQuery = BaseQuery> = ReturnType<
  typeof usePagination<T, Q>
>;