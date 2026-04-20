import { Request, Response } from 'express';
import { MikroORM } from '@mikro-orm/core';
import { Libro } from '../entities/libro.entity';
import { Autor } from '../entities/autor.entity';
import { Categoria } from '../entities/categoria.entity';
import { Editorial } from '../entities/editorial.entity';
import { buscarLibro, getBookById } from '../services/googleBooks.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const obtenerLibros = async (req: Request, res: Response) => {
  const { q, startIndex, maxResults } = req.query;
  if (!q) return res.status(400).json({ message: 'Falta parámetro q' });

  const startIndexNum = startIndex ? parseInt(startIndex.toString(), 10) : 0;
  const maxResultsNum = maxResults ? parseInt(maxResults.toString(), 10) : 40;

  const libros = await buscarLibro(q.toString(), startIndexNum, maxResultsNum);
  res.json(libros);
};

/**
 * Extrae el ID de Google Books desde un slug
 * Formato esperado: "titulo-slug-googleId"
 * Ejemplo: "cien-anos-soledad-abc12345" → "abc12345"
 */
const extractGoogleIdFromSlug = (slug: string): string => {
  const parts = slug.split('-');
  return parts[parts.length - 1]; // Último segmento
};

/**
 * Extrae el título desde un slug para búsqueda
 * Ejemplo: "cien-anos-soledad-abc12345" → "cien anos soledad"
 */
const extractTitleFromSlug = (slug: string): string => {
  const parts = slug.split('-');
  return parts.slice(0, -1).join(' '); // Todo excepto el último segmento (ID)
};

export const obtenerLibroPorId = async (req: Request, res: Response) => {
  const idParam = req.params.id;
  // Handle both string and string[] cases from req.params
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  if (!id) return res.status(400).json({ message: 'Falta parámetro id' });

  try {
    // Intentar primero con el ID directamente
    let libro = await getBookById(id);
    
    // Si no se encuentra y parece un slug (contiene guiones), extraer el ID
    if (!libro && id.includes('-')) {
      const googleId = extractGoogleIdFromSlug(id);
      console.log(`Slug detectado. Intentando con ID extraído: ${googleId}`);
      libro = await getBookById(googleId);
      
      // Si aún no se encuentra, intentar búsqueda por título
      if (!libro) {
        const titulo = extractTitleFromSlug(id);
        console.log(`ID no encontrado. Buscando por título: ${titulo}`);
        const resultados = await buscarLibro(titulo, 0, 1);
        
        if (resultados && resultados.length > 0) {
          libro = resultados[0];
        }
      }
    }
    
    if (!libro) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }

    res.json(libro);
  } catch (error) {
    console.error('Error al obtener libro de Google Books:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const addGoogleBook = async (req: AuthRequest, res: Response) => {
  const orm = req.app.get('orm') as MikroORM;
  const em = orm.em.fork();

  const { googleBookId } = req.body;

  if (!googleBookId) {
    return res.status(400).json({ error: 'Se requiere el ID del libro de Google Books' });
  }

  try {
    // Check if book already exists
    const existingBook = await em.findOne(Libro, { externalId: googleBookId });
    if (existingBook) {
      console.log(`El libro con ID ${googleBookId} ya existe. Omitiendo creación.`);
      return res.status(200).json(existingBook);
    }

    // Get book details from Google Books
    const googleBook = await getBookById(googleBookId);
    if (!googleBook) {
      return res.status(404).json({ error: 'Libro no encontrado en Google Books' });
    }

    // Handle author - take the first author if available
    let autor: Autor | undefined;
    if (googleBook.autores && googleBook.autores.length > 0) {
      const autorNombreCompleto = googleBook.autores[0];
      // Split name into first and last name (simple split by space)
      const partesNombre = autorNombreCompleto.split(' ');
      const nombre = partesNombre[0] || autorNombreCompleto;
      const apellido = partesNombre.slice(1).join(' ') || '';
      
      // Generar un ID único para Google Books (usamos el nombre completo como identificador)
      const googleBooksAuthorId = `google_${autorNombreCompleto.toLowerCase().replace(/\s+/g, '_')}`;
      
      // Paso 1: Buscar por googleBooksId (ID externo de Google)
      autor = await em.findOne(Autor, { googleBooksId: googleBooksAuthorId }) || undefined;
      
      if (!autor) {
        // Paso 2: Buscar por nombre completo (por si ya existe de otra fuente)
        autor = await em.findOne(Autor, { nombre, apellido }) || undefined;
        
        if (autor) {
          // Si existe por nombre, actualizamos el googleBooksId
          autor.googleBooksId = googleBooksAuthorId;
        } else {
          // Paso 3: Crear nuevo autor
          autor = em.create(Autor, {
            nombre,
            apellido,
            googleBooksId: googleBooksAuthorId,
            createdAt: new Date()
          });
        }
        await em.persist(autor);
      }
    }

    // Create the book (similar to favorites logic)
    const nuevoLibro = em.create(Libro, {
      externalId: googleBook.id,
      source: 'google',
      nombre: googleBook.titulo,
      sinopsis: googleBook.descripcion,
      imagen: googleBook.imagen,
      enlace: googleBook.enlace,
      autor: autor,
      createdAt: new Date()
    });

    console.log(`Creando nuevo libro con ID ${googleBookId}.`);
    await em.persistAndFlush(nuevoLibro);
    res.status(201).json(nuevoLibro);
  } catch (error) {
    console.error('Error adding Google Book:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
