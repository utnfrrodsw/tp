/**
 * Utilidades de parsing y validación para resena.controller.ts
 * Separa la lógica de validación y parseo de la lógica de negocio
 */

import { validateRating, validateTextLength, sanitizeInput, parseNumericId, validatePagination } from '../services/validation.service';

/**
 * Parsea y valida datos de entrada para crear una reseña
 */
export function parseResenaInput(body: any): { 
  valid: boolean; 
  data?: { comentario: string; estrellas: number; libroId: string | number };
  errors?: string[];
} {
  const errors: string[] = [];
  
  // Validar comentario
  if (!body.comentario || typeof body.comentario !== 'string') {
    errors.push('El comentario es requerido');
  } else {
    // Permite comentarios cortos para que pasen por moderación automática
    // (si son demasiado cortos, se bloquean y notifican en createResena).
    const comentarioValidation = validateTextLength(body.comentario, 1, 5000);
    if (!comentarioValidation.valid) {
      errors.push(comentarioValidation.error || 'Comentario inválido');
    }
  }
  
  // Validar estrellas
  if (!validateRating(body.estrellas)) {
    errors.push('La calificación debe ser un número entre 1 y 5');
  }
  
  // Validar libroId
  if (!body.libroId) {
    errors.push('El ID del libro es requerido');
  }
  
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  
  return {
    valid: true,
    data: {
      comentario: sanitizeInput(body.comentario),
      estrellas: Number(body.estrellas),
      libroId: body.libroId
    }
  };
}

/**
 * Parsea y valida filtros para buscar reseñas
 */
export function parseResenaFilters(query: any): {
  libroId?: string | number;
  usuarioId?: number;
  estado?: string;
  page: number;
  limit: number;
} {
  const filters: any = {};
  
  // Parsear libroId (puede ser string o number)
  if (query.libroId) {
    filters.libroId = query.libroId;
  }
  
  // Parsear usuarioId (debe ser numérico)
  if (query.usuarioId) {
    const userId = parseNumericId(query.usuarioId);
    if (userId) {
      filters.usuarioId = userId;
    }
  }
  
  // Parsear estado
  if (query.estado && typeof query.estado === 'string') {
    filters.estado = query.estado;
  }
  
  // Parsear paginación
  const pagination = validatePagination(query.page, query.limit);
  filters.page = pagination.page;
  filters.limit = pagination.limit;
  
  return filters;
}

/**
 * Valida datos para actualizar una reseña
 */
export function parseResenaUpdateInput(body: any): {
  valid: boolean;
  data?: { comentario?: string; estrellas?: number };
  errors?: string[];
} {
  const errors: string[] = [];
  const data: any = {};
  
  // Validar comentario si se proporciona
  if (body.comentario !== undefined) {
    if (typeof body.comentario !== 'string') {
      errors.push('El comentario debe ser un texto');
    } else {
      const comentarioValidation = validateTextLength(body.comentario, 10, 5000);
      if (!comentarioValidation.valid) {
        errors.push(comentarioValidation.error || 'Comentario inválido');
      } else {
        data.comentario = sanitizeInput(body.comentario);
      }
    }
  }
  
  // Validar estrellas si se proporcionan
  if (body.estrellas !== undefined) {
    if (!validateRating(body.estrellas)) {
      errors.push('La calificación debe ser un número entre 1 y 5');
    } else {
      data.estrellas = Number(body.estrellas);
    }
  }
  
  // Debe haber al menos un campo para actualizar
  if (Object.keys(data).length === 0 && errors.length === 0) {
    errors.push('Debe proporcionar al menos un campo para actualizar');
  }
  
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  
  return { valid: true, data };
}

/**
 * Construye query de búsqueda para reseñas
 */
export function buildResenaQuery(filters: {
  libroId?: string | number;
  usuarioId?: number;
  estado?: string;
}): any {
  const where: any = {};
  
  // Siempre excluir reseñas eliminadas
  where.deletedAt = null;
  
  // Filtrar por libro
  if (filters.libroId) {
    const libroIdStr = filters.libroId.toString();
    const isNumeric = /^\d+$/.test(libroIdStr);
    
    if (isNumeric) {
      // Buscar por ID numérico O externalId
      where.libro = { 
        $or: [
          { id: +libroIdStr }, 
          { externalId: libroIdStr }
        ] 
      };
    } else {
      // Solo por externalId
      where.libro = { externalId: libroIdStr };
    }
  }
  
  // Filtrar por usuario
  if (filters.usuarioId) {
    where.usuario = { id: filters.usuarioId };
  }
  
  // Filtrar por estado
  if (filters.estado) {
    where.estado = filters.estado;
  } else {
    // Por defecto, excluir reseñas flagged
    where.estado = { $nin: ['flagged'] };
  }
  
  return where;
}

/**
 * Valida ID de reseña
 */
export function validateResenaId(id: any): { valid: boolean; id?: number; error?: string } {
  const numId = parseNumericId(id);
  
  if (!numId) {
    return { valid: false, error: 'ID de reseña inválido' };
  }
  
  return { valid: true, id: numId };
}

/**
 * Valida respuesta a reseña
 */
export function parseResenaRespuesta(body: any, resenaPadreId: number): {
  valid: boolean;
  data?: { comentario: string; resenaPadreId: number };
  errors?: string[];
} {
  const errors: string[] = [];
  
  // Validar comentario
  if (!body.comentario || typeof body.comentario !== 'string') {
    errors.push('El comentario es requerido');
  } else {
    const comentarioValidation = validateTextLength(body.comentario, 3, 2000);
    if (!comentarioValidation.valid) {
      errors.push(comentarioValidation.error || 'Comentario inválido');
    }
  }
  
  // No validamos libroId porque la respuesta hereda el libro de la reseña padre
  
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  
  return {
    valid: true,
    data: {
      comentario: sanitizeInput(body.comentario),
      resenaPadreId
    }
  };
}
