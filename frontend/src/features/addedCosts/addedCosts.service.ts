import { http } from '@/lib/http';
import type { PaginatedResponse } from '@/types/pagination';
import type {
  AddedCost, CreateAddedCostDto, UpdateAddedCostDto, AddedCostsQuery, TotalResponse,
} from './types';

const BASE = 'added-cost'; // singular, como está en el backend

export const addedCostsService = {
  getAll: (params: AddedCostsQuery, signal?: AbortSignal) =>
    http.get<PaginatedResponse<AddedCost>>(BASE, { params, signal }),
  getById: (id: string, signal?: AbortSignal) =>
    http.get<AddedCost>(`${BASE}/${id}`, { signal }),
  getByBudget: (idBudget: string, signal?: AbortSignal) =>
    http.get<AddedCost[]>(`${BASE}/ofBudget/${idBudget}`, { signal }),
  getTotalByBudget: (idBudget: string, signal?: AbortSignal) =>
    http.get<TotalResponse>(`${BASE}/ofBudget/${idBudget}/total`, { signal }),
  create: (data: CreateAddedCostDto) => http.post<AddedCost>(BASE, data),
  update: (id: string, data: UpdateAddedCostDto) =>
    http.put<AddedCost>(`${BASE}/${id}`, data),
  remove: (id: string) => http.delete<{ message?: string }>(`${BASE}/${id}`),
};
