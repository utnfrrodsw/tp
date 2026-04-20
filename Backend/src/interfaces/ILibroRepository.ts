import type { Libro } from '../entities/libro.entity';
import type { FilterQuery, FindOptions } from '@mikro-orm/core';

/**
 * Interfaz para el repositorio de Libro
 * Sigue el patrón Repository para abstraer acceso a datos
 */
export interface ILibroRepository {
  /**
   * Buscar libro por ID
   */
  findById(id: number, options?: FindOptions<Libro>): Promise<Libro | null>;

  /**
   * Buscar libro por ISBN
   */
  findByISBN(isbn: string): Promise<Libro | null>;

  /**
   * Buscar libro por slug
   */
  findBySlug(slug: string): Promise<Libro | null>;

  /**
   * Buscar múltiples libros con filtros
   */
  find(
    filter: FilterQuery<Libro>,
    options?: FindOptions<Libro>
  ): Promise<Libro[]>;

  /**
   * Buscar un libro con filtros
   */
  findOne(
    filter: FilterQuery<Libro>,
    options?: FindOptions<Libro>
  ): Promise<Libro | null>;

  /**
   * Contar libros con filtros
   */
  count(filter?: FilterQuery<Libro>): Promise<number>;

  /**
   * Crear nuevo libro
   */
  create(libro: Partial<Libro>): Promise<Libro>;

  /**
   * Actualizar libro existente
   */
  update(id: number, data: Partial<Libro>): Promise<Libro>;

  /**
   * Eliminar libro
   */
  delete(id: number): Promise<void>;

  /**
   * Buscar libros por autor
   */
  findByAutor(autorId: number, options?: FindOptions<Libro>): Promise<Libro[]>;

  /**
   * Buscar libros por editorial
   */
  findByEditorial(editorialId: number, options?: FindOptions<Libro>): Promise<Libro[]>;

  /**
   * Buscar libros por categoría
   */
  findByCategoria(categoriaId: number, options?: FindOptions<Libro>): Promise<Libro[]>;

  /**
   * Buscar libros por saga
   */
  findBySaga(sagaId: number, options?: FindOptions<Libro>): Promise<Libro[]>;

  /**
   * Búsqueda de texto completo
   */
  search(query: string, options?: FindOptions<Libro>): Promise<Libro[]>;

  /**
   * Verificar si existe un libro con el ISBN dado
   */
  existsByISBN(isbn: string): Promise<boolean>;

  /**
   * Obtener libros más populares (por reseñas)
   */
  findMostPopular(limit: number): Promise<Libro[]>;

  /**
   * Obtener libros mejor valorados
   */
  findTopRated(limit: number): Promise<Libro[]>;
}
