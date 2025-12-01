import { api } from './api';
import type { EntityData } from './api';

export const serviciosApi = {
  getAll: () => api.get('/servicio'),
  getById: (id: string) => api.get(`/servicio/${id}`),
  create: (data: EntityData) => api.post('/servicio', data),
  update: (id: string, data: EntityData) => api.put(`/servicio/${id}`, data),
  delete: (id: string) => api.delete(`/servicio/${id}`),
  
  // Métodos específicos para usuario+tarea
  getByUser: (usuarioId: number) => api.get(`/servicio/user/${usuarioId}`),
  upsertByUserAndTask: (data: { tareaId: number; usuarioId: number; precio: number }) => 
    api.post('/servicio/upsert', data),
  deleteByUserAndTask: (usuarioId: number, tareaId: number) => 
    api.delete(`/servicio/user/${usuarioId}/task/${tareaId}`),
  deactivateByUserAndTask: (usuarioId: number, tareaId: number) => 
    api.patch(`/servicio/user/${usuarioId}/task/${tareaId}/deactivate`),
};
