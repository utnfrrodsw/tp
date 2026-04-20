/**
 * Parser para notificaciones
 * Valida y parsea parámetros de búsqueda y operaciones con notificaciones
 */

import { validatePagination, parseNumericId } from '../services/validation.service';

/**
 * Interfaz para filtros de notificaciones
 */
export interface NotificacionFilters {
  limit: number;
  offset: number;
  page: number;
  soloNoLeidas?: boolean;
}

/**
 * Parsea filtros de búsqueda de notificaciones
 */
export function parseNotificationFilters(query: any): NotificacionFilters {
  const result = validatePagination(query.page, query.limit);
  const offset = (result.page - 1) * result.limit;
  
  return {
    limit: result.limit,
    offset,
    page: result.page,
    soloNoLeidas: query.soloNoLeidas === 'true' || query.soloNoLeidas === true,
  };
}

/**
 * Valida ID de notificación
 */
export function validateNotificationId(id: any): { valid: boolean; value?: number; error?: string } {
  const numericId = parseNumericId(id);
  
  if (!numericId) {
    return {
      valid: false,
      error: 'ID de notificación inválido'
    };
  }
  
  return {
    valid: true,
    value: numericId
  };
}

/**
 * Parsea límites de paginación para notificaciones
 * Aplica límite máximo de 50 notificaciones por página
 */
export function parseNotificationPagination(query: any): { limit: number; offset: number } {
  const MAX_LIMIT = 50;
  const DEFAULT_LIMIT = 20;
  
  let limit = DEFAULT_LIMIT;
  if (query.limit) {
    const parsedLimit = parseInt(query.limit, 10);
    if (!isNaN(parsedLimit) && parsedLimit > 0) {
      limit = Math.min(parsedLimit, MAX_LIMIT);
    }
  }
  
  let offset = 0;
  if (query.page) {
    const page = parseInt(query.page, 10);
    if (!isNaN(page) && page > 0) {
      offset = (page - 1) * limit;
    }
  } else if (query.offset) {
    const parsedOffset = parseInt(query.offset, 10);
    if (!isNaN(parsedOffset) && parsedOffset >= 0) {
      offset = parsedOffset;
    }
  }
  
  return { limit, offset };
}

/**
 * Construye query para buscar notificaciones
 */
export function buildNotificationQuery(usuarioId: number, filters: NotificacionFilters) {
  const where: any = {
    usuario: usuarioId,
    deletedAt: null,
  };
  
  if (filters.soloNoLeidas) {
    where.leida = false;
  }
  
  return where;
}
