import '../presupuesto/Presupuesto.css'
import Detalle from './Detalle.jsx';
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from "../../../auth/constants.js";

function DetalleServicio(){

  const history = useNavigate();
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
console.log(presupuesto);
return(
<>
  {presupuesto ? (
    <>
    <Detalle
      idSolicitud={presupuesto.idSolicitud}
      cliente={presupuesto.cliente}
      titulo={presupuesto.titulo}
      fechaHora={presupuesto.fechaPublicacion}
      direccion={presupuesto.direccion}
      descripcion={presupuesto.descripcion}
      materiales= {presupuesto.materiales}
      costoMateriales={presupuesto.costoMateriales}
      tiempo={presupuesto.tiempoAprox}
      costoxHora={presupuesto.costoXHora}
      fechasSeleccionadas={presupuesto.fechasDisponibles}
        />
      <div className='presupuesto-Content'>
        <div className='campos'>                              
            <div className='listaMat'>
              <h2>Detalles del Servicio:</h2>
              <p>Estado del servicio: {presupuesto.costoXHora}</p>
              <p>Costo final: {presupuesto.costoTotal}</p>
            </div>
            <p>Fecha final:{new Date(presupuesto.fechaFinal).toLocaleDateString()}</p>
        </div> 
      </div>
      <div>
        <button type='button' onClick={()=> history(-1)}>ir Atras</button>
        <button type='button'>Solicitar finalizacion</button>
      </div>
    </>
    ) : (
        <p>Loading...</p> // You can show a loading message or component while waiting for the data
      )}
    </>
);
}
export default DetalleServicio;