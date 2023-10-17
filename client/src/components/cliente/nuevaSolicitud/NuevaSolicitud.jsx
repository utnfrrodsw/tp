import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import '../Inicio/InicioCliente.css';
import { API_URL } from '../../../auth/constants';
import { useAuth } from '../../../auth/authProvider.jsx';
import LoandingDots from '../../load/loandingDots/LoandingDots.jsx';

export function NuevaSolicitud({hendleSolicitudesUpdate}) {
  const [showModal, setShowModal] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [idDireccion, setidDireccion] = useState('');
  const [fotos, setFotos] = useState(null);
  const [errorTitulo, setErrorTitulo] = useState(false);
  const [errorDescripcion, setErrorDescripcion] = useState(false);
  const [errorEspecialidad, setErrorEspecialidad] = useState(false);
  const [erroridDireccion, setErroridDireccion] = useState(false);
  const [errorFotos, setErrorFotos] = useState([]);
  const [error, setError] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const auth = useAuth();
  const user = auth.getUser();

  const handleClose = () => {
    setError(false);
    setEnviando(false);
    setShowModal(false);
    setErrorTitulo(false);
    setErrorDescripcion(false);
    setErrorEspecialidad(false);
    // Limpiar los campos del formulario
    setTitulo('');
    setDescripcion('');
    setEspecialidad('');
    setidDireccion('');
    setFotos([]);
  };

  const handleShow = () => setShowModal(true);

  const handleSubmit = async () => {
    setEnviando(true);
    //Validar los campos del formulario
    if (!titulo || !descripcion || !especialidad || !idDireccion || fotos.length === 0) {
      if (!titulo) setErrorTitulo(true);
      if (!descripcion) setErrorDescripcion(true);
      if (!especialidad) setErrorEspecialidad(true);
      if (!idDireccion) setErroridDireccion(true);
      if (fotos.length === 0) setErrorFotos(true);
      return;
    }

    console.log(fotos)
    const formdata = new FormData();
    formdata.append('titulo', titulo);
    formdata.append('descripcion', descripcion);
    formdata.append('especialidad', especialidad);
    formdata.append('idDireccion', idDireccion);
    fotos.forEach((foto) => {
      formdata.append('fotos', foto);
    });
    

    try{
      const response = await fetch(`${API_URL}/solicitud/cliente/${user.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.getRefreshToken()}`
        },
        body: formdata
      })
      .then((res) => res.json())
      .then((data) => {
        setEnviando(false);
        handleClose();
        console.log(data);
      })
      .catch((error) => {
        setEnviando(false);
        setError(true);
        console.log(error);
      });

      setEnviando(false);
    }catch(error){
      setEnviando(false);
      setError(true);
      console.log(error);
    }
    
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFotos(selectedFiles);
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <div >
      <Button  variant='primary' className="floating-button"  onClick={handleShow} onMouseLeave={toggleMenu} onMouseEnter={toggleMenu} >
        +
      </Button>
    </div>
      {isMenuOpen && (
        <div className="modal-alert">
          Nueva Solicitud
        </div>
      )}

      <Modal show={showModal}>
        <Modal.Header closeButton>
          <Modal.Title>Nueva Solicitud</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>Título</label>
            <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
            {errorTitulo && <span className="error-message">Ingrese un título</span>}
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
            {errorDescripcion && <span className="error-message">Ingrese una descripción</span>}
          </div>
          <div className="form-group">
            <label>Especialidad</label>
            <select value={especialidad} onChange={(e) => setEspecialidad(e.target.value)}>
              <option value="">Elija una especialidad</option>
              <option value="Carpintería">Carpintería</option>
              <option value="Electricidad">Electricidad</option>
              <option value="Plomería">Plomería</option>
              {/* Agrega más opciones según tus necesidades */}
            </select>
            {errorEspecialidad && <span className="error-message">Seleccione una especialidad</span>}
          </div>
          <div className="form-group">
            <label>Direccion</label>
            <input type="text" value={idDireccion} onChange={(e) => setidDireccion(e.target.value)} />
            {erroridDireccion && <span className="error-message">Ingrese una idDireccion valida</span>}
          </div>
          <div className="form-group">
            <label>Fotos</label>
            <input type="file" multiple onChange={handleFileChange} />
            {errorFotos && <span className="error-message">Ingrese al menos una foto</span>}

          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className='btn-cls'>
          <Button variant="secondary"  onClick={handleClose}>
            Cerrar
          </Button>
          </div>
          <Button  onClick={async() => {await handleSubmit(); handleClose(); hendleSolicitudesUpdate();}}>
            {enviando ? <><LoandingDots /></> : 'Enviar'}
        </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default NuevaSolicitud;