// Canciones que aportó un usuario, en la pestaña "Aportes" de su perfil.
//
// Es también uno de los lugares donde un usuario propone una canción nueva: el
// botón abre un modal con el formulario y manda la propuesta sin salir del perfil.
//
// En el perfil propio se ven también las pendientes y las rechazadas (por eso
// cada card muestra su estado): el que las cargó necesita saber en qué quedaron.
// En el perfil de otro usuario se pide solo lo aprobado (un admin recibiría todo).
//
// OJO, no confundir con la pestaña "Canciones calificadas": esa lista las que el
// usuario reseñó, y depende de la feature review. Esta lista las que cargó.
import { Music } from 'lucide-react';
import { Alert } from '../../../../core/components/Alert';
import { Button } from '../../../../core/components/Button';
import { ShowMore } from '../../../../core/components/ShowMore';
import { useShowMore } from '../../../../core/hooks/useShowMore';
import { Loader } from '../../../../core/components/Loader';
import { EmptyState } from '../../../../core/components/EmptyState';
import { ConfirmDialog } from '../../../../core/components/Modal';
import { useFetch } from '../../../../core/hooks/useFetch';
import { useContributions } from '../../../../core/hooks/useContributions';
import { songService } from '../../services/songService';
import type { SongInput } from '../../services/songService';
import type { Song } from '../../models/Song';
import { SongCard } from '../SongCard';
import { MAX_PENDING_PROPOSALS } from '../../../../core/utils/catalogRules';
import { SongProposalModal } from '../SongProposalModal';
import './SongContributionsList.scss';

type SongContributionsListProps = {
  /** Dueño del perfil que se está mirando. */
  userId: number;
  username: string;
  /** true si el perfil es del usuario logueado: solo él puede proponer acá. */
  isOwnProfile: boolean;
};

// Cuántos aportes se ven de entrada y cuántos suma cada "Ver más". Mismo
// criterio que ArtistContributionsList, su hermana.
const PAGE_SIZE = 12;

