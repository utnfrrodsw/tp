 
import React from 'react';
import { Link } from 'react-router-dom';
import './InicioCliente.css';
import logo from "./logo.png";


function InicioCliente() {

    const user = JSON.parse(localStorage.getItem('user'));


    return (
        <div className="page">
            <div className='header-home-client'>
                <div>
                    <div className="logo-content2">
                        <Link to = "/client/home"><img src={logo} alt="No disp" className="logo2"/></Link>
                    </div>
                    <section>
                        <h1>Bienvenido a FastServices { user.nombre }</h1>
                        <p>
                        Tu lugar para solicitar servicios para tu hogar de manera rápida y eficiente. <br/>
                        Encuentra expertos en electricidad, plomería, reparaciones y más. <br/>
                        Obtén presupuestos personalizados y elige el mejor servicio para tus necesidades.</p>
                    </section>
                    
                </div>
 
            </div>
            
            <div className='blocks'>
                <div className="block">
                    <h2>Mis Solicitudes</h2>
                    <Link to="/client/home/active">Ver más</Link>
                </div>
                <div className="block">
                    <h2>Servicios en Progreso</h2>
                    <Link to="/client/home/progress">Ver más</Link>
                </div>
                <div className="block">
                    <h2>Servicios Terminados</h2>
                    <Link to="/client/home/active">Ver más</Link>
                </div>
            </div>
        </div>
    );
}

export default InicioCliente;