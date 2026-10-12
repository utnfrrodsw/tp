// Listado de canciones del catálogo (/songs).
//
// Es a donde llevan los "Ver todos" de las secciones de canciones de /music. Qué
// se lista lo dice la URL, con los mismos nombres de parámetros que entiende la
// API:
//
//   /songs?sort=rating                   las mejor calificadas
//   /songs?sort=recent                   las últimas agregadas
//   /songs?year_from=1990&year_to=1999   las de los álbumes de una década
//
// Es la hermana de AlbumsExplorePage: mismo cuerpo (ExploreListing), mismas
// reglas de acceso (la ruta pide sesión) y dos diferencias que vienen del DER. No
// hay orden por año, porque la canción no tiene fecha propia, y no hay filtro por
// género, porque el género es del álbum.
import { useSearchParams } from 'react-router-dom';
import { BackLink } from '../../../../core/components/BackLink';
import { Navbar } from '../../../../core/components/Navbar';
import { Footer } from '../../../../core/components/Footer';
import { ExploreListing } from '../../../music/components/ExploreListing';
import { songToExploreItem } from '../../../music/models/ExploreItem';
import { songService } from '../../services/songService';
import type { SongSort } from '../../models/Song';
import { MAX_RELEASE_YEAR, MIN_RELEASE_YEAR } from '../../../album/models/Album';

/** Cómo se titula cada criterio de orden. */
const SORT_TITLES: Record<SongSort, string> = {
  rating: 'Mejores calificadas',
  reviews: 'Más reseñadas',
  trending: 'Tendencia ahora',
  recent: 'Últimas agregadas',
  title: 'Todas las canciones',
};

/** Qué explica cada criterio, para el subtítulo. */
const SORT_SUBTITLES: Record<SongSort, string> = {
  rating: 'Ordenadas por la calificación promedio que les puso la comunidad.',
  reviews: 'Ordenadas por cuántas reseñas recibieron en total.',
  trending: 'Las que más reseñas sumaron en los últimos días.',
  recent: 'Las últimas canciones que se sumaron al catálogo de Musicboxd.',
  title: 'Todo el catálogo, en orden alfabético.',
};

/**
 * Lee el orden de la URL. Si no vino ninguno, o vino uno que no existe, se usa el
 * alfabético: la URL la escribe cualquiera y no puede romper la página.
 */
function readSort(raw: string | null): SongSort {
  const sorts: SongSort[] = ['rating', 'reviews', 'trending', 'recent', 'title'];
  return sorts.find((sort) => sort === raw) ?? 'title';
}

/** Lee un año de la URL, o null si no vino o no es un número. */
function readYear(raw: string | null): number | null {
  if (raw === null) return null;
  const year = Number(raw);
  return Number.isInteger(year) ? year : null;
}

/** Cómo se titula un rango de años. Es el año del ÁLBUM de cada canción. */
function buildYearTitle(from: number | null, to: number | null): string | null {
  if (from === null && to === null) return null;
  if (from !== null && to !== null) {
    if (to >= MAX_RELEASE_YEAR) return `Canciones de ${from} en adelante`;
    if (from <= MIN_RELEASE_YEAR) return `Canciones hasta ${to}`;
    return `Canciones de ${from} a ${to}`;
  }

  return from !== null ? `Canciones de ${from} en adelante` : `Canciones hasta ${to}`;
}

export const SongsExplorePage = () => {
  const [searchParams] = useSearchParams();

  const sort = readSort(searchParams.get('sort'));
  const yearFrom = readYear(searchParams.get('year_from'));
  const yearTo = readYear(searchParams.get('year_to'));

  const yearTitle = buildYearTitle(yearFrom, yearTo);

  return (
    <>
      <Navbar />

      <ExploreListing
        eyebrow="Canciones"
        title={yearTitle ?? SORT_TITLES[sort]}
        subtitle={
          yearTitle
            ? 'Todas las canciones de los álbumes lanzados en ese período.'
            : SORT_SUBTITLES[sort]
        }
        // La clave junta todo lo que sale de la URL: si cambia cualquier cosa, el
        // listado se reinicia desde la primera tanda.
        queryKey={`${sort}|${yearFrom}|${yearTo}`}
        fetchPage={async (offset, limit) => {
          const songs = await songService.explore({
            sort,
            limit,
            offset,
            yearFrom: yearFrom ?? undefined,
            yearTo: yearTo ?? undefined,
          });
          return songs.map(songToExploreItem);
        }}
        footer={<BackLink fallbackTo="/music" />}
      />

      <Footer />
    </>
  );
};
