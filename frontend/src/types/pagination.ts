
export interface PaginatedResponse<T> {
  data: T[];
  metadata: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type SortOrder = "asc" | "desc";

export interface BaseQuery {
  search?: string;
  page: number;
  limit: number;
  sortOrder?: SortOrder;
}