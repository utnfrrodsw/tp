// Sección de la página de inicio que muestra los álbumes más reseñados del
// catálogo.
//
// Es el mismo criterio que la sección "Más Reseñados" del explorador (/music):
// ordena por cantidad de reseñas, que es lo que Musicboxd puede medir de verdad
// (no hay reproducciones en el modelo). Mientras no exista el CRUD de reseñas
// todas empatan en cero y desempata el orden alfabético.
//
// Las tarjetas son GatedLink, igual que en el explorador: la portada y el título
// se ven sin cuenta —es la vitrina de la página de inicio— pero el click solo
// entra a la ficha si hay sesión; si no, abre el modal de registro.
import { Loader } from '../../../../core/components/Loader';
import { GatedLink } from '../../../../core/components/GatedLink';
import { useFetch } from '../../../../core/hooks/useFetch';
import { AlbumCover } from '../../../genre/components/AlbumCover';
import { albumService } from '../../../album/services/albumService';
import './PopularAlbums.scss';

/** Cuántas tarjetas entran en la fila del diseño. */
const SECTION_SIZE = 7;

export const PopularAlbums = () => {
  const { data, isLoading, error } = useFetch(() =>
    albumService.explore({ sort: 'reviews', limit: SECTION_SIZE })
  );

  const albums = data ?? [];

  return (
    <section className="popular-albums">
      <div className="popular-albums__container">
        <h2 className="popular-albums__title">Más Reseñados</h2>

        {isLoading ? (
          <Loader message="Cargando álbumes..." />
        ) : error ? (
          // En la página de inicio un error no puede ser un cartel rojo enorme:
          // es una sección decorativa, así que se avisa en una línea y ya.
          <p className="popular-albums__empty" role="alert">
            No pudimos cargar los álbumes en este momento.
          </p>
        ) : albums.length === 0 ? (
          <p className="popular-albums__empty">Todavía no hay álbumes en el catálogo.</p>
        ) : (
          <div className="popular-albums__grid">
            {albums.map((album) => (
              <GatedLink key={album.id} to={`/albums/${album.id}`} className="popular-album-card">
                <div className="popular-album-card__cover">
                  {/* AlbumCover dibuja un degradado con la inicial cuando el
                      álbum no tiene portada cargada. */}
                  <AlbumCover title={album.title} url={album.urlCover} size="lg" />
                </div>
                <div className="popular-album-card__info">
                  <h3 className="popular-album-card__title">{album.title}</h3>
                  <p className="popular-album-card__artist">{album.artistName}</p>
                </div>
              </GatedLink>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
