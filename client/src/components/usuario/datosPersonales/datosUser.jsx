import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { useAuth } from '../../../auth/authProvider';
import { API_URL } from '../../../auth/constants.js';
import NuevaDireccion from '../NuevaDireccion/NuevaDireccion';
import './datosUser.css';

const DatosPersonales = () => {
  // Define un estado para los datos personales

  const user = JSON.parse(localStorage.getItem('user'));
  const [nuevaEspecialidad, setNuevaEspecialidad] = useState('');
  const [nombreNuevo, setNombreNuevo] = useState(user.nombre);
  const [apellidoNuevo, setApellidoNuevo] = useState(user.apellido);
  const [emailNuevo, setEmailNuevo] = useState(user.email);
  const [fechaNuevo, setFechaNuevo] = useState(user.fechaNacimiento);
  const [showModalContrasena, setShowModalContrasena] = useState(false);
  

  const [direcciones, setDirecciones] = useState([]);
  const [error, setError] = useState(false);
  const [realoadDirecciones, setRealoadDirecciones] = useState(false);

  const auth = useAuth();

  // Estados para mensajes de error y éxito
  const [errorCurrentPassword, setErrorCurrentPassword] = useState('');
  const [errorAgregarEspecialidad, setErrorAgregarEspecialidad] = useState({
    status: 0,
    message: "",
  });
  const [errorNewPassword, setErrorNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    try {
      const response = fetch(`${API_URL}/direccion/cliente/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data.body.direcciones);
          setDirecciones(data.body.direcciones);
        });
      if (response.ok) {
        setError(false);
      } else {
        setError(true);
      }
    } catch (error) {
      error ? console.log(error) : console.log('Error al cargar direcciones');
      setError(true);
    }
  }, [realoadDirecciones, user.id]);

  const [contrasenaActual, setContrasenaActual] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmNuevaContrasena, setConfirmNuevaContrasena] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [nuevaDireccion, setNuevaDireccion] = useState(false);

  const cerrarMenu = () => {
    setNuevaDireccion(false);
  };

  const agregarDireccion = () => {
    // Deberías realizar aquí el reload de las direcciones
    setRealoadDirecciones(true);
    setNuevaDireccion(false);
  };

  // Función para manejar cambios en los datos personales
  const handleUpdateData = () => {
    // Aquí puedes agregar la lógica para actualizar los datos en el backend
    // Ignoramos la implementación real y simplemente mostramos un mensaje
    alert('Datos actualizados');
  };

  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

  const verifyCurrentPassword = async () => {
    try {
      if (contrasenaActual === '') {
        setErrorCurrentPassword('Por favor, ingresa la contraseña actual.');
        return;
      }
  
      // Lógica para verificar la contraseña actual en la API
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
        setIsPasswordVerified(true); // Marcar que la contraseña actual ha sido verificada con éxito
      } else {
        setErrorCurrentPassword('Contraseña actual incorrecta. Intenta nuevamente.');
        setIsPasswordVerified(false); // Marcar que la contraseña actual no es correcta
      }
    } catch (error) {
      console.error('Error al verificar la contraseña actual:', error);
      // Manejo de errores
    }
  };
  
  const handleChangePassword = async () => {
    try {
      if (nuevaContrasena === '' || confirmNuevaContrasena === '') {
        setErrorNewPassword('Por favor, ingresa la nueva contraseña y confírmala.');
        return;
      }
  
      if (nuevaContrasena !== confirmNuevaContrasena) {
        setErrorNewPassword('La nueva contraseña y la confirmación no coinciden.');
        return;
      }
  
      // Lógica para cambiar la contraseña en la API
      const response = await fetch(`${API_URL}/usuario/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idUsuario: user.id,
          newPassword: nuevaContrasena,
        }),
      });
  
      if (response.status === 200) {
        setErrorNewPassword('');
        setSuccessMessage('Contraseña cambiada con éxito');
        // Limpiar los campos de contraseña
        setContrasenaActual('');
        setNuevaContrasena('');
        setConfirmNuevaContrasena('');
        setIsPasswordVerified(false); // Restablecer isPasswordVerified a false
      } else {
        setErrorNewPassword('Error al cambiar la contraseña. Intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      // Manejo de errores
    }
  };

  // Función para manejar la carga de la foto de perfil
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setFotoPerfil(URL.createObjectURL(file));
  };

  const handleAgregarEspecialidad = async () => {
    console.log(nuevaEspecialidad);
    try{
      const response = await fetch(`${API_URL}/especialidad/agregarEspecialidad/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          especialidad: nuevaEspecialidad,
        }),
      });
      if(response.status === 200){
        setErrorAgregarEspecialidad(response)
      } else if (response.status === 500) {
        setErrorAgregarEspecialidad(response);
      } else {
        setErrorAgregarEspecialidad(response);
      }
      setTimeout(() => {
        setErrorAgregarEspecialidad("");
      }, 10000);
      
    }catch(error){
      setErrorAgregarEspecialidad(true);
    }
  }
  const handleClose = () => setShowModalContrasena(false);

  return (
    <div>
      <Row>
        <Col>
          <Card className='cardDatosPer'>
            <Card.Body>
              <h2 className='h2'>Datos Personales</h2>
              <div className="user-details">
                <label htmlFor="firstName">Nombre:</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={user.nombre}
                  onChange={(e) => setNombreNuevo({ ...user, nombre: e.target.value })}
                />
                <label htmlFor="lastName">Apellido:</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={user.apellido}
                  onChange={(e) => setApellidoNuevo({ ...user, apellido: e.target.value })}
                />
                <label htmlFor="email">Correo Electrónico:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={user.email}
                  onChange={(e) => setEmailNuevo({ ...user, email: e.target.value })}
                />
                <label htmlFor="birthdate">Fecha de Nacimiento:</label>
                <input
                  type="date"
                  id="birthdate"
                  name="birthdate"
                  value={user.fechaNacimiento}
                  onChange={(e) => setFechaNuevo({ ...user, fechaNacimiento: e.target.value })}
                />
  
                <Button variant="primary" className='button' onClick={handleUpdateData}>
                  Actualizar Datos
                </Button>
                <Button variant="primary" className='button' onClick={()=> setShowModalContrasena(true)}>Cambiar Contraseña</Button>
                
              </div>
            </Card.Body>
          </Card>
          <Modal show={showModalContrasena} onHide={handleClose} className='cardSegurity' closeButton>
            <Modal.Header closeButton>
              <Modal.Title>Cambiar Contraseña</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="security-details">
                <label htmlFor="currentPassword">Contraseña Actual:</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={contrasenaActual}
                  onChange={(e) => setContrasenaActual(e.target.value)}
                  className="form-control"
                />
                {errorCurrentPassword && <div className="error-message">{errorCurrentPassword}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
                <Button variant="primary" className='button' onClick={verifyCurrentPassword}>
                  Verificar Contraseña
                </Button>
                
                {isPasswordVerified && (
                  <>
                    <label htmlFor="newPassword">Nueva Contraseña:</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={nuevaContrasena}
                      onChange={(e) => setNuevaContrasena(e.target.value)}
                      className="form-control"
                    />
                    <label htmlFor="confirmNewPassword">Confirmar Nueva Contraseña:</label>
                    <input
                      type="password"
                      id="confirmNewPassword"
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
            </Modal.Body>
          </Modal>
        </Col>
  
        <Col>
          <Card className='cardDatosPer'>
            {user.esPrestador ? (
              <Card.Body>
                <h2 className='h2'>Especialidades</h2>
                <div className="user-details">
                  <input onChange={(e) => setNuevaEspecialidad(e.target.value)}></input>
                  <Button variant="primary" className='button' onClick={handleAgregarEspecialidad}>
                    Agregar Especialidad  
                  </Button>
                  {errorAgregarEspecialidad.status === 200  && <div className="success-message">{errorAgregarEspecialidad.message}</div>}
                  {errorAgregarEspecialidad.status === 500  && <div className="error-message">{errorAgregarEspecialidad.message}</div>}
                </div>
              </Card.Body>
            ) : (
              <></>
            )}
            
          </Card>
          <Card className='cardDatosPer'>
            <Card.Body>
              <h2 className='h2'>Direcciones</h2>
              <div className="user-details">
                <select>
                  <option>Mis Direcciones</option>
                  {direcciones && direcciones.map((direccion, index) => (
                    <option key={direccion.idDireccion} value={direccion.idDireccion}> {direccion.calle} {direccion.numero}
                      {direccion.piso || direccion.dpto ? <span>({direccion.piso}{direccion.dpto})</span> : null}
                      /{direccion.localidad.nombre}/{direccion.localidad.provincia}</option>
                  ))}
                </select>
                <Button variant="primary" className='button' onClick={() => { setNuevaDireccion(true); console.log(nuevaDireccion) }}>Agregar Dirección</Button>
                {nuevaDireccion && (
                  <NuevaDireccion nuevaDireccion={nuevaDireccion} hendleDireccionesUpdate={agregarDireccion} cerrarMenu={cerrarMenu} />
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
