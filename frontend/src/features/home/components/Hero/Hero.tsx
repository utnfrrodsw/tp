// Sección principal (Hero) de la página de inicio con el mensaje de bienvenida y botones de acción.
import { Link } from 'react-router-dom';
import { useAuth } from '../../../../core/context/AuthContext';
import { useAuthModal } from '../../../../core/context/AuthModalContext';
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

      {/* Portadas flotando de fondo. Son imágenes fijas de public/ y no del
          catálogo: es decoración elegida a mano, y con la API el fondo
          cambiaría según qué álbumes tengan más reseñas. */}
      <div className="hero__floating-albums">
        <img src="/images/abbey-road.jpg" alt="Abbey Road" className="floating-album floating-album--1" />
        <img src="/images/ahi-vamos.jpg" alt="Ahi Vamos" className="floating-album floating-album--2" />
        <img src="/images/audioslave.jpeg" alt="Audioslave" className="floating-album floating-album--3" />
        <img src="/images/frank-sinatra.webp" alt="Frank Sinatra" className="floating-album floating-album--4" />
        <img src="/images/oktubre.jpg" alt="Oktubre" className="floating-album floating-album--5" />
        <img src="/images/wish-you-where-here.jpeg" alt="Wish You Were Here" className="floating-album floating-album--6" />
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
