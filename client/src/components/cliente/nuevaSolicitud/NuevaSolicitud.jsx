import React, { useEffect, useState } from 'react';
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
  const [direccion, setDireccion] = useState('');
  const [direcciones, setDirecciones] = useState([]);
  const [fotos, setFotos] = useState(null);
  const [errorTitulo, setErrorTitulo] = useState(false);
  const [errorDescripcion, setErrorDescripcion] = useState(false);
  const [errorEspecialidad, setErrorEspecialidad] = useState(false);
  const [errorDirecciones, setErrorDirecciones] = useState(false);
  const [errorFotos, setErrorFotos] = useState(false);
  const [error, setError] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const auth = useAuth();
  const user = auth.getUser();

  // eslint-disable-next-line
  useEffect(() => {
    try{
      const response = fetch(`${API_URL}/direccion/cliente/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.body.direcciones);
        setDirecciones(data.body.direcciones);
      })
      if(response.ok){
        setErrorDirecciones(false);
      }else{
        setErrorDirecciones(true);
      }
    }catch(error){
      error ? console.log(error): console.log('Error al cargar direcciones');
      setErrorDirecciones(true);
    }
  }, [user.id]);

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
    setDireccion('');
    setFotos([]);
  };

  const handleShow = () => setShowModal(true);

  const handleSubmit = async () => {
    setEnviando(true);
    //Validar los campos del formulario
    if (!titulo || !descripcion || !especialidad || !direccion || fotos.length === 0) {
      if (!titulo) setErrorTitulo(true);
      if (!descripcion) setErrorDescripcion(true);
      if (!especialidad) setErrorEspecialidad(true);
      if (!direccion) setErrorDirecciones(true);
      if (fotos.length === 0) setErrorFotos(true);
      return;
    }

    console.log("footoss" + fotos)
    const formdata = new FormData();
    formdata.append('titulo', titulo);
    formdata.append('descripcion', descripcion);
    formdata.append('especialidad', especialidad);
    formdata.append('idDireccion', direccion);
    fotos.forEach((foto) => {
      formdata.append('fotos', foto);
    });
    

    try{
      console.log('enviando solicitud 2')
      await fetch(`${API_URL}/solicitud/cliente/${user.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.getRefreshToken()}`
        },
        body: formdata
      })
      .then((res) => res.json())
      .then((data) => {
        setEnviando(false);
        hendleSolicitudesUpdate();
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

  const hendleDireccion = (e) => {
    setDireccion(e.target.value);
  }

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
        <Modal.Header>
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
            <select value={direccion} onChange={hendleDireccion}>
              {direcciones && direcciones.map((direccion, index) => (
                <option key={index} value={direccion.idDireccion}> {direccion.calle} {direccion.numero} 
                {direccion.piso || direccion.dpto ? <span>({direccion.piso}{direccion.dpto})</span> : null} 
                /{direccion.localidad.nombre}/{direccion.localidad.provincia}</option>
              ))}
            </select>
            {errorDirecciones && <span className="error-message">Ingrese una direccion valida</span>}
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
          <Button  onClick={async() => {await handleSubmit();}}>
            {enviando ? <><LoandingDots /></> : 'Enviar'}
        </Button>
        </Modal.Footer>
        {error && <span className="error-message">Error al enviar la solicitud</span>}
      </Modal>
    </div>
  );
}

export default NuevaSolicitud;