/**
 * Utilidades para parsear y validar respuestas de la API
 * Asegura que los datos tengan la estructura esperada
 */

/**
 * Parsea respuesta de libro desde la API
 */
export function parseLibroResponse(data: any): any | null {
  if (!data || typeof data !== 'object') {
    return null;
  }
  
  try {
    return {
      id: data.id || data.external_id || '',
      externalId: data.externalId || data.external_id || data.id || '',
      nombre: data.nombre || data.title || '',
      slug: data.slug || '',
      sinopsis: data.sinopsis || data.description || '',
      imagen: data.imagen || data.thumbnail || data.imageUrl || '',
      enlace: data.enlace || data.link || '',
      source: data.source || 'manual',
      autor: data.autor ? parseAutorResponse(data.autor) : undefined,
      categoria: data.categoria ? parseCategoriaResponse(data.categoria) : undefined,
      saga: data.saga ? parseSagaResponse(data.saga) : undefined,
      createdAt: data.createdAt || data.created_at,
      updatedAt: data.updatedAt || data.updated_at
    };
  } catch (error) {
    console.error('Error parseando libro:', error);
    return null;
  }
}

/**
 * Parsea array de libros
 */
export function parseLibrosResponse(data: any): any[] {
  if (!Array.isArray(data)) {
    return [];
  }
  
  return data
    .map(parseLibroResponse)
    .filter((libro): libro is any => libro !== null);
}

/**
 * Parsea respuesta de reseña desde la API
 */
export function parseResenaResponse(data: any): any | null {
  if (!data || typeof data !== 'object') {
    return null;
  }
  
  try {
    return {
      id: data.id,
      comentario: data.comentario || '',
      estrellas: typeof data.estrellas === 'number' ? data.estrellas : 0,
      estado: data.estado || 'pendiente',
      fechaResena: data.fechaResena || data.fecha_resena || data.createdAt,
      usuario: data.usuario ? parseUserResponse(data.usuario) : undefined,
      libro: data.libro ? parseLibroResponse(data.libro) : undefined,
      reacciones: Array.isArray(data.reacciones) ? data.reacciones : [],
      respuestas: Array.isArray(data.respuestas) ? data.respuestas.map(parseResenaResponse).filter(Boolean) : [],
      resenaPadre: data.resenaPadre ? parseResenaResponse(data.resenaPadre) : undefined,
      createdAt: data.createdAt || data.created_at,
      updatedAt: data.updatedAt || data.updated_at
    };
  } catch (error) {
    console.error('Error parseando reseña:', error);
    return null;
  }
}

/**
 * Parsea array de reseñas
 */
export function parseResenasResponse(data: any): any[] {
  if (!Array.isArray(data)) {
    return [];
  }
  
  return data
    .map(parseResenaResponse)
    .filter((resena): resena is any => resena !== null);
}

/**
 * Parsea respuesta de usuario desde la API
 */
export function parseUserResponse(data: any): any | null {
  if (!data || typeof data !== 'object') {
    return null;
  }
  
  try {
    return {
      id: data.id,
      email: data.email || '',
      username: data.username || '',
      nombre: data.nombre || '',
      biografia: data.biografia || '',
      ubicacion: data.ubicacion || '',
      genero: data.genero || '',
      avatar: data.avatar || '',
      rol: data.rol || 'usuario',
      createdAt: data.createdAt || data.created_at,
      updatedAt: data.updatedAt || data.updated_at
    };
  } catch (error) {
    console.error('Error parseando usuario:', error);
    return null;
  }
}

/**
 * Parsea respuesta de autor desde la API
 */
export function parseAutorResponse(data: any): any | null {
  if (!data || typeof data !== 'object') {
    return null;
  }
  
  try {
    return {
      id: data.id,
      nombre: data.nombre || '',
      apellido: data.apellido || '',
      foto: data.foto || '',
      googleBooksId: data.googleBooksId || data.google_books_id,
      openLibraryKey: data.openLibraryKey || data.open_library_key,
      biografia: data.biografia || '',
      createdAt: data.createdAt || data.created_at,
      updatedAt: data.updatedAt || data.updated_at
    };
  } catch (error) {
    console.error('Error parseando autor:', error);
    return null;
  }
}

/**
 * Parsea respuesta de categoría desde la API
 */
export function parseCategoriaResponse(data: any): any | null {
  if (!data || typeof data !== 'object') {
    return null;
  }
  
  try {
    return {
      id: data.id,
      nombre: data.nombre || '',
      descripcion: data.descripcion || '',
      imagen: data.imagen || '',
      createdAt: data.createdAt || data.created_at,
      updatedAt: data.updatedAt || data.updated_at
    };
  } catch (error) {
    console.error('Error parseando categoría:', error);
    return null;
  }
}

/**
 * Parsea respuesta de saga desde la API
 */
export function parseSagaResponse(data: any): any | null {
  if (!data || typeof data !== 'object') {
    return null;
  }
  
  try {
    return {
      id: data.id,
      nombre: data.nombre || '',
      libros: Array.isArray(data.libros) ? parseLibrosResponse(data.libros) : [],
      createdAt: data.createdAt || data.created_at,
      updatedAt: data.updatedAt || data.updated_at
    };
  } catch (error) {
    console.error('Error parseando saga:', error);
    return null;
  }
}

/**
 * Parsea respuesta de paginación
 */
export function parsePaginationResponse(data: any): {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
} {
  return {
    page: typeof data?.page === 'number' ? data.page : 1,
    limit: typeof data?.limit === 'number' ? data.limit : 12,
    total: typeof data?.total === 'number' ? data.total : 0,
    totalPages: typeof data?.totalPages === 'number' ? data.totalPages : 0
  };
}

/**
 * Valida respuesta de API y extrae datos
 */
export function validateAPIResponse<T>(
  response: any,
  parser: (data: any) => T | null
): { success: boolean; data?: T; error?: string } {
  if (!response) {
    return {
      success: false,
      error: 'No se recibió respuesta del servidor'
    };
  }
  
  if (response.error || response.message) {
    return {
      success: false,
      error: response.message || response.error || 'Error desconocido'
    };
  }
  
  const parsedData = parser(response);
  
  if (!parsedData) {
    return {
      success: false,
      error: 'Error al procesar los datos recibidos'
    };
  }
  
  return {
    success: true,
    data: parsedData
  };
}

/**
 * Valida respuesta de array de API
 */
export function validateAPIArrayResponse<T>(
  response: any,
  parser: (data: any[]) => T[]
): { success: boolean; data?: T[]; error?: string } {
  if (!response) {
    return {
      success: false,
      error: 'No se recibió respuesta del servidor'
    };
  }
  
  if (response.error || response.message) {
    return {
      success: false,
      error: response.message || response.error || 'Error desconocido'
    };
  }
  
  const data = Array.isArray(response) ? response : response.data || [];
  const parsedData = parser(data);
  
  return {
    success: true,
    data: parsedData
  };
}
