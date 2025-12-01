import { api } from './api';
import type { EntityData } from './api';

export const tareasApi = {
  getAll: () => api.get('/tarea'),
  getById: (id: string) => api.get(`/tarea/${id}`),
  create: (data: EntityData) => api.post('/tarea', data),
  update: (id: string, data: EntityData) => api.put(`/tarea/${id}`, data),
  delete: (id: string) => api.delete(`/tarea/${id}`),
};
