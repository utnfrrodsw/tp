import { IonAvatar } from '@ionic/react';
import Rating from '@mui/material/Rating';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import Placeholder from 'react-bootstrap/Placeholder';
import { useAuth } from '../../../auth/authProvider';
import { REACT_APP_PHOTO, REACT_APP_CLIENT } from '../../../auth/constants.js';
import { agregarProfesion, getDatosPersonales, getDirecciones, getProfesiones, modificarDatosPer, fetchFotoPerfil, fetchSetFotoPerfil, fetchDeleteProfesion, fetchVerificarPassword, fetchCambiarContrasena } from '../../../services/DatosPersonales.js';
import LoaderFijo from '../../load/loaderFijo/LoaderFijo.jsx';
import NuevaDireccion from '../NuevaDireccion/NuevaDireccion';
import './datosUser.css';

const DatosPersonales = () => {
  const [userData, setUserData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    fechaNacimiento: '',
    promedioResenas: null
  });

  const [originalData, setOriginalData] = useState({ ...userData });

  const auth = useAuth();
  const user = JSON.parse(localStorage.getItem('user'));

  const [direcciones, setDirecciones] = useState([]);
  const [error, setError] = useState("");
  const [reloadDirecciones, setReloadDirecciones] = useState(false);

  const [errorCurrentPassword, setErrorCurrentPassword] = useState('');
  const [errorNewPassword, setErrorNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorCurrentDp, setErrorCurrentDp] = useState('');
  const [successMessageDp, setSuccessMessageDp] = useState('');

  const [contrasenaActual, setContrasenaActual] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmNuevaContrasena, setConfirmNuevaContrasena] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState(undefined);
  const [selectedFile, setSelectedFile] = useState(null);
  const [successMessageFoto, setSuccessMessageFoto] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState('');
  const [mostrarContrasena2, setMostrarContrasena2] = useState('');


  const [nuevaDireccion, setNuevaDireccion] = useState(false);

  const cerrarMenu = () => {
    setNuevaDireccion(false);
  };

  const agregarDireccion = () => {
    setReloadDirecciones(true);
    setNuevaDireccion(false);
  };


  const [loadingFotoPerfil, setLoadingFotoPerfil] = useState(true);

  const hendleObtenerFotoPerfil = async () => {
    setLoadingFotoPerfil(true);
    try{
      const responseFoto = await fetchFotoPerfil(user.id);
      if(responseFoto.statusCode === 200){
        setFotoPerfil(responseFoto.body.NombreFoto);
      }
    }catch(error){
      setError(error.message);
    }finally{
      setLoadingFotoPerfil(false);
    }
  };

  const [loadDatosPersonales, setLoadDatosPersonales] = useState(true);
  // Función para obtener los datos del usuario
  const fetchUserData = async () => {
    setLoadDatosPersonales(true);
    const idUser = JSON.parse(localStorage.getItem('user')).id;
    try {
      const responseDatosUser = await getDatosPersonales(idUser);
      if(responseDatosUser.statusCode === 200){
        setUserData(responseDatosUser.body.respuestaUsuario);
        setOriginalData(responseDatosUser.body.respuestaUsuario);
      }else{
        setError(responseDatosUser.body.message);
      }
      hendleObtenerFotoPerfil();
    } catch (error) {
      setError(error || "Error al cargar Foto de Perfil");
    } finally {
      setLoadingFotoPerfil(false);
      setLoadDatosPersonales(false);
      setTimeout(() => {
        setError("");
      }, 10000);
    }
  };

  // Llama a fetchUserData cuando el componente se monta
  useEffect(() => {
    fetchUserData();
  }, []);

  const [loadDirecciones, setLoadDirecciones] = useState(true);
  useEffect(() => {
    const fetchDireccionesData = async () => {
      setLoadDirecciones(true);
      try {
        const response = await getDirecciones(user.id);
        if(response.statusCode === 200){
          setDirecciones(response.body.direcciones);
          setError("");
        }else{
          setError(response.message);
        }
      } catch (error) {
        setError(error.message || 'Error al cargar direcciones');
      }finally{
        setLoadDirecciones(false);
        setTimeout(() => {
          setError("");
        }, 10000);
      }
    };
    fetchDireccionesData();
  }, [reloadDirecciones, user.id]);

  const handleUpdateData = async () => {
    try {
      setErrorCurrentDp('');
      setSuccessMessageDp('');
  
      // Comprobar si se han realizado cambios
      if (JSON.stringify(userData) === JSON.stringify(originalData) && !selectedFile) {
        setErrorCurrentDp('No se han realizado cambios en los datos personales.');
        return;
      }
      
      const updatedData = {
        nombre: userData.nombre,
        apellido: userData.apellido,
        email: userData.email,
        fechaNacimiento: userData.fechaNacimiento,
      };
  
      // Actualizar datos personales solo si se han modificado
      if (JSON.stringify(updatedData) !== JSON.stringify(originalData)) {
        const response = await modificarDatosPer(updatedData, user.id, auth.getRefreshToken());
        if (response.statusCode === 200) {
          setSuccessMessageDp('Datos actualizados con éxito');
          setOriginalData({ ...originalData, ...updatedData });
          setUserData({ ...userData, ...updatedData });
        } else {
          if (response.errors && response.errors.length > 0) {
            setErrorCurrentDp(response.errors[0].msg);
          } else {
            setErrorCurrentDp('Ocurrió un error desconocido');
          }
          return;
        }
      }
  
    } catch (error) {
      setErrorCurrentDp(error.message);
    }
  };


  const [profesiones, setProfesiones] = useState([]);
  const [loadProfesiones, setLoadProfesiones] = useState(false);
  // Función para obtener las profesiones del usuario
  const fetchProfesiones = async () => {
    try {
      setLoadProfesiones(true)
      const response = await getProfesiones(user.id);
      if(response.statusCode === 200){
        setProfesiones(response.body.profesiones);
      }else{
        setError(response.message);
      }
    } catch (error) {
      setError(error.message)
    }finally{
      setLoadProfesiones(false);
    }
  };

  // Llama a fetchProfesiones cuando el componente se monta o cuando cambia el ID del usuario
  useEffect(() => {
    fetchProfesiones();
  }, [user.id]);

  const [nuevaProfesion, setNuevaProfesion] = useState('');
  const [errorProfesion, setErrorProfesion] = useState('');
  const [successMessageProfesion, setSuccessMessageProfesion] = useState('');

  const agregarProfesionUsuario = async (idUsuario, profesion) => {
    setLoadProfesiones(true);
    setErrorProfesion('');
    setSuccessMessageProfesion('');
     try {
      const response = await agregarProfesion( idUsuario,profesion  );
      if (response.statusCode === 200) {
        setNuevaProfesion('');
        setProfesiones((prevProfesiones) => [...prevProfesiones, profesion]);
        setSuccessMessageProfesion( 'Profesión agregada con éxito');
        setErrorProfesion('');
      } else {
        if (response.menssage === 'La profesión ya existe para este usuario') {
          setErrorProfesion('La profesión ya existe para este usuario');
        }
        const firstError = response.errors && response.errors.length > 0
        ? response.errors[0].msg
        : 'Error al agregar la profesión';

        setErrorProfesion(
          response.error || firstError
        );

      }
    } catch (error) {
      setErrorProfesion(error.message);
      setSuccessMessageProfesion('');
    }finally{
      setLoadProfesiones(false);
    }
  };

  const handleRemoveProfesion = async (idProfesion) => {
    setSuccessMessageProfesion('');
    setErrorProfesion('');
    try {
      setLoadProfesiones(true);
      const response = await fetchDeleteProfesion(user.id, idProfesion, auth.getRefreshToken());
      if (response.statusCode === 200) {
        setProfesiones(prevProfesiones => prevProfesiones.filter(p => p.idProfesion !== idProfesion));
        setSuccessMessageProfesion('Profesión eliminada con éxito');
      }else{
        setErrorProfesion(response.body.message);
      }
    } catch (error) {
      setErrorProfesion(error.message);
    }finally{
      setLoadProfesiones(false);
    }
  };

  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

  const verifyCurrentPassword = async () => {
    setErrorCurrentPassword('');
    setSuccessMessage('');
    try {
      if (contrasenaActual === '') {
        setErrorCurrentPassword('Por favor, ingresa la contraseña actual.');
        return;
      }

      const response = await fetchVerificarPassword(user.id, contrasenaActual);
      if (response.statusCode === 200) {
        setErrorCurrentPassword('');
        setSuccessMessage('Contraseña actual verificada. Ahora puedes cambiar la contraseña.');
        setIsPasswordVerified(true);
      } else {
        setErrorCurrentPassword('Contraseña actual incorrecta. Intenta nuevamente.');
        setIsPasswordVerified(false);
      }
    } catch (error) {
      setError(error.message)
    }
  };

  const handleChangePassword = async () => {
    try {
      const response = await fetchCambiarContrasena( user.id, nuevaContrasena, confirmNuevaContrasena);
      if (response.statusCode === 200) {
        setErrorNewPassword('');
        setSuccessMessage('Contraseña cambiada con éxito');
        setContrasenaActual('');
        setNuevaContrasena('');
        setConfirmNuevaContrasena('');
        setIsPasswordVerified(false);
      } else {
        // Si la respuesta contiene un campo de errores, mostrar esos mensajes de error
        setErrorNewPassword(response.errors && response.errors.length > 0 ? response.errors[0].msg : response.message );
      }
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      setError(error.message)
    }
  };

  const [errorMessageFoto, setErrorMessageFoto] = useState(null);

  const handleProfilePictureUpload = async (e) => {
    setErrorMessageFoto('');
    setSuccessMessageFoto('');
    setLoadingFotoPerfil(true);
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await fetchSetFotoPerfil(user.id, formData);
        if(response.statusCode === 200){
          setSuccessMessageFoto('Foto de perfil actualizada con éxito');
          setErrorMessageFoto(null);
          hendleObtenerFotoPerfil();
        }else{
          if (response.error) {
            setErrorMessageFoto(response.error);
          } else {
            setErrorMessageFoto('Error al cargar la foto de perfil');
          }
        }
      } catch (error) {
        console.error('Error en handleProfilePictureUpload:', error);
        setErrorMessageFoto(error.message);
      }finally{
        setLoadingFotoPerfil(false);
      }
    }
  };

  const [showModal, setShowModal] = useState(false);

  const handleImageClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="datosPersonales">
      <Row className="row" style={user.esPrestador ? ({width: '100%'}): ({width:'80%'}) }>
        <Col>
          {!loadDatosPersonales ? (
          <Card className="cardDatosPer">
            <Card.Body>
              <h2 className="h2">Datos Personales</h2>
              <div className="user-details">
              <div className="profile-picture">
                {loadingFotoPerfil ? (
                <div><LoaderFijo/></div>
                ) : (
                <IonAvatar className="ion-avatar" onClick={handleImageClick}>
                  <img
                    src={fotoPerfil ? `${REACT_APP_PHOTO}/images/fotoPerfil/${fotoPerfil}` : REACT_APP_CLIENT + `/images/fotoPerfil/avatarDefecto.png`}
                    alt="foto"
                    className="round-image"
                    />
                </IonAvatar>
                )}
                {successMessageFoto && <div className="success-message">{successMessageFoto}</div>}
                {errorMessageFoto && <div className="error-message">{errorMessageFoto}</div>}  
                <input type="file" accept="image/*" onChange={handleProfilePictureUpload} className="file-input"/>
                <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Visualización de imagen</Modal.Title>
                  </Modal.Header>
                    <Modal.Body>
                      <img
                      src={fotoPerfil ? (`${REACT_APP_PHOTO}/images/fotoPerfil/${fotoPerfil}`) : REACT_APP_CLIENT  + `/images/fotoPerfil/avatarDefecto.png`}
                      alt="foto"
                      className="modal-image"
                      style={{ width: '100%', height: 'auto' }}
                    />
                    </Modal.Body>
                  </Modal>
              </div>
              <label htmlFor="firstName">Nombre:</label>
              <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={userData.nombre}
                  onChange={(e) => setUserData({ ...userData, nombre: e.target.value })}
                />
                <label htmlFor="lastName">Apellido:</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={userData.apellido}
                  onChange={(e) => setUserData({ ...userData, apellido: e.target.value })}
                />
                <div className="vertical-items">
                  <label htmlFor="email">Correo Electrónico:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  />
                  <label htmlFor="birthdate">Fecha de Nacimiento:</label>
                  <input
                    type="date"
                    id="birthdate"
                    name="birthdate"
                    value={userData.fechaNacimiento}
                    onChange={(e) => setUserData({ ...userData, fechaNacimiento: e.target.value })}
                  />
                </div>
                {errorCurrentDp && <div className="error-message">{errorCurrentDp}</div>}
                {successMessageDp && <div className="success-message">{successMessageDp}</div>}
                <Button
                  variant="primary"
                  className="button"
                  onClick={() => { 
                    handleUpdateData();
                  }}
                >
                  Actualizar Datos
                </Button>
              </div>
            </Card.Body>
          </Card>
          ) : (
            <Card className="cardDatosPer" style={{width: '100%', height:'80%'}}>
            <Card.Body >
              <div className="user-details" style={{height:'90%'}}  >
              <Placeholder as={Card.Title} animation="glow">
                <Placeholder sm={10} />
              </Placeholder>
              <Placeholder as={Card.Text} animation="glow">
                <Placeholder lg={7} />
                <Placeholder lg={8} /> 
                <Placeholder lg={5} /> 
                <Placeholder lg={9} />
                <Placeholder lg={8} />
                <Placeholder lg={5} />
                <Placeholder lg={7} />
                <Placeholder lg={6} />
              </Placeholder>
              <Placeholder.Button variant="primary" sm={6} />
              </div>
            </Card.Body>
            </Card>
          )}
        </Col>
        {!!user.esPrestador && (
          <>
            <Col>
              <Card className='cardSegurity'>
                <h2 className='h2'>Reputación:</h2>
                <h2><Rating name="read-only" value={userData.promedioResenas} readOnly precision={0.25}/></h2>
              </Card>
              <Card className='cardSegurity'>
              {!loadProfesiones ? (
                <Card.Body>
                  <div>
                  <h2 className="h2">Profesiones</h2>
                    <div className="user-details">
                    {profesiones.map((profesion, index) => (
                      <div key={index} className="profesion-item">
                        <p>{profesion.profesion}</p>
                        <Button variant="danger" onClick={() => handleRemoveProfesion(profesion.idProfesion)}>
                          Eliminar
                        </Button>
                      </div>
                    ))}
                  </div>
                  <form
                  onSubmit={async (event) => {
                  event.preventDefault();
                  if (!nuevaProfesion.trim()) {
                  setErrorProfesion('La profesión no puede estar vacía.');
                  return;
                  }
                  await agregarProfesionUsuario(user.id, nuevaProfesion.toLowerCase());
                  await fetchProfesiones();
                  }}
                  >
                  <label className='agregarProfesion'>
                    <input
                      type="text"
                        placeholder='Nueva Profesion'
                        value={nuevaProfesion}
                          onChange={(e) => setNuevaProfesion(e.target.value)}
                          />
                    </label>
                    <button type="submit" className='button' disabled={!nuevaProfesion.trim()}>
                      Agregar profesión
                    </button>
                  </form>
                {errorProfesion && <div className="error-message">{errorProfesion}</div>}
                {successMessageProfesion && <div className="success-message">{successMessageProfesion}</div>}
                </div>
                </Card.Body>
              ) : (
                <Card.Body>
                  <div className="user-details">
                    <Placeholder as={Card.Title} animation="glow">
                      <Placeholder xs={10} />
                    </Placeholder>
                    <Placeholder as={Card.Text} animation="glow">
                      <Placeholder xs={15} />
                      <Placeholder xs={10} /> 
                    </Placeholder>
                    <Placeholder.Button variant="primary" xs={6} />
                  </div>
                </Card.Body>
              )}
              </Card>
            </Col>
          </>
        )}
        <Col>
          {!loadDirecciones ?
            <Card className='cardDatosPer'>
              <Card.Body>
                <h2 className='h2'>Direcciones</h2>
                <div className="user-details">
                  <select>
                    <option>Mis Direcciones</option>
                    {direcciones && direcciones.map((direccion, index) => (
                      <option key={direccion.idDireccion} value={direccion.idDireccion}>
                        {direccion.calle} {direccion.numero}
                        {direccion.piso || direccion.dpto ? <span>({direccion.piso}{direccion.dpto})</span> : null}
                        /{direccion.localidad.nombre}/{direccion.localidad.provincia}
                      </option>
                    ))}
                  </select>
                  <Button variant="primary" className='button' onClick={() => { setNuevaDireccion(true); console.log(nuevaDireccion) }}>Agregar Dirección</Button>
                  {nuevaDireccion && (
                    <NuevaDireccion nuevaDireccion={nuevaDireccion} hendleDireccionesUpdate={agregarDireccion} cerrarMenu={cerrarMenu} />
                  )}
                </div>
              </Card.Body>
            </Card>:
            <Card className="cardDatosPer" style={{ width: '100%' }}>
              <Card.Body>
                <div className="user-details">
                  <Placeholder as={Card.Title} animation="glow">
                    <Placeholder xs={10} />
                  </Placeholder>
                  <Placeholder as={Card.Text} animation="glow">
                    <Placeholder xs={15} />
                    <Placeholder xs={10} /> 
                  </Placeholder>
                  <Placeholder.Button variant="primary" xs={6} />
                </div>
              </Card.Body>
            </Card>
          }
          <Card className='cardSegurity'>
            <Card.Body>
              <div className="security-details">
                <h2 className='h2'>Cambiar Contraseña</h2>
                <label htmlFor="currentPassword">Contraseña Actual:</label>
                <div className='input-wrapper'>
                <input
                  type={mostrarContrasena ? "text" : "password"}
                  placeholder="Contraseña"
                  id="currentPassword"
                  name="currentPassword"
                  value={contrasenaActual}
                  onChange={(e) => setContrasenaActual(e.target.value)}
                />
               <button
                 type="button"
                 className="mostrar-ocultar"
                 onClick={() => setMostrarContrasena(!mostrarContrasena)}
                 >
                {mostrarContrasena ? "🙈" : "👁️"}
              </button>
              </div>
                {errorCurrentPassword && <div className="error-message">{errorCurrentPassword}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
                <Button variant="primary" className='button' onClick={verifyCurrentPassword}>
                  Verificar Contraseña
                </Button>

                {isPasswordVerified && (
                  <>
                    <label htmlFor="newPassword">Nueva Contraseña:</label>
                    <div className='input-wrapper'>
                     <input
                     type={mostrarContrasena2 ? "text" : "password"}
                     placeholder="Contraseña"
                     id="currentPassword"
                     name="currentPassword"
                     value={nuevaContrasena}
                     onChange={(e) => setNuevaContrasena(e.target.value)}
                       />
                      <button
                     type="button"
                     className="mostrar-ocultar"
                     onClick={() => setMostrarContrasena2(!mostrarContrasena2)}
                      >
                      {mostrarContrasena2 ? "🙈" : "👁️"}
                    </button>
                    </div>
                    <label htmlFor="confirmNewPassword">Confirmar Nueva Contraseña:</label>
                    <input
                      type="password"
                      id="confirmNewPassword"
                      placeholder="Constraseña"
                      name="confirmNewPassword"
                      value={confirmNuevaContrasena}
                      onChange={(e) => setConfirmNuevaContrasena(e.target.value)}
                      className="form-control"
                    />
                    {errorNewPassword && <div className="error-message">{errorNewPassword}</div>}
                    <Button variant="primary" className='button' onClick={handleChangePassword}>Cambiar Contraseña</Button>
                  </>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default function App() {
  return (
    <div className='datosPersonales'>
      <DatosPersonales />
    </div>
  );
}
