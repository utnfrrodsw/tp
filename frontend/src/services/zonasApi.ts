import { api } from './api';
import type { EntityData } from './api';

export const zonasApi = {
  getAll: () => api.get('/zona'),
  getById: (id: string) => api.get(`/zona/${id}`),
  create: (data: EntityData) => api.post('/zona', data),
  update: (id: string, data: EntityData) => api.put(`/zona/${id}`, data),
  delete: (id: string) => api.delete(`/zona/${id}`),
  getAllPerUser: () => {
    const token = localStorage.getItem('token');

    return api.get('/zona/usuario', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  updateByUser: (id: string, estado: boolean) => {
    const token = localStorage.getItem('token');
    return api.put(
      `/zona/updateByUser/${id}`,
      { estado },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },
};
