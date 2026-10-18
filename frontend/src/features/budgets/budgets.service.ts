import { http } from '@/lib/http';
import type { PaginatedResponse } from '@/types/pagination';
import type {
  Budget, CreateBudgetDto, UpdateBudgetDto, BudgetsQuery, BudgetRespondDto,
} from './types';

const BASE = 'budgets';

export const budgetsService = {
  getAll: (params: BudgetsQuery, signal?: AbortSignal) =>
    http.get<PaginatedResponse<Budget>>(BASE, { params, signal }),
  getById: (id: string, signal?: AbortSignal) =>
    http.get<Budget>(`${BASE}/${id}`, { signal }),
  getByOrder: (idOrder: string, signal?: AbortSignal) =>
    http.get<Budget>(`${BASE}/ofOrder/${idOrder}`, { signal }),
  create: (data: CreateBudgetDto) => http.post<Budget>(BASE, data),
  update: (id: string, data: UpdateBudgetDto) =>
    http.put<Budget>(`${BASE}/${id}`, data),
  updateByTech: (id: string, data: UpdateBudgetDto) =>
    http.put<Budget>(`${BASE}/modifyBudget/${id}`, data),
  remove: (id: string) => http.delete<unknown>(`${BASE}/${id}`),
  sendEmail: (id: string) =>
    http.post<{ message: string }>(`${BASE}/${id}/send-email`),
};

// Endpoints públicos (sin auth, usan el token del mail)
export const budgetsPublicService = {
  getByToken: (token: string, signal?: AbortSignal) =>
    http.get<Budget>(`${BASE}/public/${token}`, { signal }),
  respond: (token: string, data: BudgetRespondDto) =>
    http.post<{ ok: boolean }>(`${BASE}/public/${token}/respond`, data),
};
