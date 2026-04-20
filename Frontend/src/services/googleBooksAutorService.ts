// Servicio para enriquecer información de autores usando Google Books API
const GOOGLE_BOOKS_API_KEY = 'AIzaSyDv1Nti5ax3FCGI-GXKzyj3S1OTK29retI';
const GOOGLE_BOOKS_BASE_URL = 'https://www.googleapis.com/books/v1/volumes';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 días

export interface GoogleBooksAuthorData {
  foto?: string;
  biografia?: string;
  libros: GoogleBook[];
  totalResults: number;
}

export interface GoogleBook {
  id: string;
  titulo: string;
  subtitulo?: string;
  autores: string[];
  portada?: string;
  portadaGrande?: string;
  descripcion?: string;
  fechaPublicacion?: string;
  editorial?: string;
  categorias?: string[];
  idioma?: string;
  paginas?: number;
  isbn?: string;
  calificacion?: number;
  numCalificaciones?: number;
  infoLink?: string;
  previewLink?: string;
}

/**
 * Buscar autor en Google Books y obtener todos sus libros
 */
export const buscarAutorEnGoogleBooks = async (
  nombreCompleto: string,
  maxResults: number = 40
): Promise<GoogleBooksAuthorData> => {
  try {
    // Verificar cache primero
    const cacheKey = `google_books_autor_${nombreCompleto.toLowerCase().replace(/\s+/g, '_')}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const age = Date.now() - timestamp;
      
      if (age < CACHE_DURATION) {
        console.log(`✅ Datos de Google Books desde cache para: ${nombreCompleto}`);
        return data;
      }
    }

    console.log(`🔍 Consultando Google Books API para: ${nombreCompleto}`);

    // Buscar libros del autor
    const query = `inauthor:"${nombreCompleto}"`;
    const url = `${GOOGLE_BOOKS_BASE_URL}?q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${GOOGLE_BOOKS_API_KEY}&orderBy=relevance`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Google Books API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return {
        libros: [],
        totalResults: 0
      };
    }

    // Procesar libros
    const libros: GoogleBook[] = data.items.map((item: any) => {
      const volumeInfo = item.volumeInfo;
      const imageLinks = volumeInfo.imageLinks || {};
      
      return {
        id: item.id,
        titulo: volumeInfo.title || 'Sin título',
        subtitulo: volumeInfo.subtitle,
        autores: volumeInfo.authors || [],
        portada: imageLinks.thumbnail?.replace('http:', 'https:') || imageLinks.smallThumbnail?.replace('http:', 'https:'),
        portadaGrande: imageLinks.large?.replace('http:', 'https:') || imageLinks.medium?.replace('http:', 'https:'),
        descripcion: volumeInfo.description,
        fechaPublicacion: volumeInfo.publishedDate,
        editorial: volumeInfo.publisher,
        categorias: volumeInfo.categories,
        idioma: volumeInfo.language,
        paginas: volumeInfo.pageCount,
        isbn: volumeInfo.industryIdentifiers?.[0]?.identifier,
        calificacion: volumeInfo.averageRating,
        numCalificaciones: volumeInfo.ratingsCount,
        infoLink: item.volumeInfo.infoLink,
        previewLink: item.volumeInfo.previewLink
      };
    });

    // Intentar obtener foto y biografía del primer libro (suele tener info del autor)
    let foto: string | undefined;
    let biografia: string | undefined;

    // La foto del autor raramente está en Google Books, pero intentamos
    // Normalmente viene en volumeInfo.imageLinks de algún libro
    if (data.items.length > 0) {
      const primerLibro = data.items[0].volumeInfo;
      
      // Algunos libros tienen foto del autor en description
      if (primerLibro.description) {
        // Intentar extraer info del autor de la descripción
        const descripcion = primerLibro.description;
        if (descripcion.length > 200) {
          biografia = descripcion.substring(0, 400) + '...';
        }
      }
    }

    const resultado: GoogleBooksAuthorData = {
      foto,
      biografia,
      libros,
      totalResults: data.totalItems || libros.length
    };

    // Guardar en cache
    localStorage.setItem(cacheKey, JSON.stringify({
      data: resultado,
      timestamp: Date.now()
    }));

    console.log(`✅ Encontrados ${libros.length} libros en Google Books para ${nombreCompleto}`);
    
    return resultado;
  } catch (error) {
    console.error('Error consultando Google Books:', error);
    return {
      libros: [],
      totalResults: 0
    };
  }
};

/**
 * Buscar foto del autor en Wikipedia/Wikidata
 */
export const buscarFotoAutor = async (nombreCompleto: string): Promise<string | null> => {
  try {
    // Cache para fotos
    const cacheKey = `foto_autor_${nombreCompleto.toLowerCase().replace(/\s+/g, '_')}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      const { foto, timestamp } = JSON.parse(cached);
      const age = Date.now() - timestamp;
      
      if (age < CACHE_DURATION) {
        return foto;
      }
    }

    console.log(`📸 Buscando foto del autor: ${nombreCompleto}`);

    // Intentar Wikipedia API
    const wikiUrl = `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(nombreCompleto)}`;
    const wikiResponse = await fetch(wikiUrl);
    
    if (wikiResponse.ok) {
      const wikiData = await wikiResponse.json();
      
      if (wikiData.thumbnail?.source) {
        const foto = wikiData.thumbnail.source;
        
        // Guardar en cache
        localStorage.setItem(cacheKey, JSON.stringify({
          foto,
          timestamp: Date.now()
        }));
        
        console.log(`✅ Foto encontrada en Wikipedia para ${nombreCompleto}`);
        return foto;
      }
    }

    // Si no encuentra en Wikipedia, intentar con originalimage
    if (wikiResponse.ok) {
      const wikiData = await wikiResponse.json();
      if (wikiData.originalimage?.source) {
        const foto = wikiData.originalimage.source;
        
        localStorage.setItem(cacheKey, JSON.stringify({
          foto,
          timestamp: Date.now()
        }));
        
        return foto;
      }
    }

    console.log(`⚠️ No se encontró foto para ${nombreCompleto}`);
    return null;
  } catch (error) {
    console.error('Error buscando foto del autor:', error);
    return null;
  }
};

