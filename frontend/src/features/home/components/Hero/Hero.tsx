// Sección principal (Hero) de la página de inicio con el mensaje de bienvenida y botones de acción.
import { Link } from 'react-router-dom';
import { useAuth } from '../../../../core/context/AuthContext';
import { useAuthModal } from '../../../../core/context/AuthModalContext';
import { FloatingCovers } from '../../../album/components/FloatingCovers';
import './Hero.scss';

export const Hero = () => {
  const { openSignup } = useAuthModal();
  const { state: authState } = useAuth();

  // A quien ya entró no se le vuelve a ofrecer registrarse: se le cambia el
  // texto de bienvenida y el botón lo lleva a explorar el catálogo.
  const user = authState.status === 'authenticated' ? authState.user : null;

  return (
    <section className="hero">
      <div className="hero__background"></div>

      {/* Portadas del catálogo flotando de fondo */}
      <div className="hero__floating-albums">
        <FloatingCovers itemClassName="floating-album" />
      </div>

      <div className="hero__content">
        <h1 className="hero__title">
          Reseña tus álbumes favoritos.<br />
          Cataloga la música que escuchas.<br />
          Comparte tu pasión por la música.
        </h1>

        {user ? (
          <>
            <p className="hero__description">
              ¡Qué bueno verte de nuevo, {user.username}! Seguí calificando álbumes y canciones,
              escribí tus reseñas y armá las listas que definen tu gusto musical.
            </p>

            <Link to="/music" className="hero__cta">
              Explorar música
            </Link>
          </>
        ) : (
          <>
            <p className="hero__description">
              Musicboxd es una plataforma social que te permite llevar un registro de toda la
              música que escuchas y hacer crecer tu pasión por la música con amigos. Escribe
              reseñas, califica álbumes y compila listas en la comunidad de mayor crecimiento en la música.
            </p>

            <button onClick={openSignup} className="hero__cta">
              ¡Únete a Musicboxd gratis!
            </button>
          </>
        )}
      </div>
    </section>
  );
};
