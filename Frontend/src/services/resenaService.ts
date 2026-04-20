// src/services/resenaService.ts
import { fetchWithRefresh } from '../utils/fetchWithRefresh';
import { API_BASE_URL } from '../config/api.config';

const API_URL = `${API_BASE_URL}/resena`;

interface LibroData {
  id: string;
  titulo: string;
  autores: string[];
  descripcion: string | null;
  imagen: string | null;
  enlace: string | null;
  source: "hardcover" | "google" | "local" | "bookcode";
}

/**
 * 🔹 Obtiene reseñas de un libro.
 * Acepta tanto el ID interno como el externalId (Google Books, por ejemplo).
 * Devuelve todas las reseñas excepto las rechazadas (según la lógica del backend).
 */
export const obtenerReseñas = async (idLibro: string) => {
  const response = await fetchWithRefresh(`${API_URL}?libroId=${encodeURIComponent(idLibro)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ Error al obtener reseñas:', error);
    throw new Error('Error al obtener reseñas');
  }

  return response.json();
};

/**
 * 🔹 Agrega una nueva reseña.
 * Si el libro no existe en la BD, el backend lo crea automáticamente.
 * Invalida la caché en Redis (si está activo) para mostrar los cambios instantáneamente.
 */
export const agregarReseña = async (
  libroId: string,
  comentario: string,
  estrellas: number,
  libro: LibroData
) => {
  console.log('📝 Enviando reseña:', { libroId, estrellas, comentarioLength: comentario.length });
  
  const response = await fetchWithRefresh(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ libroId, comentario, estrellas, libro }),
  });

  console.log('📡 Response status:', response.status);

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    console.error('❌ Error response:', data);
    
    // Crear error con toda la información de moderación
    const error: any = new Error(data.error || 'Error al agregar reseña');
    error.details = data.details;
    error.reasons = data.reasons || [];
    error.moderationScore = data.moderationScore;
    error.blocked = data.blocked;
    error.score = data.moderationScore; // Alias para compatibilidad
    
    throw error;
  }

  const result = await response.json();
  console.log('✅ Reseña creada:', result);
  return result;
};

/**
 * 🔹 Obtiene todas las reseñas pendientes de moderación (solo admin).
 * Incluye PENDING y FLAGGED para el panel de moderación.
 */
export const obtenerResenasPendientes = async (_token?: string) => {
  const response = await fetchWithRefresh(`${API_URL}?estado=pendiente`, {
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache',
    },
  });

  if (!response.ok) {
    const error = new Error('Error al obtener reseñas pendientes');
    (error as any).status = response.status;
    throw error;
  }

  return response.json();
};

/**
 * 🔹 Aprueba una reseña (solo admin).
 */
export const aprobarResena = async (id: number, _token?: string) => {
  const response = await fetchWithRefresh(`${API_URL}/${id}/approve`, {
    method: 'PUT',
  });

  if (!response.ok) {
    const error = new Error('Error al aprobar reseña');
    (error as any).status = response.status;
    throw error;
  }

  return response.json();
};

/**
 * 🔹 Rechaza una reseña (solo admin).
 */
export const rechazarResena = async (id: number, _token?: string, comentario?: string) => {
  const response = await fetchWithRefresh(`${API_URL}/${id}/reject`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ comentario: comentario?.trim() || undefined }),
  });

  if (!response.ok) {
    const error = new Error('Error al rechazar reseña');
    (error as any).status = response.status;
    throw error;
  }

  return response.json();
};

/**
 * 🔹 Obtiene reseñas de un usuario.
 */
export const getResenasByUsuario = async (userId: number) => {
  const response = await fetchWithRefresh(`${API_URL}?usuarioId=${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
  });

  if (!response.ok) throw new Error('Error al obtener reseñas del usuario');
  return response.json();
};

/**
 * 🔹 Obtiene reseñas de un libro (mismo propósito que obtenerReseñas, pero separado por compatibilidad).
 */
export const getResenasByLibro = async (libroId: string) => {
  const response = await fetchWithRefresh(`${API_URL}?libroId=${encodeURIComponent(libroId)}&includeReactions=true&includeReplies=true`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
  });

  if (!response.ok) throw new Error('Error al obtener reseñas del libro');
  return response.json();
};

/**
 * 🔹 Crea una respuesta a una reseña.
 */
export const crearRespuesta = async (
  parentId: number,
  comentario: string
) => {
  const response = await fetchWithRefresh(`${API_URL}/${parentId}/responder`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ comentario }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    
    // Crear error con toda la información de moderación
    const error: any = new Error(data.error || 'Error al crear respuesta');
    error.details = data.details;
    error.errors = data.errors || [];
    error.reasons = data.reasons || [];
    error.moderationScore = data.moderationScore;
    error.blocked = data.blocked;
    error.score = data.moderationScore; // Alias para compatibilidad
    
    throw error;
  }

  return response.json();
};

/**
 * 🔹 Edita una reseña existente del usuario autenticado.
 */
export const editarResena = async (
  id: number,
  payload: { comentario?: string; estrellas?: number }
) => {
  const response = await fetchWithRefresh(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const error: any = new Error(data.error || 'Error al editar reseña');
    error.details = data.details;
    error.errors = data.errors;
    throw error;
  }

  return response.json();
};

/**
 * 🔹 Elimina una reseña existente del usuario autenticado.
 */
export const eliminarResena = async (id: number) => {
  const response = await fetchWithRefresh(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const error: any = new Error(data.error || 'Error al eliminar reseña');
    error.details = data.details;
    throw error;
  }

  return response.json();
};

/**
 * 🔹 Obtiene reseñas populares (ordenadas por cantidad de reacciones).
 */
export const obtenerResenasPopulares = async (libroId?: string, limit: number = 10) => {
  const params = new URLSearchParams();
  if (libroId) params.append('libroId', libroId);
  params.append('limit', limit.toString());

  const response = await fetchWithRefresh(`${API_URL}s/populares?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ Error al obtener reseñas populares:', error);
    throw new Error('Error al obtener reseñas populares');
  }

  return response.json();
};

/**
 * 🔹 Obtiene estadísticas de moderación (solo admin).
 */
export const obtenerEstadisticasModeracion = async (range: '7d' | '30d' | '90d' = '30d', _token?: string) => {
  const response = await fetchWithRefresh(`${API_URL}/admin/moderation/stats?range=${range}`, {
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache',
    },
  });

  if (!response.ok) {
    const error = new Error('Error al obtener estadísticas de moderación');
    (error as any).status = response.status;
    throw error;
  }

  return response.json();
};
