import { api } from './api';
import type { EntityData } from './api';

export const turnosApi = {
  getAll: () => api.get('/turno'),
  getById: (id: string) => api.get(`/turno/${id}`),
  getByUserId: (
    cantItemsPerPage: number,
    currentPage: number,
    selectedValueShow?: string,
    selectedValueOrder?: string
  ) => {
    // Construir la URL con parámetros en la ruta como espera el backend
    // Usar 'all' como valor por defecto para selectedValueShow si está vacío
    const filterValue = selectedValueShow || 'all';
    const orderValue = selectedValueOrder || '';

    let url = `/turno/byUser/${cantItemsPerPage}/${currentPage}/${filterValue}`;
    if (orderValue) {
      url += `/${orderValue}`;
    }
    const token = localStorage.getItem('token');
    return api.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  getByPrestadorId: (
    id: string,
    cantItemsPerPage: string,
    currentPage: string,
    selectedValueShow?: string,
    selectedValueOrder?: string,
    searchQuery?: string
  ) => {
    // contruyo la url con el array
    const parts = [
      'turno',
      'byPrestador',
      id,
      cantItemsPerPage,
      currentPage,
      selectedValueShow || 'all',
    ];

    // chequeo por si existen tanto el selectedValueOrder como el searchQuery pero no son vacios,
    //para armar la url bien
    if (selectedValueOrder && selectedValueOrder.trim() !== '') {
      parts.push(selectedValueOrder.trim());
    } else if (searchQuery && searchQuery.trim() !== '') {
      parts.push('none');
    }
    if (searchQuery && searchQuery.trim() !== '') {
      parts.push(encodeURIComponent(searchQuery.trim()));
    }
    const url = '/' + parts.join('/');
    console.log('URL construida:', url);
    return api.get(url);
  },
  create: (data: EntityData) => api.post('/turno', data),
  createWithCookie: (data: EntityData) => {
    const token = localStorage.getItem('token');
    return api.post('/turno/cookie', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  update: (id: string, data: EntityData) => api.put(`/turno/${id}`, data),
  delete: (id: string) => api.delete(`/turno/${id}`),
  getTurnsPerDay: (id: string, date: string) =>
    api.get(`turno/turnosPorDia/${id}/${date}`),

  updateMultipleEstados: async (turnoIds: number[], nuevoEstado: string) => {
    return Promise.all(
      turnoIds.map((id) =>
        api.patch(`/turno/${id}`, { estado: nuevoEstado.toLowerCase() })
      )
    );
  },
};
