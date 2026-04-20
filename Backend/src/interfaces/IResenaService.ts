import type { Resena } from '../entities/resena.entity';

/**
 * DTOs para operaciones de Reseña
 */
export interface CreateResenaDTO {
  titulo: string;
  contenido: string;
  calificacion: number;
  libroId: number;
  usuarioId: number;
  resenaOriginalId?: number; // Para respuestas
}

export interface UpdateResenaDTO {
  titulo?: string;
  contenido?: string;
  calificacion?: number;
}

export interface ResenaSearchDTO {
  libroId?: number;
  usuarioId?: number;
  calificacionMin?: number;
  calificacionMax?: number;
  fechaDesde?: Date;
  fechaHasta?: Date;
  conRespuestas?: boolean;
  limit?: number;
  offset?: number;
  orderBy?: 'fecha' | 'calificacion' | 'utilidad';
  orderDirection?: 'ASC' | 'DESC';
}

export interface ModerationDTO {
  aprobada: boolean;
  rechazada: boolean;
  moderadorId: number;
  razonRechazo?: string;
}

export interface ResenaWithStatsDTO extends Resena {
  totalReacciones: number;
  reaccionesPositivas: number;
  reaccionesNegativas: number;
  totalRespuestas: number;
}

/**
 * Interfaz del servicio de Reseña
 * Define el contrato de lógica de negocio para reseñas
 */
export interface IResenaService {
  /**
   * Obtener reseña por ID
   */
  getById(id: number): Promise<Resena | null>;

  /**
   * Buscar reseñas con filtros
   */
  search(filters: ResenaSearchDTO): Promise<{
    resenas: Resena[];
    total: number;
    page: number;
    pageSize: number;
  }>;

  /**
   * Crear nueva reseña
   */
  create(data: CreateResenaDTO): Promise<Resena>;

  /**
   * Actualizar reseña
   */
  update(id: number, data: UpdateResenaDTO, usuarioId: number): Promise<Resena>;

  /**
   * Eliminar reseña
   */
  delete(id: number, usuarioId: number): Promise<void>;

  /**
   * Obtener reseñas de un libro
   */
  getByLibro(libroId: number, options?: ResenaSearchDTO): Promise<Resena[]>;

  /**
   * Obtener reseñas de un usuario
   */
  getByUsuario(usuarioId: number, options?: ResenaSearchDTO): Promise<Resena[]>;

  /**
   * Obtener respuestas de una reseña
   */
  getRespuestas(resenaId: number): Promise<Resena[]>;

  /**
   * Crear respuesta a una reseña
   */
  createRespuesta(resenaId: number, data: CreateResenaDTO): Promise<Resena>;

  /**
   * Obtener reseñas más útiles de un libro
   */
  getMostHelpful(libroId: number, limit?: number): Promise<ResenaWithStatsDTO[]>;

  /**
   * Obtener reseñas recientes
   */
  getRecent(limit?: number): Promise<Resena[]>;

  /**
   * Verificar si usuario ya reseñó un libro
   */
  hasUserReviewed(usuarioId: number, libroId: number): Promise<boolean>;

  /**
   * Moderar reseña (aprobar/rechazar)
   */
  moderate(resenaId: number, moderation: ModerationDTO): Promise<Resena>;

  /**
   * Obtener reseñas pendientes de moderación
   */
  getPendingModeration(): Promise<Resena[]>;

  /**
   * Validar contenido de reseña (filtro de spam, palabras prohibidas)
   */
  validateContent(contenido: string): Promise<{ valid: boolean; reason?: string }>;
}