export const SongContributionsList = ({
  userId,
  username,
  isOwnProfile,
}: SongContributionsListProps) => {
  const {
    data,
    isLoading,
    error,
    reload: loadContributions,
  } = useFetch(
    // En el perfil de otro se pide solo lo aprobado: la API le devuelve todos los
    // estados a un admin, y mostrarle a cualquiera los pendientes o rechazados de
    // otra persona confunde (eso se modera en el panel de administración).
    () => songService.list({ createdBy: userId, state: isOwnProfile ? undefined : 'approved' }),
    userId
  );
  const songs = data ?? [];

  // Solo importa en el perfil propio: es el único lugar donde se puede proponer.
  // Las aprobadas y las rechazadas ya se resolvieron, no cuentan para el tope.
  const pendingCount = songs.filter((song) => song.isPending).length;
  const hasReachedPendingLimit = isOwnProfile && pendingCount >= MAX_PENDING_PROPOSALS;

  // Proponer, corregir y dar de baja: lo mismo en artistas, álbumes y canciones,
  // así que vive en el hook compartido. Acá se renombra a lo que usa el JSX.
  const {
    feedback,
    actionError,
    isModalOpen,
    isSubmitting,
    submitError,
    editing,
    toDelete,
    setToDelete,
    busyId,
    openModal: handleOpenModal,
    closeModal,
    submit: handleSubmit,
    confirmDelete: handleConfirmDelete,
  } = useContributions<Song, SongInput>({
    service: songService,
    reload: loadContributions,
    getName: (song) => song.title,
  });

  // Cuántos aportes se muestran (paginado del lado del cliente). No hace falta
  // resetearlo: ProfileTabContent remonta este componente al cambiar de pestaña
  // (Artistas/Álbumes/Canciones son tres componentes distintos), así que arranca
  // de nuevo solo.
  const { visibleItems: visibleSongs, hasMore, showMore } = useShowMore(songs, PAGE_SIZE);

  /** Elige qué mostrar en el cuerpo: la carga, el error, el vacío o la lista. */
  const renderBody = () => {
    if (isLoading) return <Loader message="Cargando canciones aportadas..." />;

    if (error) return <Alert tone="error">{error}</Alert>;

    if (songs.length === 0) {
      return (
        <EmptyState
          icon={<Music size={22} />}
          title={
            isOwnProfile
              ? 'Todavía no propusiste ninguna canción.'
              : `${username} no tiene canciones aportadas.`
          }
          message={
            isOwnProfile
              ? 'Si falta una pista en el tracklist de un álbum, proponela: tu aporte queda pendiente hasta que un administrador lo apruebe.'
              : 'Las canciones que aporte van a listarse acá una vez aprobadas.'
          }
          action={
            isOwnProfile ? (
              <Button onClick={() => handleOpenModal(null)}>Proponer una canción</Button>
            ) : undefined
          }
        />
      );
    }


    return (
      <>
        <div className="song-contributions__head">
          <h3 className="song-contributions__title">Canciones ({songs.length})</h3>

          {isOwnProfile && (
            <Button
              onClick={() => handleOpenModal(null)}
              disabled={hasReachedPendingLimit}
              title={
                hasReachedPendingLimit
                  ? `Ya tenés ${MAX_PENDING_PROPOSALS} propuestas de canción esperando revisión.`
                  : undefined
              }
            >
              Proponer otra canción
            </Button>
          )}
        </div>

        {/* Solo se ve al tocar el tope: mientras haya lugar, el botón de arriba
            alcanza y esto sería ruido. */}
        {hasReachedPendingLimit && (
          <Alert tone="warning">
            Ya tenés {MAX_PENDING_PROPOSALS} propuestas de canción esperando revisión. Esperá a
            que un administrador las apruebe o las rechace antes de cargar otra.
          </Alert>
        )}

        {/* Sobre sus propios aportes el autor puede: corregir mientras no estén
            aprobados (un aprobado ya es catálogo y lo edita un ADMIN), y dar de
            baja solo los que siguen pendientes, que es lo que la API permite.
            Un rechazo es una decisión de moderación y no se borra solo. */}
        <ul className="song-contributions__list">
          {visibleSongs.map((song) => (
            <li key={song.id}>
              <SongCard
                song={song}
                showState={isOwnProfile}
                isBusy={busyId === song.id}
                onEdit={isOwnProfile && !song.isApproved ? handleOpenModal : undefined}
                onDelete={isOwnProfile && song.isPending ? setToDelete : undefined}
              />
            </li>
          ))}
        </ul>

        {hasMore && (
          <ShowMore
            shown={visibleSongs.length}
            total={songs.length}
            noun="canciones"
            onShowMore={showMore}
          />
        )}
      </>
    );
  };

  return (
    <div className="song-contributions">
      {feedback && <Alert tone="success">{feedback}</Alert>}
      {actionError && <Alert tone="error">{actionError}</Alert>}

      {renderBody()}

      {isOwnProfile && (
        <>
          {/* El mismo modal sirve para proponer y para corregir: lo que cambia
              son los textos, los valores iniciales y a qué handler se manda. */}
          <SongProposalModal
            isOpen={isModalOpen}
            song={editing}
            isSubmitting={isSubmitting}
            error={submitError}
            onSubmit={handleSubmit}
            onClose={closeModal}
          />

          <ConfirmDialog
            isOpen={toDelete !== null}
            title="Eliminar la propuesta"
            message={
              toDelete
                ? `¿Seguro que querés eliminar tu propuesta "${toDelete.title}"? Todavía no la revisó nadie, así que se borra sin dejar rastro.`
                : ''
            }
            confirmLabel="Eliminar"
            isDestructive
            onConfirm={handleConfirmDelete}
            onCancel={() => setToDelete(null)}
          />
        </>
      )}
    </div>
  );
};
