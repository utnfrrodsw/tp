import { EntityManager } from '@mikro-orm/core';
import { Autor } from '../entities/autor.entity';
import axios from 'axios';
import redis from '../redis';

const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

interface GoogleBooksAuthor {
  name: string;
}

interface OpenLibraryAuthor {
  key: string;
  name: string;
  birth_date?: string;
  death_date?: string;
  bio?: string | { value: string };
  photos?: number[];
}

// DTO para autores externos (sin guardar en BDD)
export interface ExternalAuthorDTO {
  nombre: string;
  apellido: string;
  googleBooksId?: string;
  openLibraryKey?: string;
  biografia?: string;
  foto?: string;
  external: true; // Flag para identificar que no está en BDD
}

/**
 * Reconcilia un autor de Google Books con la base de datos.
 * Evita duplicados buscando primero por googleBooksId, luego por nombre.
 */
export async function reconcileGoogleBooksAuthor(
  em: EntityManager,
  autorNombreCompleto: string
): Promise<Autor> {
  try {
    const partesNombre = autorNombreCompleto.trim().split(' ');
    const nombre = partesNombre[0] || autorNombreCompleto;
    const apellido = partesNombre.slice(1).join(' ') || '';
    
    // Generar ID único para Google Books
    const googleBooksAuthorId = `google_${autorNombreCompleto.toLowerCase().replace(/\s+/g, '_')}`;
    
    // Paso 1: Buscar por googleBooksId
    let autor = await em.findOne(Autor, { googleBooksId: googleBooksAuthorId });
    
    if (!autor) {
      // Paso 2: Buscar por nombre completo
      autor = await em.findOne(Autor, { nombre, apellido });
      
      if (autor) {
        // Actualizar con el googleBooksId si no tiene uno
        if (!autor.googleBooksId) {
          autor.googleBooksId = googleBooksAuthorId;
        }
      } else {
        // Paso 3: Crear nuevo autor
        autor = em.create(Autor, {
          nombre,
          apellido,
          googleBooksId: googleBooksAuthorId,
          createdAt: new Date()
        });
        await em.persist(autor);
      }
    }
    
    return autor;
  } catch (error: any) {
    console.error(`❌ Error en reconcileGoogleBooksAuthor para "${autorNombreCompleto}":`, error.message);
    throw error;
  }
}

/**
 * Reconcilia un autor de OpenLibrary con la base de datos.
 * Evita duplicados buscando primero por openLibraryKey, luego por nombre.
 */
export async function reconcileOpenLibraryAuthor(
  em: EntityManager,
  openLibraryAuthor: OpenLibraryAuthor
): Promise<Autor> {
  try {
    const autorNombreCompleto = openLibraryAuthor.name.trim();
    const partesNombre = autorNombreCompleto.split(' ');
    const nombre = partesNombre[0] || autorNombreCompleto;
    const apellido = partesNombre.slice(1).join(' ') || '';
    
    const openLibraryKey = openLibraryAuthor.key;
    
    // Paso 1: Buscar por openLibraryKey
    let autor = await em.findOne(Autor, { openLibraryKey });
    
    if (!autor) {
      // Paso 2: Buscar por nombre completo
      autor = await em.findOne(Autor, { nombre, apellido });
      
      if (autor) {
        // Actualizar con el openLibraryKey si no tiene uno
        if (!autor.openLibraryKey) {
          autor.openLibraryKey = openLibraryKey;
        }
        
        // Actualizar biografía y foto si no las tiene
        if (!autor.biografia && openLibraryAuthor.bio) {
          autor.biografia = typeof openLibraryAuthor.bio === 'string' 
            ? openLibraryAuthor.bio 
            : openLibraryAuthor.bio.value;
        }
        
        if (!autor.foto && openLibraryAuthor.photos && openLibraryAuthor.photos.length > 0) {
          autor.foto = `https://covers.openlibrary.org/a/id/${openLibraryAuthor.photos[0]}-M.jpg`;
        }
      } else {
        // Paso 3: Crear nuevo autor
        const biografia = openLibraryAuthor.bio 
          ? (typeof openLibraryAuthor.bio === 'string' ? openLibraryAuthor.bio : openLibraryAuthor.bio.value)
          : undefined;
        
        const foto = openLibraryAuthor.photos && openLibraryAuthor.photos.length > 0
          ? `https://covers.openlibrary.org/a/id/${openLibraryAuthor.photos[0]}-M.jpg`
          : undefined;
        
        autor = em.create(Autor, {
          nombre,
          apellido,
          openLibraryKey,
          biografia,
          foto,
          createdAt: new Date()
        });
        await em.persist(autor);
      }
    }
    
    return autor;
  } catch (error: any) {
    console.error(`❌ Error en reconcileOpenLibraryAuthor:`, error.message);
    throw error;
  }
}

