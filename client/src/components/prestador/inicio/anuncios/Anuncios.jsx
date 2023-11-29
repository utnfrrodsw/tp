import React, { useEffect, useState } from "react";
import { NavLink } from "../../../navlink/Navlink.jsx";
import Anuncio from "../anuncio/Anuncio.jsx";
import "./anuncios.css";
import { getSolicitudesPrestador } from "../../../../services/Solicitud.js";
import { useAuth } from "../../../../auth/authProvider.jsx";
import LoaderFijo from "../../../load/loaderFijo/LoaderFijo.jsx";

function Anuncios(props) {
  const [anuncios, setAnuncios] = useState([]);
  const [anunciosUpdate, setAnunciosUpdate] = useState(false);
  const [estado, setEstado] = useState("");
  const [filtrado, setFiltrado] = useState("");
  const [load, setLoad] = useState(false);
  const auth = useAuth();
  const user = auth.getUser();
  const userData = JSON.parse(localStorage.getItem("user"));
  const [selectedTab, setSelectedTab] = useState('');

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoad(true);
      try {
        const solicitudes = await getSolicitudesPrestador(props.estado, user.id, props.filtrado);
        setAnuncios(solicitudes);
      } catch (error) {
        console.error(error);
      } finally {
        setLoad(false);
      }
      };
    
      fetchData(); // Llamada a la función asíncrona dentro del efecto
    
  }, [anunciosUpdate, props.estado, user.id, props.filtrado]);

  const [paginaActual, setPaginaActual] = useState(1);
  const anunciosPorPagina = 3;
  const totalPaginas = Math.ceil(anuncios.length / anunciosPorPagina);
  const indiceInicio = (paginaActual - 1) * anunciosPorPagina;
  const AnunciosPagina = anuncios.slice(indiceInicio, indiceInicio + anunciosPorPagina);

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

  const handleAnunciosUpdate = () => {
    setAnunciosUpdate(true);
  };

  const handleEstadoClick = (nuevoEstado) => {
    setEstado(nuevoEstado);
  };

  const handleFiltradoClick = (nuevoFiltro) => {
    setFiltrado(nuevoFiltro);
  };

  const handleDoubleClick = (nuevoEstado, nuevoFiltro) => {
    handleEstadoClick(nuevoEstado);
    handleFiltradoClick(nuevoFiltro);
  };
  return (
    <div className="anuncios-container">
      <nav className="navigation">
  <ul className="ul-navegation-cli">
    <li className="li-navegation-cli">
      <NavLink
        to="/provider/home/add"
        onClick={() => handleTabClick('Nuevos') && handleDoubleClick("activa", "nuevas")}
        style={selectedTab === 'Nuevos' ? { color: '#fff' } : {}}
        className="link"
      >
        Anuncios
      </NavLink>
    </li>
    <li className="li-navegation-cli">
      <NavLink
        to="/provider/home/budgeted"
        onClick={() => handleTabClick('Presupuestados') && handleDoubleClick("activa", "presupuestadas")}
        style={selectedTab === 'Presupuestados' ? { color: '#fff' } : {}}
        className="link"
      >
        Presupuestados
      </NavLink>
    </li>
    <li className="li-navegation-cli">
      <NavLink
        to="/provider/home/accepted"
        onClick={() => handleTabClick('Aceptados') && handleDoubleClick("progreso", "aceptadas")}
        style={selectedTab === 'Aceptados' ? { color: '#fff' } : {}}
        className="link"
      >
        Aceptados
      </NavLink>
    </li>
  </ul>
</nav>

      <nav className="navigation">
        <>
        {selectedTab === 'Nuevos' && (
          <li className="li-navegation-cli">
            <></>
          </li> 
        )}
        {selectedTab === 'Presupuestados' && (
          <>
              <li className="li-navegation-cli">
                <NavLink to="/provider/home/budgeted" onClick={() => handleDoubleClick("activa", "presupuestadas")} className="link">Pendientes</NavLink>
              </li>
              <li className="li-navegation-cli">
                <NavLink to="/provider/home/expired" onClick={() => handleDoubleClick("progreso", "presupuestadas")} className="link">Caducados</NavLink>
              </li>
            </>
          )}
          {selectedTab === 'Aceptados' && (
            <>
              <li className="li-navegation-cli">
                <NavLink to="/provider/home/accepted" onClick={() => handleDoubleClick("progreso", "aceptadas")} className="link">En progreso</NavLink>
              </li>
              <li className="li-navegation-cli">
                <NavLink to="/provider/home/finished" onClick={() => handleDoubleClick("terminado", "aceptadas")} className="link">Terminadas</NavLink>
              </li>
            </>
          )}
        </>
      </nav>

      <div className="anuncios">
        {load === false ? (
          AnunciosPagina.length > 0 ? (
            AnunciosPagina.map((anuncio) => (
              <Anuncio
                filtrado={props.filtrado}
                handleAnunciosUpdate={handleAnunciosUpdate}
                key={anuncio.id}
                id={anuncio.id}
                titulo={anuncio.titulo}
                fechaHora={anuncio.fechaHora}
                direccion={anuncio.direccion}
                descripcion={anuncio.descripcion}
                fotos={anuncio.fotos}
              />
            ))
          ) : (
            <div>
              <h1>No hay nunguna solicitud en {props.estado}</h1>
            </div>
          )
        ) : (
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
    </div>
  );
}

export default Anuncios;
