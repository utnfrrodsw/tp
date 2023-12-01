import '../presupuesto/Presupuesto.css'
import Detalle from './Detalle.jsx';
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { getPresupuestoPrestador } from '../../../services/Presupuesto';
function DetallePresupuesto(){

  const history = useNavigate();
  const { idSolicitud } = useParams();
  const [presupuesto, setPresupuesto] = useState(null);
  const user=JSON.parse(localStorage.getItem('user'));
  useEffect(() => {
    const fetchData= async()=>{
      try{
        const presupuesto=await getPresupuestoPrestador(idSolicitud,user.id)
        setPresupuesto(presupuesto);
      }catch(error){
        console.error(error);
      }
    };
    fetchData();
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