/**
 * Obtener detalles completos de un libro específico
 */
export const obtenerDetallesLibro = async (googleBooksId: string): Promise<GoogleBook | null> => {
  try {
    const url = `${GOOGLE_BOOKS_BASE_URL}/${googleBooksId}?key=${GOOGLE_BOOKS_API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error obteniendo detalles del libro: ${response.status}`);
    }

    const item = await response.json();
    const volumeInfo = item.volumeInfo;
    const imageLinks = volumeInfo.imageLinks || {};
    
    return {
      id: item.id,
      titulo: volumeInfo.title || 'Sin título',
      subtitulo: volumeInfo.subtitle,
      autores: volumeInfo.authors || [],
      portada: imageLinks.thumbnail?.replace('http:', 'https:'),
      portadaGrande: imageLinks.large?.replace('http:', 'https:') || imageLinks.medium?.replace('http:', 'https:'),
      descripcion: volumeInfo.description,
      fechaPublicacion: volumeInfo.publishedDate,
      editorial: volumeInfo.publisher,
      categorias: volumeInfo.categories,
      idioma: volumeInfo.language,
      paginas: volumeInfo.pageCount,
      isbn: volumeInfo.industryIdentifiers?.[0]?.identifier,
      calificacion: volumeInfo.averageRating,
      numCalificaciones: volumeInfo.ratingsCount,
      infoLink: item.volumeInfo.infoLink,
      previewLink: item.volumeInfo.previewLink
    };
  } catch (error) {
    console.error('Error obteniendo detalles del libro:', error);
    return null;
  }
};

/**
 * Limpiar cache de Google Books
 */
export const limpiarCacheGoogleBooks = () => {
  const keys = Object.keys(localStorage);
  let count = 0;
  
  keys.forEach(key => {
    if (key.startsWith('google_books_') || key.startsWith('foto_autor_')) {
      localStorage.removeItem(key);
      count++;
    }
  });
  
  console.log(`🗑️ Cache limpiado: ${count} entradas eliminadas`);
};

/**
 * Combinar libros de BD local con Google Books (eliminar duplicados)
 */
export const combinarLibros = (
  librosLocales: any[],
  librosGoogle: GoogleBook[]
): { locales: any[], adicionales: GoogleBook[] } => {
  // Normalizar títulos para comparación
  const normalizarTitulo = (titulo: string) => {
    return titulo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
      .replace(/[^\w\s]/g, '') // Quitar puntuación
      .trim();
  };

  const titulosLocales = new Set(
    librosLocales.map(libro => normalizarTitulo(libro.nombre || libro.titulo || ''))
  );

  // Filtrar libros de Google que NO están en la BD local
  const librosAdicionales = librosGoogle.filter(libroGoogle => {
    const tituloNormalizado = normalizarTitulo(libroGoogle.titulo);
    return !titulosLocales.has(tituloNormalizado);
  });

  console.log(`📚 Libros locales: ${librosLocales.length}`);
  console.log(`📚 Libros Google: ${librosGoogle.length}`);
  console.log(`📚 Libros adicionales (no en BD): ${librosAdicionales.length}`);

  return {
    locales: librosLocales,
    adicionales: librosAdicionales
  };
};

export default {
  buscarAutorEnGoogleBooks,
  buscarFotoAutor,
  obtenerDetallesLibro,
  limpiarCacheGoogleBooks,
  combinarLibros
};
