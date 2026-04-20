import type { Autor } from '../entities/autor.entity';
import type { FilterQuery, FindOptions } from '@mikro-orm/core';

/**
 * Interfaz para el repositorio de Autor
 * Abstrae el acceso a datos de autores
 */
export interface IAutorRepository {
  /**
   * Buscar autor por ID
   */
  findById(id: number, options?: FindOptions<Autor>): Promise<Autor | null>;

  /**
   * Buscar autor por Google Books ID
   */
  findByGoogleBooksId(googleBooksId: string): Promise<Autor | null>;

  /**
   * Buscar autor por Open Library ID
   */
  findByOpenLibraryId(openLibraryId: string): Promise<Autor | null>;

  /**
   * Buscar múltiples autores con filtros
   */
  find(
    filter: FilterQuery<Autor>,
    options?: FindOptions<Autor>
  ): Promise<Autor[]>;

  /**
   * Buscar un autor con filtros
   */
  findOne(
    filter: FilterQuery<Autor>,
    options?: FindOptions<Autor>
  ): Promise<Autor | null>;

  /**
   * Contar autores con filtros
   */
  count(filter?: FilterQuery<Autor>): Promise<number>;

  /**
   * Crear nuevo autor
   */
  create(autor: Partial<Autor>): Promise<Autor>;

  /**
   * Actualizar autor existente
   */
  update(id: number, data: Partial<Autor>): Promise<Autor>;

  /**
   * Eliminar autor
   */
  delete(id: number): Promise<void>;

  /**
   * Buscar autores por nombre (búsqueda parcial)
   */
  searchByName(nombre: string, options?: FindOptions<Autor>): Promise<Autor[]>;

  /**
   * Verificar si existe un autor con el nombre dado
   */
  existsByName(nombre: string, apellido?: string): Promise<boolean>;

  /**
   * Obtener autores más populares (por cantidad de libros)
   */
  findMostPopular(limit: number): Promise<Autor[]>;

  /**
   * Obtener libros de un autor
   */
  getLibros(autorId: number): Promise<any[]>;

  /**
   * Buscar o crear autor por nombre
   */
  findOrCreate(data: Partial<Autor>): Promise<Autor>;
}
