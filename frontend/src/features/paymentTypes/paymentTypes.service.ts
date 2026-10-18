import { http } from '@/lib/http';
import type { PaginatedResponse } from '@/types/pagination';
import type {
  PaymentType, CreatePaymentTypeDto, UpdatePaymentTypeDto, PaymentTypesQuery,
} from './types';

const BASE = 'payment-types';

export const paymentTypesService = {
  getAll: (params: PaymentTypesQuery, signal?: AbortSignal) =>
    http.get<PaginatedResponse<PaymentType>>(BASE, { params, signal }),
  getById: (id: string, signal?: AbortSignal) =>
    http.get<PaymentType>(`${BASE}/${id}`, { signal }),
  create: (data: CreatePaymentTypeDto) => http.post<PaymentType>(BASE, data),
  update: (id: string, data: UpdatePaymentTypeDto) =>
    http.put<PaymentType>(`${BASE}/${id}`, data),
  remove: (id: string) => http.delete<{ message: string }>(`${BASE}/${id}`),
};
