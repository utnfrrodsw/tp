import '../presupuesto/Presupuesto.css';
import Detalle from './Detalle.jsx';
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from "../../../auth/constants.js";
import { Modal } from 'react-bootstrap';

function DetalleServicio() {
  const history = useNavigate();
  const { idSolicitud } = useParams();
  const [presupuesto, setPresupuesto] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const [successMessage, setSuccessMessage] = useState();
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
  }, [idSolicitud, user.id]);

  const updateServicio = async () => {
    try {
      console.log('solicitar finalizacion');
      fetch(`${API_URL}/servicio/aterminar/${idSolicitud}/prestador/${user.id}`, {
        method: 'PATCH',
      });
      setSuccessMessage('El servicio se actualizó exitosamente.');
      setTimeout(() => {
          history('/provider/home/add/');
        }, 3000);
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
            <button type='button' onClick={() => history(-1)}>ir Atras</button>
            {presupuesto.estado === "progreso" && (
              <button type="button" onClick={updateServicio}>
              Solicitar finalización
              </button>
            )}
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default DetalleServicio;
