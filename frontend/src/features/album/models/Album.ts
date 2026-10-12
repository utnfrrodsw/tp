// Modelo de un álbum dentro del frontend.
// El resto de la app trabaja SIEMPRE con esta clase; el JSON crudo del backend no
// sale nunca de la capa de servicios (ver services/albumService.ts).
import type { BadgeTone } from '../../../core/components/Badge';

/**
 * Rango de años de lanzamiento que admite un álbum. Son los mismos topes que
 * MIN_RELEASE_YEAR / MAX_RELEASE_YEAR de backend/src/features/album/album.schema.ts:
 * el formulario los usa para avisar antes y los listados para titular las décadas
 * de los extremos (2100 no es un año real: es "hasta el presente").
 */
export const MIN_RELEASE_YEAR = 1900;
export const MAX_RELEASE_YEAR = 2100;

/**
 * Estados de moderación del catálogo, igual que el enum ALBUMS.state del backend.
 * Se declara acá y no se importa de la feature artist para que las features sigan
 * siendo independientes entre sí (mismo criterio que models/Genre.ts).
 */
export const CONTENT_STATES = ['pending', 'approved', 'rejected'] as const;
export type ContentState = (typeof CONTENT_STATES)[number];

/** Nombre para mostrar de cada estado: en la UI nunca se escribe el valor crudo. */
export const STATE_LABELS: Record<ContentState, string> = {
  pending: 'Pendiente',
  approved: 'Aprobado',
  rejected: 'Rechazado',
};

/**
 * Color de la pastilla de cada estado (ver core/components/Badge).
 * Se define acá, junto a las etiquetas, para que la ficha, la tabla del panel y
 * los aportes del perfil pinten el mismo estado del mismo color.
 */
export const STATE_TONES: Record<ContentState, BadgeTone> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
};

/**
 * Cómo se ordena el explorador. Son los mismos valores que acepta la API en
 * `GET /albums/explore?sort=` (ver ALBUM_SORTS en album.schema.ts del backend).
 */
export type AlbumSort = 'rating' | 'reviews' | 'trending' | 'recent' | 'year' | 'title';

/** Una década del explorador, tal como viaja en la API. */
export type DecadeApiResponse = {
  label: string;
  from: number;
  to: number;
  count: number;
};

/**
 * Una década del catálogo, con cuántos álbumes tiene.
 *
 * Es una vista de solo lectura: la arma el backend a partir de los años de
 * lanzamiento y sirve para dibujar "Explorar por Década" y para saber con qué
 * rango pedirle los álbumes al listado.
 */
export class Decade {
  constructor(
    public readonly label: string,
    public readonly from: number,
    public readonly to: number,
    public readonly count: number
  ) {}

  /** ¿Tiene algo para mostrar? Las décadas vacías no se dibujan. */
  get hasAlbums(): boolean {
    return this.count > 0;
  }

  /** Cantidad de álbumes en texto ("1 álbum" / "41 álbumes"). */
  get countLabel(): string {
    return this.count === 1 ? '1 álbum' : `${this.count} álbumes`;
  }

  /**
   * El rango en texto, como lo muestra la tarjeta ("1990 – 1999").
   *
   * La década más nueva llega hasta el tope que admite la entidad (2100), que no
   * es un año real de nada: ahí se dice "Presente".
   */
  get yearsLabel(): string {
    if (this.to >= MAX_RELEASE_YEAR) return `${this.from} – Presente`;
    if (this.from <= MIN_RELEASE_YEAR) return `Antes de ${this.to + 1}`;
    return `${this.from} – ${this.to}`;
  }
}

/** Artista del álbum, tal como viaja dentro de su ficha en la API. */
export type AlbumArtistApiResponse = {
  id_artist: number;
  name: string;
};

/** Género asignado al álbum, tal como viaja en la API. */
export type AlbumGenreApiResponse = {
  id_genre: number;
  name: string;
};

/** Usuario que cargó el álbum, tal como viaja dentro de su ficha en la API. */
export type AlbumCreatorApiResponse = {
  id_user: number;
  username: string;
};

