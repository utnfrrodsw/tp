// Álbumes que aportó un usuario, en la pestaña "Aportes" de su perfil.
//
// Es también uno de los lugares donde un usuario propone un álbum nuevo: el botón
// abre un modal con el formulario y manda la propuesta sin salir del perfil.
//
// En el perfil propio se ven también los pendientes y los rechazados (por eso
// cada card muestra su estado): el que los cargó necesita saber en qué quedaron.
// En el perfil de otro usuario se pide solo lo aprobado (un admin recibiría todo).
//
// Vive en la feature album para que el perfil solo tenga que montarla, igual que
// ArtistContributionsList en la feature artist.
import { Disc3 } from 'lucide-react';
import { Alert } from '../../../../core/components/Alert';
import { Button } from '../../../../core/components/Button';
import { ShowMore } from '../../../../core/components/ShowMore';
import { useShowMore } from '../../../../core/hooks/useShowMore';
import { Loader } from '../../../../core/components/Loader';
import { EmptyState } from '../../../../core/components/EmptyState';
import { ConfirmDialog } from '../../../../core/components/Modal';
import { useFetch } from '../../../../core/hooks/useFetch';
import { useContributions } from '../../../../core/hooks/useContributions';
import { albumService } from '../../services/albumService';
import type { AlbumInput } from '../../services/albumService';
import type { Album } from '../../models/Album';
import { AlbumCard } from '../AlbumCard';
import { MAX_PENDING_PROPOSALS } from '../../../../core/utils/catalogRules';
import { AlbumProposalModal } from '../AlbumProposalModal';
import './AlbumContributionsList.scss';

type AlbumContributionsListProps = {
  /** Dueño del perfil que se está mirando. */
  userId: number;
  username: string;
  /** true si el perfil es del usuario logueado: solo él puede proponer acá. */
  isOwnProfile: boolean;
};

// Cuántos aportes se ven de entrada y cuántos suma cada "Ver más". Mismo
// criterio que ArtistContributionsList, su hermana.
const PAGE_SIZE = 12;

export const AlbumContributionsList = ({
  userId,
  username,
  isOwnProfile,
}: AlbumContributionsListProps) => {
  const {
    data,
    isLoading,
    error,
    reload: loadContributions,
  } = useFetch(
    // En el perfil de otro se pide solo lo aprobado: la API le devuelve todos los
    // estados a un admin, y mostrarle a cualquiera los pendientes o rechazados de
    // otra persona confunde (eso se modera en el panel de administración).
    () => albumService.list({ createdBy: userId, state: isOwnProfile ? undefined : 'approved' }),
    userId
  );
  const albums = data ?? [];

  // Solo importa en el perfil propio: es el único lugar donde se puede proponer.
  // Los aprobados y los rechazados ya se resolvieron, no cuentan para el tope.
  const pendingCount = albums.filter((album) => album.isPending).length;
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
  } = useContributions<Album, AlbumInput>({
    service: albumService,
    reload: loadContributions,
    getName: (album) => album.title,
  });

  // Cuántos aportes se muestran (paginado del lado del cliente). No hace falta
  // resetearlo: ProfileTabContent remonta este componente al cambiar de pestaña
  // (Artistas/Álbumes/Canciones son tres componentes distintos), así que arranca
  // de nuevo solo.
  const { visibleItems: visibleAlbums, hasMore, showMore } = useShowMore(albums, PAGE_SIZE);

  /** Elige qué mostrar en el cuerpo: la carga, el error, el vacío o la grilla. */
  const renderBody = () => {
    if (isLoading) return <Loader message="Cargando álbumes aportados..." />;

    if (error) return <Alert tone="error">{error}</Alert>;

    if (albums.length === 0) {
      return (
        <EmptyState
          icon={<Disc3 size={22} />}
          title={
            isOwnProfile
              ? 'Todavía no propusiste ningún álbum.'
              : `${username} no tiene álbumes aportados.`
          }
          message={
            isOwnProfile
              ? 'Si falta un disco en Musicboxd, proponelo: tu aporte queda pendiente hasta que un administrador lo apruebe.'
              : 'Los álbumes que aporte van a listarse acá una vez aprobados.'
          }
          action={
            isOwnProfile ? <Button onClick={() => handleOpenModal(null)}>Proponer un álbum</Button> : undefined
          }
        />
      );
    }


    return (
      <>
        <div className="album-contributions__head">
          <h3 className="album-contributions__title">Álbumes ({albums.length})</h3>

          {isOwnProfile && (
            <Button
              onClick={() => handleOpenModal(null)}
              disabled={hasReachedPendingLimit}
              title={
                hasReachedPendingLimit
                  ? `Ya tenés ${MAX_PENDING_PROPOSALS} propuestas de álbum esperando revisión.`
                  : undefined
              }
            >
              Proponer otro álbum
            </Button>
          )}
        </div>

        {/* Solo se ve al tocar el tope: mientras haya lugar, el botón de arriba
            alcanza y esto sería ruido. */}
        {hasReachedPendingLimit && (
          <Alert tone="warning">
            Ya tenés {MAX_PENDING_PROPOSALS} propuestas de álbum esperando revisión. Esperá a que
            un administrador las apruebe o las rechace antes de cargar otro.
          </Alert>
        )}

        {/* Sobre sus propios aportes el autor puede: corregir mientras no estén
            aprobados (un aprobado ya es catálogo y lo edita un ADMIN), y dar de
            baja solo los que siguen pendientes, que es lo que la API permite.
            Un rechazo es una decisión de moderación y no se borra solo. */}
        <ul className="album-contributions__grid">
          {visibleAlbums.map((album) => (
            <li key={album.id}>
              <AlbumCard
                album={album}
                showState={isOwnProfile}
                isBusy={busyId === album.id}
                onEdit={isOwnProfile && !album.isApproved ? handleOpenModal : undefined}
                onDelete={isOwnProfile && album.isPending ? setToDelete : undefined}
              />
            </li>
          ))}
        </ul>

        {hasMore && (
          <ShowMore
            shown={visibleAlbums.length}
            total={albums.length}
            noun="álbumes"
            onShowMore={showMore}
          />
        )}
      </>
    );
  };

  return (
    <div className="album-contributions">
      {feedback && <Alert tone="success">{feedback}</Alert>}
      {actionError && <Alert tone="error">{actionError}</Alert>}

      {renderBody()}

      {isOwnProfile && (
        <>
          {/* El mismo modal sirve para proponer y para corregir: lo que cambia
              son los textos, los valores iniciales y a qué handler se manda. */}
          <AlbumProposalModal
            isOpen={isModalOpen}
            album={editing}
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
