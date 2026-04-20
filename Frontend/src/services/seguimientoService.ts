import { fetchWithRefresh } from '../utils/fetchWithRefresh';

export interface Usuario {
  id: number;
  username: string;
  email: string;
  nombre?: string;
  biografia?: string;
  ubicacion?: string;
  genero?: string;
  avatar?: string;
  rol: string;
  createdAt: string;
  updatedAt?: string;
}

export const seguimientoService = {
  async followUser(seguidoId: number): Promise<{ message: string }> {
    const response = await fetchWithRefresh('/api/seguimientos/follow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ seguidoId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al seguir al usuario');
    }

    return response.json();
  },

  async unfollowUser(seguidoId: number): Promise<{ message: string }> {
    const response = await fetchWithRefresh(`/api/seguimientos/unfollow/${seguidoId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al dejar de seguir al usuario');
    }

    return response.json();
  },

  async getSeguidores(usuarioId: number): Promise<Usuario[]> {
    const response = await fetchWithRefresh(`/api/seguimientos/seguidores/${usuarioId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al obtener seguidores');
    }

    return response.json();
  },

  async getSeguidos(): Promise<Usuario[]> {
    const response = await fetchWithRefresh('/api/seguimientos/seguidos');

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al obtener seguidos');
    }

    return response.json();
  },

  async isFollowing(seguidoId: number): Promise<boolean> {
    const response = await fetchWithRefresh(`/api/seguimientos/is-following/${seguidoId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al verificar seguimiento');
    }

    const data = await response.json();
    return data.isFollowing;
  },

  async getFollowCounts(userId: number): Promise<{ seguidores: number; siguiendo: number }> {
    const response = await fetchWithRefresh(`/api/seguimientos/counts/${userId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al obtener conteos de seguimiento');
    }

    return response.json();
  },
};
