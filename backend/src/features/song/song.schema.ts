// Schemas de Zod para validar la entrada de los endpoints del CRUD de canciones.
// Los usa el middleware validate() en song.routes.ts, antes del controller.
import { z } from 'zod';
import { CONTENT_STATES } from '../../shared/types/enums';

// Reglas de cada campo definidas una sola vez: las comparten el alta y la edición.
// El máximo acompaña al STRING(200) de la columna: si no, el error lo terminaría
// tirando MySQL y con un mensaje que no le sirve al usuario.
const songTitleSchema = z
  .string()
  .trim()
  .min(1, 'El título de la canción no puede estar vacío.')
  .max(200, 'El título de la canción no puede tener más de 200 caracteres.');

// El número de pista se guarda en un SMALLINT UNSIGNED: hasta 65535. Ningún
// álbum real llega ni cerca, pero es el techo que admite la columna.
const MAX_TRACK_NUMBER = 65535;

// Es OPCIONAL en el alta aunque la columna sea NOT NULL: cuando no viene, el
// service le asigna la pista siguiente a la última del álbum (o la 1 si la
// canción no pertenece a ninguno). Así se puede cargar un tracklist en orden sin
// tener que ir contando a mano.
//
// El string vacío también significa "decidilo vos", y no un número inválido: es
// lo que manda el formulario cuando el usuario deja el campo en blanco. Se
// traduce a undefined y NO a null, porque la columna no admite NULL: lo que hace
// falta acá es que el campo llegue ausente para que el service lo complete.
//
// El orden de las opciones importa: z.coerce.number() convierte '' en 0, así que
// si el literal no se probara primero, un campo vacío se leería como la pista 0.
const numberTrackSchema = z
  .union([
    z.literal(''),
    z.null(),
    z.coerce
      .number()
      .int('El número de pista tiene que ser un número entero.')
      .min(1, 'El número de pista debe ser mayor a cero.')
      .max(MAX_TRACK_NUMBER, 'El número de pista no es válido.'),
  ])
  .transform((value) => (value === '' || value === null ? undefined : value));

// Duración en segundos, como la guarda la entidad (ver song.entity.ts). Admite
// NULL: puede no conocerse. El string vacío se traduce a null, que es lo que
// manda el formulario cuando el usuario borra el campo.
//
// El techo son 10 horas: alcanza de sobra para cualquier pista, incluidas las
// grabaciones largas, y corta una duración cargada por error en milisegundos.
const MAX_DURATION_SECONDS = 36000;

const durationSchema = z
  .union([
    z.literal(''),
    z.null(),
    z.coerce
      .number()
      .int('La duración tiene que ser un número entero de segundos.')
      .min(1, 'La duración debe ser mayor a cero.')
      .max(MAX_DURATION_SECONDS, 'La duración no es válida.'),
  ])
  .transform((value) => (value === '' ? null : value));

// Álbum al que pertenece la canción. Es OBLIGATORIO, aunque la columna admita
// NULL.
//
// La FK de SONG hacia ALBUMS es NULL en el DER para no cerrarle la puerta al
// single suelto, pero una canción sin álbum queda sin artista: ARTIST cuelga de
// ALBUMS, no de SONG. O sea que no habría forma de decir de quién es esa canción,
// ni de llegar a ella desde ninguna pantalla del sitio (el tracklist se dibuja
// dentro de la ficha del álbum). Por eso la API no deja cargar ninguna: la regla
// vive acá y no en la entidad, que sigue reflejando el DER tal cual.
// El mismo texto para las tres formas de equivocarse (no mandar nada, mandar
// null, mandar un id que no es un número positivo): al usuario le sirve saber que
// falta elegir el álbum, no en cuál de los tres casos cayó. Sin el `error` del
// coerce, un campo ausente devolvería el mensaje por defecto de Zod, que habla de
// NaN y no le dice nada a nadie.
const ALBUM_REQUIRED_MESSAGE = 'Hay que elegir el álbum al que pertenece la canción.';

const idAlbumSchema = z.coerce
  .number({ error: ALBUM_REQUIRED_MESSAGE })
  .int(ALBUM_REQUIRED_MESSAGE)
  .positive(ALBUM_REQUIRED_MESSAGE);

// El :id de la URL llega siempre como string; se valida y convierte a número acá,
// así el resto de las capas ya lo reciben tipado como number.
export const songIdParamSchema = z.object({
  id: z.coerce.number().int().positive('El id debe ser un número positivo.'),
});