/** Pista del tracklist, tal como viaja dentro de la ficha del álbum. */
export type AlbumSongApiResponse = {
  id_song: number;
  number_track: number;
  song_title: string;
  duration: number | null;
  state: ContentState;
  average_rating: number;
  reviews_count: number;
};

/**
 * Forma cruda con la que viaja un álbum en las respuestas de la API.
 * Respeta los nombres del backend (snake_case, como en el DER); pasarlo al modelo
 * es justamente lo que hace el servicio.
 *
 * `songs` es opcional porque solo la manda la ficha (`GET /albums/:id`). El
 * listado devuelve la versión corta: ahí alcanza con `songs_count`, que es lo
 * único que mira la tabla del panel.
 */
export type AlbumApiResponse = {
  id_album: number;
  title: string;
  release_year: number | null;
  url_cover: string | null;
  average_rating: number;
  state: ContentState;
  created_by: number | null;
  creator: AlbumCreatorApiResponse | null;
  artist: AlbumArtistApiResponse | null;
  genres: AlbumGenreApiResponse[];
  songs_count: number;
  reviews_count: number;
  songs?: AlbumSongApiResponse[];
};

/** Artista de un álbum, reducido a lo que se muestra debajo del título. */
export class AlbumArtist {
  constructor(
    public readonly id: number,
    public readonly name: string
  ) {}
}

/** Género asignado a un álbum, reducido a lo que hace falta para nombrarlo. */
export class AlbumGenre {
  constructor(
    public readonly id: number,
    public readonly name: string
  ) {}
}

/** Autor de un aporte al catálogo, para poder mostrarlo en la cola de moderación. */
export class AlbumCreator {
  constructor(
    public readonly id: number,
    public readonly username: string
  ) {}
}

/**
 * Segundos convertidos a "m:ss", que es como se lee una duración en un tracklist.
 * @param seconds duración de la pista, o null si no se conoce.
 */
function formatDuration(seconds: number | null): string {
  if (seconds === null) return '--:--';

  const minutes = Math.floor(seconds / 60);
  // padStart deja "3:07" y no "3:7", que se leería como treinta y siete.
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
}

/**
 * Pista del tracklist de un álbum.
 *
 * Es una vista de solo lectura de una canción: quien la administra es la feature
 * song, con su propio modelo. Esta clase existe porque la ficha del álbum recibe
 * las pistas adentro del álbum y no como un listado aparte.
 */
export class AlbumSong {
  constructor(
    public readonly id: number,
    public readonly numberTrack: number,
    public readonly title: string,
    /** Duración en segundos, o null si no se conoce. */
    public readonly duration: number | null,
    public readonly state: ContentState,
    /** Promedio de las reseñas de esta pista. Es 0 mientras no tenga ninguna. */
    public readonly averageRating: number,
    public readonly reviewsCount: number
  ) {}

  /** Duración lista para mostrar ("3:07"), o "--:--" si no se conoce. */
  get durationLabel(): string {
    return formatDuration(this.duration);
  }

  /** ¿Alguien ya la calificó? Distingue "sin reseñas" de un promedio bajo. */
  get hasRating(): boolean {
    return this.averageRating > 0;
  }

  /** Promedio con un decimal, como se muestra al lado de la estrella ("4.5"). */
  get ratingLabel(): string {
    return this.averageRating.toFixed(1);
  }
}

