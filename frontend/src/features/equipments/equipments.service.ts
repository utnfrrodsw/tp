import { http } from '@/lib/http';
import type { PaginatedResponse } from '@/types/pagination';
import type {
  Equipment, CreateEquipmentDto, UpdateEquipmentDto, EquipmentsQuery,
} from './types';

const BASE = 'equipments';

export const equipmentsService = {
  getAll: (params: EquipmentsQuery, signal?: AbortSignal) =>
    http.get<PaginatedResponse<Equipment>>(BASE, { params, signal }),
  getById: (id: string, signal?: AbortSignal) =>
    http.get<Equipment>(`${BASE}/${id}`, { signal }),
  getByClient: (idClient: string, signal?: AbortSignal) =>
    http.get<Equipment[]>(`${BASE}/equipmentForClient/${idClient}`, { signal }),
  create: (data: CreateEquipmentDto) => http.post<Equipment>(BASE, data),
  update: (id: string, data: UpdateEquipmentDto) =>
    http.put<Equipment>(`${BASE}/${id}`, data),
  remove: (id: string) => http.delete<Equipment>(`${BASE}/${id}`),
};
