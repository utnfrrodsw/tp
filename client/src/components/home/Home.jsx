import React from 'react';
import { Link } from 'react-router-dom';
import './home.css'; // Asegúrate de que el archivo CSS esté correctamente importado

function Home() {
  return (
    <section className='fondoHome'>
      <div className='home-container'>
        <header className="header">
          <h1>BIENVENIDO A FASTSERVICES</h1>
          <p>Tu plataforma para solicitar servicios de manera rápida y sencilla.</p>
          <section className="cta-section">
            <Link to="/login" className="cta-button">Ingresá</Link>
            <Link to="/register" className="cta-button">Creá tu cuenta</Link>
          </section>
        </header>

        <section className="features">
          <div className="feature">
            <div className="feature-box">
              <h2>SERVICIOS VARIADOS</h2>
              <p>Encuentra una amplia gama de servicios disponibles para tus necesidades.</p>
            </div>
          </div>
          <div className="feature">
            <div className="feature-box">
              <h2>PEDIDOS FÁCILES</h2>
              <p>Realiza múltiples pedidos de servicios en pocos pasos, sin complicaciones.</p>
            </div>
          </div>
          <div className="feature">
            <div className="feature-box">
              <h2>PROFESIONALES CALIFICADOS</h2>
              <p>Trabajamos con los mejores profesionales para brindarte un excelente servicio.</p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

export default Home;
