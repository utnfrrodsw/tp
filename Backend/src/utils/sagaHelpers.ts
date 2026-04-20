// src/utils/sagaHelpers.ts
import { Libro } from '../entities/libro.entity';
import { Autor } from '../entities/autor.entity';
import { EntityManager } from '@mikro-orm/core';
import { getBookById } from '../services/googleBooks.service';

/**
 * Interface para libro transformado en respuesta
 */
export interface LibroTransformado {
  id: number;
  titulo: string;
  autores: string[];
  descripcion: string | null;
  imagen: string | null;
  enlace: string | null;
  externalId: string | null;
}

/**
 * Busca o crea un autor basado en nombre completo
 */
export async function findOrCreateAutor(
  em: EntityManager,
  autorNombreCompleto: string
): Promise<Autor> {
  const partesNombre = autorNombreCompleto.split(' ');
  const nombre = partesNombre[0] || autorNombreCompleto;
  const apellido = partesNombre.slice(1).join(' ') || '';

  let autorEntity = await em.findOne(Autor, { nombre, apellido });
  
  if (!autorEntity) {
    autorEntity = em.create(Autor, { 
      nombre, 
      apellido, 
      createdAt: new Date() 
    });
    await em.persist(autorEntity);
  }

  return autorEntity;
}

/**
 * Obtiene información del autor desde Google Books API
 */
export async function getAuthorFromExternalAPI(
  externalId: string
): Promise<string[] | null> {
  try {
    const googleBook = await getBookById(externalId);
    if (googleBook && googleBook.autores && googleBook.autores.length > 0) {
      return googleBook.autores;
    }
  } catch (error) {
    console.error('Error fetching author from Google Books:', error);
  }
  return null;
}

/**
 * Asigna el autor al libro si no lo tiene (auto-corrección)
 */
export async function assignAutorToLibro(
  em: EntityManager,
  libro: Libro,
  autorNombreCompleto: string
): Promise<void> {
  const autorEntity = await findOrCreateAutor(em, autorNombreCompleto);
  libro.autor = autorEntity;
  await em.flush();
}

/**
 * Obtiene la lista de autores de un libro (con auto-corrección)
 */
export async function getLibroAutores(
  em: EntityManager,
  libro: Libro
): Promise<string[]> {
  // Si el libro ya tiene autor, devolverlo
  if (libro.autor) {
    return [`${libro.autor.nombre} ${libro.autor.apellido}`.trim() || 'Autor desconocido'];
  }

  // Si no tiene autor pero tiene externalId, buscar en Google Books
  if (libro.externalId) {
    const autoresFromAPI = await getAuthorFromExternalAPI(libro.externalId);
    
    if (autoresFromAPI && autoresFromAPI.length > 0) {
      // Auto-corrección: asignar el autor al libro
      await assignAutorToLibro(em, libro, autoresFromAPI[0]);
      return autoresFromAPI;
    }
  }

  // Default: autor desconocido
  return ['Autor desconocido'];
}

/**
 * Transforma un libro de la entidad a formato de respuesta
 */
export async function transformarLibro(
  em: EntityManager,
  libro: Libro
): Promise<LibroTransformado> {
  const autores = await getLibroAutores(em, libro);

  return {
    id: libro.id,
    titulo: libro.nombre || 'Título desconocido',
    autores,
    descripcion: libro.sinopsis || null,
    imagen: libro.imagen || null,
    enlace: libro.enlace || null,
    externalId: libro.externalId || null,
  };
}

/**
 * Transforma una colección de libros
 */
export async function transformarLibros(
  em: EntityManager,
  libros: Libro[]
): Promise<LibroTransformado[]> {
  return Promise.all(
    libros.map(libro => transformarLibro(em, libro))
  );
}

/**
 * Valida los datos para crear una saga
 */
export function validateSagaData(nombre: any, libroIds: any): { 
  error?: string; 
  valid: boolean 
} {
  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    return { valid: false, error: 'El nombre de la saga es requerido' };
  }

  if (!Array.isArray(libroIds) || libroIds.length === 0) {
    return { valid: false, error: 'Debe seleccionar al menos un libro' };
  }

  return { valid: true };
}
