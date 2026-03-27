import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import '../../cliente/Inicio/InicioCliente.css';
import { API_URL } from '../../../auth/constants';
import { useAuth } from '../../../auth/authProvider.jsx';
import LoandingDots from '../../load/loandingDots/LoandingDots.jsx';

export function NuevaDireccion(props) {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(false);
  const [calle, setCalle] = useState('');
  const [numero, setNumero] = useState('');
  const [piso, setPiso] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [provincia, setProvincia] = useState('');
  const [errorCalle, setErrorCalle] = useState(false);
  const [errornumero, setErrorNumero] = useState(false);
  const [errorPiso, setErrorPiso] = useState(false);
  const [errorDepartamento, setErrorDepartamento] = useState(false);
  const [errorCodigoPostal, setErrorCodigoPostal] = useState(false);
  const [errorCiudad, setErrorCiudad] = useState(false);
  const [errorProvincia, setErrorProvincia] = useState(false);
  
  const [enviando, setEnviando] = useState(false);
  const auth = useAuth();
  const user = auth.getUser();


  const handleClose = () => {
    setShowModal(false);
    setError(false);
    setCalle('');
    setNumero('');
    setPiso('');
    setDepartamento('');
    setCodigoPostal('');
    setCiudad('');
    setProvincia('');
    setErrorCalle(false);
    setErrorNumero(false);
    setErrorPiso(false);
    setErrorDepartamento(false);
    setErrorCodigoPostal(false);
    setErrorCiudad(false);
    setErrorProvincia(false);
    props.cerrarMenu();
  };

  useEffect(() => {
    setShowModal(props.nuevaDireccion)
    console.log("nueva direccion: " + props.nuevaDireccion)
  }, [props.nuevaDireccion]);

  const handleSubmit = async () => {
    setEnviando(true);
    try{
      await fetch(`${API_URL}/direccion/agregarDireccion/cliente/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.getRefreshToken()}`
        },
        body: JSON.stringify({
          calle: calle,
          numero: numero,
          piso: piso,
          departamento: departamento,
          codigoPostal: codigoPostal,
          ciudad: ciudad,
          provincia: provincia,
        }),
      })
      .then((res) => res.json())
      .then((data) => {
        setEnviando(false);
        props.hendleDireccionesUpdate();
        handleClose();
      })
      .catch((error) => {
        setError(true);
        setEnviando(false);
      });
      setEnviando(false);
    }catch(error){
      console.log(error.body.message)
      setEnviando(false);
      setError(true);
    }
  };


  return (
    <div>
      <Modal show={showModal}>
        <Modal.Header>
          <Modal.Title>Nueva Direccion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>Calle</label>
            <input type="text" value={calle} onChange={(e) => setCalle(e.target.value)} />
            {errorCalle && <span className="error-message">Ingrese la Calle</span>}
          </div>
          <div className="form-group">
            <label>Número</label>
            <input type="text" value={numero} onChange={(e) => setNumero(e.target.value)} />
            {errornumero && <span className="error-message">Ingrese un número</span>}
          </div>
          <div className="form-group">
            <label>piso*</label>
            <input type="text" value={piso} onChange={(e) => setPiso(e.target.value)} />
            {errorPiso && <span className="error-message">ingrese el numero del piso</span>}
          </div>
          <div className="form-group">
            <label>Departamento*</label>
            <input type="text" value={departamento} onChange={(e) => setDepartamento(e.target.value)} />
            {errorDepartamento && <span className="error-message">ingrese la letra del Departamento</span>}
          </div>
          <div className="form-group">
            <label>Codigo Postal</label>
            <input type="text" value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} />
            {errorCodigoPostal && <span className="error-message">ingrese el Codigo Postal</span>}
          </div>
          <div className="form-group">
            <label>Ciudad</label>
            <input type="text" value={ciudad} onChange={(e) => setCiudad(e.target.value)} />
            {errorCiudad && <span className="error-message">ingrese la Ciudad</span>}
          </div>
          <div className="form-group">
            <label>Provincia</label>
            <input type="text" value={provincia} onChange={(e) => setProvincia(e.target.value)} />
            {errorProvincia && <span className="error-message">ingrese la Provincia</span>}
          </div>
          
        </Modal.Body>
        <Modal.Footer>
          <div className='btn-cls'>
          <Button variant="secondary"  onClick={handleClose}>
            Cerrar
          </Button>
          </div>
          <Button  onClick={async() => {await handleSubmit();}}>
            {enviando ? <><LoandingDots /></> : 'Enviar'}
        </Button>
        </Modal.Footer>
        {error && <span className="error-message">Error al agregar direccion</span>}
      </Modal>
    </div>
  );
}

export default NuevaDireccion;