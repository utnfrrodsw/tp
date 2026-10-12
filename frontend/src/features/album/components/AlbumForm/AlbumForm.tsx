// Formulario de alta y edición de un álbum (título, año, portada, artista y
// géneros). Es controlado y no guarda nada: delega el submit al padre, igual que
// ArtistForm en la feature artist.
//
// Lo único que hace por su cuenta es traer las dos listas que necesitan sus
// campos: los artistas para el desplegable y los géneros para las casillas. Se
// piden acá y no en cada pantalla porque el mismo formulario se usa para proponer
// desde el perfil y para cargar desde el panel de administración.
//
// Los servicios de artist y genre se usan solo para LEER, que es lo que necesita
// este formulario: el álbum no crea artistas ni géneros, los vincula.
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Alert } from '../../../../core/components/Alert';
import { Button } from '../../../../core/components/Button';
import { FormField, NumberInput, TextInput } from '../../../../core/components/FormField';
import { Loader } from '../../../../core/components/Loader';
import { Select } from '../../../../core/components/Select';
import type { SelectOption } from '../../../../core/components/Select';
import { useFetch } from '../../../../core/hooks/useFetch';
import {
  fieldErrorProps,
  hasErrors,
  isIntegerBetween,
  isUrl,
  maxLength,
  required,
  validateField,
} from '../../../../core/utils/validators';
import type { FieldErrors } from '../../../../core/utils/validators';
import { artistService } from '../../../artist/services/artistService';
import { genreService } from '../../../genre/services/genreService';
import { MAX_RELEASE_YEAR, MIN_RELEASE_YEAR } from '../../models/Album';
import type { AlbumInput } from '../../services/albumService';
import './AlbumForm.scss';

type AlbumFormProps = {
  /**
   * Valores con los que arranca el formulario. En un alta va vacío; en una edición
   * son los del álbum que se está modificando.
   *
   * Se leen una sola vez, al montar: el padre remonta el formulario con una `key`
   * distinta cuando cambia de álbum (ver AlbumAdminSection), así no hace falta
   * sincronizar el estado con las props.
   */
  initialValues?: AlbumInput;
  isSubmitting: boolean;
  submitLabel?: string;
  /** Devuelve true si la operación salió bien; con eso el alta limpia los campos. */
  onSubmit: (input: AlbumInput) => Promise<boolean>;
  /** Si se pasa, se muestra un botón para salir sin guardar (se usa al editar). */
  onCancel?: () => void;
};

/** Un álbum sin artista todavía elegido. 0 nunca es un id real. */
const NO_ARTIST = 0;

const EMPTY_FORM: AlbumInput = {
  title: '',
  release_year: '',
  url_cover: '',
  id_artist: NO_ARTIST,
  genre_ids: [],
};

type AlbumField = 'title' | 'id_artist' | 'release_year' | 'url_cover';

/**
 * Valida el álbum con las mismas reglas que album.schema.ts del backend. Los
 * géneros no se validan: son casillas y cualquier combinación es válida.
 */
function validateAlbumForm(form: AlbumInput): FieldErrors<AlbumField> {
  return {
    title: validateField(form.title, [
      required('El título del álbum no puede estar vacío.'),
      maxLength(200, 'El título del álbum no puede tener más de 200 caracteres.'),
    ]),
    id_artist: form.id_artist === NO_ARTIST ? 'Hay que elegir el artista del álbum.' : undefined,
    release_year: validateField(form.release_year ?? '', [
      isIntegerBetween(
        MIN_RELEASE_YEAR,
        MAX_RELEASE_YEAR,
        `El año de lanzamiento tiene que estar entre ${MIN_RELEASE_YEAR} y ${MAX_RELEASE_YEAR}.`
      ),
    ]),
    url_cover: validateField(form.url_cover ?? '', [
      maxLength(500, 'La URL de la portada no puede tener más de 500 caracteres.'),
      isUrl('La URL de la portada no es válida.'),
    ]),
  };
}

