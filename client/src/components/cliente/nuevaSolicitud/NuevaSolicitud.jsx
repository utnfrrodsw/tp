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
  const [fotos, setFotos] = useState([]);
  const [errorProfesiones, setErrorProfesiones] = useState(false);
  const [errorTitulo, setErrorTitulo] = useState("");
  const [errorDescripcion, setErrorDescripcion] = useState("");
  const [errorProfesion, setErrorProfesion] = useState("");
  const [errorDirecciones, setErrorDirecciones] = useState("");
  const [errorFotos, setErrorFotos] = useState("");
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
      if (!titulo) setErrorTitulo("El titulo es requerido");
      if (!descripcion) setErrorDescripcion("La descripcion es requerida");
      if (!profesion) setErrorProfesion("La profesion es requerida");
      if (!direccion) setErrorDirecciones("La direccion es requerida");
      if (fotos.length === 0) setErrorFotos("Debe cargar al menos una foto");
      if (fotos.length > 5) setErrorFotos("Solo puede cargar hasta 5 fotos");
      setEnviando(false);
      setTimeout(() => {
        setErrorTitulo("");
        setErrorDescripcion("");
        setErrorProfesion("");
        setErrorDirecciones("");
        setErrorFotos("");
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
      await fetch(`${API_URL}/solicitud/cliente/${user.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.getRefreshToken()}`
        },
        body: formdata
      })
      .then((res) => res.json())
      .then((data) => {
              if(data.error){
                data.error.map((error) => {
                  if(error.path === 'titulo') setErrorTitulo(error.msg);
                  if(error.path === 'descripcion') setErrorDescripcion(error.msg);
                  if(error.path === 'idProfesion') setErrorProfesion(error.msg);
                  if(error.path === 'idDireccion') setErrorDirecciones(error.msg);
                  if(error.path === 'fotos') setErrorFotos(error.msg);
                  return null;
                });
                setTimeout(() => {
                  setErrorTitulo("");
                  setErrorDescripcion("");
                  setErrorProfesion("");
                  setErrorDirecciones("");
                  setErrorFotos("");
                }, 10000);
              }else{
                setEnviando(false);
                hendleSolicitudesUpdate();
                handleClose();
              }
            })
      .catch((error) => {
        setEnviando(false);
        setError(true);
        
      });
      setEnviando(false);
    }catch(error){
      setEnviando(false);
      setError(true);
      
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
            {errorTitulo && <span className="error-message">{errorTitulo}</span>}
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
            {errorDescripcion && <span className="error-message">{errorDescripcion}</span>}
          </div>
          <div className="form-group">
            <label>Profesion</label>
            <select value={profesion} onChange={(e) => setProfesion(e.target.value)} >
              <option value="0">seleccione una profesion</option>
              {profesiones.length > 0 &&
              profesiones.map((profesion, index) => (
                <option key={index + 1} value={profesion.idProfesion}>{profesion.nombreProfesion}</option>
              ))}
              {/* Agrega más opciones según tus necesidades */}
            </select>
            {errorProfesion && <span className="error-message">{errorProfesion}</span>}
            {errorProfesiones && <span className="error-message">Error al traer profesiones</span>}
          </div>
          <div className="form-group">
            <label>Direccion</label>
            <select value={direccion} onChange={hendleDireccion}>
              <option value="0">seleccione una dirección</option>
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
            <input type="file" multiple onChange={handleFileChange} />
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
            {enviando ? <><LoandingDots /></> : 'Enviar'}
        </Button>
        </Modal.Footer>
        {error && <span className="error-message">Error al enviar la solicitud</span>}
      </Modal>
    </div>
  );
}

export default NuevaSolicitud;