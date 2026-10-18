import { http } from '@/lib/http';
import type { PaginatedResponse } from '@/types/pagination';
import type { StatusHistory, RegisterStatusDto, StatusQuery } from './types';

const BASE = 'status';

export const statusService = {
  getAll: (params: StatusQuery, signal?: AbortSignal) =>
    http.get<PaginatedResponse<StatusHistory>>(BASE, { params, signal }),
  getByOrder: (idOrder: string, signal?: AbortSignal) =>
    http.get<StatusHistory[]>(`${BASE}/ofOrder/${idOrder}`, { signal }),
  register: (data: RegisterStatusDto) => http.post<StatusHistory>(BASE, data),
};
