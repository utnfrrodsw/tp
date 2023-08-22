//PAGE REGISTER

import React, { useState } from 'react'; // Importar React y useState desde 'react'
import axios from 'axios'; // Importar la librería axios para realizar solicitudes HTTP
import '../styles.css'; // Importar el archivo CSS que contiene los estilos generales

//FALTA AGREGAR VALIDACIONES Y DATOS DEL REGISTRO

const Registro = () => {
    const [nombre, setNombre] = useState(''); // Estado para almacenar el nombre
    const [email, setEmail] = useState(''); // Estado para almacenar el email
    const [contrasena, setContrasena] = useState(''); // Estado para almacenar la contraseña
  
    const handleRegistro = () => {
      const nuevoUsuario = {
        nombre,
        email,
        contrasena,
      };
  
      // Enviar solicitud POST a la ruta '/api/registro' con los datos del nuevo usuario
      axios.post('/api/registro', nuevoUsuario)
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
      <div id="register" >
        <h2>REGISTRO DE USUARIOS</h2>
        <form id="formRegister"> 
          <input id="" type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
          <input id="" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input id="" type="password" placeholder="Contraseña" value={contrasena} onChange={e => setContrasena(e.target.value)} />
          <button id="buttonRegister" type="button" onClick={handleRegistro}>Registrarse</button>
        </form>
      </div>
    );
};

export default Registro; // Exportar el componente 'Registro'