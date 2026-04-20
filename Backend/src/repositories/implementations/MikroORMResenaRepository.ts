import { EntityManager, FilterQuery, FindOptions } from '@mikro-orm/core';
import type { IResenaRepository } from '../../interfaces/IResenaRepository';
import { Resena, EstadoResena } from '../../entities/resena.entity';

/**
 * Implementación de IResenaRepository usando MikroORM
 * Responsabilidad: Acceso a datos de reseñas
 */
export class MikroORMResenaRepository implements IResenaRepository {
  constructor(private readonly em: EntityManager) {}

  async findById(id: number, options?: FindOptions<Resena>): Promise<Resena | null> {
    return this.em.findOne(Resena, { id }, options);
  }

  async find(
    filter: FilterQuery<Resena>,
    options?: FindOptions<Resena>
  ): Promise<Resena[]> {
    return this.em.find(Resena, filter, options);
  }

  async findOne(
    filter: FilterQuery<Resena>,
    options?: FindOptions<Resena>
  ): Promise<Resena | null> {
    return this.em.findOne(Resena, filter, options);
  }

  async count(filter?: FilterQuery<Resena>): Promise<number> {
    return this.em.count(Resena, filter);
  }

  async create(resena: Partial<Resena>): Promise<Resena> {
    const newResena = this.em.create(Resena, resena as any);
    await this.em.persistAndFlush(newResena);
    return newResena;
  }

  async update(id: number, data: Partial<Resena>): Promise<Resena> {
    const resena = await this.findById(id);
    if (!resena) {
      throw new Error(`Reseña con id ${id} no encontrada`);
    }

    this.em.assign(resena, data);
    await this.em.flush();
    return resena;
  }

  async delete(id: number): Promise<void> {
    const resena = await this.findById(id);
    if (!resena) {
      throw new Error(`Reseña con id ${id} no encontrada`);
    }

    await this.em.removeAndFlush(resena);
  }

  async findByLibro(libroId: number, options?: FindOptions<Resena>): Promise<Resena[]> {
    return this.em.find(Resena, { libro: libroId }, options);
  }

  async findByUsuario(usuarioId: number, options?: FindOptions<Resena>): Promise<Resena[]> {
    return this.em.find(Resena, { usuario: usuarioId }, options);
  }

  async findRespuestas(resenaId: number, options?: FindOptions<Resena>): Promise<Resena[]> {
    return this.em.find(Resena, { resenaPadre: resenaId }, options);
  }

  async existsByUsuarioAndLibro(usuarioId: number, libroId: number): Promise<boolean> {
    const count = await this.em.count(Resena, {
      usuario: usuarioId,
      libro: libroId,
      resenaPadre: null, // Solo reseñas principales, no respuestas
    });
    return count > 0;
  }

  async findPendingModeration(options?: FindOptions<Resena>): Promise<Resena[]> {
    return this.em.find(
      Resena,
      {
        estado: EstadoResena.PENDING,
      },
      options
    );
  }

  async findMostHelpful(libroId: number, limit: number): Promise<Resena[]> {
    // TODO: Implement using MikroORM's native methods
    // For now, just return recent reseñas as fallback
    return this.em.find(
      Resena,
      { libro: libroId, resenaPadre: null },
      { orderBy: { createdAt: 'DESC' }, limit }
    );
  }

  async findRecent(limit: number, options?: FindOptions<Resena>): Promise<Resena[]> {
    return this.em.find(
      Resena,
      {},
      {
        ...options,
        orderBy: { createdAt: 'DESC' },
        limit,
      }
    );
  }

  async getAverageRating(libroId: number): Promise<number> {
    // TODO: Implement using MikroORM's native methods
    // For now, return 0 as fallback
    return 0;
  }

  async getRatingDistribution(libroId: number): Promise<Record<number, number>> {
    // TODO: Implement using MikroORM's native methods
    // For now, return empty distribution
    return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  }
}
