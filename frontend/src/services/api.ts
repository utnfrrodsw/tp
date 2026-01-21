// src/services/api.ts

import axios, { AxiosError } from 'axios';
import type { AxiosInstance } from 'axios';
import { API_BASE_URL } from '../utils/constants';
import type { 
  LoginData, 
  RegisterData, 
  Camiseta, 
  ApiResponse, 
  AuthResponse, 
  CamisetaFiltro, 
  DashboardData,
  Usuario,
  Subasta,
  Oferta,
  CreateSubastaData,
  CreateOfertaData,
  SubastaFiltro,
  Categoria,
  Descuento,
  CamisetaSeleccion
} from '../types';

export class ApiAuthError extends Error {
  constructor(message = 'UNAUTHORIZED') {
    super(message);
    this.name = 'ApiAuthError';
  }
}


const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      return Promise.reject(new ApiAuthError());
    }

    if (import.meta.env.MODE === 'development') {
      console.error('❌ Error en API:', error.response || error.message);
    }

    return Promise.reject(error);
  }
);


export const authService = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return response.data.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return response.data.data;
  },

  changePassword: async (usuarioId: number, contrasenaActual: string, contrasenaNueva: string): Promise<{ message: string }> => {
    const response = await api.post<ApiResponse<{ message: string }>>('/auth/change-password', {
      usuarioId,
      contrasenaActual,
      contrasenaNueva
    });
    return response.data.data;
  },
};


