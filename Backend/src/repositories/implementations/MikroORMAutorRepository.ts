import { EntityManager, FilterQuery, FindOptions } from '@mikro-orm/core';
import type { IAutorRepository } from '../../interfaces/IAutorRepository';
import { Autor } from '../../entities/autor.entity';

/**
 * Implementación de IAutorRepository usando MikroORM
 * Responsabilidad: Acceso a datos de autores
 */
export class MikroORMAutorRepository implements IAutorRepository {
  constructor(private readonly em: EntityManager) {}

  async findById(id: number, options?: FindOptions<Autor>): Promise<Autor | null> {
    return this.em.findOne(Autor, { id }, options);
  }

  async findByGoogleBooksId(googleBooksId: string): Promise<Autor | null> {
    return this.em.findOne(Autor, { googleBooksId });
  }

  async findByOpenLibraryId(openLibraryId: string): Promise<Autor | null> {
    return this.em.findOne(Autor, { openLibraryKey: openLibraryId });
  }

  async find(
    filter: FilterQuery<Autor>,
    options?: FindOptions<Autor>
  ): Promise<Autor[]> {
    return this.em.find(Autor, filter, options);
  }

  async findOne(
    filter: FilterQuery<Autor>,
    options?: FindOptions<Autor>
  ): Promise<Autor | null> {
    return this.em.findOne(Autor, filter, options);
  }

  async count(filter?: FilterQuery<Autor>): Promise<number> {
    return this.em.count(Autor, filter);
  }

  async create(autor: Partial<Autor>): Promise<Autor> {
    const newAutor = this.em.create(Autor, autor as any);
    await this.em.persistAndFlush(newAutor);
    return newAutor;
  }

  async update(id: number, data: Partial<Autor>): Promise<Autor> {
    const autor = await this.findById(id);
    if (!autor) {
      throw new Error(`Autor con id ${id} no encontrado`);
    }

    this.em.assign(autor, data);
    await this.em.flush();
    return autor;
  }

  async delete(id: number): Promise<void> {
    const autor = await this.findById(id);
    if (!autor) {
      throw new Error(`Autor con id ${id} no encontrado`);
    }

    await this.em.removeAndFlush(autor);
  }

  async searchByName(nombre: string, options?: FindOptions<Autor>): Promise<Autor[]> {
    return this.em.find(
      Autor,
      {
        $or: [
          { nombre: { $ilike: `%${nombre}%` } },
          { apellido: { $ilike: `%${nombre}%` } },
        ],
      },
      options
    );
  }

  async existsByName(nombre: string, apellido?: string): Promise<boolean> {
    const filter: any = { nombre };
    if (apellido) {
      filter.apellido = apellido;
    }

    const count = await this.em.count(Autor, filter);
    return count > 0;
  }

  async findMostPopular(limit: number): Promise<Autor[]> {
    // TODO: Implement using MikroORM's native methods
    // For now, just return recent autores as fallback
    return this.em.find(
      Autor,
      {},
      { orderBy: { createdAt: 'DESC' }, limit }
    );
  }

  async getLibros(autorId: number): Promise<any[]> {
    const autor = await this.em.findOne(
      Autor,
      { id: autorId },
      { populate: ['libros'] }
    );

    return autor?.libros?.toArray() || [];
  }

  async findOrCreate(data: Partial<Autor>): Promise<Autor> {
    // Buscar por nombre y apellido
    if (data.nombre) {
      const existing = await this.em.findOne(Autor, {
        nombre: data.nombre,
        apellido: data.apellido || null,
      });

      if (existing) {
        return existing;
      }
    }

    // Buscar por IDs externos
    if (data.googleBooksId) {
      const existing = await this.findByGoogleBooksId(data.googleBooksId);
      if (existing) {
        return existing;
      }
    }

    if (data.openLibraryKey) {
      const existing = await this.findByOpenLibraryId(data.openLibraryKey);
      if (existing) {
        return existing;
      }
    }

    // Crear nuevo
    return this.create(data);
  }
}
