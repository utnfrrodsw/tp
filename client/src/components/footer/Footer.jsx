import React from 'react';
import './footer.css'; // Asegúrate de que el archivo CSS esté en la misma ubicación

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="copyright">© 2023 FastServices. Todos los derechos reservados.</p>
        <div className="social-icons">
          {/* Agrega aquí tus iconos de redes sociales */}
        </div>
      </div>
    </footer>
  );
}

export default Footer;