export const camisetaService = {
  async getAll(filtros?: CamisetaFiltro) {
    const params: Record<string, unknown> = {};
    
    if (filtros?.equipo) params.equipo = filtros.equipo;
    if (filtros?.temporada) params.temporada = filtros.temporada;
    if (filtros?.talle) params.talle = filtros.talle;
    if (filtros?.condicion) params.condicion = filtros.condicion;
    if (filtros?.estado) params.estado = filtros.estado;
    if (filtros?.precioMin) params.precioMin = filtros.precioMin;
    if (filtros?.precioMax) params.precioMax = filtros.precioMax;
    if (typeof filtros?.esSubasta === 'boolean') params.esSubasta = filtros.esSubasta;
    if (filtros?.search) params.search = filtros.search;
    if (filtros?.page) params.page = filtros.page;
    if (filtros?.limit) params.limit = filtros.limit;
    if (filtros?.sort) params.sort = filtros.sort;
    if (filtros?.categoriaId) params.categoriaId = filtros.categoriaId;
    
    if (filtros?.usuarioId) params.vendedorId = filtros.usuarioId;
    if (filtros?.vendedorId) params.vendedorId = filtros.vendedorId;

    console.log('camisetaService.getAll -> params:', params);
    
    const response = await api.get<ApiResponse<Camiseta[]>>('/camisetas', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Camiseta> => {
    const response = await api.get<ApiResponse<Camiseta>>(`/camisetas/${id}`);
    return response.data.data;
  },

 
  getByIds: async (ids: number[]): Promise<Camiseta[]> => {
    const response = await api.post<ApiResponse<Camiseta[]>>('/camisetas/by-ids', { ids });
    return response.data.data;
  },

  create: async (camiseta: Partial<Camiseta>): Promise<Camiseta> => {
    const response = await api.post<ApiResponse<Camiseta>>('/camisetas', camiseta);
    return response.data.data;
  },

  update: async (id: number, camiseta: Partial<Camiseta>): Promise<Camiseta> => {
    const response = await api.put<ApiResponse<Camiseta>>(`/camisetas/${id}`, camiseta);
    return response.data.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<ApiResponse<{ message: string }>>(`/camisetas/${id}`);
    return response.data.data;
  },

  publicar: async (data: Partial<Camiseta> & { precioInicial: number; esSubasta?: boolean; stock?: number; categoriaId?: number }): Promise<Camiseta> => {
    const response = await api.post<ApiResponse<Camiseta>>('/camisetas/publicar', data);
    return response.data.data;
  },

  getSeleccion: async (): Promise<{ data: CamisetaSeleccion[] }> => {
    const response = await api.get<ApiResponse<CamisetaSeleccion[]>>('/camisetas/seleccion');
    return {
      data: response.data.data
    };
  }
};


export const adminService = {
  getDashboard: async (): Promise<DashboardData> => {
    const response = await api.get<ApiResponse<DashboardData>>('/admin/dashboard');
    return response.data.data;
  },

  getUsuarios: async (): Promise<Usuario[]> => {
    const response = await api.get<ApiResponse<Usuario[]>>('/usuarios');
    return response.data.data;
  },

  toggleEstadoUsuario: async (id: number): Promise<Usuario> => {
    const response = await api.put<ApiResponse<Usuario>>(`/usuarios/${id}/toggle-estado`);
    return response.data.data;
  },

  updateUsuario: async (id: number, data: Partial<Usuario>): Promise<Usuario> => {
    const response = await api.put<ApiResponse<Usuario>>(`/usuarios/${id}`, data);
    return response.data.data;
  },

  deleteUsuario: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<ApiResponse<{ message: string }>>(`/usuarios/${id}`);
    return response.data.data;
  },
};


export const subastaService = {
  getAll: async (filtros: SubastaFiltro = {}): Promise<{ data: Subasta[]; count: number }> => {
    console.log('🌐 subastaService.getAll llamado con:', filtros);
    
    const params = Object.fromEntries(
      Object.entries(filtros).filter(([, v]) => v !== undefined && v !== null)
    );
    
    console.log(' Params enviados:', params);
    
    try {
      const response = await api.get<ApiResponse<Subasta[]>>('/subastas', { params });
      
      console.log('Respuesta:', {
        status: response.status,
        count: response.data.count,
        cantidad: response.data.data?.length
      });
      
      return {
        data: response.data.data,
        count: response.data.count ?? response.data.data.length
      };
    } catch (error) {
      console.error(' Error en subastaService.getAll:', error);
      throw error;
    }
  },

  getById: async (id: number): Promise<Subasta> => {
    const response = await api.get<ApiResponse<Subasta>>(`/subastas/${id}`);
    return response.data.data;
  },

  create: async (data: CreateSubastaData): Promise<Subasta> => {
    const response = await api.post<ApiResponse<Subasta>>('/subastas', data);
    return response.data.data;
  },

  getOfertas: async (subastaId: number): Promise<Oferta[]> => {
    const response = await api.get<ApiResponse<Oferta[]>>('/ofertas', {
      params: { subastaId }
    });
    return response.data.data;
  },

  getMisSubastas: async (vendedorId: number): Promise<Subasta[]> => {
    const response = await api.get<ApiResponse<Subasta[]>>(`/subastas?vendedorId=${vendedorId}`);
    return response.data.data;
  },
};


export const ofertaService = {
  getAll: async (): Promise<Oferta[]> => {
    const response = await api.get<ApiResponse<Oferta[]>>('/ofertas');
    return response.data.data;
  },

  getById: async (id: number): Promise<Oferta> => {
    const response = await api.get<ApiResponse<Oferta>>(`/ofertas/${id}`);
    return response.data.data;
  },

  create: async (data: CreateOfertaData): Promise<Oferta> => {
    const response = await api.post<ApiResponse<Oferta>>('/ofertas', data);
    return response.data.data;
  },

  getMisOfertas: async (usuarioId: number): Promise<Oferta[]> => {
    const response = await api.get<ApiResponse<Oferta[]>>('/ofertas', {
      params: { usuarioId }
    });
    return response.data.data;
  },

  getBySubasta: async (subastaId: number): Promise<Oferta[]> => {
    const response = await api.get<ApiResponse<Oferta[]>>('/ofertas', {
      params: { subastaId }
    });
    return response.data.data;
  },
};


export const categoriaService = {
  getAll: async (): Promise<{ data: Categoria[]; count: number }> => {
    const response = await api.get<ApiResponse<Categoria[]>>('/categorias');
    return {
      data: response.data.data,
      count: response.data.count ?? response.data.data.length
    };
  },

  getById: async (id: number): Promise<Categoria> => {
    const response = await api.get<ApiResponse<Categoria>>(`/categorias/${id}`);
    return response.data.data;
  },

  create: async (data: { nombre: string; descripcion?: string }): Promise<Categoria> => {
    const response = await api.post<ApiResponse<Categoria>>('/categorias', data);
    return response.data.data;
  },

  update: async (id: number, data: { nombre?: string; descripcion?: string }): Promise<Categoria> => {
    const response = await api.put<ApiResponse<Categoria>>(`/categorias/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<ApiResponse<{ message: string }>>(`/categorias/${id}`);
    return response.data.data;
  },
};


export const descuentoService = {
  getAll: async (params?: { activos?: boolean; vigentes?: boolean }): Promise<{ data: Descuento[]; count: number }> => {
    const response = await api.get<ApiResponse<Descuento[]>>('/descuentos', { params });
    return {
      data: response.data.data,
      count: response.data.count ?? response.data.data.length
    };
  },

  getById: async (id: number): Promise<Descuento> => {
    const response = await api.get<ApiResponse<Descuento>>(`/descuentos/${id}`);
    return response.data.data;
  },

  validarCodigo: async (codigo: string, montoCompra?: number): Promise<{
    valido: boolean;
    descuento?: {
      id: number;
      codigo: string;
      descripcion: string;
      porcentaje: number;
      fechaVencimiento: Date;
    };
    montoDescuento?: number;
  }> => {
    const params = montoCompra ? { montoCompra } : {};
    const response = await api.get(`/descuentos/validar/${codigo}`, { params });
    return response.data;
  },

  create: async (data: {
    codigo: string;
    descripcion: string;
    porcentaje: number;
    fechaInicio: string | Date;
    fechaFin: string | Date;
    tipoAplicacion?: string;
    categoriaId?: number;
    camisetaIds?: number[];
  }): Promise<Descuento> => {
    const response = await api.post<ApiResponse<Descuento>>('/descuentos', data);
    return response.data.data;
  },

  update: async (id: number, data: {
    descripcion?: string;
    porcentaje?: number;
    fechaInicio?: string | Date;
    fechaFin?: string | Date;
    activo?: boolean;
    tipoAplicacion?: string;
    categoriaId?: number;
    camisetaIds?: number[];
  }): Promise<Descuento> => {
    const response = await api.put<ApiResponse<Descuento>>(`/descuentos/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<ApiResponse<{ message: string }>>(`/descuentos/${id}`);
    return response.data.data;
  },
};


export const imagenService = {
  upload: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('imagen', file);

    const response = await api.post<{
      success: boolean;
      data: {
        filename: string;
        path: string;
        size: number;
        mimetype: string;
      };
    }>('/imagenes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.data.success && response.data.data.path) {
      return response.data.data.path;
    }
    throw new Error('No se pudo subir la imagen');
  },

  descargar: async (url: string, nombre?: string): Promise<string> => {
    const response = await api.post<{ success: boolean; path: string }>(
      '/imagenes/descargar',
      { url, nombre }
    );
    if (response.data.success && response.data.path) {
      return response.data.path;
    }
    throw new Error('No se pudo descargar la imagen');
  },
};

export const services = {
  auth: authService,
  camiseta: camisetaService,
  admin: adminService,
  subasta: subastaService,
  oferta: ofertaService,
  categoria: categoriaService,
  descuento: descuentoService,
  imagen: imagenService, 
};

export default api;