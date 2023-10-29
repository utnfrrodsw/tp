import React, { useEffect, useState } from "react";
import { NavLink } from "../../navlink/Navlink.jsx";
import { NuevaSolicitud } from "../nuevaSolicitud/NuevaSolicitud.jsx";
import Solicitud from "../solicitud/Solicitud.jsx";
import "./solicitudes.css";
import { API_URL } from "../../../auth/constants.js";
import LoaderFijo from "../../load/loaderFijo/LoaderFijo.jsx";


function Solicitudes(props) {

    const [solicitudes, setSolicitudes] = useState([]);
    const [solicitudesUpdate, setSolicitudesUpdate] = useState(false);
    const [load, setLoad] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    
    // eslint-disable-next-line
    useEffect(() => {
        setLoad(true);
        fetch(`${API_URL}/solicitud/${props.estado}/cliente/${user.id}`)
          .then((res) => res.json())
          .then((data) => {
            setSolicitudes(data.body.solicitudes);
            setSolicitudesUpdate(false); // Mover esta línea aquí
            setLoad(false);
          })
          .catch((error) => {
            setLoad(false);
            console.log(error)
            console.error('Error al cargar solicitudes:', error);
          });
    }, [solicitudesUpdate, props.estado ,user.id]);
      
    // pagination
    const [paginaActual, setPaginaActual] = useState(1);
    const solicitudesPorPagina = 3;
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

    const hendleSolicitudesUpdate = () => {
        setSolicitudesUpdate(true);
    };


    return (
        <div className="solicitudes-container">

            <nav className="navigation" >
                <ul className="ul-navegation-cli">
                    <li className="li-navegation-cli">
                        <NavLink to="/client/home/active"  className="link">Activas</NavLink>
                    </li>
                    <li className="li-navegation-cli" >
                        <NavLink to="/client/home/progress"  className="link">En Progreso</NavLink>
                    </li>
                    <li className="li-navegation-cli">
                        <NavLink to="/client/home/finished"  className="link">Terminados</NavLink>
                    </li>    
                </ul>
            </nav>

            <div className="solicitudes">
                {load === false ? (
                SolicitudesPagina.length > 0 ? (
                
                SolicitudesPagina.map((solicitud, index) => (
                    
                    <Solicitud
                        hendleSolicitudesUpdate={hendleSolicitudesUpdate}
                        key={index}
                        id={solicitud.id}
                        telefonoPrestador={solicitud.telefonoPrestador}
                        nombrePrestador={solicitud.nombrePrestador}
                        fechaHoraServicio={solicitud.fechaHoraServicio}
                        titulo={solicitud.titulo}
                        profesion={solicitud.profesion}
                        fecha={solicitud.fechaHora}
                        direccion={solicitud.direccion}
                        descripcion={solicitud.descripcion}
                        estado={solicitud.estado}
                        fotos={solicitud.fotos}
                    />
                ))) : (
                    <div>
                        <h1>No hay solicitudes {props.estado}</h1>
                    </div>
                )) : (
                    <div>
                        <LoaderFijo />
                    </div>
                )}
            </div>
            <div className="pagination">
                <button onClick={irAtras} disabled={paginaActual === 1}>Atrás</button>
                <span>{paginaActual} / {totalPaginas}</span>
                <button onClick={irAdelante} disabled={paginaActual === totalPaginas}>Adelante</button>
            </div>
            <NuevaSolicitud hendleSolicitudesUpdate={hendleSolicitudesUpdate}/>
        </div>   
    )
}

export default Solicitudes;