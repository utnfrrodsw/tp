 import React from 'react';
import { Link } from 'react-router-dom';
import './inicioPrestador.css';
import logo from "./logo.png";

function InicioPrestador() {

const user = JSON.parse(localStorage.getItem('user'));
    return (
        <div className="page">
            <div className='header-home-prestador'>
                <div>
                    <div className="logo-content2">
                        <Link to = "/client/home"><img src={logo} alt="No disp" className="logo2"/></Link>
                    </div>
                    <section>
                        <h1>Bienvenido a FastServices, { user.nombre }</h1>
                        <p>
                        Tu lugar para encontrar trabajos de manera rápida y eficiente. <br/>
                        Encuentra presonas buscando expertos en electricidad, plomería, reparaciones y más. <br/>
                        </p>
                    </section>
                    
                </div>
 
            </div>
            
            <div className='blocks'>
                <div className="block">
                    <h2>Anuncios</h2>
                    <Link to='/provider/home/add'>Ver más</Link>
                </div>
                <div className="block">
                    <h2>Presupuestados</h2>
                    <Link to='/provider/home/budgeted'>Ver más</Link>
                </div>
                <div className="block">
                    <h2>Aceptadas</h2>
                    <Link to="/provider/home/accepted">Ver más</Link>
                </div>
            </div>
        </div>
    );
}

export default InicioPrestador;