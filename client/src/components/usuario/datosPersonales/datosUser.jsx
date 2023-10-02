import React, { useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import './datosUser.css';


const DatosPersonales = () => {
  // Define un estado para los datos personales
  const [userData, setUserData] = useState({
    firstName: 'Juan',
    lastName: 'Gonzales',
    email: 'usuario@ejemplo.com',
    birthdate: '1990-01-01',
  });

  // Estado para la contraseña actual
  const [currentPassword, setCurrentPassword] = useState('');

  // Estado para la nueva contraseña
  const [newPassword, setNewPassword] = useState('');

  // Estado para la confirmación de la nueva contraseña
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Estado para la foto de perfil
  const [profilePicture, setProfilePicture] = useState(null);

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
    setProfilePicture(URL.createObjectURL(file));
  };

  return (
    <Row>
      <Col>
        <Card className='cardDatosPer'>
          <Card.Body>
            <h2 className='h2'>Datos Personales</h2>
            <div className="user-details">
              <div className="profile-picture">
                {profilePicture ? (
                  <img src={profilePicture} alt="Foto de perfil" />
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
                value={userData.firstName}
                onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
              />
              <label htmlFor="lastName">Apellido:</label>
<input
  type="text"
  id="lastName"
  name="lastName"
  value={userData.lastName}
  onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
/>
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
  value={userData.birthdate}
  onChange={(e) => setUserData({ ...userData, birthdate: e.target.value })}
/>

              <Button variant="primary" className='button' onClick={handleUpdateData}>
                Actualizar Datos
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
       
      <Col>
        <Card className='cardSegurity'>
          <Card.Body>
            <h2 className='h2'>Cambiar Contraseña</h2>
            <div className="security-details">
              <label htmlFor="currentPassword">Contraseña Actual:</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <Button variant="primary" className='button' onClick={verifyCurrentPassword}>
                Verificar Contraseña
              </Button>
              {currentPassword && (
                <>
                  <label htmlFor="newPassword">Nueva Contraseña:</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <label htmlFor="confirmNewPassword">Confirmar Nueva Contraseña:</label>
                  <input
                    type="password"
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                  />
                  <Button variant="primary"  className='button'>Cambiar Contraseña</Button>
                </>
              )}
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default function App() {
  return (
    <div className='datosPersonales'>
      <DatosPersonales />
    </div>
  );
}