/**
 * Busca autores en Google Books API y los reconcilia con la BDD
 */
export async function searchGoogleBooksAuthors(
  em: EntityManager,
  query: string
): Promise<Autor[]> {
  try {
    console.log('📖 Buscando en Google Books API:', query);
    
    const url = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${encodeURIComponent(query)}&maxResults=10${GOOGLE_BOOKS_API_KEY ? `&key=${GOOGLE_BOOKS_API_KEY}` : ''}`;
    const response = await axios.get(url, { timeout: 5000 });
    
    if (!response.data.items) {
      console.log('⚠️ No se encontraron libros en Google Books');
      return [];
    }
    
    // Extraer autores únicos
    const authorsSet = new Set<string>();
    response.data.items.forEach((item: any) => {
      if (item.volumeInfo?.authors) {
        item.volumeInfo.authors.forEach((author: string) => {
          authorsSet.add(author);
        });
      }
    });
    
    console.log(`✅ Encontrados ${authorsSet.size} autores únicos en Google Books`);
    
    // Reconciliar cada autor con la BDD
    const autores: Autor[] = [];
    for (const authorName of authorsSet) {
      try {
        const autor = await reconcileGoogleBooksAuthor(em, authorName);
        autores.push(autor);
      } catch (error: any) {
        console.error(`❌ Error reconciliando autor "${authorName}":`, error.message);
      }
    }
    
    await em.flush();
    console.log(`✅ Reconciliados ${autores.length} autores de Google Books`);
    return autores;
  } catch (error: any) {
    console.error('❌ Error searching Google Books authors:', error.message);
    return [];
  }
}

/**
 * Busca autores en OpenLibrary API y los reconcilia con la BDD
 */
export async function searchOpenLibraryAuthors(
  em: EntityManager,
  query: string
): Promise<Autor[]> {
  try {
    console.log('📚 Buscando en OpenLibrary API:', query);
    
    const url = `https://openlibrary.org/search/authors.json?q=${encodeURIComponent(query)}&limit=10`;
    const response = await axios.get(url, { timeout: 5000 });
    
    if (!response.data.docs || response.data.docs.length === 0) {
      console.log('⚠️ No se encontraron autores en OpenLibrary');
      return [];
    }
    
    console.log(`✅ Encontrados ${response.data.docs.length} autores en OpenLibrary`);
    
    // Reconciliar cada autor con la BDD
    const autores: Autor[] = [];
    for (const olAuthor of response.data.docs) {
      try {
        const autor = await reconcileOpenLibraryAuthor(em, olAuthor);
        autores.push(autor);
      } catch (error: any) {
        console.error(`❌ Error reconciliando autor OpenLibrary:`, error.message);
      }
    }
    
    await em.flush();
    console.log(`✅ Reconciliados ${autores.length} autores de OpenLibrary`);
    return autores;
  } catch (error: any) {
    console.error('❌ Error searching OpenLibrary authors:', error.message);
    return [];
  }
}

/**
 * Busca autores en Google Books sin guardarlos en BDD (solo lectura)
 * Retorna DTOs que representan autores externos
 */
