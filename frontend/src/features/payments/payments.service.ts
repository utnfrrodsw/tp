import { http } from '@/lib/http';
import type { PaginatedResponse } from '@/types/pagination';
import type { Payment, CreatePaymentDto, PaymentsQuery } from './types';

// ⚠ payment.routes.ts no está montado en server/src/api/routes.ts
const BASE = 'payments';

export const paymentsService = {
  getAll: (params: PaymentsQuery, signal?: AbortSignal) =>
    http.get<PaginatedResponse<Payment>>(BASE, { params, signal }),
  getById: (id: string, signal?: AbortSignal) =>
    http.get<Payment>(`${BASE}/${id}`, { signal }),
  getByBudget: (idBudget: string, signal?: AbortSignal) =>
    http.get<Payment[]>(`${BASE}/ofBudget/${idBudget}`, { signal }),
  create: (data: CreatePaymentDto) => http.post<Payment>(BASE, data),
  remove: (id: string) => http.delete<Payment>(`${BASE}/${id}`),
};
