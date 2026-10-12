// Test unitario de los schemas del CRUD de álbum (Juan Ignacio Esterri).
//
// Prueba las tres reglas propias del schema: el campo vacío que se guarda como
// NULL, el rango de años y el artista obligatorio. Más el filtro de origen del
// listado, que es el que no puede usar z.coerce.boolean().
import { describe, expect, it } from 'vitest';
import { createAlbumSchema, listAlbumsQuerySchema } from '../../src/features/album/album.schema';

// Alta mínima válida: el título y el artista son los dos únicos campos obligatorios.
const validAlbum = {
  title: 'Nevermind',
  id_artist: 1,
};

describe('createAlbumSchema', () => {
  it('traduce el año vacío a null', () => {
    const result = createAlbumSchema.safeParse({ ...validAlbum, release_year: '' });

    expect(result.success).toBe(true);
    // El formulario manda '' cuando el usuario borra el campo, y la columna
    // admite NULL: hay álbumes viejos sin fecha de lanzamiento confiable.
    expect(result.data?.release_year).toBeNull();
  });

  it('rechaza un año anterior a 1900', () => {
    const result = createAlbumSchema.safeParse({ ...validAlbum, release_year: 1899 });

    expect(result.success).toBe(false);
  });

  it('acepta una portada https y rechaza una javascript:', () => {
    const https = createAlbumSchema.safeParse({ ...validAlbum, url_cover: 'https://example.com/a.jpg' });
    const script = createAlbumSchema.safeParse({ ...validAlbum, url_cover: 'javascript:alert(1)' });

    expect(https.success).toBe(true);
    expect(script.success).toBe(false);
  });

  it('exige el artista, porque la FK de ALBUMS es NOT NULL', () => {
    const result = createAlbumSchema.safeParse({ title: 'Nevermind' });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('Hay que elegir el artista del álbum.');
  });
});

describe('listAlbumsQuerySchema', () => {
  it('interpreta ?contributed=false como false y no como true', () => {
    // En un query string TODO llega como texto. Con z.coerce.boolean() el string
    // 'false' daría true (cualquier texto no vacío es true), y la cola de
    // moderación terminaría mostrando justo lo contrario de lo que se le pidió.
    const result = listAlbumsQuerySchema.safeParse({ contributed: 'false' });

    expect(result.success).toBe(true);
    expect(result.data?.contributed).toBe(false);
  });

  it('interpreta ?contributed=true como true', () => {
    const result = listAlbumsQuerySchema.safeParse({ contributed: 'true' });

    expect(result.success).toBe(true);
    expect(result.data?.contributed).toBe(true);
  });
});
