// src/utils/libroSearchHelpers.ts
/**
 * Helper functions para búsqueda optimizada de libros.
 * Reemplaza múltiples queries con una única query usando $or.
 */

import { EntityManager, FilterQuery } from '@mikro-orm/mysql';
import { Libro } from '../entities/libro.entity';

/**
 * Resultado de validación de búsqueda
 */
export interface SearchValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedQuery?: string;
}

/**
 * Opciones de búsqueda de libros
 */
export interface LibroSearchOptions {
  query: string;
  searchIn?: Array<'titulo' | 'autor' | 'isbn' | 'categoria' | 'editorial'>;
  limit?: number;
  offset?: number;
}

/**
 * Valida un query de búsqueda
 */
export function validateSearchQuery(query: string): SearchValidationResult {
  if (!query) {
    return {
      isValid: false,
      error: 'Query de búsqueda es requerido'
    };
  }

  const sanitized = query.trim();

  if (sanitized.length < 2) {
    return {
      isValid: false,
      error: 'La consulta de búsqueda debe tener al menos 2 caracteres'
    };
  }

  if (sanitized.length > 100) {
    return {
      isValid: false,
      error: 'La consulta de búsqueda no puede exceder 100 caracteres'
    };
  }

  return {
    isValid: true,
    sanitizedQuery: sanitized
  };
}

/**
 * Construye el filtro WHERE para búsqueda optimizada
 * Usa $or para buscar en múltiples campos con una sola query
 */
export function buildSearchFilter(query: string, searchIn?: Array<'titulo' | 'autor' | 'isbn' | 'categoria' | 'editorial'>): FilterQuery<Libro> {
  const sanitizedQuery = query.trim();
  const searchPattern = `%${sanitizedQuery}%`;

  // Por defecto, buscar en título y autor
  const fieldsToSearch = searchIn || ['titulo', 'autor'];

  const orConditions: any[] = [];

  // Búsqueda en título
  if (fieldsToSearch.includes('titulo')) {
    orConditions.push({ nombre: { $like: searchPattern } });
  }

  // Búsqueda en autor (nombre o apellido)
  if (fieldsToSearch.includes('autor')) {
    orConditions.push({ 
      autor: { 
        $or: [
          { nombre: { $like: searchPattern } },
          { apellido: { $like: searchPattern } }
        ]
      }
    });
  }

  // Búsqueda en ISBN (si existe en el entity)
  // Comentado: el entity Libro actualmente no tiene campo isbn
  // if (fieldsToSearch.includes('isbn')) {
  //   orConditions.push({ isbn: { $like: searchPattern } });
  // }

  // Búsqueda en categoría
  if (fieldsToSearch.includes('categoria')) {
    orConditions.push({ 
      categoria: { nombre: { $like: searchPattern } }
    });
  }

  // Búsqueda en editorial
  if (fieldsToSearch.includes('editorial')) {
    orConditions.push({ 
      editorial: { nombre: { $like: searchPattern } }
    });
  }

  return {
    $and: [
      { activo: true },
      { $or: orConditions }
    ]
  } as FilterQuery<Libro>;
}

/**
 * Busca libros de forma optimizada usando una única query
 */
export async function searchLibrosOptimized(
  em: EntityManager,
  options: LibroSearchOptions
): Promise<Libro[]> {
  const { query, searchIn, limit, offset } = options;

  // Validar query
  const validation = validateSearchQuery(query);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  // Construir filtro
  const where = buildSearchFilter(validation.sanitizedQuery!, searchIn);

  // Ejecutar búsqueda con populate de relaciones necesarias
  const libros = await em.find(Libro, where, {
    populate: ['autor', 'categoria', 'editorial'],
    limit: limit || 50, // Límite por defecto
    offset: offset || 0,
    orderBy: { nombre: 'ASC' }
  });

  return libros;
}

/**
 * Busca libros solo por título
 */
export async function searchLibrosByTitulo(
  em: EntityManager,
  query: string,
  limit = 50
): Promise<Libro[]> {
  return searchLibrosOptimized(em, {
    query,
    searchIn: ['titulo'],
    limit
  });
}

/**
 * Busca libros solo por autor
 */
export async function searchLibrosByAutor(
  em: EntityManager,
  query: string,
  limit = 50
): Promise<Libro[]> {
  return searchLibrosOptimized(em, {
    query,
    searchIn: ['autor'],
    limit
  });
}

/**
 * Busca libros por ISBN
 * Nota: El entity Libro actualmente no tiene campo isbn
 * Esta función está preparada para cuando se agregue el campo
 */
export async function searchLibrosByISBN(
  em: EntityManager,
  isbn: string
): Promise<Libro | null> {
  const validation = validateSearchQuery(isbn);
  if (!validation.isValid) {
    return null;
  }

  // TODO: Descomentar cuando se agregue campo isbn al entity Libro
  // return em.findOne(Libro, { isbn: validation.sanitizedQuery }, {
  //   populate: ['autor', 'categoria', 'editorial']
  // });

  // Por ahora, retornar null
  console.warn('searchLibrosByISBN: El entity Libro no tiene campo isbn todavía');
  return null;
}

/**
 * Elimina duplicados de un array de libros basándose en el ID
 */
export function deduplicateLibros(libros: Libro[]): Libro[] {
  const seen = new Set<number>();
  return libros.filter(libro => {
    if (seen.has(libro.id)) {
      return false;
    }
    seen.add(libro.id);
    return true;
  });
}

/**
 * Estadísticas de búsqueda (para debugging)
 */
export interface SearchStats {
  query: string;
  fieldsSearched: string[];
  resultsCount: number;
  executionTime: number;
}

/**
 * Ejecuta búsqueda con estadísticas
 */
export async function searchLibrosWithStats(
  em: EntityManager,
  options: LibroSearchOptions
): Promise<{ libros: Libro[]; stats: SearchStats }> {
  const startTime = Date.now();
  
  const libros = await searchLibrosOptimized(em, options);
  
  const endTime = Date.now();
  
  const stats: SearchStats = {
    query: options.query,
    fieldsSearched: options.searchIn || ['titulo', 'autor'],
    resultsCount: libros.length,
    executionTime: endTime - startTime
  };

  return { libros, stats };
}

/**
 * Sanitiza caracteres especiales para SQL LIKE
 */
export function sanitizeLikePattern(query: string): string {
  // Escapar caracteres especiales de SQL LIKE: % _ [ ]
  return query
    .replace(/[%_\[\]]/g, '\\$&')
    .trim();
}

/**
 * Construye sugerencias de búsqueda basadas en resultados parciales
 */
export async function getSearchSuggestions(
  em: EntityManager,
  query: string,
  limit = 5
): Promise<string[]> {
  const validation = validateSearchQuery(query);
  if (!validation.isValid) {
    return [];
  }

  const sanitized = sanitizeLikePattern(validation.sanitizedQuery!);
  const pattern = `${sanitized}%`; // Autocompletar

  // Buscar títulos que comiencen con el query
  const libros = await em.find(Libro, {
    nombre: { $like: pattern }
  }, {
    fields: ['nombre'],
    limit,
    orderBy: { nombre: 'ASC' }
  });

  return libros
    .map(l => l.nombre)
    .filter((nombre): nombre is string => nombre !== undefined);
}
