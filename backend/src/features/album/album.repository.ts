// Acceso a datos de la feature album: consultas a la tabla albums para el CRUD
// del catálogo. Es la única capa que habla con Sequelize.
import { IncludeOptions, literal, Op, Order, OrderItem } from 'sequelize';
import { Album, Artist, Genre, GenreAlbum, Review, Song, User } from '../../entities';
import { escapeLike, startsWithFirst } from '../../shared/db/like';
import { ContentState } from '../../shared/types/enums';
import { AlbumSort } from './album.schema';

/** Artista del álbum, reducido a lo que se muestra debajo del título. */
export type AlbumArtist = {
  id_artist: number;
  name: string;
};

/** Autor del aporte, reducido a lo que se muestra en la cola de moderación. */
export type AlbumCreator = {
  id_user: number;
  username: string;
};

/** Género asignado al álbum, reducido a lo que hace falta para nombrarlo. */
export type AlbumGenre = {
  id_genre: number;
  name: string;
};

/** Reseña reducida a lo que hace falta para promediar la calificación. */
export type AlbumSongReview = {
  rating: number;
  state: string;
};

/**
 * Canción del álbum tal como la trae la ficha: la pista completa, con las
 * calificaciones de sus reseñas para poder promediarlas.
 *
 * SONG no tiene una columna `average_rating` como sí tiene ALBUMS (ver el DER),
 * así que el promedio de cada pista se calcula al leerlo, en el service.
 */
export type AlbumSong = {
  id_song: number;
  number_track: number;
  song_title: string;
  duration: number | null;
  state: ContentState;
  reviews?: AlbumSongReview[];
};

/** Álbum reducido a lo que hace falta para comparar títulos entre sí. */
export type AlbumTitleRow = {
  id_album: number;
  title: string;
  state: ContentState;
  id_artist: number;
};

/**
 * Álbum tal como sale de este repositorio: con su artista, su autor, sus géneros,
 * sus canciones y sus reseñas, cuando la consulta los trajo (el alta no, porque
 * crea un álbum todavía sin nada colgado).
 *
 * Ninguna de esas propiedades está declarada en album.entity.ts, porque las
 * entidades son compartidas por todas las features y no se tocan desde una sola.
 * Se las agrega acá, que es la capa que sabe cómo está armada la consulta.
 */
export type AlbumWithRelations = Album & {
  artist?: AlbumArtist | null;
  creator?: AlbumCreator | null;
  genres?: AlbumGenre[];
  songs?: AlbumSong[];
  reviews?: { id_review: number }[];
};

/** Filtros opcionales del listado. Sin ninguno, devuelve el catálogo completo. */
type AlbumFilters = {
  state?: ContentState;
  /** Búsqueda parcial: alcanza con que el título contenga este texto. */
  title?: string;
  /** Solo los álbumes de un artista puntual. */
  idArtist?: number;
  /**
   * true: solo los álbumes aportados por un usuario (created_by no nulo).
   * false: solo los del catálogo inicial. Sin definir, no filtra por origen.
   */
  contributed?: boolean;
  /** Solo los aportes de este usuario. Es lo que lista "Aportes" en el perfil. */
  createdBy?: number;
};

type CreateAlbumData = {
  title: string;
  release_year?: number | null;
  url_cover?: string | null;
  state: ContentState;
  /** Usuario que lo cargó. NULL solo para lo que vino del seed inicial. */
  created_by: number | null;
  id_artist: number;
};

type UpdateAlbumData = {
  title?: string;
  release_year?: number | null;
  url_cover?: string | null;
  state?: ContentState;
  id_artist?: number;
};

// El artista viaja con cada álbum porque no hay pantalla que muestre un álbum sin
// decir de quién es.
const artistInclude = {
  model: Artist,
  as: 'artist',
  attributes: ['id_artist', 'name'],
};

// El autor viaja para que la cola de moderación pueda decir quién mandó el aporte.
// required: false porque es un LEFT JOIN: los álbumes del seed no tienen autor.
const creatorInclude = {
  model: User,
  as: 'creator',
  attributes: ['id_user', 'username'],
  required: false,
};

