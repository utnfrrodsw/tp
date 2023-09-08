import React, { useState } from 'react';
import userAvatar from './128-1280406_view-user-icon-png-user-circle-icon-png.png'; // Importa tu imagen de perfil aquí
import './DatosPersonales.css';

const DatosPersonales = () => {
  const [userData, setUserData] = useState({
    username: 'usuarioEjemplo',
    firstName: 'Juan',
    lastName: 'Gonzales',
  });

  // Función para manejar cambios en los datos
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <section className='fondoDatosPersonales'>
    <section className="datos-personales-container">
      <h2>Datos Personales</h2>

      <div className="user-profile">
        <img src={userAvatar} alt="Avatar" className="profile-picture" />
        <h3>{userData.username}</h3>
      </div>

      <div className="user-details">
        <label htmlFor="firstName">Nombre:</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={userData.firstName}
          onChange={handleInputChange}
        />

        <label htmlFor="lastName">Apellido:</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={userData.lastName}
          onChange={handleInputChange}
        />

        <label htmlFor="email">Correo Electrónico:</label>
        <input
          type="email"
          id="email"
          name="email"
          value="usuario@ejemplo.com"
          disabled
        />

        <label htmlFor="birthdate">Fecha de Nacimiento:</label>
        <input
          type="date"
          id="birthdate"
          name="birthdate"
          value="1990-01-01"
          disabled
        />
      </div>

      <button className="btn">Guardar Cambios</button>
    </section>
    </section>
  );
};

export default DatosPersonales;
