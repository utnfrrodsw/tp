// Acceso a datos de la feature song: consultas a la tabla song para el CRUD del
// tracklist. Es la única capa que habla con Sequelize.
import { literal, Op, Order, OrderItem } from 'sequelize';
import { Album, Artist, Review, Song, User } from '../../entities';
import { escapeLike, startsWithFirst } from '../../shared/db/like';
import { ContentState } from '../../shared/types/enums';
import { SongSort } from './song.schema';

/** Artista del álbum de la canción, para poder ubicarla en una sola línea. */
export type SongArtist = {
  id_artist: number;
  name: string;
};

/**
 * Álbum al que pertenece la canción.
 *
 * Es null solo en las filas viejas: la API ya no deja cargar canciones sin álbum
 * (ver el comentario de idAlbumSchema en song.schema.ts), pero la columna lo
 * admite y editarlas es lo que permite asignarles uno.
 *
 * Trae la carátula y el año porque la ficha de la canción los muestra: es la
 * única imagen que puede acompañarla, ya que una canción no tiene portada propia.
 */
export type SongAlbum = {
  id_album: number;
  title: string;
  release_year: number | null;
  url_cover: string | null;
  artist?: SongArtist | null;
};

/** Autor del aporte, reducido a lo que se muestra en la cola de moderación. */
export type SongCreator = {
  id_user: number;
  username: string;
};

/** Reseña reducida a lo que hace falta para promediar la calificación. */
export type SongReview = {
  rating: number;
  state: string;
};

/** Pista reducida a lo que hace falta para chequear el número dentro del álbum. */
export type SongTrackRow = {
  id_song: number;
  number_track: number;
  song_title: string;
};

/**
 * Canción tal como sale de este repositorio: con su álbum (y el artista de ese
 * álbum), su autor y sus reseñas, cuando la consulta los trajo (el alta no,
 * porque crea una canción todavía sin nada colgado).
 *
 * Ninguna de esas propiedades está declarada en song.entity.ts, porque las
 * entidades son compartidas por todas las features y no se tocan desde una sola.
 * Se las agrega acá, que es la capa que sabe cómo está armada la consulta.
 */
export type SongWithRelations = Song & {
  album?: SongAlbum | null;
  creator?: SongCreator | null;
  reviews?: SongReview[];
};

/** Filtros opcionales del listado. Sin ninguno, devuelve todas las canciones. */
type SongFilters = {
  state?: ContentState;
  /** Búsqueda parcial: alcanza con que el título contenga este texto. */
  title?: string;
  /** Solo las pistas de un álbum puntual. */
  idAlbum?: number;
  /**
   * true: solo las canciones aportadas por un usuario (created_by no nulo).
   * false: solo las del catálogo inicial. Sin definir, no filtra por origen.
   */
  contributed?: boolean;
  /** Solo los aportes de este usuario. Es lo que lista "Aportes" en el perfil. */
  createdBy?: number;
};

type CreateSongData = {
  song_title: string;
  number_track: number;
  duration?: number | null;
  state: ContentState;
  /** Usuario que la cargó. NULL solo para lo que vino del seed inicial. */
  created_by: number | null;
  id_album: number | null;
};

type UpdateSongData = {
  song_title?: string;
  number_track?: number;
  duration?: number | null;
  state?: ContentState;
  id_album?: number | null;
};

// El álbum viaja con cada canción, y con él su artista: sin eso, una lista de
// canciones sueltas no se puede leer (hay muchos "Intro" en el catálogo).
// required: false porque es un LEFT JOIN: una canción puede no tener álbum.
const albumInclude = {
  model: Album,
  as: 'album',
  attributes: ['id_album', 'title', 'release_year', 'url_cover'],
  required: false,
  include: [{ model: Artist, as: 'artist', attributes: ['id_artist', 'name'] }],
};

// El autor viaja para que la cola de moderación pueda decir quién mandó el aporte.
// required: false porque las canciones del seed no tienen autor.
const creatorInclude = {
  model: User,
  as: 'creator',
  attributes: ['id_user', 'username'],
  required: false,
};

// Las reseñas se traen enteras (con su estado) y se promedian en el service:
// SONG no tiene una columna `average_rating` como sí tiene ALBUMS (ver el DER).
//
// separate: true hace que Sequelize las pida en una consulta aparte en vez de con
// un JOIN, así una canción con cinco reseñas no aparece cinco veces en el listado.
const reviewsInclude = {
  model: Review,
  as: 'reviews',
  attributes: ['rating', 'state'],
  separate: true,
};

