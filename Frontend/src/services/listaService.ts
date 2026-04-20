import { fetchWithRefresh } from '../utils/fetchWithRefresh';

export interface Lista {
  id: number;
  nombre: string;
  tipo: 'read' | 'to_read' | 'pending' | 'custom';
  createdAt: string;
  ultimaModificacion: string;
  usuario: { id: number; username: string };
}

export interface ContenidoLista {
  id: number;
  createdAt: string;
  orden?: number; // Para drag & drop y ordenamiento personalizado
  lista: { id: number; tipo: string };
  libro: {
    id: number;
    nombre: string;
    autor?: { nombre: string };
    autores: string[];
    imagen: string;
    categoria: { nombre: string };
    ratingLibro?: { avgRating: number };
  };
}

export const listaService = {
  async getUserListas(): Promise<Lista[]> {
    const response = await fetchWithRefresh('/api/lista', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Error al obtener listas');
    return response.json();
  },

  async createLista(nombre: string, tipo: string): Promise<Lista> {
    const response = await fetchWithRefresh('/api/lista', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre, tipo }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Si el error es por lista duplicada, intentar obtener la existente
      if (response.status === 409 || errorData.message?.includes('ya existe')) {
        console.log('⚠️ Lista ya existe, buscando la existente...');
        const listas = await this.getUserListas();
        const listaExistente = listas.find(l => l.tipo === tipo || l.nombre === nombre);
        if (listaExistente) {
          console.log('✅ Lista existente encontrada:', listaExistente);
          return listaExistente;
        }
      }
      
      throw new Error(errorData.message || 'Error al crear lista');
    }
    return response.json();
  },

  // ✅ Nuevo método: Obtener o crear lista (idempotente)
  async getOrCreateLista(nombre: string, tipo: string): Promise<Lista> {
    try {
      // 1. Intentar obtener todas las listas del usuario
      const listas = await this.getUserListas();
      
      // 2. Buscar por tipo primero (más confiable para listas fijas)
      let listaExistente = listas.find(l => l.tipo === tipo);
      
      // 3. Si no existe, intentar crear
      if (!listaExistente) {
        console.log('📝 Creando nueva lista:', { nombre, tipo });
        listaExistente = await this.createLista(nombre, tipo);
      } else {
        console.log('✅ Lista ya existe:', listaExistente);
      }
      
      return listaExistente;
    } catch (error: any) {
      console.error('Error en getOrCreateLista:', error);
      throw error;
    }
  },

  async getContenidoLista(listaId: number): Promise<ContenidoLista[]> {
    const response = await fetchWithRefresh(`/api/contenido-lista/${listaId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Error al obtener contenido de lista');
    return response.json();
  },

  async addLibroALista(listaId: number, libro: { id: string; titulo: string; autores: string[]; descripcion: string | null; imagen: string | null; enlace: string | null; source: 'hardcover' | 'google' | 'local' | 'bookcode' }): Promise<void> {
    const response = await fetchWithRefresh('/api/contenido-lista', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ listaId, libro }),
    });

    if (!response.ok) {
      // Lee el cuerpo del error desde el servidor
      const errorData = await response.json();
      // Muestra el mensaje de error real en la consola
      console.error("Error del servidor:", errorData);
      // Lanza un error más descriptivo
      throw new Error(errorData.error || 'Error al agregar libro a lista');
    }
  },

  async removeLibroDeLista(listaId: number, libroId: string): Promise<void> {
    const response = await fetchWithRefresh(`/api/contenido-lista/${listaId}/${libroId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Error al remover libro de lista');
  },

  async getListasByUsuario(userId: number): Promise<Lista[]> {
    const response = await fetchWithRefresh(`/api/lista?usuarioId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Error al obtener listas del usuario');
    return response.json();
  },

  async getListasContainingBook(libroId: string): Promise<number[]> {
    const response = await fetchWithRefresh(`/api/libro/${libroId}/listas`);
    if (!response.ok) {
      throw new Error('Error al obtener las listas del libro');
    }
    return response.json(); // Devuelve el array de IDs
  },

  async getAllUserContenido(): Promise<ContenidoLista[]> {
    const response = await fetchWithRefresh('/api/contenido-lista/user/all', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Error al obtener todo el contenido del usuario');
    return response.json();
  },

  // Obtener lista con filtros y ordenamiento
  async getListaDetallada(
    listaId: number, 
    filtros?: {
      orderBy?: 'alfabetico' | 'fecha' | 'rating' | 'personalizado';
      filterAutor?: string;
      filterCategoria?: string;
      filterRating?: number;
      search?: string;
    }
  ): Promise<Lista & { contenidos: ContenidoLista[] }> {
    const params = new URLSearchParams();
    if (filtros?.orderBy) params.append('orderBy', filtros.orderBy);
    if (filtros?.filterAutor) params.append('filterAutor', filtros.filterAutor);
    if (filtros?.filterCategoria) params.append('filterCategoria', filtros.filterCategoria);
    if (filtros?.filterRating !== undefined) params.append('filterRating', filtros.filterRating.toString());
    if (filtros?.search) params.append('search', filtros.search);

    const queryString = params.toString();
    const url = queryString ? `/api/lista/${listaId}?${queryString}` : `/api/lista/${listaId}`;

    const response = await fetchWithRefresh(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Error al obtener lista detallada');
    return response.json();
  },

  // Reordenar libros en lista (drag & drop)
  async reordenarLista(listaId: number, ordenamiento: { libroId: number; orden: number }[]): Promise<void> {
    const response = await fetchWithRefresh(`/api/lista/${listaId}/reordenar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ordenamiento }),
    });
    if (!response.ok) throw new Error('Error al reordenar lista');
  },
};