export async function searchGoogleBooksAuthorsReadOnly(query: string): Promise<ExternalAuthorDTO[]> {
  try {
    console.log('📚 [READ-ONLY] Buscando en Google Books API:', query);
    
    const url = GOOGLE_BOOKS_API_KEY
      ? `https://www.googleapis.com/books/v1/volumes?q=inauthor:${encodeURIComponent(query)}&key=${GOOGLE_BOOKS_API_KEY}&maxResults=10`
      : `https://www.googleapis.com/books/v1/volumes?q=inauthor:${encodeURIComponent(query)}&maxResults=10`;
    
    const response = await axios.get(url, { timeout: 5000 });
    
    if (!response.data.items || response.data.items.length === 0) {
      console.log('⚠️ No se encontraron resultados en Google Books');
      return [];
    }
    
    const authorsSet = new Set<string>();
    const autoresDTO: ExternalAuthorDTO[] = [];
    
    for (const item of response.data.items) {
      const authors = item.volumeInfo?.authors || [];
      for (const authorName of authors) {
        if (!authorsSet.has(authorName)) {
          authorsSet.add(authorName);
          
          const partesNombre = authorName.trim().split(' ');
          const nombre = partesNombre[0] || authorName;
          const apellido = partesNombre.slice(1).join(' ') || '';
          const googleBooksId = `google_${authorName.toLowerCase().replace(/\s+/g, '_')}`;
          
          autoresDTO.push({
            nombre,
            apellido,
            googleBooksId,
            external: true
          });
        }
      }
    }
    
    console.log(`✅ [READ-ONLY] Encontrados ${autoresDTO.length} autores en Google Books`);
    return autoresDTO;
  } catch (error: any) {
    console.error('❌ Error searching Google Books authors (read-only):', error.message);
    return [];
  }
}

/**
 * Busca autores en OpenLibrary sin guardarlos en BDD (solo lectura)
 * Retorna DTOs que representan autores externos
 */
export async function searchOpenLibraryAuthorsReadOnly(query: string): Promise<ExternalAuthorDTO[]> {
  try {
    console.log('📚 [READ-ONLY] Buscando en OpenLibrary API:', query);
    
    const url = `https://openlibrary.org/search/authors.json?q=${encodeURIComponent(query)}&limit=10`;
    const response = await axios.get(url, { timeout: 5000 });
    
    if (!response.data.docs || response.data.docs.length === 0) {
      console.log('⚠️ No se encontraron autores en OpenLibrary');
      return [];
    }
    
    const autoresDTO: ExternalAuthorDTO[] = [];
    
    for (const olAuthor of response.data.docs) {
      const autorNombreCompleto = olAuthor.name.trim();
      const partesNombre = autorNombreCompleto.split(' ');
      const nombre = partesNombre[0] || autorNombreCompleto;
      const apellido = partesNombre.slice(1).join(' ') || '';
      
      const biografia = olAuthor.bio 
        ? (typeof olAuthor.bio === 'string' ? olAuthor.bio : olAuthor.bio.value)
        : undefined;
      
      const foto = olAuthor.photos && olAuthor.photos.length > 0
        ? `https://covers.openlibrary.org/a/id/${olAuthor.photos[0]}-L.jpg`
        : undefined;
      
      autoresDTO.push({
        nombre,
        apellido,
        openLibraryKey: olAuthor.key,
        biografia,
        foto,
        external: true
      });
    }
    
    console.log(`✅ [READ-ONLY] Encontrados ${autoresDTO.length} autores en OpenLibrary`);
    return autoresDTO;
  } catch (error: any) {
    console.error('❌ Error searching OpenLibrary authors (read-only):', error.message);
    return [];
  }
}

/**
 * Guarda un autor externo en la BDD bajo demanda (cuando el usuario lo visualiza)
 * @param em EntityManager
 * @param externalAuthor DTO del autor externo
 * @returns El autor guardado en la BDD
 */
export async function saveExternalAuthor(
  em: EntityManager,
  externalAuthor: ExternalAuthorDTO
): Promise<Autor> {
  try {
    console.log(`💾 Guardando autor externo bajo demanda: ${externalAuthor.nombre} ${externalAuthor.apellido}`);
    
    // Verificar si ya existe por ID externo
    let autor: Autor | null = null;
    
    if (externalAuthor.googleBooksId) {
      autor = await em.findOne(Autor, { googleBooksId: externalAuthor.googleBooksId });
    } else if (externalAuthor.openLibraryKey) {
      autor = await em.findOne(Autor, { openLibraryKey: externalAuthor.openLibraryKey });
    }
    
    // Si no existe por ID externo, buscar por nombre
    if (!autor) {
      autor = await em.findOne(Autor, { 
        nombre: externalAuthor.nombre, 
        apellido: externalAuthor.apellido 
      });
    }
    
    // Si existe, actualizar con info externa
    if (autor) {
      console.log('✅ Autor ya existe, actualizando con info externa...');
      if (externalAuthor.googleBooksId && !autor.googleBooksId) {
        autor.googleBooksId = externalAuthor.googleBooksId;
      }
      if (externalAuthor.openLibraryKey && !autor.openLibraryKey) {
        autor.openLibraryKey = externalAuthor.openLibraryKey;
      }
      if (externalAuthor.biografia && !autor.biografia) {
        autor.biografia = externalAuthor.biografia;
      }
      if (externalAuthor.foto && !autor.foto) {
        autor.foto = externalAuthor.foto;
      }
    } else {
      // Crear nuevo autor
      console.log('✅ Creando nuevo autor en BDD...');
      autor = em.create(Autor, {
        nombre: externalAuthor.nombre,
        apellido: externalAuthor.apellido,
        googleBooksId: externalAuthor.googleBooksId,
        openLibraryKey: externalAuthor.openLibraryKey,
        biografia: externalAuthor.biografia,
        foto: externalAuthor.foto,
        createdAt: new Date()
      });
    }
    
    await em.persistAndFlush(autor);
    console.log(`✅ Autor guardado con ID: ${autor.id}`);
    return autor;
  } catch (error: any) {
    console.error('❌ Error guardando autor externo:', error.message);
    throw error;
  }
}

