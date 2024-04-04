import '../presupuesto/Presupuesto.css';
import Detalle from './Detalle.jsx';
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import {fetchDetalleServicio, fetchSolicitarTerminacion} from '../../../services/servicio.js';
import {useAuth} from '../../../auth/authProvider.jsx';
import LoaderFijo from '../../load/loaderFijo/LoaderFijo.jsx';

function DetalleServicio() {

  const history = useNavigate();
  const {idSolicitud } = useParams();
  const [presupuesto, setPresupuesto] = useState(null);
  const [errorCargarPresupuesto, setErrorCargarPresupuesto] = useState("");
  const [errorSolicitarTerminacion, setErrorSolicitarTerminacion] = useState("");
  const user = JSON.parse(localStorage.getItem('user'));
  const [successMessage, setSuccessMessage] = useState();
  const auth = useAuth();

  useEffect( () => {
    const fetchData = async () => {
      try {
        const response = await fetchDetalleServicio(idSolicitud, user.id, auth.token);
        if (response.statusCode === 200) {
          setPresupuesto(response.body.presupuesto);
        } else {
          setErrorCargarPresupuesto("error al cargar el presupuesto");
        }
      } catch (error) {
        setErrorCargarPresupuesto(error.message);
      }
    };
    fetchData();
  }, []);

  const updateServicio = async () => {
    try {
      const response = await fetchSolicitarTerminacion(idSolicitud, user.id, auth.token);
      if(response.statusCode === 200){
        setSuccessMessage('El servicio se actualizó exitosamente.');
        setTimeout(() => {
          history('/provider/home/add/');
        }, 3000);
      }else{
        setErrorSolicitarTerminacion(response.body.message)
      }
    } catch (error) {
      console.error('Error al actualizar el servicio:', error);
      setSuccessMessage('Error al actualizar el servicio.')
    }
  };

  return (
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
            materiales={presupuesto.materiales}
            costoMateriales={presupuesto.costoMateriales}
            tiempo={presupuesto.tiempoAprox}
            costoxHora={presupuesto.costoXHora}
            fechasSeleccionadas={presupuesto.fechasDisponibles}
            resenia={presupuesto.resenia}
          />
          <div className='presupuesto-Content'>
            {successMessage && <div className="modal show" style={{ display: 'block', position: 'center' }}>
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Title><h1>ATENCION</h1></Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>{successMessage}</p>
              </Modal.Body>
              </Modal.Dialog>
              </div>}
            <div className='campos'>
              <div className='listaMat'>
                <h2>Detalles del Servicio:</h2>
                <p>Estado del servicio: {presupuesto.estado}</p>
                <p>Costo final: {presupuesto.costoTotal}</p>
              </div>
              <p>Fecha final:{new Date(presupuesto.fechaFinal).toLocaleString()}</p>
            </div>
          </div>
          <div>
            <Button type='button' onClick={() => {history(-1);}}>ir Atras</Button>
            {presupuesto.estado === "progreso" && (
              <>
              <Button type="button" onClick={updateServicio}>
                Solicitar finalización
              </Button>
              {errorSolicitarTerminacion && <p style={{ color: 'red' }}>{errorSolicitarTerminacion}</p>}
              </>
            )}
          </div>
        </>
      ) : (
        <div className='content-loaderFijo'>
          <LoaderFijo />
        </div>
      )}
      {errorCargarPresupuesto && <p style={{ color: 'red' }}>{errorCargarPresupuesto}</p>}
    </div>
  );
}

export default DetalleServicio;
