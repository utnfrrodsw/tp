import axios from 'axios';

// Base API configuration
const API_BASE_URL = 'https://TU_APP.fly.dev/api'; // Cambia TU_APP por el nombre real de tu app en Fly.io

// Create axios instance with interceptors
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available in localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle common errors
apiClient.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', error);

    // Handle common HTTP errors
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Forbidden
      console.error('Access forbidden');
    } else if (error.response?.status >= 500) {
      // Server error
      console.error('Server error');
    }

    return Promise.reject(error);
  }
);

// Types and interfaces
export interface Prestador {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  rubros: string[];
  puntuacion: number;
  zona: string;
  descripcion?: string;
  precio?: number;
}

export interface FilterParams {
  servicio?: string;
  zona?: string;
  ordenarPor?: string;
  minPuntuacion?: number;
  maxPrecio?: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  total?: number;
  page?: number;
  limit?: number;
}

// Service functions
export const serviciosService = {
  // GET: Fetch all service providers
  getAllPrestadores: async (): Promise<Prestador[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Prestador[]>>(
        '/prestadores'
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching prestadores:', error);
      throw new Error('Failed to fetch service providers');
    }
  },

  // GET: Fetch service provider by ID
  getPrestadorById: async (id: number): Promise<Prestador> => {
    try {
      const response = await apiClient.get<ApiResponse<Prestador>>(
        `/prestadores/${id}`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching prestador ${id}:`, error);
      throw new Error(`Failed to fetch service provider with ID ${id}`);
    }
  },

  // GET: Fetch filtered service providers
  getFilteredPrestadores: async (
    filters: FilterParams
  ): Promise<Prestador[]> => {
    try {
      // Convert filters to query parameters
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get<ApiResponse<Prestador[]>>(
        `/prestadores/filter?${params.toString()}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching filtered prestadores:', error);
      throw new Error('Failed to fetch filtered service providers');
    }
  },

  // POST: Create new service provider
  createPrestador: async (
    prestadorData: Omit<Prestador, 'id'>
  ): Promise<Prestador> => {
    try {
      const response = await apiClient.post<ApiResponse<Prestador>>(
        '/prestadores',
        prestadorData
      );
      return response.data.data;
    } catch (error) {
      console.error('Error creating prestador:', error);
      throw new Error('Failed to create service provider');
    }
  },

  // PUT: Update service provider
  updatePrestador: async (
    id: number,
    prestadorData: Partial<Prestador>
  ): Promise<Prestador> => {
    try {
      const response = await apiClient.put<ApiResponse<Prestador>>(
        `/prestadores/${id}`,
        prestadorData
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error updating prestador ${id}:`, error);
      throw new Error(`Failed to update service provider with ID ${id}`);
    }
  },

  // DELETE: Delete service provider
  deletePrestador: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/prestadores/${id}`);
    } catch (error) {
      console.error(`Error deleting prestador ${id}:`, error);
      throw new Error(`Failed to delete service provider with ID ${id}`);
    }
  },

  // GET: Search providers by name or service
  searchPrestadores: async (query: string): Promise<Prestador[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Prestador[]>>(
        `/prestadores/search?q=${encodeURIComponent(query)}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error searching prestadores:', error);
      throw new Error('Failed to search service providers');
    }
  },

  // GET: Get providers by zone
  getPrestadoresByZona: async (zona: string): Promise<Prestador[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Prestador[]>>(
        `/prestadores/zona/${encodeURIComponent(zona)}`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching prestadores by zone ${zona}:`, error);
      throw new Error(`Failed to fetch service providers in zone ${zona}`);
    }
  },

  // POST: Rate a service provider
  ratePrestador: async (
    id: number,
    rating: number,
    comment?: string
  ): Promise<void> => {
    try {
      await apiClient.post(`/prestadores/${id}/rate`, { rating, comment });
    } catch (error) {
      console.error(`Error rating prestador ${id}:`, error);
      throw new Error(`Failed to rate service provider with ID ${id}`);
    }
  },
};

export default serviciosService;