/**
 * Resuelve la parte de created_by del where. Los dos filtros que la tocan se
 * excluyen entre sí, y gana el más específico: pedir los aportes de un usuario
 * puntual ya implica que son aportes de alguien.
 * @param filters filtros del listado.
 */
function buildCreatedByFilter(filters: SongFilters) {
  if (filters.createdBy !== undefined) return { created_by: filters.createdBy };
  if (filters.contributed === undefined) return {};
  return { created_by: filters.contributed ? { [Op.ne]: null } : null };
}

/**
 * Arma la cláusula where del listado a partir de los filtros recibidos.
 * @param filters estado, título, álbum, origen y/o autor a filtrar.
 * @returns el where listo para Sequelize; vacío si no vino ningún filtro.
 */
function buildWhere(filters: SongFilters) {
  return {
    ...(filters.state ? { state: filters.state } : {}),
    // La colación de la base (utf8mb4_unicode_ci) ya ignora mayúsculas y
    // minúsculas, así que un LIKE común encuentra "Come As You Are" buscando "come".
    ...(filters.title ? { song_title: { [Op.like]: `%${escapeLike(filters.title)}%` } } : {}),
    ...(filters.idAlbum !== undefined ? { id_album: filters.idAlbum } : {}),
    ...buildCreatedByFilter(filters),
  };
}

/** Opciones del explorador público. Ver exploreSongsQuerySchema. */
type ExploreOptions = {
  sort?: SongSort;
  limit?: number;
  offset?: number;
  yearFrom?: number;
  yearTo?: number;
  /** Búsqueda parcial por título, para el buscador de la barra. */
  title?: string;
};

// Ventana de "Tendencia Ahora": cuántos días atrás cuentan como actividad
// reciente. Mismo valor que TRENDING_WINDOW_DAYS en album.repository.ts.
const TRENDING_WINDOW_DAYS = 14;

/**
 * Traduce el orden pedido a la cláusula ORDER BY de Sequelize.
 *
 * Los criterios que miran reseñas usan una subconsulta correlacionada, porque
 * SONG no guarda ni el promedio ni la cantidad (a diferencia de ALBUMS, que sí
 * tiene la columna derivada average_rating) y el include que trae las reseñas va
 * con `separate: true`, en una consulta aparte.
 *
 * El desempate siempre es por título, para que dos consultas iguales devuelvan
 * las filas en el mismo orden: hoy, sin reseñas cargadas, TODAS las canciones
 * empatan y sin esto el orden lo elegiría MySQL.
 *
 * @param sort criterio elegido; sin él, alfabético.
 */
function buildExploreOrder(sort: SongSort = 'title'): Order {
  const byTitle: OrderItem = ['song_title', 'ASC'];

  switch (sort) {
    case 'rating':
      // Solo las publicadas: las ocultas y las borradas dejaron de contar.
      return [
        [
          literal(
            "(SELECT AVG(`r`.`rating`) FROM `review` `r` " +
              "WHERE `r`.`id_song` = `Song`.`id_song` AND `r`.`state` = 'published')"
          ),
          'DESC',
        ],
        byTitle,
      ];
    case 'reviews':
      return [
        [
          literal(
            "(SELECT COUNT(*) FROM `review` `r` " +
              "WHERE `r`.`id_song` = `Song`.`id_song` AND `r`.`state` = 'published')"
          ),
          'DESC',
        ],
        byTitle,
      ];
    // Misma subconsulta que 'reviews', acotada a los últimos TRENDING_WINDOW_DAYS
    // días: es lo que hace real a "Tendencia Ahora" en vez de mostrar lo último
    // agregado al catálogo (ver el mismo criterio en album.repository.ts).
    case 'trending':
      return [
        [
          literal(
            "(SELECT COUNT(*) FROM `review` `r` " +
              "WHERE `r`.`id_song` = `Song`.`id_song` AND `r`.`state` = 'published' " +
              `AND \`r\`.\`review_date\` >= NOW() - INTERVAL ${TRENDING_WINDOW_DAYS} DAY)`
          ),
          'DESC',
        ],
        byTitle,
      ];
    // El id autoincremental alcanza para saber qué se cargó último: SONG no tiene
    // una columna de fecha de alta en el DER.
    case 'recent':
      return [['id_song', 'DESC'], byTitle];
    case 'title':
      return [byTitle];
  }
}