// Alta de una canción (POST /api/songs). El estado y el autor NO se reciben del
// cliente: los decide el service a partir del rol de quien hace la request.
export const createSongSchema = z.object({
  song_title: songTitleSchema,
  number_track: numberTrackSchema.optional(),
  duration: durationSchema.optional(),
  id_album: idAlbumSchema,
});

// Todo opcional: PATCH permite mandar solo el campo que se quiere cambiar.
// `state` tampoco se edita por acá; para eso están /:id/approve y /:id/reject.
//
// `id_album` se puede cambiar por otro álbum, pero no vaciar: mandar null lo
// rechaza el mismo schema que el alta, por el motivo explicado más arriba.
export const updateSongSchema = z
  .object({
    song_title: songTitleSchema.optional(),
    number_track: numberTrackSchema.optional(),
    duration: durationSchema.optional(),
    id_album: idAlbumSchema.optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'Hay que enviar al menos un campo para actualizar.',
  });

// Filtros del listado (GET /api/songs?id_album=12&state=pending).
// Solo un ADMIN puede pedir un estado distinto de 'approved' (y cualquiera sobre
// sus propios aportes): eso lo resuelve el service, acá únicamente se chequea que
// lo que llegue sea un estado válido.
export const listSongsQuerySchema = z.object({
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
  // Deja solo las pistas de un álbum. Es lo que usa el panel para administrar un
  // tracklist completo de una vez.
  id_album: z.coerce
    .number()
    .int()
    .positive('El id del álbum debe ser un número positivo.')
    .optional(),
  // Filtra por origen de la canción: 'true' deja solo las aportadas por usuarios
  // y 'false' solo las del catálogo inicial.
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
 * Cómo se ordena el explorador. Son los mismos criterios que los del álbum
 * (ver ALBUM_SORTS), menos `year`: la canción no tiene año propio, lo hereda de
 * su álbum, y ordenar por él dejaría el tracklist entero pegado en bloque.
 *
 *   rating    las mejor calificadas.
 *   reviews   las más reseñadas (histórico, todas las reseñas).
 *   trending  "Tendencia Ahora": las más reseñadas en los últimos días (ver
 *             TRENDING_WINDOW_DAYS en song.repository.ts).
 *   recent    las últimas agregadas al catálogo.
 *   title     alfabético; es el orden por defecto de un listado sin criterio.
 */
export const SONG_SORTS = ['rating', 'reviews', 'trending', 'recent', 'title'] as const;
export type SongSort = (typeof SONG_SORTS)[number];

// Techo de cuántas canciones puede pedir una sola request al explorador. Las
// secciones de /music piden entre 5 y 6; el listado completo pagina de a tandas.
const MAX_EXPLORE_LIMIT = 100;

// Los mismos límites que valida la entidad Album para su año de lanzamiento.
const MIN_RELEASE_YEAR = 1900;
const MAX_RELEASE_YEAR = 2100;

// El rango de años filtra por el año del ÁLBUM de la canción, que es el único
// que existe: SONG no tiene fecha propia en el DER.
const albumYearSchema = z.coerce
  .number()
  .int('El año tiene que ser un número entero.')
  .min(MIN_RELEASE_YEAR, `El año debe ser posterior a ${MIN_RELEASE_YEAR}.`)
  .max(MAX_RELEASE_YEAR, 'El año no es válido.');

/**
 * Filtros del explorador público (GET /api/songs/explore).
 *
 * Va aparte del listado normal porque son dos consultas distintas: esta no
 * recibe `state` ni `created_by` (siempre devuelve el catálogo aprobado, sin
 * importar quién pregunte) y sí recibe orden, tope y rango de años.
 */
export const exploreSongsQuerySchema = z.object({
  sort: z
    .enum(SONG_SORTS, { message: `El orden debe ser uno de: ${SONG_SORTS.join(', ')}.` })
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
  year_from: albumYearSchema.optional(),
  year_to: albumYearSchema.optional(),
  // Búsqueda parcial por título. La usa el buscador de la barra de navegación,
  // que es público: por eso va acá y no solo en el listado, que pide sesión.
  title: z
    .string()
    .trim()
    .max(200, 'El título a buscar no puede tener más de 200 caracteres.')
    .transform((value) => (value === '' ? undefined : value))
    .optional(),
});

export type SongIdParam = z.infer<typeof songIdParamSchema>;
export type ExploreSongsQuery = z.infer<typeof exploreSongsQuerySchema>;
export type CreateSongInput = z.infer<typeof createSongSchema>;
export type UpdateSongInput = z.infer<typeof updateSongSchema>;
export type ListSongsQuery = z.infer<typeof listSongsQuerySchema>;
