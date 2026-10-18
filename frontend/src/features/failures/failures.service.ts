import { http } from '@/lib/http';
import type {
  Failure, CreateFailuresDto, CreateFailuresResponse, UpdateFailureDto,
  UpdateFailureResponse, DeleteFailureResponse, TotalResponse,
} from './types';

const BASE = 'failures';

export const failuresService = {
  getByOrder: (idOrder: string, signal?: AbortSignal) =>
    http.get<Failure[]>(`${BASE}/ofOrder/${idOrder}`, { signal }),
  getTotalByOrder: (idOrder: string, signal?: AbortSignal) =>
    http.get<TotalResponse>(`${BASE}/ofOrder/${idOrder}/total`, { signal }),
  createMany: (data: CreateFailuresDto) =>
    http.post<CreateFailuresResponse>(BASE, data),
  update: (id: string, data: UpdateFailureDto) =>
    http.put<UpdateFailureResponse>(`${BASE}/${id}`, data),
  remove: (id: string) => http.delete<DeleteFailureResponse>(`${BASE}/${id}`),
};
