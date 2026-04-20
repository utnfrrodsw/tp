import { fetchWithRefresh } from '../utils/fetchWithRefresh';

export interface PublicUserProfile {
  id: number;
  username: string;
  nombre?: string;
  biografia?: string;
  ubicacion?: string;
  genero?: 'masculino' | 'femenino' | 'otro';
  avatar?: string;
  createdAt: string;
  isFollowing?: boolean;
}

export interface UserStats {
  seguidores: number;
  siguiendo: number;
}

export const usuarioService = {
  /**
   * Obtiene el perfil público de un usuario por su ID
   * @param userId ID del usuario
   * @returns Perfil público del usuario
   */
  async getPublicProfile(userId: number): Promise<PublicUserProfile> {
    const response = await fetchWithRefresh(`/api/usuarios/perfil/${userId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al obtener perfil del usuario');
    }

    return response.json();
  },

  /**
   * Obtiene las estadísticas de seguimiento de un usuario
   * @param userId ID del usuario
   * @returns Contadores de seguidores y siguiendo
   */
  async getUserStats(userId: number): Promise<UserStats> {
    const response = await fetchWithRefresh(`/api/seguimientos/counts/${userId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al obtener estadísticas del usuario');
    }

    return response.json();
  },

  /**
   * Obtiene el usuario por ID (requiere autenticación)
   * @param userId ID del usuario
   * @returns Información completa del usuario (si tiene permisos)
   */
  async getUsuarioById(userId: number): Promise<any> {
    const response = await fetchWithRefresh(`/api/usuarios/${userId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al obtener usuario');
    }

    return response.json();
  },
};
