// Listado de álbumes del catálogo (/albums).
//
// Es a donde llevan los "Ver todos" de las secciones de álbumes de /music y las
// tarjetas de "Explorar por Década". Qué se lista lo dice la URL, con los mismos
// nombres de parámetros que entiende la API:
//
//   /albums?sort=rating              los mejor calificados
//   /albums?sort=year                los últimos lanzamientos
//   /albums?year_from=1990&year_to=1999   una década
//   /albums?id_genre=2               los de un género
//
// La ruta pide sesión (ver App.tsx), igual que las fichas: la vitrina pública es
// /music. La API que consume sí es abierta y devuelve solo el catálogo aprobado.
import { useSearchParams } from 'react-router-dom';
import { BackLink } from '../../../../core/components/BackLink';
import { Navbar } from '../../../../core/components/Navbar';
import { Footer } from '../../../../core/components/Footer';
import { ExploreListing } from '../../../music/components/ExploreListing';
import { albumToExploreItem } from '../../../music/models/ExploreItem';
import { albumService } from '../../services/albumService';
import { MAX_RELEASE_YEAR, MIN_RELEASE_YEAR } from '../../models/Album';
import type { AlbumSort } from '../../models/Album';

/** Cómo se titula cada criterio de orden. */
const SORT_TITLES: Record<AlbumSort, string> = {
  rating: 'Mejores calificados',
  reviews: 'Más reseñados',
  trending: 'Tendencia ahora',
  recent: 'Últimos agregados',
  year: 'Nuevos lanzamientos',
  title: 'Todos los álbumes',
};

/** Qué explica cada criterio, para el subtítulo. */
const SORT_SUBTITLES: Record<AlbumSort, string> = {
  rating: 'Ordenados por la calificación promedio que les puso la comunidad.',
  reviews: 'Ordenados por cuántas reseñas recibieron en total.',
  trending: 'Los que más reseñas sumaron en los últimos días.',
  recent: 'Los últimos álbumes que se sumaron al catálogo de Musicboxd.',
  year: 'Del año de lanzamiento más nuevo al más viejo.',
  title: 'Todo el catálogo, en orden alfabético.',
};

/**
 * Lee el orden de la URL. Si no vino ninguno, o vino uno que no existe, se usa el
 * alfabético: la URL la escribe cualquiera y no puede romper la página.
 */
function readSort(raw: string | null): AlbumSort {
  const sorts: AlbumSort[] = ['rating', 'reviews', 'trending', 'recent', 'year', 'title'];
  return sorts.find((sort) => sort === raw) ?? 'title';
}

/** Lee un año de la URL, o null si no vino o no es un número. */
function readYear(raw: string | null): number | null {
  if (raw === null) return null;
  const year = Number(raw);
  return Number.isInteger(year) ? year : null;
}

/**
 * Cómo se titula un rango de años.
 *
 * La década más nueva llega hasta 2100, que es el tope que admite la entidad y no
 * un año real: ahí se dice "en adelante". Y el grupo más viejo arranca en 1900,
 * que es el piso: ahí se dice "hasta".
 */
function buildYearTitle(from: number | null, to: number | null): string | null {
  if (from === null && to === null) return null;
  if (from !== null && to !== null) {
    if (to >= MAX_RELEASE_YEAR) return `Álbumes de ${from} en adelante`;
    if (from <= MIN_RELEASE_YEAR) return `Álbumes hasta ${to}`;
    return `Álbumes de ${from} a ${to}`;
  }

  return from !== null ? `Álbumes de ${from} en adelante` : `Álbumes hasta ${to}`;
}

export const AlbumsExplorePage = () => {
  const [searchParams] = useSearchParams();

  const sort = readSort(searchParams.get('sort'));
  const yearFrom = readYear(searchParams.get('year_from'));
  const yearTo = readYear(searchParams.get('year_to'));
  const idGenre = readYear(searchParams.get('id_genre'));

  // Un rango de años manda sobre el orden a la hora de titular: lo que define a
  // la página es la década, y el orden es solo cómo se acomodan adentro.
  const yearTitle = buildYearTitle(yearFrom, yearTo);

  return (
    <>
      <Navbar />

      <ExploreListing
        eyebrow="Álbumes"
        title={yearTitle ?? SORT_TITLES[sort]}
        subtitle={
          yearTitle
            ? 'Todos los álbumes del catálogo lanzados en ese período.'
            : SORT_SUBTITLES[sort]
        }
        // La clave junta todo lo que sale de la URL: si cambia cualquier cosa, el
        // listado se reinicia desde la primera tanda.
        queryKey={`${sort}|${yearFrom}|${yearTo}|${idGenre}`}
        fetchPage={async (offset, limit) => {
          const albums = await albumService.explore({
            sort,
            limit,
            offset,
            yearFrom: yearFrom ?? undefined,
            yearTo: yearTo ?? undefined,
            idGenre: idGenre ?? undefined,
          });
          return albums.map(albumToExploreItem);
        }}
        footer={<BackLink fallbackTo="/music" />}
      />

      <Footer />
    </>
  );
};
