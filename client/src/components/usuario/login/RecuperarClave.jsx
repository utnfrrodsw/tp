import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recClave } from '../../../services/RecuperarClave.js';
import Loader from '../../load/loader/Loader';
import './RecuperarClave.css';

const PasswordResetPage = () => {
  // Inicializamos la función de navegación.
  const goTo = useNavigate();

  // Variables de estado para almacenar el email, el mensaje y el estado de envío.
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Agregamos una variable de estado para almacenar el estado de respuesta.
  const [responseStatus, setResponseStatus] = useState(null);

  // Estado para controlar el loader
  const [isLoading, setIsLoading] = useState(false);

  // Función para actualizar el estado 'email' cuando el usuario escribe en el campo de entrada.
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Función para manejar la solicitud de restablecimiento de contraseña.
  const handlePasswordReset = async () => {
    setIsLoading(true);

    try {
      const jsonResponse = await recClave(email);
      // Actualizamos el estado de respuesta.
      setResponseStatus(jsonResponse.statusCode);
       
      if (jsonResponse.statusCode === 200) {
        setMessage('Se ha enviado un código a tu correo electrónico, por favor revisa tu bandeja de entrada');
        setSubmitted(true);
        const loginURL = `/reset-password?email=${email}`;
        // Redirigir a la URL de inicio de sesión después de un retraso (5 segundos).
        setTimeout(() => {
          goTo(loginURL);
        }, 5000);
      } else {
        const firstError = jsonResponse.error || (jsonResponse.errors && jsonResponse.errors.length > 0
          ? jsonResponse.errors[0].msg
          : 'Error durante el restablecimiento de la contraseña');

        setMessage(firstError);

        if (jsonResponse.statusCode === 404) {
          setMessage('No se encontró una cuenta con ese correo electrónico');
        }
      }
    } catch (error) {
      console.error('Error al solicitar el restablecimiento de contraseña:', error);
      setMessage('Error al solicitar el restablecimiento de contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para manejar el envío del formulario.
  const handleSubmit = (e) => {
    e.preventDefault();
    handlePasswordReset();
  };

  return (
    <section>
      {isLoading ? <Loader /> : (
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
      )}
    </section>
  );
};

export default PasswordResetPage;
