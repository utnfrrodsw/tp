import type { Libro } from '../entities/libro.entity';

/**
 * DTOs para operaciones de Libro
 */
export interface CreateLibroDTO {
  titulo: string;
  isbn: string;
  descripcion?: string;
  paginas?: number;
  fechaPublicacion?: Date;
  idioma?: string;
  portada?: string;
  autorId?: number;
  editorialId?: number;
  sagaId?: number;
  ordenEnSaga?: number;
  categoriaIds?: number[];
}

export interface UpdateLibroDTO {
  titulo?: string;
  descripcion?: string;
  paginas?: number;
  fechaPublicacion?: Date;
  idioma?: string;
  portada?: string;
  autorId?: number;
  editorialId?: number;
  sagaId?: number;
  ordenEnSaga?: number;
}

export interface LibroSearchDTO {
  query?: string;
  autorId?: number;
  editorialId?: number;
  categoriaId?: number;
  sagaId?: number;
  fechaDesde?: Date;
  fechaHasta?: Date;
  paginasMin?: number;
  paginasMax?: number;
  idioma?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
}

export interface LibroStatsDTO {
  totalResenas: number;
  promedioCalificacion: number;
  distribucionCalificaciones: Record<number, number>;
  totalFavoritos: number;
}

/**
 * Interfaz del servicio de Libro
 * Define el contrato de lógica de negocio para libros
 */
export interface ILibroService {
  /**
   * Obtener libro por ID con relaciones
   */
  getById(id: number): Promise<Libro | null>;

  /**
   * Obtener libro por ISBN
   */
  getByISBN(isbn: string): Promise<Libro | null>;

  /**
   * Obtener libro por slug
   */
  getBySlug(slug: string): Promise<Libro | null>;

  /**
   * Buscar libros con filtros
   */
  search(filters: LibroSearchDTO): Promise<{
    libros: Libro[];
    total: number;
    page: number;
    pageSize: number;
  }>;

  /**
   * Crear nuevo libro
   */
  create(data: CreateLibroDTO): Promise<Libro>;

  /**
   * Actualizar libro
   */
  update(id: number, data: UpdateLibroDTO): Promise<Libro>;

  /**
   * Eliminar libro
   */
  delete(id: number): Promise<void>;

  /**
   * Obtener estadísticas de un libro
   */
  getStats(id: number): Promise<LibroStatsDTO>;

  /**
   * Obtener libros recomendados basados en un libro
   */
  getRecommended(libroId: number, limit?: number): Promise<Libro[]>;

  /**
   * Obtener libros más populares
   */
  getMostPopular(limit?: number): Promise<Libro[]>;

  /**
   * Obtener libros mejor valorados
   */
  getTopRated(limit?: number): Promise<Libro[]>;

  /**
   * Verificar si un libro existe por ISBN
   */
  existsByISBN(isbn: string): Promise<boolean>;

  /**
   * Importar libro desde API externa (Google Books, Open Library)
   */
  importFromExternalAPI(isbn: string, source: 'google' | 'openlibrary'): Promise<Libro>;
}
