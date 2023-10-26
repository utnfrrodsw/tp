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
  const [profesion, setProfesion] = useState('');
  const [profesiones, setProfesiones] = useState([]);
  const [direccion, setDireccion] = useState('');
  const [direcciones, setDirecciones] = useState([]);
  const [fotos, setFotos] = useState(null);
  const [errorProfesiones, setErrorProfesiones] = useState(false);
  const [errorTitulo, setErrorTitulo] = useState(false);
  const [errorDescripcion, setErrorDescripcion] = useState(false);
  const [errorProfesion, setErrorProfesion] = useState(false);
  const [errorDirecciones, setErrorDirecciones] = useState(false);
  const [errorFotos, setErrorFotos] = useState(false);
  const [error, setError] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const auth = useAuth();
  const user = auth.getUser();


  //direcciones
  // eslint-disable-next-line
  useEffect(() => {
    try{
      const response = fetch(`${API_URL}/direccion/cliente/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setErrorDirecciones(false);
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

  //profesiones
  // eslint-disable-next-line
  useEffect(() => {
    try{
      const response = fetch(`${API_URL}/profesion/getProfesionesExistentes`)
      .then((res) => res.json())
      .then((data) => {
        setErrorProfesiones(false);
        setProfesiones(data.body.profesiones);
      })
      if(response.ok){
        setErrorProfesiones(false);
      }else{
        setErrorProfesiones(true);
      }
    }catch(error){
      error ? console.log(error): console.log('Error al cargar profesiones');
      setErrorProfesiones(true);
    }
  }, [user.id]);

  const handleClose = () => {
    setError(false);
    setEnviando(false);
    setShowModal(false);
    setErrorTitulo(false);
    setErrorDescripcion(false);
    setErrorProfesion(false);
    // Limpiar los campos del formulario
    setTitulo('');
    setDescripcion('');
    setProfesion('');
    setDireccion('');
    setFotos([]);
  };

  const handleShow = () => setShowModal(true);

  const handleSubmit = async () => {
    setEnviando(true);
    //Validar los campos del formulario
    if (!titulo || !descripcion || !profesion || !direccion || fotos.length === 0) {
      if (!titulo) setErrorTitulo(true);
      if (!descripcion) setErrorDescripcion(true);
      if (!profesion) setErrorProfesion(true);
      if (!direccion) setErrorDirecciones(true);
      if (fotos.length === 0) setErrorFotos(true);
      return;
    }

    console.log("footoss" + fotos)
    const formdata = new FormData();
    formdata.append('titulo', titulo);
    formdata.append('descripcion', descripcion);
    formdata.append('idProfesion', profesion);
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
            <label>Profesion</label>
            <select value={profesion} onChange={(e) => setProfesion(e.target.value)} >
              <option key={0} value={0}>{"seleccione una profesion"}</option>
              {profesiones.map((profesion, index) => (
                <option key={index} value={profesion.idProfesion}>{profesion.nombreProfesion}</option>
              ))}
              {/* Agrega más opciones según tus necesidades */}
            </select>
            {errorProfesion && <span className="error-message">Seleccione una profesion</span>}
            {errorProfesiones && <span className="error-message">Error al traer profesiones</span>}
          </div>
          <div className="form-group">
            <label>Direccion</label>
            <select value={direccion} onChange={hendleDireccion}>
                <option key={0} value={0}>{"seleccione una direccion"}</option>
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