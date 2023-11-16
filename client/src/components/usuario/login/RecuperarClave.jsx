import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecuperarClave.css';
const { API_URL } = require('../../../auth/constants');

const PasswordResetPage = () => {
  // Inicializamos la función de navegación.
  const goTo = useNavigate();

  // Variables de estado para almacenar el email, el mensaje y el estado de envío.
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Agregamos una variable de estado para almacenar el estado de respuesta.
  const [responseStatus, setResponseStatus] = useState(null);

  // Función para actualizar el estado 'email' cuando el usuario escribe en el campo de entrada.
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Función para manejar la solicitud de restablecimiento de contraseña.
  const handlePasswordReset = async () => {
    try {
      // Enviamos una solicitud POST al punto final de la API de restablecimiento de contraseña.
      const response = await fetch(`${API_URL}/usuario/reset-password/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      // Actualizamos el estado de respuesta.
      setResponseStatus(response.status);

      const json = await response.json();

      if (response.status === 200) {
        setMessage('Se ha enviado un código a tu correo electrónico, por favor revisa tu bandeja de entrada');
        setSubmitted(true);
        const loginURL = `/reset-password?email=${email}`;
        // Redirigir a la URL de inicio de sesión después de un retraso (5 segundos).
        setTimeout(() => {
          goTo(loginURL);
        }, 5000)
      } else {
        // Si la respuesta contiene errores de validación, manejarlos aquí
        setMessage(json.errors && json.errors.length > 0 ? json.errors[0].msg : json.message );
       
        if (json.statusCode === 404) {
          setMessage('No se encontró una cuenta con ese correo electrónico');
        }
      }
    } catch (error) {
      console.error('Error al solicitar el restablecimiento de contraseña:', error);
      setMessage('Error al solicitar el restablecimiento de contraseña');
    }
  };

  // Función para manejar el envío del formulario.
  const handleSubmit = (e) => {
    e.preventDefault();
    handlePasswordReset();
  };

  return (
    <div className="conteinerRecClave">
      <h2>Recuperación de Contraseña</h2>
      {message && <div className={`message ${responseStatus === 200 ? 'success' : 'error'}`}>{message}</div>}
      {!submitted && (
        <form onSubmit={handleSubmit}>
          <div className="Formulario">
            <label htmlFor="email">Proporciona tu email de registro</label>
            <input
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="formularioGrupo">
            <button className='enviarSolicitud' type="submit">Enviar Solicitud</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PasswordResetPage;
