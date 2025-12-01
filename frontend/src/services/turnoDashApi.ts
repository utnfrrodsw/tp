import axios from 'axios';

// El puerto del backend donde quiere hacer las peticiones
// Como las variables de env son siempre string, tiene que comparar si es igual a 'true', entonces almacena el booleano de js
const local = import.meta.env.VITE_LOCAL === 'true';
const API_BASE_URL = local
  ? 'http://localhost:3000/api'
  : 'https://backend-patient-morning-1303.fly.dev/api';
const token = localStorage.getItem('token');
// ====== INTERFACES Y TIPOS ======

/**
 * Interfaz flexible para representar cualquier entidad con propiedades dinámicas
 * Permite que un objeto tenga cualquier cantidad de propiedades con cualquier tipo de valor
 */
export interface EntityData {
  [key: string]: unknown;
}

// Interfaces específicas para los turnos
export interface Usuario {
  id: number;
  mail: string;
  nombre?: string;
  apellido?: string;
  telefono?: string;
  nombreFantasia?: string;
  direccion?: string;
}

export interface TipoServicio {
  id: number;
  nombreTipo: string;
  descripcionTipo?: string;
}

export interface Tarea {
  id: number;
  descripcionTarea: string;
  tipoServicio: TipoServicio;
}

export interface Servicio {
  id: number;
  precio: number;
  tarea: Tarea;
  usuario: Usuario;
}

export interface Turno {
  id: number;
  fechaHora: string;
  estado: string;
  calificacion?: number;
  comentario?: string;
  montoFinal: number;
  servicio: Servicio;
  usuario: Usuario;
}

export interface TurnosResponse {
  message: string;
  data: Turno[];
  pagination: {
    totalPages: number;
    currentPage: number;
    totalCount: number;
    cantItemsPerPage: number;
  };
}

// ====== CONFIGURACIÓN DE AXIOS ======
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});

// ====== INTERCEPTORES ======

/**
 * Interceptor de respuestas: Maneja automáticamente todas las respuestas del servidor
 * - Si la respuesta es exitosa: la retorna sin modificaciones
 * - Si hay un error: lo registra en consola y rechaza la promesa para manejo posterior
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la petición:', error);
    return Promise.reject(error);
  }
);

// ====== FUNCIONES DE API PARA TURNOS ======

/**
 * Obtiene los turnos de un prestatario específico con paginación
 * @param prestadorId ID del prestatario
 * @param cantItemsPerPage Cantidad de items por página (opcional, default: 10)
 * @param currentPage Página actual (opcional, default: 1)
 * @param selectedValueShow Filtro de mostrar (opcional)
 * @param selectedValueOrder Orden de resultados (opcional)
 */
export const getTurnosByPrestador = async (
  prestadorId: number,
  cantItemsPerPage: number = 10,
  currentPage: number = 1,
  selectedValueShow?: string,
  selectedValueOrder?: string
): Promise<TurnosResponse> => {
  try {
    let url = `/turnos/byUser/${prestadorId}`;

    // Agregar parámetros opcionales
    const params = [
      cantItemsPerPage,
      currentPage,
      selectedValueShow,
      selectedValueOrder,
    ].filter((param) => param !== undefined);

    if (params.length > 0) {
      url += `/${params.join('/')}`;
    }

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error al obtener turnos del prestatario:', error);
    throw error;
  }
};

/**
 * Obtiene un turno específico por ID
 * @param turnoId ID del turno
 */
export const getTurnoById = async (turnoId: number): Promise<Turno> => {
  try {
    const response = await api.get(`/turnos/${turnoId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener turno por ID:', error);
    throw error;
  }
};

/**
 * Actualiza el estado de múltiples turnos
 * @param turnoIds Array de IDs de turnos
 * @param nuevoEstado Nuevo estado para los turnos
 */
export const updateTurnosEstado = async (
  turnoIds: number[],
  nuevoEstado: string
): Promise<void> => {
  try {
    // Realizar actualizaciones en paralelo
    await Promise.all(
      turnoIds.map((id) => api.put(`/turnos/${id}`, { estado: nuevoEstado }))
    );
  } catch (error) {
    console.error('Error al actualizar estado de turnos:', error);
    throw error;
  }
};

/**
 * Obtiene turnos de un día específico para un prestatario
 * @param prestadorId ID del prestatario
 * @param fecha Fecha en formato YYYY-MM-DD
 */
export const getTurnosPorDia = async (
  prestadorId: number,
  fecha: string
): Promise<Turno[]> => {
  try {
    const response = await api.get(
      `/turnos/turnosPorDia/${prestadorId}/${fecha}`
    );
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener turnos por día:', error);
    throw error;
  }
};
