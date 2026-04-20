import { EntityManager, FilterQuery, FindOptions } from '@mikro-orm/core';
import type { ILibroRepository } from '../../interfaces/ILibroRepository';
import { Libro } from '../../entities/libro.entity';

/**
 * Implementación de ILibroRepository usando MikroORM
 * Responsabilidad: Acceso a datos de libros
 */
export class MikroORMLibroRepository implements ILibroRepository {
  constructor(private readonly em: EntityManager) {}

  async findById(id: number, options?: FindOptions<Libro>): Promise<Libro | null> {
    return this.em.findOne(Libro, { id }, options);
  }

  async findByISBN(isbn: string): Promise<Libro | null> {
    // Libro entity doesn't have isbn property, search by externalId instead
    return this.em.findOne(Libro, { externalId: isbn });
  }

  async findBySlug(slug: string): Promise<Libro | null> {
    return this.em.findOne(Libro, { slug });
  }

  async find(
    filter: FilterQuery<Libro>,
    options?: FindOptions<Libro>
  ): Promise<Libro[]> {
    return this.em.find(Libro, filter, options);
  }

  async findOne(
    filter: FilterQuery<Libro>,
    options?: FindOptions<Libro>
  ): Promise<Libro | null> {
    return this.em.findOne(Libro, filter, options);
  }

  async count(filter?: FilterQuery<Libro>): Promise<number> {
    return this.em.count(Libro, filter);
  }

  async create(libro: Partial<Libro>): Promise<Libro> {
    const newLibro = this.em.create(Libro, libro as any);
    await this.em.persistAndFlush(newLibro);
    return newLibro;
  }

  async update(id: number, data: Partial<Libro>): Promise<Libro> {
    const libro = await this.findById(id);
    if (!libro) {
      throw new Error(`Libro con id ${id} no encontrado`);
    }

    this.em.assign(libro, data);
    await this.em.flush();
    return libro;
  }

  async delete(id: number): Promise<void> {
    const libro = await this.findById(id);
    if (!libro) {
      throw new Error(`Libro con id ${id} no encontrado`);
    }

    await this.em.removeAndFlush(libro);
  }

  async findByAutor(autorId: number, options?: FindOptions<Libro>): Promise<Libro[]> {
    return this.em.find(Libro, { autor: autorId }, options);
  }

  async findByEditorial(editorialId: number, options?: FindOptions<Libro>): Promise<Libro[]> {
    return this.em.find(Libro, { editorial: editorialId }, options);
  }

  async findByCategoria(categoriaId: number, options?: FindOptions<Libro>): Promise<Libro[]> {
    return this.em.find(
      Libro,
      { categoria: categoriaId },
      options
    );
  }

  async findBySaga(sagaId: number, options?: FindOptions<Libro>): Promise<Libro[]> {
    return this.em.find(Libro, { saga: sagaId }, options);
  }

  async search(query: string, options?: FindOptions<Libro>): Promise<Libro[]> {
    return this.em.find(
      Libro,
      {
        $or: [
          { nombre: { $ilike: `%${query}%` } },
          { sinopsis: { $ilike: `%${query}%` } },
        ],
      },
      options
    );
  }

  async existsByISBN(isbn: string): Promise<boolean> {
    // Libro entity doesn't have isbn property, check by externalId instead
    const count = await this.em.count(Libro, { externalId: isbn });
    return count > 0;
  }

  async findMostPopular(limit: number): Promise<Libro[]> {
    // TODO: Implement using MikroORM's native methods
    // For now, just return all libros sorted by creation date as fallback
    return this.em.find(
      Libro,
      {},
      { orderBy: { createdAt: 'DESC' }, limit }
    );
  }

  async findTopRated(limit: number): Promise<Libro[]> {
    // TODO: Implement using MikroORM's native methods
    // For now, just return all libros sorted by creation date as fallback
    return this.em.find(
      Libro,
      {},
      { orderBy: { createdAt: 'DESC' }, limit }
    );
  }
}