export const songRepository = {
  /**
   * Listado del explorador público: solo canciones aprobadas, ordenadas por el
   * criterio pedido y acotadas a un tope de filas.
   *
   * El rango de años filtra por el año del ÁLBUM, que es el único que hay. Va
   * como `where` dentro del include del álbum (y no en el where principal)
   * porque release_year es una columna de ALBUMS.
   *
   * @param options orden, tope y rango de años.
   */
  findForExplore: async (options: ExploreOptions = {}): Promise<SongWithRelations[]> => {
    const hasYearRange = options.yearFrom !== undefined || options.yearTo !== undefined;

    const yearRange = {
      ...(options.yearFrom !== undefined ? { [Op.gte]: options.yearFrom } : {}),
      ...(options.yearTo !== undefined ? { [Op.lte]: options.yearTo } : {}),
    };

    // required: true convierte el LEFT JOIN en INNER: con un rango de años piedo,
    // una canción cuyo álbum no entra en el rango tiene que quedar afuera.
    const albumFilterInclude = hasYearRange
      ? { ...albumInclude, where: { release_year: yearRange }, required: true }
      : albumInclude;

    const songs = await Song.findAll({
      // Lo pendiente y lo rechazado no forman parte del catálogo público, y este
      // endpoint no pide token: no hay forma de saber si quien pregunta es el
      // autor.
      where: {
        state: 'approved' as ContentState,
        // Los comodines de LIKE se escapan: buscar "%" no tiene que traer todo.
        ...(options.title
          ? { song_title: { [Op.like]: `%${escapeLike(options.title)}%` } }
          : {}),
      },
      include: [albumFilterInclude, reviewsInclude],
      // En una búsqueda, primero los títulos que empiezan con lo buscado y, dentro
      // de cada grupo, el orden pedido.
      order: options.title
        ? [
            startsWithFirst('`Song`.`song_title`', options.title),
            ...(buildExploreOrder(options.sort) as OrderItem[]),
          ]
        : buildExploreOrder(options.sort),
      ...(options.limit !== undefined ? { limit: options.limit } : {}),
      ...(options.offset !== undefined ? { offset: options.offset } : {}),
    });

    return songs as SongWithRelations[];
  },

  findAll: async (filters: SongFilters = {}): Promise<SongWithRelations[]> => {
    const songs = await Song.findAll({
      where: buildWhere(filters),
      include: [albumInclude, creatorInclude, reviewsInclude],
      // Por álbum y número de pista: dentro de un mismo álbum, el orden del
      // tracklist es el orden natural de la lista.
      order: [
        ['id_album', 'ASC'],
        ['number_track', 'ASC'],
      ],
    });

    return songs as SongWithRelations[];
  },

  findById: async (id_song: number): Promise<SongWithRelations | null> => {
    const song = await Song.findByPk(id_song, {
      include: [albumInclude, creatorInclude, reviewsInclude],
    });

    return song as SongWithRelations | null;
  },

  // Pistas de un álbum, sin includes: es lo único que necesitan el chequeo del
  // número repetido y el cálculo del número siguiente.
  findTracksByAlbum: (id_album: number): Promise<SongTrackRow[]> =>
    Song.findAll({
      attributes: ['id_song', 'number_track', 'song_title'],
      where: { id_album },
      order: [['number_track', 'ASC']],
    }),

  // Cuántos aportes de este usuario siguen pendientes de revisión. Lo usa el
  // alta para frenar a un PRO que ya satura la cola de moderación (ver
  // MAX_PENDING_PROPOSALS en song.service.ts).
  countPending: (createdBy: number): Promise<number> =>
    Song.count({ where: { created_by: createdBy, state: 'pending' } }),

  create: (data: CreateSongData): Promise<SongWithRelations> => Song.create(data),

  update: async (song: SongWithRelations, data: UpdateSongData): Promise<SongWithRelations> => {
    // update() devuelve la misma instancia, así que conserva lo que ya había
    // traído el include.
    await song.update(data);
    return song;
  },

  delete: (song: SongWithRelations): Promise<void> => song.destroy(),

  /** ¿Existe ese álbum? Lo necesita el alta antes de colgarle la pista. */
  albumExists: async (id_album: number): Promise<boolean> => {
    const album = await Album.findByPk(id_album, { attributes: ['id_album'] });
    return album !== null;
  },
};
