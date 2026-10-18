import { http } from '@/lib/http';
import type { PaginatedResponse } from '@/types/pagination';
import type {
  FailureType, CreateFailureTypeDto, UpdateFailureTypeDto, FailureTypesQuery,
} from './types';

const BASE = 'failure-types';

export const failureTypesService = {
  getAll: (params: FailureTypesQuery, signal?: AbortSignal) =>
    http.get<PaginatedResponse<FailureType>>(BASE, { params, signal }),
  getById: (id: string, signal?: AbortSignal) =>
    http.get<FailureType>(`${BASE}/${id}`, { signal }),
  create: (data: CreateFailureTypeDto) => http.post<FailureType>(BASE, data),
  update: (id: string, data: UpdateFailureTypeDto) =>
    http.put<FailureType>(`${BASE}/${id}`, data),
  remove: (id: string) => http.delete<{ message: string }>(`${BASE}/${id}`),
};