// through: { attributes: [] } deja afuera las columnas de la tabla intermedia
// (genres_albums): no las usa nadie y solo ensucian la respuesta.
const genresInclude = {
  model: Genre,
  as: 'genres',
  attributes: ['id_genre', 'name'],
  through: { attributes: [] },
};

// En el listado las canciones y las reseñas viajan SOLO como ids: alcanza para
// contarlas, que es lo único que necesita la tabla del panel (y el chequeo de la
// baja, que ahora las dos FK son RESTRICT). Traer el tracklist completo de cada
// uno de los cientos de álbumes del catálogo sería mandar datos que nadie mira.
//
// separate: true hace que Sequelize las pida en una consulta aparte en vez de con
// un JOIN. Sin eso, dos hasMany en la misma consulta se multiplican entre sí y
// cada álbum aparecería tantas veces como canciones por reseñas tenga.
const songIdsInclude = {
  model: Song,
  as: 'songs',
  attributes: ['id_song'],
  separate: true,
};

const reviewIdsInclude = {
  model: Review,
  as: 'reviews',
  attributes: ['id_review'],
  separate: true,
};

// La ficha sí necesita el tracklist completo, ordenado por número de pista, y con
// las calificaciones de cada canción para poder promediarlas.
//
// Las reseñas se traen enteras (con su estado) y se filtran en el service: un
// `where` acá dejaría afuera a las canciones que todavía no tienen ninguna.
const songsDetailInclude: IncludeOptions = {
  model: Song,
  as: 'songs',
  attributes: ['id_song', 'number_track', 'song_title', 'duration', 'state'],
  separate: true,
  order: [['number_track', 'ASC']],
  include: [{ model: Review, as: 'reviews', attributes: ['rating', 'state'] }],
};

/**
 * Resuelve la parte de created_by del where. Los dos filtros que la tocan se
 * excluyen entre sí, y gana el más específico: pedir los aportes de un usuario
 * puntual ya implica que son aportes de alguien.
 * @param filters filtros del listado.
 */
function buildCreatedByFilter(filters: AlbumFilters) {
  if (filters.createdBy !== undefined) return { created_by: filters.createdBy };
  if (filters.contributed === undefined) return {};
  return { created_by: filters.contributed ? { [Op.ne]: null } : null };
}

/**
 * Arma la cláusula where del listado a partir de los filtros recibidos.
 * @param filters estado, título, artista, origen y/o autor a filtrar.
 * @returns el where listo para Sequelize; vacío si no vino ningún filtro.
 */
function buildWhere(filters: AlbumFilters) {
  return {
    ...(filters.state ? { state: filters.state } : {}),
    // La colación de la base (utf8mb4_unicode_ci) ya ignora mayúsculas y
    // minúsculas, así que un LIKE común encuentra "Nevermind" buscando "nevermind".
    ...(filters.title ? { title: { [Op.like]: `%${escapeLike(filters.title)}%` } } : {}),
    ...(filters.idArtist !== undefined ? { id_artist: filters.idArtist } : {}),
    ...buildCreatedByFilter(filters),
  };
}

/** Opciones del explorador público. Ver exploreAlbumsQuerySchema. */
type ExploreOptions = {
  sort?: AlbumSort;
  limit?: number;
  offset?: number;
  yearFrom?: number;
  yearTo?: number;
  idGenre?: number;
  /** Búsqueda parcial por título, para el buscador de la barra. */
  title?: string;
};

// Ventana de "Tendencia Ahora": cuántos días atrás cuentan como actividad
// reciente. Se define acá y no en el schema porque es un detalle de cómo se
// arma la consulta, no un dato que valide la entrada.
const TRENDING_WINDOW_DAYS = 14;

/**
 * Traduce el orden pedido a la cláusula ORDER BY de Sequelize.
 *
 * Los que cuentan reseñas usan una subconsulta correlacionada: la cantidad de
 * reseñas no es una columna de ALBUMS, y el include que las trae va con
 * `separate: true` (una consulta aparte), así que no se puede ordenar por él. La
 * subconsulta la resuelve MySQL fila por fila dentro del mismo SELECT.
 *
 * `trending` es la misma subconsulta que `reviews`, pero acotada a las reseñas
 * publicadas de los últimos TRENDING_WINDOW_DAYS días: es lo que la distingue de
 * "Más Reseñados" (histórico) y lo que hace real a "Tendencia Ahora", que hasta
 * ahora eran los últimos agregados al catálogo, no una tendencia.
 *
 * El desempate siempre es por título, para que dos consultas iguales devuelvan
 * las filas en el mismo orden (hoy, sin reseñas cargadas, TODOS los álbumes
 * empatan en 0 y sin esto el orden lo elegiría MySQL).
 *
 * @param sort criterio elegido; sin él, alfabético.
 */
