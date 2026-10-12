// Schemas de Zod para validar la entrada de los endpoints del CRUD de anuncios.
// Los usa el middleware validate() en ad.routes.ts, antes del controller.
import { z } from 'zod';

// Cada máximo acompaña al tamaño de su columna en ads: si no, el error lo
// terminaría tirando MySQL y con un mensaje que no le sirve a quien lo carga.
const titleSchema = z
  .string()
  .trim()
  .min(1, 'El título del anuncio no puede estar vacío.')
  .max(80, 'El título del anuncio no puede tener más de 80 caracteres.');

// La descripción es opcional y en la base admite NULL. El string vacío se traduce
// a null (mismo criterio que url_avatar en user.schema.ts): es lo que manda el
// formulario cuando se deja el campo sin completar, y "sin descripción" en la base
// es NULL, no ''.
const descriptionSchema = z
  .union([
    z.literal(''),
    z.string().trim().max(200, 'La descripción no puede tener más de 200 caracteres.'),
  ])
  .transform((value) => (value === '' ? null : value));

// La imagen es una ruta dentro de public/ del frontend ("/images/ads/ad-vinyl.jpg"),
// no una URL completa, así que NO se valida con z.url() como el avatar o la
// portada de un álbum: acá un "/algo.jpg" es justamente lo correcto.
const imageSchema = z
  .string()
  .trim()
  .min(1, 'El anuncio necesita una imagen.')
  .max(500, 'La ruta de la imagen no puede tener más de 500 caracteres.');

// A dónde lleva el anuncio. Admite dos formas, y por eso no alcanza con z.url()
// como en el avatar o la portada de un álbum:
//
//   - una dirección externa ("https://..."), que el frontend abre en otra pestaña;
//   - una ruta interna del propio sitio ("/pro"), que es lo que usa el anuncio de
//     la membresía: Musicboxd también se publicita a sí mismo.
//
// Mismo patrón que url_avatar en lo demás, con el '' que vuelve a null para el
// anuncio que no lleva enlace.
const targetUrlSchema = z
  .union([
    z.literal(''),
    z
      .string()
      .trim()
      .max(500, 'El enlace del anuncio no puede tener más de 500 caracteres.')
      .refine(
        (value) => isSitePath(value) || isHttpUrl(value),
        'El enlace tiene que ser una URL (https://...) o una ruta del sitio (/pro).'
      ),
  ])
  .transform((value) => (value === '' ? null : value));

/**
 * ¿Es una ruta del propio sitio? Empieza con una sola barra: "//otro.com" es un
 * dominio externo disfrazado de ruta, y el navegador lo trataría como tal.
 */
function isSitePath(value: string): boolean {
  return value.startsWith('/') && !value.startsWith('//');
}

/** ¿Es una URL http(s)? Descarta "javascript:", "data:" y compañía. */
function isHttpUrl(value: string): boolean {
  if (!URL.canParse(value)) return false;
  const { protocol } = new URL(value);
  return protocol === 'http:' || protocol === 'https:';
}

// El :id de la URL llega siempre como string; se valida y convierte a número acá,
// así el resto de las capas ya lo reciben tipado como number.
export const adIdParamSchema = z.object({
  id: z.coerce.number().int().positive('El id debe ser un número positivo.'),
});

// Alta de un anuncio (POST /api/ads). Si no se manda `active`, entra publicado:
// es el default de la columna y lo que se espera al cargar uno nuevo.
export const createAdSchema = z.object({
  title: titleSchema,
  description: descriptionSchema.optional(),
  url_image: imageSchema,
  target_url: targetUrlSchema.optional(),
  active: z.boolean().optional(),
});

// Edición de un anuncio (PATCH /api/ads/:id).
//
// Todo opcional para poder cambiar un solo campo: es lo que hace el interruptor
// de la tabla del panel, que manda únicamente `active`. El refine corta el PATCH
// vacío, que no pediría ningún cambio.
export const updateAdSchema = z
  .object({
    title: titleSchema.optional(),
    description: descriptionSchema.optional(),
    url_image: imageSchema.optional(),
    target_url: targetUrlSchema.optional(),
    active: z.boolean().optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'Hay que enviar al menos un campo para modificar.',
  });

export type AdIdParam = z.infer<typeof adIdParamSchema>;
export type CreateAdInput = z.infer<typeof createAdSchema>;
export type UpdateAdInput = z.infer<typeof updateAdSchema>;