/**
 * Obtiene autores populares de APIs externas (solo lectura)
 * Se usa cuando la base de datos está vacía para mostrar contenido inicial
 * Incluye caché de 24 horas para evitar golpear las APIs constantemente
 */
export async function getPopularAuthorsFromAPIs(limit: number = 20): Promise<ExternalAuthorDTO[]> {
  const CACHE_KEY = `autores:populares:${limit}`;
  const CACHE_TTL = 24 * 60 * 60; // 24 horas en segundos
  
  try {
    // Intentar obtener del caché
    const cached = await redis.get(CACHE_KEY);
    
    if (cached) {
      console.log(`✅ Autores populares obtenidos del caché`);
      return JSON.parse(cached);
    }
  } catch (error) {
    console.log('⚠️ Redis no disponible, continuando sin caché');
  }

  const AUTORES_POPULARES = [
    'Gabriel García Márquez',
    'Isabel Allende',
    'Jorge Luis Borges',
    'Paulo Coelho',
    'Julio Cortázar',
    'Mario Vargas Llosa',
    'Stephen King',
    'J.K. Rowling',
    'George R.R. Martin',
    'Agatha Christie',
    'Jane Austen',
    'Charles Dickens',
    'Mark Twain',
    'Edgar Allan Poe',
    'Oscar Wilde',
    'Virginia Woolf',
    'Franz Kafka',
    'Haruki Murakami',
    'Dan Brown',
    'Neil Gaiman',
    'Ernest Hemingway',
    'F. Scott Fitzgerald',
    'George Orwell',
    'J.R.R. Tolkien',
    'Miguel de Cervantes',
    'William Shakespeare',
    'Emily Dickinson',
    'Leo Tolstoy',
    'Fyodor Dostoevsky',
    'Albert Camus'
  ];

  console.log(`🌟 Buscando ${limit} autores populares en APIs externas...`);
  
  const autoresPromises = AUTORES_POPULARES.slice(0, limit).map(async (nombreCompleto) => {
    try {
      // Buscar primero en Google Books (más info)
      const autoresGoogle = await searchGoogleBooksAuthorsReadOnly(nombreCompleto);
      if (autoresGoogle.length > 0) {
        return autoresGoogle[0]; // Tomar el primero (más relevante)
      }
      
      // Si no está en Google Books, buscar en OpenLibrary
      const autoresOpenLibrary = await searchOpenLibraryAuthorsReadOnly(nombreCompleto);
      if (autoresOpenLibrary.length > 0) {
        return autoresOpenLibrary[0];
      }
      
      return null;
    } catch (error) {
      console.error(`❌ Error buscando autor popular "${nombreCompleto}":`, error);
      return null;
    }
  });

  const autoresPopulares = (await Promise.all(autoresPromises))
    .filter((autor): autor is ExternalAuthorDTO => autor !== null);

  console.log(`✅ Encontrados ${autoresPopulares.length} autores populares`);
  
  // Guardar en caché
  try {
    await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(autoresPopulares));
    console.log(`✅ Autores populares guardados en caché (24h)`);
  } catch (error) {
    console.log('⚠️ No se pudo guardar en caché');
  }
  
  return autoresPopulares;
}
