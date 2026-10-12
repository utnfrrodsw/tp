// Página de una reseña (/reviews/:id): el detalle del listado de reseñas.
//
// Es la ruta a la que llevan el botón "Compartir" y el "Leer más..." de cada
// tarjeta, y es PÚBLICA a propósito: un enlace compartido lo tiene que poder
// abrir alguien sin cuenta, igual que la vitrina /music. La API del detalle
// también es pública (ver optionalAuth en review.routes.ts).
//
// Muestra tres cosas que el listado no puede: el texto completo sin cortar, el
// hilo de comentarios ya desplegado y las otras reseñas del mismo autor y del
// mismo ítem. Y es también la pantalla donde el autor gestiona la suya.
//
// El layout es de dos columnas desde LG, como la ficha de álbum: a la izquierda
// lo que se lee de corrido y a la derecha las acciones, que quedan a la vista sin
// tener que volver a subir después de leer una reseña larga.
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MessageSquareOff } from 'lucide-react';
import { Alert } from '../../../../core/components/Alert';
import { BackLink } from '../../../../core/components/BackLink';
import { Button } from '../../../../core/components/Button';
import { EmptyState } from '../../../../core/components/EmptyState';
import { Footer } from '../../../../core/components/Footer';
import { Loader } from '../../../../core/components/Loader';
import { ConfirmDialog } from '../../../../core/components/Modal';
import { Navbar } from '../../../../core/components/Navbar';
import { useAuth } from '../../../../core/context/AuthContext';
import { useAuthModal } from '../../../../core/context/AuthModalContext';
import { useFetch } from '../../../../core/hooks/useFetch';
import { getErrorMessage } from '../../../../core/utils/errorHandler';
import { RelatedReviews } from '../../components/RelatedReviews';
import { ReviewActionsPanel } from '../../components/ReviewActionsPanel';
import { ReviewArticle } from '../../components/ReviewArticle';
import { ReviewComments } from '../../components/ReviewComments';
import { ReviewDetailHero } from '../../components/ReviewDetailHero';
import { ReviewEditModal } from '../../components/ReviewEditModal';
import { reviewService } from '../../services/reviewService';
import './ReviewDetailPage.scss';

