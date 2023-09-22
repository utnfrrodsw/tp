import React, { useState } from "react";
import { NavLink } from "../../navlink/Navlink.jsx";
import { NuevaSolicitud } from "../nuevaSolicitud/NuevaSolicitud.jsx";
import Solicitud from "../solicitud/Solicitud.jsx";
import "./solicitudes.css";

function Solicitudes(props) {

    const solicitudes = [
        { nombre: 'Electricista', estado: 'pendiente', precio: 0 },
        { nombre: 'Plomero', estado: 'presupuestado', precio: 50 },
        { nombre: 'Carpintero', estado: 'pendiente', precio: 0 },
        { nombre: 'Pintor', estado: 'presupuestado', precio: 40 },
        // Esto lo saco de la base de datos
      ];
    
    const solicitudesPorPagina = 3;
    const [paginaActual, setPaginaActual] = useState(1);
    const totalPaginas = Math.ceil(solicitudes.length / solicitudesPorPagina);

    const indiceInicio = (paginaActual - 1) * solicitudesPorPagina;
    const SolicitudesPagina = solicitudes.slice(indiceInicio, indiceInicio + solicitudesPorPagina);

    const irAtras = () => {
        if (paginaActual > 1) {
        setPaginaActual(paginaActual - 1);
        }
    };

    const irAdelante = () => {
        if (paginaActual < totalPaginas) {
        setPaginaActual(paginaActual + 1);
        }
    };

    return (
        <div className="solicitudes-container">

            <nav className="navigation">
                <ul>
                    <li>
                        <NavLink to="/client/home/requests" className="link">Solicitudes</NavLink>
                    </li>
                    <li>
                        <NavLink to="/client/home/progress" className="link">En Progreso</NavLink>
                    </li>
                    <li>
                        <NavLink to="/client/home/finished" className="link">Terminados</NavLink>
                    </li>    
                </ul>
            </nav>

            <div>
                {SolicitudesPagina.map((especialidad, index) => (
                <Solicitud 
                    key={index} 
                    nombre={especialidad.nombre}
                    estado={especialidad.estado}
                    precio={especialidad.precio}
                />
                ))}
            </div>
            <div className="pagination">
                <button onClick={irAtras} disabled={paginaActual === 1}>Atrás</button>
                <span>{paginaActual} / {totalPaginas}</span>
                <button onClick={irAdelante} disabled={paginaActual === totalPaginas}>Adelante</button>
            </div>
            <NuevaSolicitud/>
        </div>
        
    )

}

export default Solicitudes;