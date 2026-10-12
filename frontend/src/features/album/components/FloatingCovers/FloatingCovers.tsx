// Portadas decorativas que flotan de fondo en el Hero de la home y en el de /pro.
// Salen del catálogo real (los álbumes más reseñados), no de imágenes fijas: así
// el fondo muestra lo que de verdad hay en Musicboxd.
import { useFetch } from '../../../../core/hooks/useFetch';
import { albumService } from '../../services/albumService';

/** Cuántas portadas entran en el diseño de los dos fondos. */
const COVERS_COUNT = 6;

type FloatingCoversProps = {
  /**
   * Clase BEM base de cada imagen ("floating-album", "pro-hero__bg-album"). Se le
   * suma el modificador --1 a --6, que es lo que ubica a cada una en su lugar.
   */
  itemClassName: string;
};

export const FloatingCovers = ({ itemClassName }: FloatingCoversProps) => {
  const { data } = useFetch(() => albumService.explore({ sort: 'reviews', limit: COVERS_COUNT }));

  // Es pura decoración: mientras carga, si falla o si el álbum no tiene portada,
  // simplemente no se dibuja nada en vez de mostrar un cartel o un hueco.
  const covers = (data ?? []).filter((album) => album.urlCover);

  return (
    <>
      {covers.map((album, index) => (
        <img
          key={album.id}
          src={album.urlCover as string}
          alt=""
          className={`${itemClassName} ${itemClassName}--${index + 1}`}
        />
      ))}
    </>
  );
};
