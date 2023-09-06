import React from 'react';
import './InicioCliente.css';
import { Link } from 'react-router-dom';
import logo from "./logo.png"


function InicioCliente() {

    return (
        <div className="page">
            <div className='header-home-client'>
                <div>
                    <div className="logo-content2">
                        <Link to = "/client/home"><img src={logo} alt="No disp" className="logo2"/></Link>
                    </div>
                    <h1>Bienvenidos a FastServices</h1>
                </div>
                <p>
                Tu lugar para solicitar servicios para tu hogar de manera rápida y eficiente. 
                Encuentra expertos en electricidad, plomería, reparaciones y más. 
                Obtén presupuestos personalizados y elige el mejor servicio para tus necesidades.</p>
            </div>
            
            <div className='blocks'>
                <div className="block">
                    <h2>Mis Solicitudes</h2>
                    <Link to="requests">Ver más</Link>
                </div>
                <div className="block">
                    <h2>Servicios en Progreso</h2>
                    <Link to="progress">Ver más</Link>
                </div>
                <div className="block">
                    <h2>Servicios Terminados</h2>
                    <Link to="finished">Ver más</Link>
                </div>
            </div>
        </div>
    );
}

export default InicioCliente;