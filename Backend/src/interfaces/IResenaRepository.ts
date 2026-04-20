import type { Resena } from '../entities/resena.entity';
import type { FilterQuery, FindOptions } from '@mikro-orm/core';

/**
 * Interfaz para el repositorio de Reseña
 * Abstrae el acceso a datos de reseñas
 */
export interface IResenaRepository {
  /**
   * Buscar reseña por ID
   */
  findById(id: number, options?: FindOptions<Resena>): Promise<Resena | null>;

  /**
   * Buscar múltiples reseñas con filtros
   */
  find(
    filter: FilterQuery<Resena>,
    options?: FindOptions<Resena>
  ): Promise<Resena[]>;

  /**
   * Buscar una reseña con filtros
   */
  findOne(
    filter: FilterQuery<Resena>,
    options?: FindOptions<Resena>
  ): Promise<Resena | null>;

  /**
   * Contar reseñas con filtros
   */
  count(filter?: FilterQuery<Resena>): Promise<number>;

  /**
   * Crear nueva reseña
   */
  create(resena: Partial<Resena>): Promise<Resena>;

  /**
   * Actualizar reseña existente
   */
  update(id: number, data: Partial<Resena>): Promise<Resena>;

  /**
   * Eliminar reseña
   */
  delete(id: number): Promise<void>;

  /**
   * Buscar reseñas por libro
   */
  findByLibro(libroId: number, options?: FindOptions<Resena>): Promise<Resena[]>;

  /**
   * Buscar reseñas por usuario
   */
  findByUsuario(usuarioId: number, options?: FindOptions<Resena>): Promise<Resena[]>;

  /**
   * Buscar respuestas de una reseña (respuestas a una reseña padre)
   */
  findRespuestas(resenaId: number, options?: FindOptions<Resena>): Promise<Resena[]>;

  /**
   * Verificar si un usuario ya reseñó un libro
   */
  existsByUsuarioAndLibro(usuarioId: number, libroId: number): Promise<boolean>;

  /**
   * Obtener reseñas pendientes de moderación
   */
  findPendingModeration(options?: FindOptions<Resena>): Promise<Resena[]>;

  /**
   * Obtener reseñas más útiles (por reacciones positivas)
   */
  findMostHelpful(libroId: number, limit: number): Promise<Resena[]>;

  /**
   * Obtener reseñas recientes
   */
  findRecent(limit: number, options?: FindOptions<Resena>): Promise<Resena[]>;

  /**
   * Calcular calificación promedio de un libro
   */
  getAverageRating(libroId: number): Promise<number>;

  /**
   * Contar reseñas por calificación (distribución)
   */
  getRatingDistribution(libroId: number): Promise<Record<number, number>>;
}