function buildOrder(sort: AlbumSort = 'title'): Order {
  const byTitle: OrderItem = ['title', 'ASC'];

  switch (sort) {
    case 'rating':
      return [['average_rating', 'DESC'], byTitle];
    case 'reviews':
      return [
        [
          literal('(SELECT COUNT(*) FROM `review` WHERE `review`.`id_album` = `Album`.`id_album`)'),
          'DESC',
        ],
        byTitle,
      ];
    case 'trending':
      return [
        [
          literal(
            '(SELECT COUNT(*) FROM `review` WHERE `review`.`id_album` = `Album`.`id_album` ' +
              "AND `review`.`state` = 'published' " +
              `AND \`review\`.\`review_date\` >= NOW() - INTERVAL ${TRENDING_WINDOW_DAYS} DAY)`
          ),
          'DESC',
        ],
        byTitle,
      ];
    // El id autoincremental alcanza para saber qué se cargó último: ALBUMS no
    // tiene una columna de fecha de alta en el DER.
    case 'recent':
      return [['id_album', 'DESC'], byTitle];
    case 'year':
      // NULLS LAST no existe en MySQL: el IS NULL primero manda los álbumes sin
      // año al final, que es donde tienen que estar en "Nuevos Lanzamientos".
      return [[literal('`Album`.`release_year` IS NULL'), 'ASC'], ['release_year', 'DESC'], byTitle];
    case 'title':
      return [byTitle];
  }
}

/**
 * Arma el where del explorador: siempre el catálogo aprobado, más el rango de
 * años y la búsqueda por título si se pidieron.
 * @param options filtros del explorador.
 */
function buildExploreWhere(options: ExploreOptions) {
  const hasYearRange = options.yearFrom !== undefined || options.yearTo !== undefined;

  const yearRange = {
    ...(options.yearFrom !== undefined ? { [Op.gte]: options.yearFrom } : {}),
    ...(options.yearTo !== undefined ? { [Op.lte]: options.yearTo } : {}),
  };

  return {
    // Lo pendiente y lo rechazado no forman parte del catálogo público, y este
    // endpoint no pide token: no hay forma de saber si quien pregunta es el autor.
    state: 'approved' as ContentState,
    // Los álbumes sin año quedan afuera de una década a propósito: no se sabe a
    // cuál pertenecen.
    ...(hasYearRange ? { release_year: yearRange } : {}),
    // Los comodines de LIKE se escapan: buscar "%" no tiene que traer todo el catálogo.
    ...(options.title ? { title: { [Op.like]: `%${escapeLike(options.title)}%` } } : {}),
  };
}

