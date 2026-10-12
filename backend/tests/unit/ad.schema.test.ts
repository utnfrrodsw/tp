// Test unitario del schema de anuncios (Santiago Siena).
//
// Prueba las reglas que sostienen el CRUD de publicidad: el título y la imagen
// obligatorios, el texto vacío traducido a null (mismo criterio que la descripción
// de una lista), el enlace que admite DOS formas —una dirección externa o una ruta
// del propio sitio, que es lo que usa el anuncio de la membresía Pro—, el "al menos
// un campo" de la edición y el id de la URL convertido a número.
import { describe, expect, it } from 'vitest';
import {
  adIdParamSchema,
  createAdSchema,
  updateAdSchema,
} from '../../src/features/ad/ad.schema';

describe('createAdSchema', () => {
  it('acepta un anuncio con lo mínimo: título e imagen', () => {
    const result = createAdSchema.safeParse({
      title: 'Vinilos Club',
      url_image: '/images/ads/ads-vinilos.jpg',
    });

    expect(result.success).toBe(true);
    // Ninguno de los dos se manda desde el formulario cuando se dejan vacíos, y
    // `active` lo pone en true el default de la columna.
    expect(result.data?.description).toBeUndefined();
    expect(result.data?.target_url).toBeUndefined();
    expect(result.data?.active).toBeUndefined();
  });

  it('rechaza el título vacío', () => {
    const result = createAdSchema.safeParse({ title: '   ', url_image: '/images/ads/x.jpg' });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('El título del anuncio no puede estar vacío.');
  });

  it('rechaza un título más largo que la columna', () => {
    // 80 es el tamaño de ads.title: el tope está en el schema para que el error lo
    // dé la API con un mensaje claro y no MySQL con un 500.
    const result = createAdSchema.safeParse({
      title: 'a'.repeat(81),
      url_image: '/images/ads/x.jpg',
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      'El título del anuncio no puede tener más de 80 caracteres.'
    );
  });

  it('rechaza un anuncio sin imagen: es lo que se ve del anuncio', () => {
    const result = createAdSchema.safeParse({ title: 'Vinilos Club', url_image: '' });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('El anuncio necesita una imagen.');
  });

  it('convierte la descripción vacía a null, como manda el formulario sin completar', () => {
    const result = createAdSchema.safeParse({
      title: 'Vinilos Club',
      description: '',
      url_image: '/images/ads/ads-vinilos.jpg',
    });

    expect(result.success).toBe(true);
    expect(result.data?.description).toBeNull();
  });

  it('acepta un enlace externo, que el frontend abre en otra pestaña', () => {
    const result = createAdSchema.safeParse({
      title: 'Vinilos Club',
      url_image: '/images/ads/ads-vinilos.jpg',
      target_url: 'https://example.com/vinilos-club',
    });

    expect(result.success).toBe(true);
    expect(result.data?.target_url).toBe('https://example.com/vinilos-club');
  });

  it('acepta una ruta del propio sitio, que es la del anuncio de la membresía', () => {
    // El quinto anuncio del seed es Musicboxd Pro y lleva a /pro: por eso el campo
    // no se puede validar con un z.url() pelado.
    const result = createAdSchema.safeParse({
      title: 'Musicboxd Pro',
      url_image: '/images/ads/ads-musica.jpg',
      target_url: '/pro',
    });

    expect(result.success).toBe(true);
    expect(result.data?.target_url).toBe('/pro');
  });

  it('rechaza un enlace que no es ni una URL ni una ruta', () => {
    const result = createAdSchema.safeParse({
      title: 'Vinilos Club',
      url_image: '/images/ads/ads-vinilos.jpg',
      target_url: 'example.com/vinilos',
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      'El enlace tiene que ser una URL (https://...) o una ruta del sitio (/pro).'
    );
  });

  it('rechaza un enlace javascript: y uno que empieza con // (dominio externo)', () => {
    const base = { title: 'Vinilos Club', url_image: '/images/ads/ads-vinilos.jpg' };

    expect(createAdSchema.safeParse({ ...base, target_url: 'javascript:alert(1)' }).success).toBe(
      false
    );
    expect(createAdSchema.safeParse({ ...base, target_url: '//evil.com' }).success).toBe(false);
  });

  it('convierte el enlace vacío a null: un anuncio puede ser solo gráfico', () => {
    const result = createAdSchema.safeParse({
      title: 'Vinilos Club',
      url_image: '/images/ads/ads-vinilos.jpg',
      target_url: '',
    });

    expect(result.success).toBe(true);
    expect(result.data?.target_url).toBeNull();
  });
});

describe('updateAdSchema', () => {
  it('rechaza un PATCH sin ningún campo', () => {
    // Un PATCH vacío no pide ningún cambio: es casi seguro un error del cliente.
    const result = updateAdSchema.safeParse({});

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      'Hay que enviar al menos un campo para modificar.'
    );
  });

  it('acepta que venga solo `active`, que es lo que manda el interruptor de la tabla', () => {
    // Pausar y reanudar un anuncio desde el panel es exactamente este PATCH: si el
    // schema exigiera el resto de los campos, el botón del ojo no podría existir.
    const result = updateAdSchema.safeParse({ active: false });

    expect(result.success).toBe(true);
    expect(result.data?.active).toBe(false);
  });

  it('acepta cambiar solo el título', () => {
    const result = updateAdSchema.safeParse({ title: 'Vinilos Club 2026' });

    expect(result.success).toBe(true);
  });

  it('sigue exigiendo el formato del enlace en una edición', () => {
    const result = updateAdSchema.safeParse({ target_url: 'example.com' });

    expect(result.success).toBe(false);
  });
});

describe('adIdParamSchema', () => {
  it('convierte el id de la URL, que siempre llega como texto, a número', () => {
    const result = adIdParamSchema.safeParse({ id: '7' });

    expect(result.success).toBe(true);
    expect(result.data?.id).toBe(7);
  });

  it('rechaza un id que no es un número', () => {
    // Es lo que pasaría con GET /api/ads/active si esa ruta se montara DESPUÉS de
    // /:id: "active" entraría como id y el 404 esperado sería un 400. El orden de
    // ad.routes.ts es lo que lo evita.
    const result = adIdParamSchema.safeParse({ id: 'active' });

    expect(result.success).toBe(false);
  });

  it('rechaza un id negativo', () => {
    const result = adIdParamSchema.safeParse({ id: '-3' });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('El id debe ser un número positivo.');
  });
});
