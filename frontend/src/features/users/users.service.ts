import { http } from '@/lib/http';
import type { PaginatedResponse } from '@/types/pagination';
import type { User, UpdateUserDto, UsersQuery } from './types';

const BASE = 'users';

export const usersService = {
  getAll: (params: UsersQuery, signal?: AbortSignal) =>
    http.get<PaginatedResponse<User>>(BASE, { params, signal }),

  getById: (id: string, signal?: AbortSignal) =>
    http.get<User>(`${BASE}/${id}`, { signal }),

  update: (id: string, data: UpdateUserDto) =>
    http.put<User>(`${BASE}/${id}`, data),

  // El backend hace baja lógica (status = false)
  remove: (id: string) => http.delete<User>(`${BASE}/${id}`),
};
