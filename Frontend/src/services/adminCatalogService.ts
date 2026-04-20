import { API_BASE_URL } from '../config/api.config';
import { getAccessToken } from '../utils/tokenUtil';

export interface AdminLibro {
  id: number;
  nombre?: string;
  slug?: string;
  imagen?: string;
  sinopsis?: string;
  enlace?: string;
  activo: boolean;
  deletedAt?: string | null;
  createdAt?: string;
  autor?: { id: number; nombre: string; apellido: string; foto?: string; biografia?: string } | null;
}

export interface AdminAutor {
  id: number;
  nombre: string;
  apellido: string;
  foto?: string;
  biografia?: string;
  activo: boolean;
  deletedAt?: string | null;
  createdAt?: string;
}

export interface CreateAdminAutorPayload {
  nombre: string;
  apellido: string;
  biografia?: string;
  foto?: string;
}

export interface CreateAdminLibroPayload {
  nombre: string;
  nombreAutor: string;
  apellidoAutor: string;
  categoriaId: number;
  sinopsis?: string;
  imagen?: string;
  enlace?: string;
  editorialId?: number;
  sagaId?: number;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

const withAuthHeaders = () => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('No hay token de autenticacion');
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const adminCatalogService = {
  async createAutor(payload: CreateAdminAutorPayload) {
    const response = await fetch(`${API_BASE_URL}/autor`, {
      method: 'POST',
      headers: withAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Error al crear autor');
    }

    return data;
  },

  async createLibro(payload: CreateAdminLibroPayload) {
    const response = await fetch(`${API_BASE_URL}/libro`, {
      method: 'POST',
      headers: withAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Error al crear libro');
    }

    return data;
  },

  async getLibros(params: { search?: string; estado?: 'todos' | 'activo' | 'inactivo'; page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.set('search', params.search);
    if (params.estado) searchParams.set('estado', params.estado);
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));

    const response = await fetch(`${API_BASE_URL}/admin/catalogo/libros?${searchParams.toString()}`, {
      headers: withAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Error al obtener libros administrables');
    }

    return data as PaginatedResponse<AdminLibro>;
  },

  async getAutores(params: { search?: string; estado?: 'todos' | 'activo' | 'inactivo'; page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.set('search', params.search);
    if (params.estado) searchParams.set('estado', params.estado);
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));

    const response = await fetch(`${API_BASE_URL}/admin/catalogo/autores?${searchParams.toString()}`, {
      headers: withAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Error al obtener autores administrables');
    }

    return data as PaginatedResponse<AdminAutor>;
  },

  async updateLibro(id: number, payload: Partial<Pick<AdminLibro, 'nombre' | 'sinopsis' | 'imagen' | 'enlace'>>) {
    const response = await fetch(`${API_BASE_URL}/admin/catalogo/libros/${id}`, {
      method: 'PUT',
      headers: withAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Error al actualizar libro');
    }

    return data;
  },

  async updateAutor(id: number, payload: Partial<Pick<AdminAutor, 'nombre' | 'apellido' | 'foto' | 'biografia'>>) {
    const response = await fetch(`${API_BASE_URL}/admin/catalogo/autores/${id}`, {
      method: 'PUT',
      headers: withAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Error al actualizar autor');
    }

    return data;
  },

  async updateLibroEstado(id: number, activo: boolean) {
    const response = await fetch(`${API_BASE_URL}/admin/catalogo/libros/${id}/estado`, {
      method: 'PATCH',
      headers: withAuthHeaders(),
      body: JSON.stringify({ activo }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Error al actualizar estado del libro');
    }

    return data;
  },

  async updateAutorEstado(id: number, activo: boolean) {
    const response = await fetch(`${API_BASE_URL}/admin/catalogo/autores/${id}/estado`, {
      method: 'PATCH',
      headers: withAuthHeaders(),
      body: JSON.stringify({ activo }),
    });

    const data = await response.json();
    if (!response.ok) {
      const error: any = new Error(data.error || 'Error al actualizar estado del autor');
      error.errorCode = data.errorCode;
      error.booksCount = data.booksCount;
      error.books = data.books;
      throw error;
    }

    return data;
  },
};