export const albumRepository = {
  /**
   * Listado del explorador público: solo álbumes aprobados, ordenados por el
   * criterio pedido y acotados a un tope de filas.
   * @param options orden, tope, rango de años y género.
   */
  findForExplore: async (options: ExploreOptions = {}): Promise<AlbumWithRelations[]> => {
    // El filtro por género va como include con `required: true` (INNER JOIN) en
    // vez de en el where, porque el género vive en la tabla intermedia.
    const genresFilterInclude =
      options.idGenre === undefined
        ? genresInclude
        : { ...genresInclude, where: { id_genre: options.idGenre }, required: true };

    const albums = await Album.findAll({
      where: buildExploreWhere(options),
      include: [artistInclude, genresFilterInclude, songIdsInclude, reviewIdsInclude],
      // En una búsqueda, primero los títulos que empiezan con lo buscado y, dentro
      // de cada grupo, el orden pedido.
      order: options.title
        ? [startsWithFirst('`Album`.`title`', options.title), ...(buildOrder(options.sort) as OrderItem[])]
        : buildOrder(options.sort),
      ...(options.limit !== undefined ? { limit: options.limit } : {}),
      ...(options.offset !== undefined ? { offset: options.offset } : {}),
    });

    return albums as AlbumWithRelations[];
  },

  findAll: async (filters: AlbumFilters = {}): Promise<AlbumWithRelations[]> => {
    const albums = await Album.findAll({
      where: buildWhere(filters),
      include: [artistInclude, creatorInclude, genresInclude, songIdsInclude, reviewIdsInclude],
      order: [['title', 'ASC']],
    });

    return albums as AlbumWithRelations[];
  },

  // La ficha: un solo álbum, pero con el tracklist completo.
  findById: async (id_album: number): Promise<AlbumWithRelations | null> => {
    const album = await Album.findByPk(id_album, {
      include: [
        artistInclude,
        creatorInclude,
        genresInclude,
        songsDetailInclude,
        reviewIdsInclude,
      ],
    });

    return album as AlbumWithRelations | null;
  },

  // Años de lanzamiento de todo el catálogo aprobado, sin includes ni ninguna
  // otra columna: es lo único que necesita el conteo por década.
  //
  // Se agrupan en el service y no con un GROUP BY porque son un par de cientos de
  // números: traerlos y contarlos en JavaScript sale igual de barato que armar la
  // subconsulta, y se lee mucho mejor.
  findApprovedReleaseYears: (): Promise<{ release_year: number | null }[]> =>
    Album.findAll({
      attributes: ['release_year'],
      where: { state: 'approved' },
      raw: true,
    }) as unknown as Promise<{ release_year: number | null }[]>,

  // Títulos de los álbumes de un artista, sin includes: es lo único que necesita
  // la comparación contra un álbum repetido. Se acota al artista a propósito, que
  // es donde el título repetido significa algo: dos artistas distintos pueden
  // tener los dos un "Greatest Hits" y no es un duplicado.
  findTitlesByArtist: (id_artist: number): Promise<AlbumTitleRow[]> =>
    Album.findAll({
      attributes: ['id_album', 'title', 'state', 'id_artist'],
      where: { id_artist },
      order: [['title', 'ASC']],
    }),

  // Cuántos aportes de este usuario siguen pendientes de revisión. Lo usa el
  // alta para frenar a un PRO que ya satura la cola de moderación (ver
  // MAX_PENDING_PROPOSALS en album.service.ts).
  countPending: (createdBy: number): Promise<number> =>
    Album.count({ where: { created_by: createdBy, state: 'pending' } }),

  create: (data: CreateAlbumData): Promise<AlbumWithRelations> => Album.create(data),

  update: async (
    album: AlbumWithRelations,
    data: UpdateAlbumData
  ): Promise<AlbumWithRelations> => {
    // update() devuelve la misma instancia, así que conserva lo que ya había
    // traído el include.
    await album.update(data);
    return album;
  },

  delete: (album: AlbumWithRelations): Promise<void> => album.destroy(),

  /**
   * Reemplaza los géneros de un álbum por los que se pasan.
   *
   * Se escribe la tabla intermedia a mano (borrar todo y volver a insertar) en
   * vez de usar el `setGenres` que genera Sequelize para el N:M: ese método no
   * está declarado en la entidad, y hacerlo explícito deja a la vista qué filas
   * de genres_albums se tocan.
   *
   * @param id_album álbum al que se le asignan los géneros.
   * @param genreIds ids de los géneros; la lista vacía le saca todos.
   */
  setGenres: async (id_album: number, genreIds: number[]): Promise<void> => {
    await GenreAlbum.destroy({ where: { id_album } });
    if (genreIds.length === 0) return;

    await GenreAlbum.bulkCreate(genreIds.map((id_genre) => ({ id_genre, id_album })));
  },

  /** Cuáles de esos ids existen de verdad en la tabla de géneros. */
  findExistingGenreIds: async (genreIds: number[]): Promise<number[]> => {
    const genres = await Genre.findAll({
      attributes: ['id_genre'],
      where: { id_genre: genreIds },
    });

    return genres.map((genre) => genre.id_genre);
  },

  /** ¿Existe ese artista? Lo necesita el alta, porque la FK de ALBUMS es NOT NULL. */
  artistExists: async (id_artist: number): Promise<boolean> => {
    const artist = await Artist.findByPk(id_artist, { attributes: ['id_artist'] });
    return artist !== null;
  },
};
