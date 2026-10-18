import { http } from '@/lib/http';
import type { PaginatedResponse } from '@/types/pagination';
import type {
  Order, CreateOrderDto, CreateOrderResponse, OrderStats, OrdersQuery,
} from './types';

const BASE = 'orders';

export const ordersService = {
  getAll: (params: OrdersQuery, signal?: AbortSignal) =>
    http.get<PaginatedResponse<Order>>(BASE, { params, signal }),
  getById: (id: string, signal?: AbortSignal) =>
    http.get<Order>(`${BASE}/${id}`, { signal }),
  getByEquipment: (idEquipment: string, signal?: AbortSignal) =>
    http.get<Order[]>(`${BASE}/ofEquipment/${idEquipment}`, { signal }),
  getStats: (signal?: AbortSignal) =>
    http.get<OrderStats>(`${BASE}/stats`, { signal }),
  create: (data: CreateOrderDto) => http.post<CreateOrderResponse>(BASE, data),
};
