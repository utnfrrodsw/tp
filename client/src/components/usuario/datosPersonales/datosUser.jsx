import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { useAuth } from '../../../auth/authProvider';
import { API_URL } from '../../../auth/constants.js';
import './datosUser.css';
import NuevaDireccion from '../NuevaDireccion/NuevaDireccion';


const DatosPersonales = () => {
  // Define un estado para los datos personales
  const [userData, setUserData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    fechaNacimiento: '',
  });

  const [direcciones, setDirecciones] = useState([]);
  const [error, setError] = useState(false);
  const [realoadDirecciones, setRealoadDirecciones] = useState(false);


  const auth = useAuth();
  const user = auth.getUser();


  useEffect(() => {
    try{
      const response = fetch(`${API_URL}/direccion/cliente/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.body.direcciones);
        setDirecciones(data.body.direcciones);
      })
      if(response.ok){
        setError(false);
      }else{
        setError(true);
      }
    }catch(error){
      error ? console.log(error): console.log('Error al cargar direcciones');
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
    //aca deberia hacer el reload de las direcciones
    setRealoadDirecciones(true);
    setNuevaDireccion(false);
  };

  // Función para manejar cambios en los datos personales
  const handleUpdateData = () => {
    // Aquí puedes agregar la lógica para actualizar los datos en el backend
    // Ignoramos la implementación real y simplemente mostramos un mensaje
    alert('Datos actualizados');
  };

  // Función para verificar la contraseña actual
  const verifyCurrentPassword = () => {
    // Aquí puedes agregar la lógica para verificar la contraseña actual
    // Si la contraseña es correcta, puedes habilitar la edición de la nueva contraseña
    alert('Contraseña actual verificada. Ahora puedes cambiar la contraseña.');
  };

  // Función para manejar la carga de la foto de perfil
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setFotoPerfil(URL.createObjectURL(file));
  };

  // Función para cerrar sesión
  async function handlelogout(e){
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/usuario/logout`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.getRefreshToken()}`,
        },
      });
      if (response.ok) {
        auth.logout();
      }
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div>
      <Row>
        <Col>
          <Card className='cardDatosPer'>
            <Card.Body>
              <h2 className='h2'>Datos Personales</h2>
              <div className="user-details">
                <div className="profile-picture">
                  {fotoPerfil ? (
                    <img src={fotoPerfil} alt="Foto de perfil" />
                  ) : (
                    <img src='./128-1280406_view-user-icon-png-user-circle-icon-png.png' alt="Foto de perfil por defecto" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                  />
                </div>
                <label htmlFor="firstName">Nombre:</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={user.nombre}
                  onChange={(e) => setUserData({ ...user, nombre: e.target.value })}
                />
                <label htmlFor="lastName">Apellido:</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={user.apellido}
                  onChange={(e) => setUserData({ ...user, apellido: e.target.value })}
                />
                <label htmlFor="email">Correo Electrónico:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={user.email}
                  onChange={(e) => setUserData({ ...user, email: e.target.value })}
                />
                <label htmlFor="birthdate">Fecha de Nacimiento:</label>
                <input
                  type="date"
                  id="birthdate"
                  name="birthdate"
                  value={user.fechaNacimiento}
                  onChange={(e) => setUserData({ ...user, fechaNacimiento: e.target.value })}
                />

                <Button variant="primary" className='button' onClick={handleUpdateData}>
                  Actualizar Datos
                </Button>
                {error && <p>Hubo un error al cargar las direcciones</p>}
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col>
          <Card className='cardDatosPer'>
            {userData.esPrestador ? (
            <Card.Body>
              <h2 className='h2'>Especialidades</h2>
              <div className="user-details">
                <label htmlFor="specialty">Especialidad:</label>
                <input
                  type="text"
                  id="specialty"
                  name="specialty"
                  value={userData.especialidad}
                  onChange={(e) => setUserData({ ...userData, especialidad: e.target.value })}
                />
                <label htmlFor="description">Descripción:</label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={userData.descripcion}
                  onChange={(e) => setUserData({ ...userData, descripcion: e.target.value })}
                />
                <Button variant="primary" className='button' onClick={handleUpdateData}>
                  Actualizar Datos
                </Button>
              </div>
            </Card.Body>) : (
            <Card.Body>
              <h2 className='h2' >Direcciónes</h2>
              <div className="user-details">
                <select>
                  <option>Mis Direcciones</option>
                  {direcciones && direcciones.map((direccion, index) => (
                  <option key={direccion.idDireccion} value={direccion.idDireccion}> {direccion.calle} {direccion.numero} 
                  {direccion.piso || direccion.dpto ? <span>({direccion.piso}{direccion.dpto})</span> : null} 
                  /{direccion.localidad.nombre}/{direccion.localidad.provincia}</option>
                  ))}
                  </select>
                <Button variant="primary" className='button' onClick={() => {setNuevaDireccion(true); console.log(nuevaDireccion)}}>Agregar Direccion</Button>
                {nuevaDireccion && (
                    <NuevaDireccion nuevaDireccion={nuevaDireccion} hendleDireccionesUpdate={agregarDireccion} cerrarMenu={cerrarMenu} />
                )}

              </div>
            </Card.Body>)}
          </Card>
          <Card className='cardSegurity'>
            <Card.Body>
              <h2 className='h2'>Cambiar Contraseña</h2>
              <div className="security-details">
                <label htmlFor="currentPassword">Contraseña Actual:</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={contrasenaActual}
                  onChange={(e) => setContrasenaActual(e.target.value)}
                />
                <Button variant="primary" className='button' onClick={verifyCurrentPassword}>
                  Verificar Contraseña
                </Button>
                {contrasenaActual && (
                  <>
                    <label htmlFor="newPassword">Nueva Contraseña:</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={nuevaContrasena}
                      onChange={(e) => setNuevaContrasena(e.target.value)}
                    />
                    <label htmlFor="confirmNewPassword">Confirmar Nueva Contraseña:</label>
                    <input
                      type="password"
                      id="confirmNewPassword"
                      name="confirmNewPassword"
                      value={confirmNuevaContrasena}
                      onChange={(e) => setConfirmNuevaContrasena(e.target.value)}
                    />
                    <Button variant="primary"  className='button'>Cambiar Contraseña</Button>
                  </>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Link className='ButtonCerrarSesion' onClick={handlelogout}>Cerrar Sesión</Link>
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
