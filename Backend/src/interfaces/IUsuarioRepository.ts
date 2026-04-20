import type { Usuario } from '../entities/usuario.entity';
import type { FilterQuery, FindOptions } from '@mikro-orm/core';

/**
 * Interfaz para el repositorio de Usuario
 * Abstrae el acceso a datos de usuarios
 */
export interface IUsuarioRepository {
  /**
   * Buscar usuario por ID
   */
  findById(id: number, options?: FindOptions<Usuario>): Promise<Usuario | null>;

  /**
   * Buscar usuario por username
   */
  findByUsername(username: string, options?: FindOptions<Usuario>): Promise<Usuario | null>;

  /**
   * Buscar usuario por email
   */
  findByEmail(email: string, options?: FindOptions<Usuario>): Promise<Usuario | null>;

  /**
   * Buscar múltiples usuarios con filtros
   */
  find(
    filter: FilterQuery<Usuario>,
    options?: FindOptions<Usuario>
  ): Promise<Usuario[]>;

  /**
   * Buscar un usuario con filtros
   */
  findOne(
    filter: FilterQuery<Usuario>,
    options?: FindOptions<Usuario>
  ): Promise<Usuario | null>;

  /**
   * Contar usuarios con filtros
   */
  count(filter?: FilterQuery<Usuario>): Promise<number>;

  /**
   * Crear nuevo usuario
   */
  create(usuario: Partial<Usuario>): Promise<Usuario>;

  /**
   * Actualizar usuario existente
   */
  update(id: number, data: Partial<Usuario>): Promise<Usuario>;

  /**
   * Eliminar usuario
   */
  delete(id: number): Promise<void>;

  /**
   * Verificar si existe un usuario con el username dado
   */
  existsByUsername(username: string): Promise<boolean>;

  /**
   * Verificar si existe un usuario con el email dado
   */
  existsByEmail(email: string): Promise<boolean>;

  /**
   * Buscar usuarios por rol
   */
  findByRole(role: string, options?: FindOptions<Usuario>): Promise<Usuario[]>;

  /**
   * Obtener favoritos de un usuario
   */
  getFavoritos(usuarioId: number): Promise<any[]>;

  /**
   * Obtener listas de un usuario
   */
  getListas(usuarioId: number): Promise<any[]>;

  /**
   * Obtener reseñas de un usuario
   */
  getResenas(usuarioId: number): Promise<any[]>;

  /**
   * Obtener actividad reciente de un usuario
   */
  getActividades(usuarioId: number, limit?: number): Promise<any[]>;
}
