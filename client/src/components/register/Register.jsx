import axios from 'axios';
import React, { useState } from 'react';
import './Register.css'; // Importa el archivo CSS

const Register = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleRegistro = () => {
    const nuevoUsuario = {
      nombre,
      email,
      contrasena,
    };

    axios.post('/api/register', nuevoUsuario)
      .then(response => {
        console.log('Registro exitoso:', response.data);
        // Mostrar mensaje de éxito o redirigir a otra página
      })
      .catch(error => {
        console.error('Error en el registro:', error);
        // Mostrar mensaje de error
      });
  };

  return (
    <div className="register-container">
      <h2>Registro de Usuario</h2>
      <form>
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input type="text" className="form-control" id="nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" className="form-control" id="email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="contrasena">Contraseña</label>
          <input type="password" className="form-control" id="contrasena" value={contrasena} onChange={e => setContrasena(e.target.value)} />
        </div>
        <button type="button" className="btn btn-primary" onClick={handleRegistro}>Registrarse</button>
      </form>
    </div>
  );
};  

export default Register;
