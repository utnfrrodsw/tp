// src/utils/libroParser.ts
import {
  sanitizeInput,
  parseNumericId,
  validateISBN,
  validateYear,
  validateTextLength,
  validatePagination,
  validateURL
} from '../services/validation.service';

/**
 * Parsea y valida los datos de entrada para crear un libro
 */
export function parseLibroInput(body: any): {
  valid: boolean;
  data?: {
    nombre: string;
    isbn?: string;
    anio_publicacion?: number;
    descripcion?: string;
    imagen?: string;
    paginas?: number;
    editorial?: number | string;
    autor?: number | string;
    categoria?: number | string;
    saga?: number | string;
    external_id?: string;
  };
  errors?: string[];
} {
  const errors: string[] = [];

  // Validar nombre (requerido)
  if (!body.nombre || typeof body.nombre !== 'string' || !body.nombre.trim()) {
    errors.push('El nombre del libro es requerido');
  }

  const nombreValidation = validateTextLength(body.nombre?.trim() || '', 1, 500);
  if (!nombreValidation.valid) {
    errors.push(nombreValidation.error!);
  }

  // Validar ISBN (opcional)
  if (body.isbn && !validateISBN(body.isbn)) {
    errors.push('El ISBN proporcionado no es válido');
  }

  // Validar año de publicación (opcional)
  if (body.anio_publicacion && !validateYear(body.anio_publicacion)) {
    errors.push('El año de publicación no es válido');
  }

  // Validar descripción (opcional)
  if (body.descripcion) {
    const descripcionValidation = validateTextLength(body.descripcion.trim(), 0, 5000);
    if (!descripcionValidation.valid) {
      errors.push(descripcionValidation.error!);
    }
  }

  // Validar imagen URL (opcional)
  if (body.imagen && body.imagen.trim() && !validateURL(body.imagen.trim())) {
    errors.push('La URL de la imagen no es válida');
  }

  // Validar páginas (opcional)
  if (body.paginas !== undefined && body.paginas !== null) {
    const paginas = Number(body.paginas);
    if (isNaN(paginas) || paginas < 1 || paginas > 10000) {
      errors.push('El número de páginas debe estar entre 1 y 10000');
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Construir objeto limpio
  const cleanData: any = {
    nombre: sanitizeInput(body.nombre.trim()),
  };

  if (body.isbn) {
    cleanData.isbn = body.isbn.replace(/[-\s]/g, '');
  }

  if (body.anio_publicacion) {
    cleanData.anio_publicacion = Number(body.anio_publicacion);
  }

  if (body.descripcion) {
    cleanData.descripcion = sanitizeInput(body.descripcion.trim());
  }

  if (body.imagen) {
    cleanData.imagen = body.imagen.trim();
  }

  if (body.paginas) {
    cleanData.paginas = Number(body.paginas);
  }

  // IDs de relaciones (pueden ser numéricos o strings para external_id)
  if (body.editorial) cleanData.editorial = body.editorial;
  if (body.autor) cleanData.autor = body.autor;
  if (body.categoria) cleanData.categoria = body.categoria;
  if (body.saga) cleanData.saga = body.saga;
  if (body.external_id) cleanData.external_id = sanitizeInput(body.external_id);

  return { valid: true, data: cleanData };
}

/**
 * Parsea los filtros de búsqueda de libros
 */
export function parseLibroFilters(query: any): {
  search?: string;
  autorId?: number;
  categoriaId?: number;
  sagaId?: number;
  minRating?: number;
  page: number;
  limit: number;
} {
  const filters: any = {};

  // Búsqueda por texto
  if (query.search && typeof query.search === 'string') {
    filters.search = sanitizeInput(query.search.trim());
  }

  // Filtro por autor
  const autorId = parseNumericId(query.autor || query.autorId);
  if (autorId) {
    filters.autorId = autorId;
  }

  // Filtro por categoría
  const categoriaId = parseNumericId(query.categoria || query.categoriaId);
  if (categoriaId) {
    filters.categoriaId = categoriaId;
  }

  // Filtro por saga
  const sagaId = parseNumericId(query.saga || query.sagaId);
  if (sagaId) {
    filters.sagaId = sagaId;
  }

  // Filtro por rating mínimo
  if (query.minRating) {
    const rating = Number(query.minRating);
    if (!isNaN(rating) && rating >= 1 && rating <= 5) {
      filters.minRating = rating;
    }
  }

  // Paginación
  const pagination = validatePagination(query.page, query.limit);
  filters.page = pagination.page;
  filters.limit = pagination.limit;

  return filters;
}

/**
 * Parsea los datos de actualización de un libro
 */
export function parseLibroUpdateInput(body: any): {
  valid: boolean;
  data?: any;
  errors?: string[];
} {
  const errors: string[] = [];
  const updates: any = {};

  // Validar nombre si se proporciona
  if (body.nombre !== undefined) {
    if (typeof body.nombre !== 'string' || !body.nombre.trim()) {
      errors.push('El nombre del libro no puede estar vacío');
    } else {
      const nombreValidation = validateTextLength(body.nombre.trim(), 1, 500);
      if (!nombreValidation.valid) {
        errors.push(nombreValidation.error!);
      } else {
        updates.nombre = sanitizeInput(body.nombre.trim());
      }
    }
  }

  // Validar ISBN si se proporciona
  if (body.isbn !== undefined) {
    if (body.isbn && !validateISBN(body.isbn)) {
      errors.push('El ISBN proporcionado no es válido');
    } else {
      updates.isbn = body.isbn ? body.isbn.replace(/[-\s]/g, '') : null;
    }
  }

  // Validar año si se proporciona
  if (body.anio_publicacion !== undefined) {
    if (body.anio_publicacion && !validateYear(body.anio_publicacion)) {
      errors.push('El año de publicación no es válido');
    } else {
      updates.anio_publicacion = body.anio_publicacion ? Number(body.anio_publicacion) : null;
    }
  }

  // Validar descripción si se proporciona
  if (body.descripcion !== undefined) {
    if (body.descripcion) {
      const descripcionValidation = validateTextLength(body.descripcion.trim(), 0, 5000);
      if (!descripcionValidation.valid) {
        errors.push(descripcionValidation.error!);
      } else {
        updates.descripcion = sanitizeInput(body.descripcion.trim());
      }
    } else {
      updates.descripcion = null;
    }
  }

  // Validar imagen si se proporciona
  if (body.imagen !== undefined) {
    if (body.imagen && body.imagen.trim() && !validateURL(body.imagen.trim())) {
      errors.push('La URL de la imagen no es válida');
    } else {
      updates.imagen = body.imagen?.trim() || null;
    }
  }

  // Validar páginas si se proporciona
  if (body.paginas !== undefined) {
    const paginas = Number(body.paginas);
    if (body.paginas && (isNaN(paginas) || paginas < 1 || paginas > 10000)) {
      errors.push('El número de páginas debe estar entre 1 y 10000');
    } else {
      updates.paginas = body.paginas ? paginas : null;
    }
  }

  // Relaciones
  if (body.editorial !== undefined) updates.editorial = body.editorial;
  if (body.autor !== undefined) updates.autor = body.autor;
  if (body.categoria !== undefined) updates.categoria = body.categoria;
  if (body.saga !== undefined) updates.saga = body.saga;

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  if (Object.keys(updates).length === 0) {
    return { valid: false, errors: ['No se proporcionaron datos para actualizar'] };
  }

  return { valid: true, data: updates };
}

/**
 * Construye el query de búsqueda para libros
 */
export function buildLibroQuery(filters: ReturnType<typeof parseLibroFilters>): any {
  const where: any = {};

  // Búsqueda por texto en nombre
  if (filters.search) {
    where.nombre = { $like: `%${filters.search}%` };
  }

  // Filtros por relaciones
  if (filters.autorId) {
    where.autor = filters.autorId;
  }

  if (filters.categoriaId) {
    where.categoria = filters.categoriaId;
  }

  if (filters.sagaId) {
    where.saga = filters.sagaId;
  }

  return where;
}

/**
 * Valida un ID de libro
 */
export function validateLibroId(id: any): {
  valid: boolean;
  id?: number;
  error?: string;
} {
  const numericId = parseNumericId(id);

  if (!numericId) {
    return {
      valid: false,
      error: 'ID de libro inválido'
    };
  }

  return {
    valid: true,
    id: numericId
  };
}

/**
 * Parsea los parámetros de búsqueda avanzada
 */
export function parseLibroSearchParams(query: any): {
  searchBy?: 'titulo' | 'autor' | 'isbn' | 'categoria';
  searchTerm?: string;
  filters: ReturnType<typeof parseLibroFilters>;
} {
  const result: any = {
    filters: parseLibroFilters(query)
  };

  // Tipo de búsqueda
  if (query.searchBy && ['titulo', 'autor', 'isbn', 'categoria'].includes(query.searchBy)) {
    result.searchBy = query.searchBy;
  }

  // Término de búsqueda
  if (query.searchTerm && typeof query.searchTerm === 'string') {
    result.searchTerm = sanitizeInput(query.searchTerm.trim());
  }

  return result;
}
