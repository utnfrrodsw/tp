import { api } from './api';
import type { EntityData } from './api';
export const usuariosApi = {
  getAll: () => api.get('/usuario'),
  getPrestatariosByTipoServicioAndZona: (
    tipoServicio: string,
    tarea: string,
    zona: string,
    orderBy: string,
    maxItems?: string,
    page?: string
  ) => {
    const params = new URLSearchParams(); // crea los parámetros para pasarlos en la consulta
    if (maxItems !== undefined) params.append('maxItems', maxItems);
    if (page !== undefined) params.append('page', page);
    if (tarea === undefined || tarea === '') tarea = '--tarea--';
    const url = `/usuario/prestatarios/${tipoServicio}/${tarea}/${zona}/${orderBy}${
      params ? `?${params}` : ''
    }`;
    console.log(url);
    return api.get(url);
  },
  getById: (id: string) => api.get(`/usuario/${id}`),
  getByIdOnlyInfo: (id: string) => api.get(`/usuario/onlyInfo/${id}`),
  getByCookie: () => {
    const token = localStorage.getItem('token');
    return api.get(`/usuario/cookie`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  getCommentsByUserId: (
    userId: string,
    maxItems?: string,
    page?: string,
    orderBy?: string
  ) => {
    const params = new URLSearchParams(); // crea los parámetros para pasarlos en la consulta
    if (maxItems !== undefined) params.append('maxItems', maxItems);
    if (page !== undefined) params.append('page', page);
    if (orderBy !== undefined) params.append('orderBy', orderBy);

    const url = `/usuario/comments/${userId}${params ? `?${params}` : ''}`;
    return api.get(url);
  },
  create: (data: EntityData) => api.post('/usuario', data),
  update: (id: string, data: EntityData) => api.put(`/usuario/${id}`, data),
  delete: (id: string) => api.delete(`/usuario/${id}`),
  login: (data: EntityData) => api.get('/usuario/login', { params: data }),
  recoverPassword: (data: EntityData) => api.post('/usuario/recuperar', data),
  validateRecoveryCode: (data: EntityData) =>
    api.post('/usuario/validar-codigo', data),
  cambiarPassword: (data: EntityData) =>
    api.post('/usuario/cambiar-password', data),
  uploadProfileImage: (userId: string, imageFile: File) => {
    const formData = new FormData();
    formData.append('profileImage', imageFile);
    //Con este nombre lo espera el middleware
    return api.post(`/usuario/upload-profile-image/${userId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