export const AlbumForm = ({
  initialValues,
  isSubmitting,
  submitLabel = 'Guardar álbum',
  onSubmit,
  onCancel,
}: AlbumFormProps) => {
  const isEditing = initialValues !== undefined;

  const [form, setForm] = useState<AlbumInput>({
    title: initialValues?.title ?? '',
    release_year: initialValues?.release_year ?? '',
    url_cover: initialValues?.url_cover ?? '',
    id_artist: initialValues?.id_artist ?? NO_ARTIST,
    genre_ids: initialValues?.genre_ids ?? [],
  });

  // Las dos listas son independientes entre sí, así que salen juntas en vez de
  // una después de la otra.
  const { data, isLoading, error } = useFetch(async () => {
    const [artists, genres] = await Promise.all([artistService.list(), genreService.list()]);
    return { artists, genres };
  });

  // Los rechazados no se ofrecen: dejaron de formar parte del catálogo. A un PRO
  // la API le devuelve solo los aprobados, así que este filtro solo cambia algo
  // para un ADMIN, que los ve todos.
  const artistOptions: SelectOption<number>[] = (data?.artists ?? [])
    .filter((artist) => artist.state !== 'rejected')
    .map((artist) => ({ value: artist.id, label: artist.name }));

  // Errores visibles recién después del primer intento de guardar; desde ahí se
  // recalculan en cada cambio (criterio común a todos los formularios).
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const errors: FieldErrors<AlbumField> = wasSubmitted ? validateAlbumForm(form) : {};

  const genres = data?.genres ?? [];
  const selectedGenres = form.genre_ids ?? [];

  /** Marca o desmarca un género. La lista que viaja reemplaza a la anterior. */
  const handleToggleGenre = (id: number) => {
    setForm((current) => {
      const currentIds = current.genre_ids ?? [];
      return {
        ...current,
        genre_ids: currentIds.includes(id)
          ? currentIds.filter((genreId) => genreId !== id)
          : [...currentIds, id],
      };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setWasSubmitted(true);
    if (hasErrors(validateAlbumForm(form))) return;

    const succeeded = await onSubmit(form);
    // En una edición los campos quedan como están porque siguen siendo los datos
    // del álbum; en un alta se vacían para poder cargar el siguiente.
    if (succeeded && !isEditing) {
      setForm(EMPTY_FORM);
      setWasSubmitted(false);
    }
  };

  if (isLoading) return <Loader message="Cargando artistas y géneros..." />;

  // Sin las dos listas no se puede completar el formulario: el artista es
  // obligatorio y no hay de dónde elegirlo.
  if (error) return <Alert tone="error">{error}</Alert>;

  return (
    <form className="album-form" onSubmit={handleSubmit} noValidate>
      <FormField id="album-title" label="Título" error={errors.title}>
        <TextInput
          id="album-title"
          type="text"
          placeholder="Nevermind, OK Computer, Clics Modernos..."
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          {...fieldErrorProps('album-title', errors.title)}
        />
      </FormField>

      {/* Es un <span> y no un <label>: el desplegable propio es un botón, y un
          label envolviéndolo no lo describiría como sí lo hace su aria-label. */}
      <div className="form-field">
        <span className="form-field__label" id="album-artist-label">
          Artista
        </span>
        {/* searchable: son casi noventa artistas, y bajar hasta el que se busca
            a mano es impracticable. */}
        <Select
          options={artistOptions}
          value={form.id_artist}
          onChange={(id_artist) => setForm({ ...form, id_artist })}
          placeholder="Elegí un artista"
          ariaLabel="Artista del álbum"
          searchable
          searchPlaceholder="Buscar un artista..."
          fullWidth
        />
        {/* Mismo aspecto que el error de FormField. Antes, sin artista, el botón de
            guardar quedaba deshabilitado sin decir por qué. */}
        {errors.id_artist && <p className="form-field__error">{errors.id_artist}</p>}
      </div>

      <div className="album-form__row">
        <FormField
          id="album-year"
          label="Año de lanzamiento"
          hint="(opcional)"
          error={errors.release_year}
        >
          <NumberInput
            id="album-year"
            placeholder="1991"
            value={form.release_year ?? ''}
            onValueChange={(release_year) => setForm({ ...form, release_year })}
            {...fieldErrorProps('album-year', errors.release_year)}
          />
        </FormField>

        <FormField
          id="album-cover"
          label="URL de la portada"
          hint="(opcional)"
          error={errors.url_cover}
        >
          {/* type="text" + inputMode: type="url" trae la validación del navegador. */}
          <TextInput
            id="album-cover"
            type="text"
            inputMode="url"
            placeholder="https://..."
            value={form.url_cover}
            onChange={(e) => setForm({ ...form, url_cover: e.target.value })}
            {...fieldErrorProps('album-cover', errors.url_cover)}
          />
        </FormField>
      </div>

      {/* Los géneros son once y no son excluyentes: un álbum puede tener varios.
          Van como casillas y no como un desplegable múltiple, que en un sitio
          oscuro dibuja el panel del sistema operativo (mismo motivo por el que
          existe el Select propio). */}
      <fieldset className="album-form__genres">
        <legend className="form-field__label">
          Géneros
          <span className="form-field__hint">(opcional)</span>
        </legend>

        <div className="album-form__genre-list">
          {genres.map((genre) => (
            <label key={genre.id} className="album-form__genre">
              <input
                type="checkbox"
                checked={selectedGenres.includes(genre.id)}
                onChange={() => handleToggleGenre(genre.id)}
              />
              {genre.name}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="album-form__actions">
        {onCancel && (
          <Button variant="subtle" disabled={isSubmitting} onClick={onCancel}>
            Cancelar
          </Button>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : submitLabel}
        </Button>
      </div>
    </form>
  );
};
