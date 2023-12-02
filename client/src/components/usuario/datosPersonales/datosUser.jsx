import { IonAvatar } from '@ionic/react';
import Rating from '@mui/material/Rating';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { useAuth } from '../../../auth/authProvider';
import { API_URL } from '../../../auth/constants.js';
import { modificarDatosPer, obtenerDatosPer } from '../../../services/DatosPersonales.js';
import NuevaDireccion from '../NuevaDireccion/NuevaDireccion';
import avatarDefecto from './avatarDefecto.png';
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
  const user = auth.getUser();

  const [direcciones, setDirecciones] = useState([]);
  const [error, setError] = useState(false);
  const [reloadDirecciones, setReloadDirecciones] = useState(false);

  const [errorCurrentPassword, setErrorCurrentPassword] = useState('');
  const [errorNewPassword, setErrorNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorCurrentDp, setErrorCurrentDp] = useState('');
  const [successMessageDp, setSuccessMessageDp] = useState('');

  const [contrasenaActual, setContrasenaActual] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmNuevaContrasena, setConfirmNuevaContrasena] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState(avatarDefecto);
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

  // Función para obtener los datos del usuario
  const fetchUserData = async () => {
    const idUser = user.id;
    console.log('idUser', idUser);
    try {
      const data = await obtenerDatosPer({idUser});
      setUserData(data);
      setOriginalData(data);
  
      const fotoPerfilUrl = `${API_URL}/usuario/obtenerFotoPerfil/${user.id}`;
      const responseFotoPerfil = await fetch(fotoPerfilUrl);
      if (responseFotoPerfil.ok) {
        setFotoPerfil(fotoPerfilUrl);
      } else {
        setFotoPerfil(avatarDefecto);  
      }
      setLoadingFotoPerfil(false);  
    } catch (error) {
      console.error('Error en fetchUserData:', error);
      setLoadingFotoPerfil(false);  
    }
  };

  // Llama a fetchUserData cuando el componente se monta
  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    try {
      const response = fetch(`${API_URL}/direccion/cliente/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setDirecciones(data.body.direcciones);
        });

      if (response.ok) {
        setError(false);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error(error ? error : 'Error al cargar direcciones');
      setError(true);
    }
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
        const data = await modificarDatosPer(updatedData, user.id);
  
        if (data) {
          setSuccessMessageDp('Datos actualizados con éxito');
          setOriginalData({ ...originalData, ...updatedData });
          setUserData({ ...userData, ...updatedData });
        } else {
          setErrorCurrentDp(data.error || data.message);
          return;
        }
      }
  
    } catch (error) {
      console.error('Error al actualizar los datos personales:', error);
      setErrorCurrentDp(error.message);
    }
  };

  const [profesiones, setProfesiones] = useState([]);

  // Función para obtener las profesiones del usuario
  const fetchProfesiones = async () => {
    try {
      const response = await fetch(`${API_URL}/usuario/obtenerProfesionesUsuario/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setProfesiones(data);
      } else {
        throw new Error('Error al obtener las profesiones del usuario');
      }
    } catch (error) {
      console.error('Error al obtener las profesiones del usuario:', error);
    }
  };

  // Llama a fetchProfesiones cuando el componente se monta o cuando cambia el ID del usuario
  useEffect(() => {
    fetchProfesiones();
  }, [user.id]);

  const [nuevaProfesion, setNuevaProfesion] = useState('');
  const [errorProfesion, setErrorProfesion] = useState('');
  const [successMessageProfesion, setSuccessMessageProfesion] = useState('');

  const agregarProfesionUsuario = async (userId, profesion) => {
    setErrorProfesion('');
    setSuccessMessageProfesion('');
    try {
      const response = await fetch(`${API_URL}/usuario/agregarProfesionesUsuario/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idUsuario: userId, profesiones: [profesion] }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setNuevaProfesion('');
        setProfesiones((prevProfesiones) => [...prevProfesiones, profesion]);
        setSuccessMessageProfesion(data.message || 'Profesión agregada con éxito');
        setErrorProfesion('');
        return data;
      } else {
        const data = await response.json();
        if (data.errors) {
          setErrorProfesion(data.errors.map(error => error.msg).join(', '));
        } else {
          setErrorProfesion(data.message || 'Error desconocido');
        }
      }
    } catch (error) {
      setErrorProfesion(error.message);
      setSuccessMessageProfesion('');
    }
  };

  const handleRemoveProfesion = async (profesion) => {
    setSuccessMessageProfesion('');
    setErrorProfesion('');
    try {
      const response = await fetch(`${API_URL}/usuario/eliminarProfesionUsuario/${user.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idUsuario: user.id, profesion: profesion }),
      });

      if (response.ok) {
        // Actualiza la lista de profesiones eliminando la que se eliminó
        setProfesiones(prevProfesiones => prevProfesiones.filter(p => p !== profesion));
        setSuccessMessageProfesion('Profesión eliminada con éxito');
      } else {
        throw new Error(`Error al eliminar la profesión: ${response.status}`);
      }
    } catch (error) {
      console.error('Error al eliminar la profesión:', error);
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

      const response = await fetch(`${API_URL}/usuario/verify-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idUsuario: user.id,
          currentPassword: contrasenaActual,
        }),
      });

      if (response.status === 200) {
        setErrorCurrentPassword('');
        setSuccessMessage('Contraseña actual verificada. Ahora puedes cambiar la contraseña.');
        setIsPasswordVerified(true);
      } else {
        setErrorCurrentPassword('Contraseña actual incorrecta. Intenta nuevamente.');
        setIsPasswordVerified(false);
      }
    } catch (error) {
      console.error('Error al verificar la contraseña actual:', error);
    }
  };

  const handleChangePassword = async () => {
    try {
      const response = await fetch(`${API_URL}/usuario/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idUsuario: user.id,
          newPassword: nuevaContrasena,
          confirmPassword: confirmNuevaContrasena,
        }),
      });
  
      const data = await response.json();
  
      if (response.status === 200) {
        setErrorNewPassword('');
        setSuccessMessage('Contraseña cambiada con éxito');
        setContrasenaActual('');
        setNuevaContrasena('');
        setConfirmNuevaContrasena('');
        setIsPasswordVerified(false);
      } else {
        // Si la respuesta contiene un campo de errores, mostrar esos mensajes de error
        setErrorNewPassword(data.errors && data.errors.length > 0 ? data.errors[0].msg : data.message );
      
      }
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
    }
  };

  const handleProfilePictureChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setFotoPerfil(URL.createObjectURL(file));
      setSelectedFile(file);
    } else {
      // Si el usuario no seleccionó una foto, establece la foto de perfil en una imagen predeterminada
      setFotoPerfil(avatarDefecto);
      setSelectedFile(null);
    }
  };

  const [errorMessageFoto, setErrorMessageFoto] = useState(null);

  const handleProfilePictureUpload = async () => {
    setErrorMessageFoto('');
    setSuccessMessageFoto('');
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
  
      try {
        const response = await fetch(`${API_URL}/usuario/cargarFotoPerfil/${user.id}`, {
          method: 'PUT',
          body: formData,
        });
  
        const data = await response.json();
  
        if (response.ok) {
          
          setSuccessMessageFoto('Foto de perfil actualizada con éxito');
          // Limpiar el mensaje de error si la carga fue exitosa
          setErrorMessageFoto(null);
        } else {
          // Si la respuesta contiene un campo de error, mostrar ese mensaje de error
          if (data.error) {
            setErrorMessageFoto(data.error);
          } else {
            setErrorMessageFoto('Error al cargar la foto de perfil');
          }
        }
      } catch (error) {
        console.error('Error en handleProfilePictureUpload:', error);
        setErrorMessageFoto(error.message);
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
      <Row className="row">
        <Col>
          <Card className="cardDatosPer">
            <Card.Body>
              <h2 className="h2">Datos Personales</h2>
              <div className="user-details">
              <div className="profile-picture">
              {loadingFotoPerfil ? (
                 <div>Loading...</div>
                 ) : (
                  <IonAvatar className="ion-avatar" onClick={handleImageClick}>
                   <img
                     src={fotoPerfil ? fotoPerfil : avatarDefecto}
                     alt="foto"
                     className="round-image"
                     />
                    </IonAvatar>
                     )}
                     <Button
                     variant='primary'
                     className='button'
                     onClick={handleProfilePictureUpload} 
                     >
                    Cambiar Foto
                  </Button>
                 {successMessageFoto && <div className="success-message">{successMessageFoto}</div>}
                 {errorMessageFoto && <div className="error-message">{errorMessageFoto}</div>}  
                 <input
                 type="file"
                accept="image/*"
            onChange={handleProfilePictureChange}
          className="file-input"
         />

         <Modal show={showModal} onHide={handleCloseModal}>
         <Modal.Header closeButton>
          <Modal.Title>Visualización de imagen</Modal.Title>
           </Modal.Header>
            <Modal.Body>
               <img
               src={fotoPerfil ? fotoPerfil : avatarDefecto}
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
        </Col>
        {!!user.esPrestador && (
       <Col>
        <Card className='cardSegurity'>
          <h2 className='h2'>Reputación:</h2>
          <h2><Rating name="read-only" value={userData.promedioResenas} readOnly precision={0.25}/></h2>
        </Card>
        <Card className='cardSegurity'>
         <Card.Body>
          <div>
           <h2 className="h2">Profesiones</h2>
            <div className="user-details">
             {profesiones.map((profesion, index) => (
              <div key={index} className="profesion-item">
                <p>{profesion}</p>
                <Button variant="danger" onClick={() => handleRemoveProfesion(profesion)}>
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
        </Card>
        </Col>
         )}


        <Col>
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
          </Card>
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