export class Album {
  constructor(
    public readonly id: number,
    public readonly title: string,
    /** null si no se conoce el año de lanzamiento. */
    public readonly releaseYear: number | null,
    /** null si el álbum no tiene portada cargada. */
    public readonly urlCover: string | null,
    /** Promedio de las reseñas. Es 0 mientras el álbum no tenga ninguna. */
    public readonly averageRating: number,
    public readonly state: ContentState,
    /** Usuario que lo cargó, o null si vino del catálogo inicial (el seed). */
    public readonly createdBy: number | null,
    public readonly artist: AlbumArtist | null,
    public readonly genres: AlbumGenre[],
    /**
     * Cuántas canciones tiene. Viene como número y no como la lista, porque el
     * listado no trae el tracklist: es lo que bloquea la baja del álbum, ya que
     * la FK de SONG es RESTRICT.
     */
    public readonly songsCount: number,
    /** Cuántas reseñas tiene. También bloquea la baja (la FK de REVIEW es RESTRICT). */
    public readonly reviewsCount: number,
    /** Tracklist. Solo lo trae la ficha; en el listado queda vacío. */
    public readonly songs: AlbumSong[] = [],
    /** Quién lo propuso, o null si es parte del catálogo inicial. */
    public readonly creator: AlbumCreator | null = null
  ) {}

  /** Nombre del artista, o un texto de reemplazo si el álbum quedó sin uno. */
  get artistName(): string {
    return this.artist?.name ?? 'Artista desconocido';
  }

  /** Nombre de quien propuso el aporte, para mostrar en la cola de moderación. */
  get creatorName(): string {
    return this.creator?.username ?? 'el catálogo inicial';
  }

  /** Año listo para mostrar, o un guión si no se conoce. */
  get yearLabel(): string {
    return this.releaseYear === null ? '—' : String(this.releaseYear);
  }

  /** Los géneros separados por coma, o un texto de reemplazo si no tiene ninguno. */
  get genresLabel(): string {
    if (this.genres.length === 0) return 'Sin género asignado';
    return this.genres.map((genre) => genre.name).join(', ');
  }

  /** ¿Ya forma parte del catálogo público? */
  get isApproved(): boolean {
    return this.state === 'approved';
  }

  /** ¿Está esperando que un ADMIN lo revise? */
  get isPending(): boolean {
    return this.state === 'pending';
  }

  /**
   * ¿Alguien ya lo calificó? Sirve para distinguir "todavía nadie lo reseñó" de
   * "lo reseñaron y el promedio dio cero", que no puede pasar porque la
   * calificación mínima es media estrella.
   */
  get hasRating(): boolean {
    return this.averageRating > 0;
  }

  /** Promedio con un decimal, como se muestra al lado de la estrella ("4.5"). */
  get ratingLabel(): string {
    return this.averageRating.toFixed(1);
  }

  /** Cantidad de canciones en texto ("1 canción" / "12 canciones"). */
  get songsLabel(): string {
    return this.songsCount === 1 ? '1 canción' : `${this.songsCount} canciones`;
  }

  /**
   * Cuánto dura el disco entero, en texto ("1 h 12 min").
   *
   * Se suma el tracklist, así que solo lo tiene la ficha: en el listado, que no
   * trae las pistas, da null y la cabecera simplemente no muestra el dato. Las
   * pistas sin duración cargada suman cero, y si ninguna la tiene se devuelve
   * null en vez de "0 min", que se leería como un álbum vacío.
   */
  get runtimeLabel(): string | null {
    const seconds = this.songs.reduce((total, song) => total + (song.duration ?? 0), 0);
    if (seconds === 0) return null;

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);

    return hours === 0 ? `${minutes} min` : `${hours} h ${minutes} min`;
  }

  /**
   * ¿Se puede eliminar? Solo si no tiene canciones ni reseñas colgadas.
   *
   * Es solo para no mostrar un botón que va a fallar: quien corta de verdad es la
   * API, que responde 409 mientras esas filas existan.
   */
  get canBeDeleted(): boolean {
    return this.songsCount === 0 && this.reviewsCount === 0;
  }

  /**
   * ¿Este usuario puede editarlo? Mismo criterio que el backend: un ADMIN puede
   * con cualquiera, y el resto solo con los álbumes que cargó.
   *
   * Es solo para no mostrar botones que van a fallar: quien corta de verdad es la
   * API, que compara el created_by contra el usuario del token.
   */
  canBeEditedBy(userId: number, isAdmin: boolean): boolean {
    return isAdmin || this.createdBy === userId;
  }
}
