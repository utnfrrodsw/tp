/**
 * Tests unitarios para apiParser.ts
 * Tests de las funciones de parsing y validación de respuestas de API
 */

import { describe, it, expect } from 'vitest';
import {
  parseLibroResponse,
  parseLibrosResponse,
  parseResenaResponse,
  parseResenasResponse,
  parseUserResponse,
  parseAutorResponse,
  parseCategoriaResponse,
  parseSagaResponse,
  parsePaginationResponse,
  validateAPIResponse,
  validateAPIArrayResponse
} from './apiParser';

describe('apiParser', () => {
  describe('parseLibroResponse', () => {
    it('debe parsear un libro válido correctamente', () => {
      const data = {
        id: 1,
        nombre: 'El Señor de los Anillos',
        slug: 'el-senor-de-los-anillos',
        sinopsis: 'Una gran aventura',
        imagen: 'https://example.com/image.jpg',
        enlace: 'https://example.com',
        source: 'manual',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-02'
      };

      const result = parseLibroResponse(data);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.nombre).toBe('El Señor de los Anillos');
      expect(result.slug).toBe('el-senor-de-los-anillos');
      expect(result.sinopsis).toBe('Una gran aventura');
      expect(result.source).toBe('manual');
    });

    it('debe manejar campos alternativos (external_id, title, description)', () => {
      const data = {
        external_id: 'ext123',
        title: 'Harry Potter',
        description: 'Magia y aventuras',
        thumbnail: 'https://example.com/thumb.jpg',
        link: 'https://example.com/book',
        created_at: '2024-01-01'
      };

      const result = parseLibroResponse(data);

      expect(result).toBeDefined();
      expect(result.externalId).toBe('ext123');
      expect(result.nombre).toBe('Harry Potter');
      expect(result.sinopsis).toBe('Magia y aventuras');
      expect(result.imagen).toBe('https://example.com/thumb.jpg');
      expect(result.enlace).toBe('https://example.com/book');
    });

    it('debe parsear libro con autor, categoría y saga', () => {
      const data = {
        id: 1,
        nombre: 'Libro Test',
        autor: { id: 1, nombre: 'John', apellido: 'Doe' },
        categoria: { id: 1, nombre: 'Fantasía' },
        saga: { id: 1, nombre: 'Saga Test', libros: [] }
      };

      const result = parseLibroResponse(data);

      expect(result).toBeDefined();
      expect(result.autor).toBeDefined();
      expect(result.autor.nombre).toBe('John');
      expect(result.categoria).toBeDefined();
      expect(result.categoria.nombre).toBe('Fantasía');
      expect(result.saga).toBeDefined();
      expect(result.saga.nombre).toBe('Saga Test');
    });

    it('debe retornar null si data es null', () => {
      const result = parseLibroResponse(null);
      expect(result).toBeNull();
    });

    it('debe retornar null si data no es un objeto', () => {
      expect(parseLibroResponse('string')).toBeNull();
      expect(parseLibroResponse(123)).toBeNull();
      expect(parseLibroResponse(undefined)).toBeNull();
    });

    it('debe manejar campos faltantes con valores por defecto', () => {
      const data = { id: 1 };
      const result = parseLibroResponse(data);

      expect(result).toBeDefined();
      expect(result.nombre).toBe('');
      expect(result.sinopsis).toBe('');
      expect(result.source).toBe('manual');
    });
  });

  describe('parseLibrosResponse', () => {
    it('debe parsear un array de libros correctamente', () => {
      const data = [
        { id: 1, nombre: 'Libro 1' },
        { id: 2, nombre: 'Libro 2' },
        { id: 3, nombre: 'Libro 3' }
      ];

      const result = parseLibrosResponse(data);

      expect(result).toHaveLength(3);
      expect(result[0].nombre).toBe('Libro 1');
      expect(result[2].nombre).toBe('Libro 3');
    });

    it('debe filtrar libros inválidos (null)', () => {
      const data = [
        { id: 1, nombre: 'Libro válido' },
        null,
        'string inválido',
        { id: 2, nombre: 'Otro válido' }
      ];

      const result = parseLibrosResponse(data);

      expect(result).toHaveLength(2);
      expect(result[0].nombre).toBe('Libro válido');
      expect(result[1].nombre).toBe('Otro válido');
    });

    it('debe retornar array vacío si data no es array', () => {
      expect(parseLibrosResponse(null)).toEqual([]);
      expect(parseLibrosResponse('string')).toEqual([]);
      expect(parseLibrosResponse({ id: 1 })).toEqual([]);
    });

    it('debe retornar array vacío si todos los libros son inválidos', () => {
      const result = parseLibrosResponse([null, undefined, 'invalid']);
      expect(result).toEqual([]);
    });
  });

  describe('parseResenaResponse', () => {
    it('debe parsear una reseña válida correctamente', () => {
      const data = {
        id: 1,
        comentario: 'Excelente libro',
        estrellas: 5,
        estado: 'aprobado',
        fechaResena: '2024-01-01',
        reacciones: [],
        respuestas: []
      };

      const result = parseResenaResponse(data);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.comentario).toBe('Excelente libro');
      expect(result.estrellas).toBe(5);
      expect(result.estado).toBe('aprobado');
    });

    it('debe parsear reseña con usuario y libro', () => {
      const data = {
        id: 1,
        comentario: 'Muy bueno',
        estrellas: 4,
        usuario: { id: 1, username: 'testuser' },
        libro: { id: 1, nombre: 'Test Book' }
      };

      const result = parseResenaResponse(data);

      expect(result).toBeDefined();
      expect(result.usuario).toBeDefined();
      expect(result.usuario.username).toBe('testuser');
      expect(result.libro).toBeDefined();
      expect(result.libro.nombre).toBe('Test Book');
    });

    it('debe parsear respuestas anidadas recursivamente', () => {
      const data = {
        id: 1,
        comentario: 'Reseña padre',
        estrellas: 5,
        respuestas: [
          { id: 2, comentario: 'Respuesta 1', estrellas: 4 },
          { id: 3, comentario: 'Respuesta 2', estrellas: 3 }
        ]
      };

      const result = parseResenaResponse(data);

      expect(result).toBeDefined();
      expect(result.respuestas).toHaveLength(2);
      expect(result.respuestas[0].comentario).toBe('Respuesta 1');
      expect(result.respuestas[1].comentario).toBe('Respuesta 2');
    });

    it('debe manejar campos alternativos (fecha_resena, created_at)', () => {
      const data = {
        id: 1,
        comentario: 'Test',
        estrellas: 3,
        fecha_resena: '2024-01-01',
        created_at: '2024-01-02'
      };

      const result = parseResenaResponse(data);

      expect(result).toBeDefined();
      expect(result.fechaResena).toBe('2024-01-01');
    });

    it('debe retornar null si data es null o no es objeto', () => {
      expect(parseResenaResponse(null)).toBeNull();
      expect(parseResenaResponse('string')).toBeNull();
      expect(parseResenaResponse(123)).toBeNull();
    });

    it('debe usar valores por defecto para campos faltantes', () => {
      const data = { id: 1 };
      const result = parseResenaResponse(data);

      expect(result).toBeDefined();
      expect(result.comentario).toBe('');
      expect(result.estrellas).toBe(0);
      expect(result.estado).toBe('pendiente');
      expect(result.reacciones).toEqual([]);
      expect(result.respuestas).toEqual([]);
    });
  });

  describe('parseResenasResponse', () => {
    it('debe parsear array de reseñas correctamente', () => {
      const data = [
        { id: 1, comentario: 'Bueno', estrellas: 4 },
        { id: 2, comentario: 'Excelente', estrellas: 5 }
      ];

      const result = parseResenasResponse(data);

      expect(result).toHaveLength(2);
      expect(result[0].estrellas).toBe(4);
      expect(result[1].estrellas).toBe(5);
    });

    it('debe filtrar reseñas inválidas', () => {
      const data = [
        { id: 1, comentario: 'Válido' },
        null,
        'invalid',
        { id: 2, comentario: 'También válido' }
      ];

      const result = parseResenasResponse(data);

      expect(result).toHaveLength(2);
    });

    it('debe retornar array vacío si data no es array', () => {
      expect(parseResenasResponse(null)).toEqual([]);
      expect(parseResenasResponse({ id: 1 })).toEqual([]);
    });
  });

  describe('parseUserResponse', () => {
    it('debe parsear usuario válido correctamente', () => {
      const data = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        nombre: 'Test User',
        biografia: 'Bio de prueba',
        ubicacion: 'Buenos Aires',
        genero: 'masculino',
        avatar: 'https://example.com/avatar.jpg',
        rol: 'admin'
      };

      const result = parseUserResponse(data);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.email).toBe('test@example.com');
      expect(result.username).toBe('testuser');
      expect(result.rol).toBe('admin');
    });

    it('debe usar valores por defecto para campos faltantes', () => {
      const data = { id: 1 };
      const result = parseUserResponse(data);

      expect(result).toBeDefined();
      expect(result.email).toBe('');
      expect(result.username).toBe('');
      expect(result.rol).toBe('usuario');
    });

    it('debe retornar null si data es inválido', () => {
      expect(parseUserResponse(null)).toBeNull();
      expect(parseUserResponse('string')).toBeNull();
    });
  });

  describe('parseAutorResponse', () => {
    it('debe parsear autor válido correctamente', () => {
      const data = {
        id: 1,
        nombre: 'Gabriel',
        apellido: 'García Márquez',
        foto: 'https://example.com/gabo.jpg',
        googleBooksId: 'gb123',
        openLibraryKey: 'ol456',
        biografia: 'Escritor colombiano'
      };

      const result = parseAutorResponse(data);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.nombre).toBe('Gabriel');
      expect(result.apellido).toBe('García Márquez');
      expect(result.googleBooksId).toBe('gb123');
      expect(result.openLibraryKey).toBe('ol456');
    });

    it('debe manejar campos alternativos (google_books_id, open_library_key)', () => {
      const data = {
        id: 1,
        nombre: 'Jorge',
        apellido: 'Borges',
        google_books_id: 'gb789',
        open_library_key: 'ol012'
      };

      const result = parseAutorResponse(data);

      expect(result).toBeDefined();
      expect(result.googleBooksId).toBe('gb789');
      expect(result.openLibraryKey).toBe('ol012');
    });

    it('debe usar valores por defecto para campos faltantes', () => {
      const data = { id: 1 };
      const result = parseAutorResponse(data);

      expect(result).toBeDefined();
      expect(result.nombre).toBe('');
      expect(result.apellido).toBe('');
      expect(result.biografia).toBe('');
    });

    it('debe retornar null si data es inválido', () => {
      expect(parseAutorResponse(null)).toBeNull();
      expect(parseAutorResponse(undefined)).toBeNull();
      expect(parseAutorResponse('string')).toBeNull();
    });
  });

  describe('parseCategoriaResponse', () => {
    it('debe parsear categoría válida correctamente', () => {
      const data = {
        id: 1,
        nombre: 'Fantasía',
        descripcion: 'Libros de fantasía',
        imagen: 'https://example.com/fantasia.jpg'
      };

      const result = parseCategoriaResponse(data);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.nombre).toBe('Fantasía');
      expect(result.descripcion).toBe('Libros de fantasía');
    });

    it('debe usar valores por defecto', () => {
      const data = { id: 1 };
      const result = parseCategoriaResponse(data);

      expect(result).toBeDefined();
      expect(result.nombre).toBe('');
      expect(result.descripcion).toBe('');
    });

    it('debe retornar null si data es inválido', () => {
      expect(parseCategoriaResponse(null)).toBeNull();
    });
  });

  describe('parseSagaResponse', () => {
    it('debe parsear saga válida con libros', () => {
      const data = {
        id: 1,
        nombre: 'El Señor de los Anillos',
        libros: [
          { id: 1, nombre: 'La Comunidad del Anillo' },
          { id: 2, nombre: 'Las Dos Torres' }
        ]
      };

      const result = parseSagaResponse(data);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.nombre).toBe('El Señor de los Anillos');
      expect(result.libros).toHaveLength(2);
      expect(result.libros[0].nombre).toBe('La Comunidad del Anillo');
    });

    it('debe manejar saga sin libros', () => {
      const data = { id: 1, nombre: 'Saga Vacía' };
      const result = parseSagaResponse(data);

      expect(result).toBeDefined();
      expect(result.libros).toEqual([]);
    });

    it('debe retornar null si data es inválido', () => {
      expect(parseSagaResponse(null)).toBeNull();
    });
  });

  describe('parsePaginationResponse', () => {
    it('debe parsear paginación válida correctamente', () => {
      const data = {
        page: 2,
        limit: 20,
        total: 100,
        totalPages: 5
      };

      const result = parsePaginationResponse(data);

      expect(result.page).toBe(2);
      expect(result.limit).toBe(20);
      expect(result.total).toBe(100);
      expect(result.totalPages).toBe(5);
    });

    it('debe usar valores por defecto si campos faltan', () => {
      const result = parsePaginationResponse({});

      expect(result.page).toBe(1);
      expect(result.limit).toBe(12);
      expect(result.total).toBe(0);
      expect(result.totalPages).toBe(0);
    });

    it('debe usar valores por defecto si tipos son incorrectos', () => {
      const data = {
        page: 'invalid',
        limit: null,
        total: undefined,
        totalPages: []
      };

      const result = parsePaginationResponse(data);

      expect(result.page).toBe(1);
      expect(result.limit).toBe(12);
      expect(result.total).toBe(0);
      expect(result.totalPages).toBe(0);
    });

    it('debe manejar data null o undefined', () => {
      const result1 = parsePaginationResponse(null);
      const result2 = parsePaginationResponse(undefined);

      expect(result1.page).toBe(1);
      expect(result2.page).toBe(1);
    });
  });

  describe('validateAPIResponse', () => {
    const mockParser = (data: any) => {
      if (!data || !data.id) return null;
      return { id: data.id, name: data.name || '' };
    };

    it('debe validar respuesta exitosa correctamente', () => {
      const response = { id: 1, name: 'Test' };
      const result = validateAPIResponse(response, mockParser);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.id).toBe(1);
      expect(result.error).toBeUndefined();
    });

    it('debe detectar cuando no hay respuesta', () => {
      const result = validateAPIResponse(null, mockParser);

      expect(result.success).toBe(false);
      expect(result.error).toBe('No se recibió respuesta del servidor');
      expect(result.data).toBeUndefined();
    });

    it('debe detectar errores en la respuesta (campo error)', () => {
      const response = { error: 'Error del servidor' };
      const result = validateAPIResponse(response, mockParser);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error del servidor');
    });

    it('debe detectar errores en la respuesta (campo message)', () => {
      const response = { message: 'Recurso no encontrado' };
      const result = validateAPIResponse(response, mockParser);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Recurso no encontrado');
    });

    it('debe priorizar message sobre error si ambos existen', () => {
      const response = { error: 'Error genérico', message: 'Error específico' };
      const result = validateAPIResponse(response, mockParser);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error específico');
    });

    it('debe detectar cuando el parser retorna null', () => {
      const response = { invalidData: true };
      const result = validateAPIResponse(response, mockParser);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error al procesar los datos recibidos');
    });

    it('debe manejar parser que lanza excepción', () => {
      const throwingParser = () => {
        throw new Error('Parse error');
      };
      const response = { id: 1 };
      
      // El validateAPIResponse actual no maneja excepciones, 
      // el parser lanzará el error
      expect(() => validateAPIResponse(response, throwingParser)).toThrow('Parse error');
    });
  });

  describe('validateAPIArrayResponse', () => {
    const mockArrayParser = (data: any[]) => {
      return data.filter(item => item && item.id).map(item => ({ id: item.id }));
    };

    it('debe validar respuesta de array exitosa', () => {
      const response = [
        { id: 1 },
        { id: 2 },
        { id: 3 }
      ];
      const result = validateAPIArrayResponse(response, mockArrayParser);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(3);
      expect(result.error).toBeUndefined();
    });

    it('debe extraer data de respuesta con propiedad data', () => {
      const response = {
        data: [{ id: 1 }, { id: 2 }],
        pagination: { page: 1 }
      };
      const result = validateAPIArrayResponse(response, mockArrayParser);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
    });

    it('debe detectar cuando no hay respuesta', () => {
      const result = validateAPIArrayResponse(null, mockArrayParser);

      expect(result.success).toBe(false);
      expect(result.error).toBe('No se recibió respuesta del servidor');
    });

    it('debe detectar errores en la respuesta', () => {
      const response = { error: 'Error al cargar lista' };
      const result = validateAPIArrayResponse(response, mockArrayParser);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error al cargar lista');
    });

    it('debe retornar array vacío si no hay data', () => {
      const response = {};
      const result = validateAPIArrayResponse(response, mockArrayParser);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });

    it('debe filtrar elementos inválidos del array', () => {
      const response = [
        { id: 1 },
        null,
        { id: 2 },
        undefined,
        { id: 3 }
      ];
      const result = validateAPIArrayResponse(response, mockArrayParser);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(3);
    });
  });
});
