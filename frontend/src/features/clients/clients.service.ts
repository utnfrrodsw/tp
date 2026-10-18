// src/features/clients/services/clients.service.ts
import { http } from '@/lib/http';
import type { BaseQuery, PaginatedResponse } from '@/types/pagination';
import type { Client, CreateClientDto, UpdateClientDto } from './types';

const BASE = 'clients';

export const clientsService = {
  getAll: (params: BaseQuery, signal?: AbortSignal) =>
    http.get<PaginatedResponse<Client>>(BASE, { params, signal }),

  getById: (id: string, signal?: AbortSignal) =>
    http.get<Client>(`${BASE}/${id}`, { signal }),

  create: (data: CreateClientDto) =>
    http.post<Client>(BASE, data),

  update: (id: string, data: UpdateClientDto) =>
    http.put<Client>(`${BASE}/${id}`, data),

  remove: (id: string) =>
    http.delete<Client>(`${BASE}/${id}`),
};

