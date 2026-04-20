// src/utils/resenaPopulateHelpers.ts
/**
 * Helper functions para manejar diferentes estrategias de populate de reseñas.
 * Evita cargar relaciones innecesarias, mejorando el rendimiento.
 */

import { EntityManager, FilterQuery, FindOptions } from '@mikro-orm/mysql';
import { Resena, EstadoResena } from '../entities/resena.entity';

/**
 * Tipo para las diferentes estrategias de populate
 */
export type PopulateStrategy = 'minimal' | 'with-reactions' | 'with-replies' | 'complete' | 'moderation';

/**
 * Configuraciones de populate según la estrategia
 */
const POPULATE_CONFIGS = {
  minimal: ['usuario', 'libro', 'libro.autor'],
  
  'with-reactions': [
    'usuario',
    'libro',
    'libro.autor',
    'reacciones',
    'reacciones.usuario'
  ],
  
  'with-replies': [
    'usuario',
    'libro',
    'libro.autor',
    'respuestas',
    'respuestas.usuario',
    'respuestas.reacciones'
  ],
  
  complete: [
    'usuario',
    'libro',
    'libro.autor',
    'reacciones',
    'reacciones.usuario',
    'resenaPadre.usuario',
    'respuestas.usuario',
    'respuestas.reacciones',
    'respuestas.reacciones.usuario',
    'respuestas.resenaPadre.usuario',
    'respuestas.respuestas.usuario'
  ],
  
  moderation: [
    'usuario',
    'libro',
    'libro.autor',
    'reacciones'
  ]
};

/**
 * Obtiene la configuración de populate según la estrategia
 */
export function getPopulateConfig(strategy: PopulateStrategy): string[] {
  return POPULATE_CONFIGS[strategy] || POPULATE_CONFIGS.minimal;
}

/**
 * Determina automáticamente la mejor estrategia según los query params
 */
export function determinePopulateStrategy(query: any): PopulateStrategy {
  // Moderación
  if (query.estado === 'PENDING') {
    return 'moderation';
  }
  
  // Vista completa (para páginas de detalle)
  if (query.includeReplies === 'true' && query.includeReactions === 'true') {
    return 'complete';
  }
  
  // Solo respuestas
  if (query.includeReplies === 'true') {
    return 'with-replies';
  }
  
  // Solo reacciones
  if (query.includeReactions === 'true') {
    return 'with-reactions';
  }
  
  // Por defecto, mínimo
  return 'minimal';
}

/**
 * Busca reseñas con la estrategia de populate especificada
 */
export async function findResenasWithStrategy(
  em: EntityManager,
  where: FilterQuery<Resena>,
  strategy: PopulateStrategy,
  options?: {
    orderBy?: FindOptions<Resena>['orderBy'];
    limit?: number;
    offset?: number;
  }
): Promise<Resena[]> {
  const populate = getPopulateConfig(strategy);
  
  const findOptions: FindOptions<Resena> = {
    populate: populate as any,
    orderBy: options?.orderBy || { createdAt: 'DESC' as const },
  };
  
  if (options?.limit !== undefined) {
    findOptions.limit = options.limit;
  }
  
  if (options?.offset !== undefined) {
    findOptions.offset = options.offset;
  }
  
  return em.find(Resena, where, findOptions);
}

/**
 * Busca una reseña por ID con la estrategia especificada
 */
export async function findResenaByIdWithStrategy(
  em: EntityManager,
  id: number,
  strategy: PopulateStrategy
): Promise<Resena | null> {
  const populate = getPopulateConfig(strategy);
  
  return em.findOne(Resena, { id }, {
    populate: populate as any
  });
}

/**
 * Obtiene reseñas mínimas (solo usuario, libro y autor)
 * Útil para: Listados simples, feeds, previews
 */
export async function findResenasMinimal(
  em: EntityManager,
  where: FilterQuery<Resena>,
  options?: { limit?: number; offset?: number }
): Promise<Resena[]> {
  return findResenasWithStrategy(em, where, 'minimal', options);
}

/**
 * Obtiene reseñas con reacciones
 * Útil para: Listados con contadores de likes/dislikes
 */
export async function findResenasWithReactions(
  em: EntityManager,
  where: FilterQuery<Resena>,
  options?: { limit?: number; offset?: number }
): Promise<Resena[]> {
  return findResenasWithStrategy(em, where, 'with-reactions', options);
}

/**
 * Obtiene reseñas con respuestas
 * Útil para: Threads de conversación
 */
export async function findResenasWithReplies(
  em: EntityManager,
  where: FilterQuery<Resena>,
  options?: { limit?: number; offset?: number }
): Promise<Resena[]> {
  return findResenasWithStrategy(em, where, 'with-replies', options);
}

/**
 * Obtiene reseñas completas con todas las relaciones
 * Útil para: Página de detalle de reseña, moderación completa
 */
export async function findResenasComplete(
  em: EntityManager,
  where: FilterQuery<Resena>,
  options?: { limit?: number; offset?: number }
): Promise<Resena[]> {
  return findResenasWithStrategy(em, where, 'complete', options);
}

/**
 * Obtiene reseñas para moderación
 * Útil para: Panel de moderación
 */
export async function findResenasForModeration(
  em: EntityManager,
  where: FilterQuery<Resena>,
  options?: { limit?: number; offset?: number }
): Promise<Resena[]> {
  return findResenasWithStrategy(em, where, 'moderation', options);
}

/**
 * Información sobre el ahorro de queries según estrategia
 */
export function getStrategyStats(strategy: PopulateStrategy): {
  strategy: PopulateStrategy;
  populateCount: number;
  estimatedQueries: number;
  useCases: string[];
} {
  const configs = {
    minimal: {
      populateCount: 3,
      estimatedQueries: 4, // 1 main + 3 populate
      useCases: ['Listados simples', 'Feeds', 'Previews', 'Cards']
    },
    'with-reactions': {
      populateCount: 5,
      estimatedQueries: 6,
      useCases: ['Listados con likes', 'Feeds con engagement', 'Trending reviews']
    },
    'with-replies': {
      populateCount: 6,
      estimatedQueries: 7,
      useCases: ['Threads', 'Conversaciones', 'Discusiones']
    },
    complete: {
      populateCount: 11,
      estimatedQueries: 15,
      useCases: ['Detalle completo', 'Moderación full', 'Admin panel']
    },
    moderation: {
      populateCount: 4,
      estimatedQueries: 5,
      useCases: ['Panel de moderación', 'Review de contenido']
    }
  };
  
  const config = configs[strategy];
  
  return {
    strategy,
    ...config
  };
}

/**
 * Log de estadísticas de populate (útil para debugging)
 */
export function logPopulateStats(strategy: PopulateStrategy): void {
  const stats = getStrategyStats(strategy);
  console.log(`🔍 Populate Strategy: ${stats.strategy}`);
  console.log(`   📊 Relations loaded: ${stats.populateCount}`);
  console.log(`   🔢 Estimated queries: ${stats.estimatedQueries}`);
  console.log(`   🎯 Use cases: ${stats.useCases.join(', ')}`);
}
