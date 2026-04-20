// src/services/votacionService.ts
import axios from 'axios';
import { API_ROOT_URL } from '../config/api.config';

export interface VotacionResponse {
  message: string;
  votacion: {
    id: number;
    voto: 'positivo' | 'negativo';
    fechaVoto: string;
  };
}

export interface VotoUsuarioResponse {
  voto: 'positivo' | 'negativo' | null;
  fechaVoto?: string;
}

export interface EstadisticasVotacion {
  libroId: number;
  total: number;
  positivos: number;
  negativos: number;
  porcentajePositivos: number;
  porcentajeNegativos: number;
}

export interface LibroMasVotado {
  libro: any;
  positivos: number;
  negativos: number;
  total: number;
  puntuacion: number;
  porcentajePositivos: number;
}

/**
 * Votar por un libro (positivo o negativo)
 */
export const votarLibro = async (
  libroId: number,
  voto: 'positivo' | 'negativo'
): Promise<VotacionResponse> => {
  const token = localStorage.getItem('token');
  const response = await axios.post(
    `${API_ROOT_URL}/api/votacion`,
    { libroId, voto },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

/**
 * Eliminar voto de un libro
 */
export const eliminarVoto = async (libroId: number): Promise<{ message: string }> => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`${API_ROOT_URL}/api/votacion/${libroId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Obtener el voto del usuario para un libro específico
 */
export const obtenerVotoUsuario = async (libroId: number): Promise<VotoUsuarioResponse> => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_ROOT_URL}/api/votacion/usuario/${libroId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Obtener estadísticas de votación de un libro
 */
export const obtenerEstadisticasLibro = async (
  libroId: number
): Promise<EstadisticasVotacion> => {
  const response = await axios.get(`${API_ROOT_URL}/api/votacion/estadisticas/${libroId}`);
  return response.data;
};

/**
 * Obtener libros más votados positivamente
 */
export const obtenerLibrosMasVotados = async (
  limit: number = 10
): Promise<LibroMasVotado[]> => {
  const response = await axios.get(`${API_ROOT_URL}/api/votacion/top?limit=${limit}`);
  return response.data;
};
