import type { Usuario } from '../entities/usuario.entity';

/**
 * DTOs para operaciones de Usuario
 */
export interface CreateUsuarioDTO {
  username: string;
  email: string;
  password: string;
  nombre?: string;
  apellido?: string;
  fechaNacimiento?: Date;
  ubicacion?: string;
  biografia?: string;
}

export interface UpdateUsuarioDTO {
  email?: string;
  nombre?: string;
  apellido?: string;
  fechaNacimiento?: Date;
  ubicacion?: string;
  biografia?: string;
  fotoPerfil?: string;
  privacidadPerfil?: 'publico' | 'privado';
}

export interface ChangePasswordDTO {
  oldPassword: string;
  newPassword: string;
}

export interface UserProfileDTO {
  usuario: Usuario;
  estadisticas: {
    totalResenas: number;
    totalListas: number;
    totalFavoritos: number;
    totalSeguidores: number;
    totalSeguidos: number;
  };
  actividadReciente: any[];
}

/**
 * Interfaz del servicio de Usuario
 * Define el contrato de lógica de negocio para usuarios
 */
export interface IUsuarioService {
  /**
   * Obtener usuario por ID
   */
  getById(id: number): Promise<Usuario | null>;

  /**
   * Obtener usuario por username
   */
  getByUsername(username: string): Promise<Usuario | null>;

  /**
   * Obtener usuario por email
   */
  getByEmail(email: string): Promise<Usuario | null>;

  /**
   * Obtener perfil completo con estadísticas
   */
  getProfile(usuarioId: number): Promise<UserProfileDTO>;

  /**
   * Crear nuevo usuario (registro)
   */
  create(data: CreateUsuarioDTO): Promise<Usuario>;

  /**
   * Actualizar perfil de usuario
   */
  update(id: number, data: UpdateUsuarioDTO): Promise<Usuario>;

  /**
   * Cambiar contraseña
   */
  changePassword(usuarioId: number, data: ChangePasswordDTO): Promise<void>;

  /**
   * Eliminar usuario (soft delete o hard delete)
   */
  delete(id: number): Promise<void>;

  /**
   * Verificar si username está disponible
   */
  isUsernameAvailable(username: string): Promise<boolean>;

  /**
   * Verificar si email está disponible
   */
  isEmailAvailable(email: string): Promise<boolean>;

  /**
   * Validar credenciales de login
   */
  validateCredentials(usernameOrEmail: string, password: string): Promise<Usuario | null>;

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
   * Obtener actividad reciente
   */
  getActividad(usuarioId: number, limit?: number): Promise<any[]>;

  /**
   * Seguir a otro usuario
   */
  follow(seguidorId: number, seguidoId: number): Promise<void>;

  /**
   * Dejar de seguir a otro usuario
   */
  unfollow(seguidorId: number, seguidoId: number): Promise<void>;

  /**
   * Verificar si un usuario sigue a otro
   */
  isFollowing(seguidorId: number, seguidoId: number): Promise<boolean>;

  /**
   * Obtener seguidores de un usuario
   */
  getFollowers(usuarioId: number): Promise<Usuario[]>;

  /**
   * Obtener usuarios seguidos
   */
  getFollowing(usuarioId: number): Promise<Usuario[]>;
}
