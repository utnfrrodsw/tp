// Componente del pie de página (Footer) de la aplicación: los enlaces rápidos y los derechos reservados.
import { Link } from 'react-router-dom';
import './Footer.scss';

// El año del copyright se calcula en vez de escribirse a mano: así no queda
// desactualizado cada enero.
const CURRENT_YEAR = new Date().getFullYear();

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__top">
          <div className="footer__column">
            <h3 className="footer__title">Tablero de música</h3>
            <ul className="footer__list">
              <li><Link to="/" className="footer__link">Inicio</Link></li>
              <li><Link to="/pro" className="footer__link footer__link--pro">Pro</Link></li>
            </ul>
          </div>

          <div className="footer__column">
            <h3 className="footer__title">Legal</h3>
            <ul className="footer__list">
              <li><Link to="/terms" className="footer__link">Condiciones de uso</Link></li>
              <li><Link to="/privacy" className="footer__link">Política de privacidad</Link></li>
            </ul>
          </div>

          <div className="footer__column">
            <h3 className="footer__title">Compañía</h3>
            <ul className="footer__list">
              <li><Link to="/faq" className="footer__link">Preguntas frecuentes</Link></li>
              <li><Link to="/contact" className="footer__link">Contacto</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">© {CURRENT_YEAR} Musicboxd AB. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
