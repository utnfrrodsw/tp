import { API_BASE_URL } from '../config/api.config';
import { fetchWithRefresh } from '../utils/fetchWithRefresh';
import { getAccessToken } from './authService';

const API_URL = API_BASE_URL;

export interface Notificacion {
  id: number;
  tipo: 'NUEVA_RESENA' | 'NUEVA_REACCION' | 'NUEVO_SEGUIDOR' | 'ACTIVIDAD_SEGUIDO' | 'RESPUESTA_RESENA' | 'LIBRO_FAVORITO' | 'RESENA_RECHAZADA';
  mensaje: string;
  leida: boolean;
  data?: any;
  url?: string;
  createdAt: string;
}

/**
 * Obtener notificaciones del usuario
 */
export const obtenerNotificaciones = async (limit: number = 20): Promise<Notificacion[]> => {
  try {
    if (!getAccessToken()) return [];

    const response = await fetchWithRefresh(`${API_URL}/notificaciones?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401 || response.status === 403) {
      return [];
    }

    if (!response.ok) {
      throw new Error('Error al obtener notificaciones');
    }

    const data = await response.json();
    return data.notificaciones || [];
  } catch (error) {
    console.error('Error en obtenerNotificaciones:', error);
    return [];
  }
};

/**
 * Contar notificaciones no leídas
 */
export const contarNoLeidas = async (): Promise<number> => {
  try {
    if (!getAccessToken()) return 0;

    const response = await fetchWithRefresh(`${API_URL}/notificaciones/count`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401 || response.status === 403) {
      return 0;
    }

    if (!response.ok) {
      throw new Error('Error al contar notificaciones');
    }

    const data = await response.json();
    return data.count || 0;
  } catch (error) {
    return 0;
  }
};

/**
 * Marcar notificación como leída
 */
export const marcarComoLeida = async (id: number): Promise<void> => {
  try {
    if (!getAccessToken()) {
      throw new Error('No autenticado');
    }

    const response = await fetchWithRefresh(`${API_URL}/notificaciones/${id}/leida`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Error al marcar notificación como leída');
    }
  } catch (error) {
    console.error('Error en marcarComoLeida:', error);
    throw error;
  }
};

/**
 * Marcar todas las notificaciones como leídas
 */
export const marcarTodasComoLeidas = async (): Promise<void> => {
  try {
    if (!getAccessToken()) {
      throw new Error('No autenticado');
    }

    const response = await fetchWithRefresh(`${API_URL}/notificaciones/marcar-todas-leidas`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Error al marcar todas como leídas');
    }
  } catch (error) {
    console.error('Error en marcarTodasComoLeidas:', error);
    throw error;
  }
};

/**
 * Eliminar notificación
 */
export const eliminarNotificacion = async (id: number): Promise<void> => {
  try {
    if (!getAccessToken()) {
      throw new Error('No autenticado');
    }

    const response = await fetchWithRefresh(`${API_URL}/notificaciones/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Error al eliminar notificación');
    }
  } catch (error) {
    console.error('Error en eliminarNotificacion:', error);
    throw error;
  }
};

/**
 * Hook para polling automático de notificaciones
 */
export const useNotificacionPolling = (intervalMs: number = 30000) => {
  if (typeof window === 'undefined') return;

  const interval = setInterval(async () => {
    try {
      await contarNoLeidas();
    } catch (error) {
      console.error('Error en polling de notificaciones:', error);
    }
  }, intervalMs);

  return () => clearInterval(interval);
};
