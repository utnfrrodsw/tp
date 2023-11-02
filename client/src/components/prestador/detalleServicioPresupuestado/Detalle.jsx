import '../presupuesto/Presupuesto.css'
import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { API_URL } from "../../../auth/constants.js";

function Detalle() {
  const { idSolicitud } = useParams();
  const [presupuesto, setPresupuesto] = useState(null);
  const user=JSON.parse(localStorage.getItem('user'));
  useEffect(() => {
    // Realiza la consulta a la base de datos para obtener los detalles del presupuesto usando el ID del presupuesto
    fetch(`${API_URL}/presupuesto/solicitud/${idSolicitud}/prestador/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setPresupuesto(data); // Almacena los detalles del presupuesto en el estado
      })
      .catch((error) => {
        console.error('Error al cargar los detalles del presupuesto:', error);
      });
  }, [idSolicitud,user.id]);

  return (
    <>
      <div className="anuncio-Content">
        {presupuesto ? (
          <>
            <div className='datos'>
              <p><h2>Detalles del Anuncio:</h2></p>
              <p>Número de Anuncio: {presupuesto.idSolicitud}</p>
              <p>Título: {presupuesto.titulo}</p>
              <p>Fecha de publicación: {new Date(presupuesto.fechaHora).toLocaleString()}</p>
              <p>Ubicación: {presupuesto.direccion.codPostal} (Ver de modificar por ciudad y prov)</p> 
            </div>
            <div className='descripcion'><h3><p>Descripción:</p></h3> {presupuesto.descripcion}</div>
          </>
        ) : (
          <p>Cargando detalles del presupuesto...</p>
        )}
      </div>

      <div className="presupuesto-Content">
        {presupuesto ? (
          <>
            <div className='datos'>
              <p><h2>Detalles del Presupuesto:</h2></p>
              <p>Número de Presupuesto: {presupuesto.idPresupuesto}</p>
              <p>Usuario: {presupuesto.idUsuario}</p>
              <p>Materiales: {presupuesto.materiales}</p>
              <p>Costo de Materiales: {presupuesto.costoMateriales}</p>
              <p>Tiempo: {presupuesto.tiempo} horas</p>
              <p>Costo por Hora: {presupuesto.costoxHora}</p>
              <p>Fechas Seleccionadas:</p>
              <ul>
                {presupuesto.fechasSeleccionadas.map((date, index) => (
                  <li key={index}>
                    {new Date(date).toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <p>Cargando detalles del presupuesto...</p>
        )}
      </div>
      <div className='servicio-content'>
        <div>
          <h3>Fecha seleccionada</h3>
          <p>{presupuesto.fechaFinal}</p>
        </div>
    </div>
    </>
  )
}

export default Detalle;
