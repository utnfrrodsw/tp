import React, { useEffect, useState } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import '../Inicio/InicioCliente.css';
import { useAuth } from '../../../auth/authProvider.jsx';
import { getClientAdresses } from '../../../services/Cliente.js'
import { getExistingProfessions } from '../../../services/Prestador.js'
import { setSolicitud } from '../../../services/Solicitud.js'

export function NuevaSolicitud({hendleSolicitudesUpdate}) {
  const [showModal, setShowModal] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [profesion, setProfesion] = useState('');
  const [profesiones, setProfesiones] = useState([]);
  const [direccion, setDireccion] = useState('');
  const [direcciones, setDirecciones] = useState([]);
  const [fotos, setFotos] = useState([]);
  const [errorProfesiones, setErrorProfesiones] = useState("");
  const [errorTitulo, setErrorTitulo] = useState("");
  const [errorDescripcion, setErrorDescripcion] = useState("");
  const [errorProfesion, setErrorProfesion] = useState("");
  const [errorProfDir, setErrorProfDir] = useState("");
  const [errorDirecciones, setErrorDirecciones] = useState("");
  const [errorFotos, setErrorFotos] = useState("");
  const [error, setError] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const auth = useAuth();
  const user = auth.getUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseAddresses = await getClientAdresses(user.id, auth.token);
        const responseProfessions = await getExistingProfessions(auth.token);
        if(responseAddresses.statusCode === 200 && responseProfessions.statusCode === 200){
          setDirecciones(responseAddresses.body.direcciones);
          setProfesiones(responseProfessions.body.profesiones);
        }else{
          setErrorDirecciones(responseAddresses.body.message);
          setErrorProfesiones(responseProfessions.body.message);
          setErrorProfDir("No se pudo cargar la informacion");
        }
      } catch (error) {
        setErrorProfDir(error);
      }
    };
    fetchData();
  }, [user.id]);

  const handleClose = () => {
    hendleErrors();
    setDireccion('');
    setTitulo('');
    setDescripcion('');
    setProfesion('');
    setDireccion('');
    setFotos([]);
  };

  const hendleErrors = () => {
    setError(false);
    setEnviando(false);
    setShowModal(false);
    setErrorTitulo(false);
    setErrorDescripcion(false);
    setErrorProfesion('');
    setErrorDirecciones('');
  };

  const handleShow = () => setShowModal(true);

  const handleSubmit = async () => {
    setEnviando(true);

    //Validar los campos del formulario
    if (!titulo || !descripcion || !profesion || !direccion || fotos.length === 0) {
      if (!titulo) setErrorTitulo("El titulo es requerido");
      if (!descripcion) setErrorDescripcion("La descripcion es requerida");
      if (!profesion) setErrorProfesion("La profesion es requerida");
      if (!direccion) setErrorDirecciones("La direccion es requerida");
      if (fotos.length === 0) setErrorFotos("Debe cargar al menos una foto");
      if (fotos.length > 5) setErrorFotos("Solo puede cargar hasta 5 fotos");
      setEnviando(false);
      setTimeout(() => {
        hendleErrors();
      }, 10000);
      return;
    }

    const formdata = new FormData();
    formdata.append('titulo', titulo);
    formdata.append('descripcion', descripcion);
    formdata.append('idProfesion', profesion);
    formdata.append('idDireccion', direccion);
    fotos &&
    fotos.forEach((foto) => {
      formdata.append('fotos', foto);
    });
    
    try{
      const response = await setSolicitud(user.id, formdata, auth.token)
      if(response.error){
        response.error.map((error) => {
          if(error.path === 'titulo') setErrorTitulo(error.msg);
          if(error.path === 'descripcion') setErrorDescripcion(error.msg);
          if(error.path === 'idProfesion') setErrorProfesion(error.msg);
          if(error.path === 'idDireccion') setErrorDirecciones(error.msg);
          if(error.path === 'fotos') setErrorFotos(error.msg);
          return null;
        });
        setTimeout(() => {
          hendleErrors();
        }, 10000);
      }else{
        hendleSolicitudesUpdate();
        handleClose();
      }
      setEnviando(false);
    }catch(error){
      setError(true);
    }finally{
      setEnviando(false);
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
            <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} data-testid="titulo-input"/>
            {errorTitulo && <span className="error-message">{errorTitulo}</span>}
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} data-testid="descripcion-input"/>
            {errorDescripcion && <span className="error-message">{errorDescripcion}</span>}
          </div>
          <div className="form-group">
            <label>Profesion</label>
            <select value={profesion} onChange={(e) => setProfesion(e.target.value)}>
              <option value="0" data-testid="profesion-input">seleccione una profesion</option>
              {profesiones.length > 0 &&
              profesiones.map((profesion, index) => (
                <option key={index + 1} value={profesion.idProfesion}>{profesion.nombreProfesion}</option>
              ))}
              {/* Agrega más opciones según tus necesidades */}
            </select>
            {errorProfesion && <span className="error-message">{errorProfesion}</span>}
            {errorProfesiones && <span className="error-message">{errorProfesiones}</span>}
          </div>
          <div className="form-group">
            <label>Direccion</label>
            <select value={direccion} onChange={hendleDireccion}>
              <option value="0" data-testid="direccion-input">seleccione una dirección</option>
              {direcciones.length > 0 &&
                direcciones.map((direccion, index) => (
                  <option key={index + 1} value={direccion.idDireccion}>
                    {direccion.calle} {direccion.numero}
                    {direccion.piso || direccion.dpto ? (
                      <>({direccion.piso}{direccion.dpto})</>
                    ) : null} 
                    /{direccion.localidad.nombre}/{direccion.localidad.provincia}
                  </option>
                ))}
            </select>
            {errorDirecciones && <span className="error-message">{errorDirecciones}</span>}
          </div>
          <div className="form-group">
            <label>Fotos</label>
            <input type="file" multiple onChange={handleFileChange} data-testid="fotos-input"/>
            {errorFotos && <span className="error-message">{errorFotos}</span>}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className='btn-cls'>
          <Button variant="secondary"  onClick={handleClose}>
            Cerrar
          </Button>
          </div>
          <Button  onClick={async() => {await handleSubmit();}}>
            {enviando ? <><Spinner
              as="span"
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
              />
              Enviando...</> : 'Enviar'
            }
        </Button>
        </Modal.Footer>
        {error && <span className="error-message">Error al enviar la solicitud</span>}
        {errorProfDir && <span className="error-message">{errorProfDir}</span>}
      </Modal>
    </div>
  );
}

export default NuevaSolicitud;