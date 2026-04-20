// src/utils/libroHelpers.ts
import { EntityManager } from '@mikro-orm/core';
import { Autor } from '../entities/autor.entity';
import { Categoria } from '../entities/categoria.entity';
import { Editorial } from '../entities/editorial.entity';
import { Saga } from '../entities/saga.entity';
import { Libro } from '../entities/libro.entity';

/**
 * Interface para las entidades relacionadas del libro
 */
export interface LibroRelatedEntities {
  autor: Autor | null;
  categoria: Categoria;
  editorial?: Editorial;
  saga?: Saga;
}

/**
 * Busca o crea un autor por nombre y apellido
 */
export async function findOrCreateAutorLibro(
  em: EntityManager,
  nombre: string,
  apellido: string
): Promise<Autor> {
  let autor = await em.findOne(Autor, { nombre, apellido });

  if (!autor) {
    console.log('El autor no existe, creando uno nuevo...');
    autor = em.create(Autor, {
      nombre,
      apellido,
      createdAt: new Date()
    });
    await em.persist(autor);
  } else {
    console.log('El autor ya existía en la base de datos.');
  }

  return autor;
}

/**
 * Busca las entidades relacionadas necesarias para crear un libro
 */
export async function findLibroRelatedEntities(
  em: EntityManager,
  categoriaId: number,
  editorialId?: number,
  sagaId?: number
): Promise<LibroRelatedEntities | { error: string }> {
  const categoria = await em.findOne(Categoria, { id: categoriaId });
  const editorial = editorialId ? await em.findOne(Editorial, { id: editorialId }) : undefined;
  const saga = sagaId ? await em.findOne(Saga, { id: sagaId }) : undefined;

  if (!categoria) {
    return { error: 'Categoría no encontrada' };
  }

  return {
    autor: null as any, // Will be set separately
    categoria,
    editorial: editorial || undefined,
    saga: saga || undefined
  };
}

/**
 * Genera un slug URL-friendly a partir del nombre del libro
 */
function generateSlug(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize('NFD') // Normaliza caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Elimina acentos
    .replace(/[^a-z0-9]+/g, '-') // Reemplaza caracteres no alfanuméricos con guiones
    .replace(/^-+|-+$/g, ''); // Elimina guiones al inicio y al final
}

/**
 * Crea una entidad de libro con todas sus relaciones
 */
export function createLibroEntity(
  em: EntityManager,
  libroData: any,
  relatedEntities: LibroRelatedEntities
): Libro {
  // Genera el slug automáticamente desde el nombre del libro
  const slug = libroData.nombre ? generateSlug(libroData.nombre) : undefined;
  
  return em.create(Libro, {
    ...libroData,
    slug, // Agrega el slug generado
    source: 'bookcode', // Marca como libro creado en BookCode
    autor: relatedEntities.autor,
    categoria: relatedEntities.categoria,
    editorial: relatedEntities.editorial,
    saga: relatedEntities.saga || undefined
  });
}

/**
 * Valida los datos requeridos para crear un libro
 */
export function validateLibroCreationData(data: any): { 
  valid: boolean; 
  error?: string 
} {
  if (!data.nombreAutor || !data.apellidoAutor) {
    return { valid: false, error: 'Nombre y apellido del autor son requeridos' };
  }

  if (!data.categoriaId) {
    return { valid: false, error: 'La categoría es requerida' };
  }

  // Editorial es opcional - removida la validación

  if (!data.nombre) {
    return { valid: false, error: 'El nombre del libro es requerido' };
  }

  return { valid: true };
}
