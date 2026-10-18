// src/features/clients/services/clients.service.ts
import { http } from '@/lib/http';
import type { BaseQuery, PaginatedResponse } from '@/types/pagination';
import type { ClientType, CreateClientTypeDto, UpdateClientTypeDto } from './types';

const BASE = 'client-types';

export const clientTypesService = {
  getAll: (params: BaseQuery, signal?: AbortSignal) =>
    http.get<PaginatedResponse<ClientType>>(BASE, { params, signal }),

  getById: (id: string, signal?: AbortSignal) =>
    http.get<ClientType>(`${BASE}/${id}`, { signal }),

  create: (data: CreateClientTypeDto) =>
    http.post<ClientType>(BASE, data),

  update: (id: string, data: UpdateClientTypeDto) =>
    http.put<ClientType>(`${BASE}/${id}`, data),

  remove: (id: string) =>
    http.delete<ClientType>(`${BASE}/${id}`),

};
