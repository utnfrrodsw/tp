// src/utils/autorSearchHelpers.ts
import { EntityManager } from '@mikro-orm/core';
import { Autor } from '../entities/autor.entity';
import { 
  searchGoogleBooksAuthorsReadOnly, 
  searchOpenLibraryAuthorsReadOnly 
} from '../services/autor.service';
import redis from '../redis';

const CACHE_TTL = 300; // 5 minutos

/**
 * Valida la query de búsqueda de autores
 */
export function validateAuthorSearchQuery(query: any): { 
  valid: boolean; 
  error?: string;
  trimmedQuery?: string;
} {
  if (!query || typeof query !== 'string') {
    return { valid: false, error: 'El parámetro "q" es requerido y debe ser un string' };
  }

  const trimmedQuery = query.trim();
  
  if (trimmedQuery.length < 2) {
    return { valid: false, error: 'La consulta de búsqueda debe tener al menos 2 caracteres' };
  }

  if (trimmedQuery.length > 100) {
    return { valid: false, error: 'La consulta de búsqueda no puede exceder 100 caracteres' };
  }

  return { valid: true, trimmedQuery };
}

/**
 * Busca autores solo en la base de datos local
 */
export async function searchAutoresLocal(
  em: EntityManager,
  query: string
): Promise<Autor[]> {
  console.log('📚 Buscando en BDD local...');
  
  const autores = await em.find(Autor, {
    $or: [
      { nombre: { $like: `%${query}%` } },
      { apellido: { $like: `%${query}%` } }
    ]
  });

  console.log(`✅ Encontrados ${autores.length} autores locales`);
  return autores;
}

/**
 * Busca autores en APIs externas (sin guardar en BD)
 */
export async function searchAutoresExternal(query: string): Promise<any[]> {
  console.log('🌐 Buscando en APIs externas (READ-ONLY)...');
  
  try {
    const [autoresGoogleDTO, autoresOpenLibraryDTO] = await Promise.all([
      searchGoogleBooksAuthorsReadOnly(query).catch((err: any) => {
        console.error('❌ Error en Google Books:', err.message);
        return [];
      }),
      searchOpenLibraryAuthorsReadOnly(query).catch((err: any) => {
        console.error('❌ Error en OpenLibrary:', err.message);
        return [];
      })
    ]);
    
    console.log(`✅ Encontrados ${autoresGoogleDTO.length} autores en Google Books`);
    console.log(`✅ Encontrados ${autoresOpenLibraryDTO.length} autores en OpenLibrary`);
    
    return [...autoresGoogleDTO, ...autoresOpenLibraryDTO];
  } catch (error: any) {
    console.error('❌ Error buscando en APIs externas:', error.message);
    return [];
  }
}

/**
 * Combina resultados locales y externos
 */
export function combineAuthorResults(
  autoresLocales: Autor[],
  autoresExternos: any[]
): any[] {
  const combined = [...autoresLocales, ...autoresExternos];
  
  console.log(
    `✅ Total combinado: ${combined.length} autores ` +
    `(${autoresLocales.length} locales, ${autoresExternos.length} externos)`
  );
  
  return combined;
}

/**
 * Intenta obtener resultados del cache
 */
export async function getFromCache(cacheKey: string): Promise<any[] | null> {
  if (!redis) return null;
  
  try {
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log('✅ Cache HIT para búsqueda:', cacheKey);
      return JSON.parse(cachedData);
    }
    console.log('⚠️ Cache MISS para búsqueda:', cacheKey);
  } catch (cacheError) {
    console.error('❌ Error al leer cache de búsqueda:', cacheError);
  }
  
  return null;
}

/**
 * Guarda resultados en cache
 */
export async function saveToCache(
  cacheKey: string, 
  data: any[]
): Promise<void> {
  if (!redis) return;
  
  try {
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(data));
    console.log('💾 Búsqueda guardada en cache');
  } catch (cacheError) {
    console.error('❌ Error al guardar en cache:', cacheError);
  }
}

/**
 * Genera clave de cache para búsqueda
 */
export function generateCacheKey(query: string, includeExternal: boolean): string {
  return `autores:search:${query}:external:${includeExternal}`;
}
