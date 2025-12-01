import { api } from './api';
import type { EntityData } from './api';

export const horariosApi = {
  getAll: () => api.get('/horario'),
  getById: (id: string) => api.get(`/horario/${id}`),
  create: (data: EntityData) => api.post('/horario', data),
  update: (id: string, data: EntityData) => api.put(`/horario/${id}`, data),
  delete: (id: string) => api.delete(`/horario/${id}`),
  getByUsuarioId: (usuarioId: number) => api.get(`/horario/${usuarioId}`),
  updateBatchByUsuarioId: (usuarioId: number, data: EntityData[]) => api.put(`/horario/usuario/${usuarioId}`, data),
};
