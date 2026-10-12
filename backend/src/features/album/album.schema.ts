// Schemas de Zod para validar la entrada de los endpoints del CRUD de álbumes.
// Los usa el middleware validate() en album.routes.ts, antes del controller.
import { z } from 'zod';
import { CONTENT_STATES } from '../../shared/types/enums';

// Reglas de cada campo definidas una sola vez: las comparten el alta y la edición.
// El máximo acompaña al STRING(200) de la columna: si no, el error lo terminaría
// tirando MySQL y con un mensaje que no le sirve al usuario.
const titleSchema = z
  .string()
  .trim()
  .min(1, 'El título del álbum no puede estar vacío.')
  .max(200, 'El título del álbum no puede tener más de 200 caracteres.');

// Los mismos límites que valida la entidad (ver album.entity.ts). Se repiten acá
// para que el error salga como un 400 con el campo señalado, y no como una
// validación de Sequelize disparada más adelante.
const MIN_RELEASE_YEAR = 1900;
const MAX_RELEASE_YEAR = 2100;

// El año es opcional y en la base admite NULL: hay álbumes viejos sin fecha
// confiable. El string vacío se traduce a null (mismo criterio que url_avatar en
// user.schema.ts): es lo que manda el formulario cuando el usuario borra el campo.
const releaseYearSchema = z
  .union([
    z.literal(''),
    z.null(),
    z.coerce
      .number()
      .int('El año de lanzamiento tiene que ser un número entero.')
      .min(MIN_RELEASE_YEAR, `El año de lanzamiento debe ser posterior a ${MIN_RELEASE_YEAR}.`)
      .max(MAX_RELEASE_YEAR, 'El año de lanzamiento no es válido.'),
  ])
  .transform((value) => (value === '' ? null : value));

// Carátula: se guarda la URL, no el archivo. Igual que el avatar del usuario, el
// string vacío significa "sin portada" y se guarda como NULL.
const urlCoverSchema = z
  .union([
    z.literal(''),
    z.null(),
    z
      .string()
      .trim()
      .max(500, 'La URL de la portada no puede tener más de 500 caracteres.')
      // Solo http(s): z.url() a secas acepta "javascript:" y "data:".
      .pipe(z.url({ protocol: /^https?$/, error: 'La URL de la portada no es válida.' })),
  ])
  .transform((value) => (value === '' ? null : value));

// Artista al que pertenece el álbum. Es obligatorio en el alta porque la FK de
// ALBUMS es NOT NULL: un álbum sin artista no existe en el modelo.
//
// El mismo texto para las tres formas de equivocarse (no mandar nada, mandar
// null, mandar un id que no es un número positivo). Sin el `error` del coerce, un
// campo ausente devolvería el mensaje por defecto de Zod, que habla de NaN y no
// le dice nada a nadie.
const ARTIST_REQUIRED_MESSAGE = 'Hay que elegir el artista del álbum.';

const artistIdSchema = z.coerce
  .number({ error: ARTIST_REQUIRED_MESSAGE })
  .int(ARTIST_REQUIRED_MESSAGE)
  .positive(ARTIST_REQUIRED_MESSAGE);

// Géneros del álbum (la relación N:M con GENRES). Es una lista de ids y no de
// nombres: el género tiene que existir de antes, este CRUD no los crea.
//
// La lista vacía es válida y significa "sacarle todos los géneros": es lo que
// manda el formulario cuando se destildan todas las casillas.
const genreIdsSchema = z.array(
  z.coerce.number().int().positive('El id del género debe ser un número positivo.'),
  { message: 'Los géneros tienen que llegar como una lista de ids.' }
);

// El :id de la URL llega siempre como string; se valida y convierte a número acá,
// así el resto de las capas ya lo reciben tipado como number.
export const albumIdParamSchema = z.object({
  id: z.coerce.number().int().positive('El id debe ser un número positivo.'),
});

// Alta de un álbum (POST /api/albums). El estado y el autor NO se reciben del
// cliente: los decide el service a partir del rol de quien hace la request.
// average_rating tampoco: es un valor derivado que recalcula el CRUD de reseñas.
export const createAlbumSchema = z.object({
  title: titleSchema,
  release_year: releaseYearSchema.optional(),
  url_cover: urlCoverSchema.optional(),
  id_artist: artistIdSchema,
  genre_ids: genreIdsSchema.optional(),
});

// Todo opcional: PATCH permite mandar solo el campo que se quiere cambiar.
// `state` tampoco se edita por acá; para eso están /:id/approve y /:id/reject.
export const updateAlbumSchema = z
  .object({
    title: titleSchema.optional(),
    release_year: releaseYearSchema.optional(),
    url_cover: urlCoverSchema.optional(),
    id_artist: artistIdSchema.optional(),
    genre_ids: genreIdsSchema.optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'Hay que enviar al menos un campo para actualizar.',
  });

