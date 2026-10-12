// Acceso a datos de la feature artist: consultas a la tabla artist para el CRUD
// del catálogo. Es la única capa que habla con Sequelize.
import { Op } from 'sequelize';
import { Album, Artist, User } from '../../entities';
import { escapeLike } from '../../shared/db/like';
import { ContentState } from '../../shared/types/enums';

/** Álbum reducido a lo mínimo que hace falta para mostrar la ficha de un artista. */
export type ArtistAlbum = {
  id_album: number;
  title: string;
};

/** Artista reducido a lo que hace falta para comparar nombres entre sí. */
export type ArtistNameRow = {
  id_artist: number;
  name: string;
  state: ContentState;
};

/** Autor del aporte, reducido a lo que se muestra en la cola de moderación. */
export type ArtistCreator = {
  id_user: number;
  username: string;
};

/**
 * Artista tal como sale de este repositorio: con sus álbumes y con el usuario que
 * lo cargó, cuando la consulta los trajo (todas menos el alta, que crea un
 * artista todavía sin nada colgado).
 *
 * Ni `albums` ni `creator` están declaradas en artist.entity.ts, porque las
 * entidades son compartidas por todas las features y no se tocan desde una sola.
 * Se las agrega acá, que es la capa que sabe cómo está armada la consulta.
 */
export type ArtistWithRelations = Artist & {
  albums?: ArtistAlbum[];
  creator?: ArtistCreator | null;
};

/** Filtros opcionales del listado. Sin ninguno, devuelve el catálogo completo. */
type ArtistFilters = {
  state?: ContentState;
  /** Búsqueda parcial: alcanza con que el nombre contenga este texto. */
  name?: string;
  /**
   * true: solo los artistas aportados por un usuario (created_by no nulo).
   * false: solo los del catálogo inicial. Sin definir, no filtra por origen.
   */
  contributed?: boolean;
  /** Solo los aportes de este usuario. Es lo que lista "Aportes" en el perfil. */
  createdBy?: number;
};

type CreateArtistData = {
  name: string;
  biography?: string | null;
  state: ContentState;
  /** Usuario que lo cargó. NULL solo para lo que vino del seed inicial. */
  created_by: number | null;
};

type UpdateArtistData = {
  name?: string;
  biography?: string | null;
  state?: ContentState;
};

// Los álbumes viajan con cada artista para poder mostrar qué depende de él antes
// de intentar borrarlo. Se piden solo id y título: el resto no lo usa ninguna vista.
const albumsInclude = {
  model: Album,
  as: 'albums',
  attributes: ['id_album', 'title'],
};

// El autor viaja para que la cola de moderación pueda decir quién mandó el aporte.
// required: false porque es un LEFT JOIN: los artistas del seed no tienen autor.
const creatorInclude = {
  model: User,
  as: 'creator',
  attributes: ['id_user', 'username'],
  required: false,
};

/**
 * Resuelve la parte de created_by del where. Los dos filtros que la tocan se
 * excluyen entre sí, y gana el más específico: pedir los aportes de un usuario
 * puntual ya implica que son aportes de alguien.
 * @param filters filtros del listado.
 */
function buildCreatedByFilter(filters: ArtistFilters) {
  if (filters.createdBy !== undefined) return { created_by: filters.createdBy };
  if (filters.contributed === undefined) return {};
  return { created_by: filters.contributed ? { [Op.ne]: null } : null };
}

/**
 * Arma la cláusula where del listado a partir de los filtros recibidos.
 * @param filters estado, nombre, origen y/o autor a filtrar.
 * @returns el where listo para Sequelize; vacío si no vino ningún filtro.
 */
function buildWhere(filters: ArtistFilters) {
  return {
    ...(filters.state ? { state: filters.state } : {}),
    // La colación de la base (utf8mb4_unicode_ci) ya ignora mayúsculas y
    // minúsculas, así que un LIKE común encuentra "Nirvana" buscando "nirvana".
    ...(filters.name ? { name: { [Op.like]: `%${escapeLike(filters.name)}%` } } : {}),
    ...buildCreatedByFilter(filters),
  };
}

export const artistRepository = {
  findAll: async (filters: ArtistFilters = {}): Promise<ArtistWithRelations[]> => {
    const artists = await Artist.findAll({
      where: buildWhere(filters),
      include: [albumsInclude, creatorInclude],
      order: [['name', 'ASC']],
    });

    return artists as ArtistWithRelations[];
  },

  findById: async (id_artist: number): Promise<ArtistWithRelations | null> => {
    const artist = await Artist.findByPk(id_artist, {
      include: [albumsInclude, creatorInclude],
    });

    return artist as ArtistWithRelations | null;
  },

  // Nombres de todo el catálogo, sin includes ni biografías: es lo único que
  // necesita la comparación contra artistas repetidos o parecidos. Son menos de
  // cien filas de tres columnas, así que traerlas enteras sale más barato que
  // hacer una consulta por cada forma posible de escribir el mismo nombre.
  findAllNames: (): Promise<ArtistNameRow[]> =>
    Artist.findAll({
      attributes: ['id_artist', 'name', 'state'],
      order: [['name', 'ASC']],
    }),

  // Cuántos aportes de este usuario siguen pendientes de revisión. Lo usa el
  // alta para frenar a un PRO que ya satura la cola de moderación (ver
  // MAX_PENDING_PROPOSALS en artist.service.ts).
  countPending: (createdBy: number): Promise<number> =>
    Artist.count({ where: { created_by: createdBy, state: 'pending' } }),

  create: (data: CreateArtistData): Promise<ArtistWithRelations> => Artist.create(data),

  update: async (
    artist: ArtistWithRelations,
    data: UpdateArtistData
  ): Promise<ArtistWithRelations> => {
    // update() devuelve la misma instancia, así que conserva lo que ya había
    // traído el include.
    await artist.update(data);
    return artist;
  },

  delete: (artist: ArtistWithRelations): Promise<void> => artist.destroy(),
};
