// src/services/recomendacionService.ts
import { fetchWithRefresh } from '../utils/fetchWithRefresh';
import { API_BASE_URL } from '../config/api.config';

const API_URL = `${API_BASE_URL}/recomendaciones`;

export interface RecomendacionResponse {
  libros: {
    id: number;
    slug: string;
    titulo: string;
    autores: string[];
    imagen: string | null;
    descripcion: string | null;
    averageRating: number;
    score: number;
    matchCategorias: string[];
    matchAutores: string[];
    esReciente: boolean;
  }[];
  metadata: {
    algoritmo: string;
    totalRecomendaciones: number;
    usuarioId: number;
  };
}

/**
 * 🔹 Obtiene recomendaciones personalizadas para el usuario autenticado
 */
export const obtenerRecomendaciones = async (limit: number = 10): Promise<RecomendacionResponse> => {
  const response = await fetchWithRefresh(`${API_URL}?limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ Error al obtener recomendaciones:', error);
    throw new Error('Error al obtener recomendaciones');
  }

  return response.json();
};

/**
 * 🔹 Invalida el caché de recomendaciones del usuario (requiere autenticación)
 */
export const invalidarCacheRecomendaciones = async (): Promise<void> => {
  const response = await fetchWithRefresh(`${API_URL}/cache`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ Error al invalidar caché:', error);
    throw new Error('Error al invalidar caché de recomendaciones');
  }
};
