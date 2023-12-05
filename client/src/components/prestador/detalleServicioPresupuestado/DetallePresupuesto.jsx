import '../presupuesto/Presupuesto.css'
import Detalle from './Detalle.jsx';
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { getPresupuestoPrestador } from '../../../services/Presupuesto';
import LoaderFijo from "../../load/loaderFijo/LoaderFijo.jsx";
import { Button } from 'react-bootstrap';



function DetallePresupuesto(){

  const history = useNavigate();
  const { idSolicitud } = useParams();
  const [loading, setLoading] = useState(false);
  const [presupuesto, setPresupuesto] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const [errorCargarPresupuesto, setErrorCargarPresupuesto] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try{
        const response = await getPresupuestoPrestador(idSolicitud,user.id)
        if(response.statusCode === 200){
          setPresupuesto(response.body.presupuesto);
        }else{
          setErrorCargarPresupuesto(response.body.message);
        }
      }catch(error){
        setErrorCargarPresupuesto(error.message);
      }
    };
    fetchData();
  }, [idSolicitud, user.id]);

return(
  <div className='scroll-container'>
    { presupuesto ? (
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
        <Button type='button' onClick={()=> history(-1)}>ir Atras</Button>
      </div>
    </>
    ) : (
      <div>
        <LoaderFijo/>
      </div>
    )}
  {errorCargarPresupuesto && <p style={{ color: 'red' }}>{errorCargarPresupuesto}</p>}
  </div>
);
}
export default DetallePresupuesto;