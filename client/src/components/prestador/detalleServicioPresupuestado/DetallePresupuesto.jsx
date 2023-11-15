import '../presupuesto/Presupuesto.css'
import Detalle from './Detalle.jsx';
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from "../../../auth/constants.js";

function DetallePresupuesto(){

  const history = useNavigate();
  const { idSolicitud } = useParams();
  const [presupuesto, setPresupuesto] = useState(null);
  const user=JSON.parse(localStorage.getItem('user'));
  useEffect(() => {
    // Realiza la consulta a la base de datos para obtener los detalles del presupuesto usando el ID del presupuesto
    fetch(`${API_URL}/presupuesto/solicitud/${idSolicitud}/prestador/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setPresupuesto(data.body.presupuesto); // Almacena los detalles del presupuesto en el estado
      })
      .catch((error) => {
        console.error('Error al cargar los detalles del presupuesto:', error);
      });
  }, [idSolicitud,user.id]);
console.log(presupuesto);
return(
<div className='scroll-container'>
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
      <div>
        <button type='button' onClick={()=> history(-1)}>ir Atras</button>
      </div>
  </>
  ) : (
        <p>Loading...</p> // You can show a loading message or component while waiting for the data
      )}
    </div>
);
}
export default DetallePresupuesto;