export const ReviewDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const { openSignup } = useAuthModal();

  const currentUser = authState.user;
  const isLogged = currentUser !== null;

  const {
    data: review,
    isLoading,
    error,
    setData,
    setError,
  } = useFetch(() => reviewService.getById(Number(id)), id);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Todas las operaciones de esta pantalla devuelven la reseña ya actualizada, así
  // que se guarda con setData en vez de volver a pedirla: recargar sería una
  // request de más y encima haría parpadear la página.

  const handleToggleLike = async () => {
    if (!review) return;

    try {
      setData(await reviewService.toggleLike(review.id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleToggleVisibility = async () => {
    if (!review) return;

    try {
      setData(
        review.isHidden
          ? await reviewService.restore(review.id)
          : await reviewService.hide(review.id)
      );
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleConfirmDelete = async () => {
    if (!review) return;

    setIsDeleteOpen(false);

    try {
      await reviewService.remove(review.id);
      // La reseña ya no existe, así que esta página tampoco: se vuelve a la ficha
      // del ítem, que es de donde salió y donde se puede escribir otra.
      navigate(review.targetLink);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const renderContent = () => {
    // Mientras no hay cabecera, "Volver" va en el flujo normal arriba del aviso:
    // flotando quedaría encima del texto (ver el bloque del final, donde sí va
    // sobre la cabecera).
    if (isLoading) {
      return (
        <div className="review-detail__state">
          <BackLink fallbackTo="/music" />
          <Loader message="Cargando la reseña..." />
        </div>
      );
    }

    if (error) {
      return (
        <div className="review-detail__state">
          <BackLink fallbackTo="/music" />
          <Alert tone="error">{error}</Alert>
        </div>
      );
    }

    if (!review) {
      return (
        <div className="review-detail__state">
          <BackLink fallbackTo="/music" />
          <EmptyState
            icon={<MessageSquareOff size={22} aria-hidden="true" />}
            title="No encontramos esa reseña."
            message="Puede que su autor la haya borrado, o que el enlace esté mal."
          />
        </div>
      );
    }

    return (
      <>
        {/* Vuelve al lugar del que se vino. Va flotando arriba a la izquierda,
            sobre la cabecera, igual que en la ficha del álbum y en la de la
            canción: en una franja propia entre el navbar y la cabecera se veía
            como una banda cortando la pantalla en dos. */}
        <div className="review-detail__topbar">
          <BackLink fallbackTo="/music" />
        </div>

        <ReviewDetailHero review={review} />

        <div className="review-detail__body">
          <div className="review-detail__main">
            <ReviewArticle review={review} />

            <section className="review-detail__comments">
              <h2 className="review-detail__section-title">Comentarios</h2>

              {/* Ya trae la lista, la caja de texto y el borrado con
                  confirmación, y esconde el formulario si no hay sesión. */}
              <ReviewComments
                reviewId={review.id}
                currentUserId={currentUser?.id ?? null}
                isAdmin={currentUser?.isAdmin ?? false}
                // En una página entera el hilo se muestra grande: el campo de
                // texto ocupa el ancho y el botón va debajo, en vez de la fila
                // apretada que entra dentro de una tarjeta del listado.
                variant="page"
                // El contador vive en la reseña, que en esta pantalla se recarga
                // sola con cada operación: acá no hay ninguno que actualizar.
                onCountChange={() => {}}
              />
            </section>
          </div>

          <div className="review-detail__aside">
            <ReviewActionsPanel
              review={review}
              currentUserId={currentUser?.id ?? null}
              isAdmin={currentUser?.isAdmin ?? false}
              onToggleLike={handleToggleLike}
              onEdit={() => setIsFormOpen(true)}
              onDelete={() => setIsDeleteOpen(true)}
              onToggleVisibility={handleToggleVisibility}
            />

            {/* Sin sesión estos dos bloques no se muestran, aunque la API del
                listado sea pública: quien llegó por un enlace compartido ya leyó
                la reseña, y en vez de seguir navegando sin cuenta ve la
                invitación a registrarse. */}
            {isLogged ? (
              <>
                {review.author && (
                  <RelatedReviews
                    title={`Más reseñas de ${review.authorName}`}
                    filters={{ userId: review.author.id }}
                    fetchKey={`author-${review.author.id}`}
                    excludeId={review.id}
                  />
                )}

                <RelatedReviews
                  title={
                    review.targetKind === 'album'
                      ? 'Más reseñas de este álbum'
                      : 'Más reseñas de esta canción'
                  }
                  filters={{ target: { kind: review.targetKind, id: review.targetId } }}
                  fetchKey={`target-${review.targetKind}-${review.targetId}`}
                  excludeId={review.id}
                />
              </>
            ) : (
              <section className="review-detail__signup">
                <p className="review-detail__signup-text">
                  Creá tu cuenta para ver más reseñas de la comunidad, comentar y calificar
                  tu propia música.
                </p>
                <Button variant="primary" fullWidth onClick={openSignup}>
                  Unirme a Musicboxd
                </Button>
              </section>
            )}
          </div>
        </div>

        <ReviewEditModal
          isOpen={isFormOpen}
          review={review}
          onClose={() => setIsFormOpen(false)}
          onSaved={setData}
        />

        <ConfirmDialog
          isOpen={isDeleteOpen}
          title="Eliminar la reseña"
          message="La reseña se borra definitivamente y el promedio se recalcula sin ella. Después vas a poder escribir una nueva."
          confirmLabel="Eliminar"
          isDestructive
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsDeleteOpen(false)}
        />
      </>
    );
  };

  return (
    <>
      <Navbar />

      {/* La cabecera va a lo ancho de la pantalla, así que el contenedor que
          alinea el contenido con el navbar no envuelve toda la página: lo aplica
          cada bloque por su cuenta (ver page-container en los estilos). */}
      {/* El "Volver" lo pone cada rama de renderContent: sobre la cabecera cuando
          la reseña cargó, y en el flujo normal cuando lo que hay es un aviso. El
          fallback es /music porque a esta página se puede llegar desde un enlace
          pegado, sin historial. */}
      <main className="review-detail">{renderContent()}</main>

      <Footer />
    </>
  );
};
