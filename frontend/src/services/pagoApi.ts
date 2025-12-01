import { api } from './api';
import type { EntityData } from './api';

export interface EstadisticasPagos {
  ingresosMes: number;   
  ingresosAnio: number;  
  clientesMes: number;   // en realidad son la cantidad de trabajos del mes actual
  clientesAnio: number;  // lo mismo
}

export interface EstadisticasResponse {
  message: string;
  data: EstadisticasPagos;
}

export const pagoApi = {
  getAll: () => api.get('/pago'),
  getById: (id: string) => api.get(`/pago/${id}`),
  getEstadisticasByUser: (usuarioId: number) => 
    api.get(`/pago/estadisticas/${usuarioId}`),
  create: (data: EntityData) => api.post('/pago', data),
  update: (id: string, data: EntityData) => api.put(`/pago/${id}`, data),
  delete: (id: string) => api.delete(`/pago/${id}`),
};