// Filtros del listado (GET /api/albums?state=pending&title=nevermind).
// Solo un ADMIN puede pedir un estado distinto de 'approved' (y cualquiera sobre
// sus propios aportes): eso lo resuelve el service, acá únicamente se chequea que
// lo que llegue sea un estado válido.
export const listAlbumsQuerySchema = z.object({
  state: z
    .enum(CONTENT_STATES, {
      message: `El estado debe ser uno de: ${CONTENT_STATES.join(', ')}.`,
    })
    .optional(),
  title: z
    .string()
    .trim()
    .max(200, 'El título a buscar no puede tener más de 200 caracteres.')
    // Un ?title= vacío significa "sin filtro", no un título inválido: es lo que
    // manda el buscador del frontend cuando el usuario borra lo que escribió.
    .transform((value) => (value === '' ? undefined : value))
    .optional(),
  // Deja solo los álbumes de un artista. Lo usa la ficha del artista y el
  // formulario de canción, que necesita elegir a qué álbum va la pista.
  id_artist: z.coerce
    .number()
    .int()
    .positive('El id del artista debe ser un número positivo.')
    .optional(),
  // Filtra por origen del álbum: 'true' deja solo los aportados por usuarios y
  // 'false' solo los del catálogo inicial. Lo usa la cola de moderación, que no
  // tiene por qué mostrar los cientos de álbumes que cargó el seed.
  //
  // No se usa z.coerce.boolean() porque convierte cualquier texto no vacío en
  // true, y entonces ?contributed=false daría true.
  contributed: z
    .enum(['true', 'false'], { message: 'El filtro de origen debe ser true o false.' })
    .optional()
    .transform((value) => (value === undefined ? undefined : value === 'true')),
  // Deja solo los aportes de un usuario puntual. Lo usa la pestaña "Aportes" del
  // perfil; el service decide qué estados de esos aportes puede ver quien pregunta.
  created_by: z.coerce
    .number()
    .int()
    .positive('El id del usuario debe ser un número positivo.')
    .optional(),
});

/**
 * Cómo se ordena el explorador. Cada valor corresponde a una sección de /music:
 *
 *   rating    los mejor calificados (columna average_rating, que mantiene el CRUD
 *             de reseñas).
 *   reviews   los más reseñados (histórico, todas las reseñas).
 *   trending  "Tendencia Ahora": los más reseñados en los últimos días (ver
 *             TRENDING_WINDOW_DAYS en album.repository.ts). A diferencia de
 *             `reviews`, que es histórico, este mira actividad reciente.
 *   recent    los últimos agregados al catálogo.
 *   year      los lanzamientos más nuevos.
 *   title     alfabético; es el orden por defecto de un listado sin criterio.
 */
export const ALBUM_SORTS = ['rating', 'reviews', 'trending', 'recent', 'year', 'title'] as const;
export type AlbumSort = (typeof ALBUM_SORTS)[number];

// Techo de cuántos álbumes puede pedir una sola request al explorador. Las
// secciones de /music piden entre 5 y 6; el listado completo pagina de a tandas.
const MAX_EXPLORE_LIMIT = 100;

/**
 * Filtros del explorador público (GET /api/albums/explore).
 *
 * Va aparte del listado normal porque son dos consultas distintas: esta no
 * recibe `state` ni `created_by` (siempre devuelve el catálogo aprobado, sin
 * importar quién pregunte) y sí recibe orden, tope y rango de años, que es lo que
 * necesitan las secciones de /music y la página de listado.
 */
export const exploreAlbumsQuerySchema = z.object({
  sort: z
    .enum(ALBUM_SORTS, { message: `El orden debe ser uno de: ${ALBUM_SORTS.join(', ')}.` })
    .optional(),
  limit: z.coerce
    .number()
    .int()
    .min(1, 'El tope tiene que ser mayor a cero.')
    .max(MAX_EXPLORE_LIMIT, `El tope no puede ser mayor a ${MAX_EXPLORE_LIMIT}.`)
    // Sin tope, un pedido anónimo traería el catálogo entero de una sola vez.
    .default(MAX_EXPLORE_LIMIT),
  // Desde qué fila arranca. Junto con el tope arma el paginado del listado: la
  // primera tanda va sin offset y la siguiente con el total ya mostrado. No hace
  // falta devolver un total: el botón "Ver más" se muestra mientras la última
  // tanda haya vuelto completa.
  offset: z.coerce
    .number()
    .int()
    .min(0, 'El desde no puede ser negativo.')
    .optional(),
  // Rango de años, los dos incluidos. Es lo que arma una década: 1990 a 1999.
  year_from: releaseYearSchema.optional(),
  year_to: releaseYearSchema.optional(),
  // Solo los álbumes de un género. Lo usa el listado cuando se llega desde la
  // ficha de un género.
  id_genre: z.coerce
    .number()
    .int()
    .positive('El id del género debe ser un número positivo.')
    .optional(),
  // Búsqueda parcial por título. La usa el buscador de la barra de navegación,
  // que es público: por eso va acá y no solo en el listado, que pide sesión.
  title: z
    .string()
    .trim()
    .max(200, 'El título a buscar no puede tener más de 200 caracteres.')
    .transform((value) => (value === '' ? undefined : value))
    .optional(),
});

export type AlbumIdParam = z.infer<typeof albumIdParamSchema>;
export type ExploreAlbumsQuery = z.infer<typeof exploreAlbumsQuerySchema>;
export type CreateAlbumInput = z.infer<typeof createAlbumSchema>;
export type UpdateAlbumInput = z.infer<typeof updateAlbumSchema>;
export type ListAlbumsQuery = z.infer<typeof listAlbumsQuerySchema>;
