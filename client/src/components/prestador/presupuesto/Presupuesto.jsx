import './Presupuesto.css'
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from "../../../auth/authProvider.jsx";
import { Modal } from 'react-bootstrap';
import {getSolicitudId} from "../../../services/Solicitud.js"
import { setPresupuesto } from '../../../services/Presupuesto.js';
function Presupuesto(props) {
   const [anuncio, setAnuncio] = useState(null);
  const [datetimeValue, setDatetimeValue] = useState('');
  const [selectedDates, setSelectedDates] = useState([]);
  const [materiales, setMateriales] = useState('');
  const [costoMateriales, setCostoMateriales] = useState();
  const [tiempo, setTiempo] = useState();
  const [costoxHora, setCostoxHora] = useState();
  const currentDate = new Date().toISOString().slice(0, 16);
  const { id } = useParams();
  const [successMessage, setSuccessMessage] = useState('');
  const history = useNavigate();
  const auth = useAuth();
  const user = auth.getUser();

  const [errorIdSolicitud, setErrorIdSolicitud] = useState("");
  const [errorIdPrestador, setErrorIdPrestador] = useState("");
  const [errorMateriales, setErrorMateriales] = useState("");
  const [errorTiempo, setErrorTiempo] = useState("");
  const [errorCostoxHora, setErrorCostoxHora] = useState("");
  const [errorFechasSeleccionadas, setErrorFechasSeleccionadas] = useState("");


  useEffect(() => {
    const fetchData=async()=>{
      try{
        const anuncio=await getSolicitudId(id);
        setAnuncio(anuncio);
      }catch(error){
        console.error(error);
      }
    };
    fetchData();
  }, [id]);
  
  const handleDatetimeChange = (event) => {
    // Obtener el valor seleccionado por el usuario del input datetime-local
    const newValue = event.target.value;
    setDatetimeValue(newValue);
  };

  const handleAddDate = () => {
    if (datetimeValue.trim() !== '') {
      // Agregar la fecha y hora seleccionada al array de fechas seleccionadas
      setSelectedDates([...selectedDates, datetimeValue]);
      // Limpiar el valor del input datetime-local
      setDatetimeValue('');
    }
  };

  const handleRemoveDate = (index) => {
    // Eliminar la fecha y hora seleccionada del array de fechas seleccionadas
    const newDates = [...selectedDates];
    newDates.splice(index, 1);
    setSelectedDates(newDates);
  };


  const handleFormSubmit = async (e) => {
  e.preventDefault();

  if (selectedDates.length === 0) {
    setErrorFechasSeleccionadas('Debes seleccionar al menos una fecha y hora.');
    setTimeout(() => {
      setErrorFechasSeleccionadas('');
    }, 10000);
    return;
  }

  // Create an object with the data for the budget
  const presupuestoData = {
    idSolicitud: anuncio.idSolicitud,
    idUsuario: user.id,
    materiales: materiales,
    costoMateriales: costoMateriales,
    tiempo: tiempo,
    costoxHora: costoxHora,
    fechasSeleccionadas: selectedDates,
  };
  console.log(presupuestoData);
  try {
    const response = await setPresupuesto(presupuestoData);

    if (response.error) {
      response.error.forEach((error) => {
        switch (error.path) {
          case 'idSolicitud':
            setErrorIdSolicitud(error.msg);
            break;
          case 'idPrestador':
            setErrorIdPrestador(error.msg);
            break;
          case 'materiales':
            setErrorMateriales(error.msg);
            break;
          case 'tiempo':
            setErrorTiempo(error.msg);
            break;
          case 'costoxHora':
            setErrorCostoxHora(error.msg);
            break;
          case 'fechasSeleccionadas':
            setErrorFechasSeleccionadas(error.msg);
            break;
          default:
            break;
        }
      });

      setTimeout(() => {
        setErrorIdSolicitud('');
        setErrorIdPrestador('');
        setErrorMateriales('');
        setErrorTiempo('');
        setErrorCostoxHora('');
        setErrorFechasSeleccionadas('');
      }, 10000);
    } else {
      setSuccessMessage('Presupuesto cargado con éxito.');
      // Schedule a redirection to the main page after a few seconds
      setTimeout(() => {
        history('/provider/home/add/');
      }, 3000); // Redirect after 3 seconds
    }
  } catch (error) {
    console.error('Error al enviar el presupuesto:', error);
  }
};
  return (
    <div className='scroll-container'>
      <div className="anuncio-Content">
        {anuncio ? (
          <>
            <div className='datos'>
              <p><h2>Detalles:</h2></p>
              <p>Número de anuncio: {anuncio.idSolicitud}</p>
              {errorIdSolicitud && <span className="error-message">{errorIdSolicitud}</span>}
              {errorIdPrestador && <span className="error-message">{errorIdPrestador}</span>}
              <p>Título: {anuncio.titulo}</p>
              <p>Fecha de publicacion: {new Date(anuncio.fechaHora).toLocaleString()}</p>
              <p>Ubicacion: {anuncio.direccion.localidad.nombre}, {anuncio.direccion.localidad.provincia}</p> 
            </div>
            <div className='descripcion'><h3><p>Descripcion:</p></h3> {anuncio.descripcion}</div>
          </>
        ) : (
          <p>Cargando detalles del anuncio...</p>
        )}
      </div>
    <form className='presupuesto-Content'  onSubmit={handleFormSubmit}>
          {successMessage && <div className="modal show" style={{ display: 'block', position: 'center' }}>
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Title>
                  <h1>ATENCIÓN</h1>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>{successMessage}</p>
              </Modal.Body>
              <Modal.Footer>
                <button onClick={() => setSuccessMessage('')}>Cerrar</button>
              </Modal.Footer>
            </Modal.Dialog>
          </div>}
      <div className='campos'>
        <div className='listaMat'>
          <p>Lista Materiales:</p> 
          <textarea name="materiales" id="1" cols="60" rows="10" required value={materiales} onChange={(e) => setMateriales(e.target.value)}></textarea>
        </div>
        <div className='textoCampos'>
          <p>Costo total en materiales aproximado</p>
          {errorTiempo && <span className="error-message">{errorTiempo}</span>}
          <p>Tiempo(En horas) aproximado</p> 
          {errorCostoxHora && <span className="error-message">{errorCostoxHora}</span>}
          <p>Costo por hora </p>
          {errorMateriales && <span className="error-message">{errorMateriales}</span>}
        </div>
        <div className='entradasCampos'>
            <input type="number" name="costo-materiales" min={1} required value={costoMateriales} onChange={(e) => setCostoMateriales(e.target.value)}/>
            <p><input name='tiempo' type="number" min={1} required value={tiempo} onChange={(e) => setTiempo(e.target.value)}/></p>
            <input type="number" name='costoxHora' min={1} required value={costoxHora} onChange={(e) => setCostoxHora(e.target.value)}/>
        </div>
      </div>
      <div className='horarios'>
        <p htmlFor="datetimePicker">Selecciona una fecha y hora:</p>
        <input 
          id="datetimePicker" 
          type="datetime-local"  
          value={datetimeValue} 
          onChange={handleDatetimeChange}
          min={currentDate}
        />
        <button type='button' onClick={handleAddDate}>+</button>
        <div>
          <p></p>
          <h2>Fechas y Horas Seleccionadas:</h2>
          <ul>
          {selectedDates.map((date , index) => (
            <p><li key={index}>
              {new Date(date).toLocaleString()}
              <button type='button' onClick={() => handleRemoveDate(index)}>-</button>
            </li></p>
          ))}
        </ul>
        </div>
        {errorFechasSeleccionadas && <span className="error-message">{errorFechasSeleccionadas}</span>}
      </div>
      <div className='botones'>
      <button type="button" onClick={() => history(-1)}>Atrás</button>
      <button type="submit">Enviar presupuesto</button>
      </div>
    </form>
  </div>
  )
}

export default Presupuesto;