import type { Autor } from '../entities/autor.entity';

/**
 * DTOs para operaciones de Autor
 */
export interface CreateAutorDTO {
  nombre: string;
  apellido?: string;
  biografia?: string;
  fechaNacimiento?: Date;
  fechaFallecimiento?: Date;
  nacionalidad?: string;
  foto?: string;
  googleBooksId?: string;
  openLibraryId?: string;
}

export interface UpdateAutorDTO {
  nombre?: string;
  apellido?: string;
  biografia?: string;
  fechaNacimiento?: Date;
  fechaFallecimiento?: Date;
  nacionalidad?: string;
  foto?: string;
}

export interface AutorWithStatsDTO extends Autor {
  totalLibros: number;
  totalResenas: number;
  promedioCalificacion: number;
}

/**
 * Interfaz del servicio de Autor
 * Define el contrato de lógica de negocio para autores
 */
export interface IAutorService {
  /**
   * Obtener autor por ID
   */
  getById(id: number): Promise<Autor | null>;

  /**
   * Obtener autor por Google Books ID
   */
  getByGoogleBooksId(googleBooksId: string): Promise<Autor | null>;

  /**
   * Obtener autor por Open Library ID
   */
  getByOpenLibraryId(openLibraryId: string): Promise<Autor | null>;

  /**
   * Buscar autores por nombre
   */
  searchByName(query: string): Promise<Autor[]>;

  /**
   * Crear nuevo autor
   */
  create(data: CreateAutorDTO): Promise<Autor>;

  /**
   * Actualizar autor
   */
  update(id: number, data: UpdateAutorDTO): Promise<Autor>;

  /**
   * Eliminar autor
   */
  delete(id: number): Promise<void>;

  /**
   * Obtener libros de un autor
   */
  getLibros(autorId: number): Promise<any[]>;

  /**
   * Obtener autores más populares
   */
  getMostPopular(limit?: number): Promise<AutorWithStatsDTO[]>;

  /**
   * Verificar si existe autor por nombre
   */
  existsByName(nombre: string, apellido?: string): Promise<boolean>;

  /**
   * Buscar o crear autor
   */
  findOrCreate(data: CreateAutorDTO): Promise<Autor>;

  /**
   * Importar autor desde API externa
   */
  importFromExternalAPI(identifier: string, source: 'google' | 'openlibrary'): Promise<Autor>;
}
