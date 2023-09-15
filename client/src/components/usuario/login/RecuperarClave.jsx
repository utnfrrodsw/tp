import React, { useState } from 'react';
import './RecuperarClave.css';

const PasswordResetPage = () => {
  // Estado para almacenar el correo electrónico ingresado por el usuario
  const [email, setEmail] = useState('');
  // Estado para mostrar un mensaje de éxito o error
  const [message, setMessage] = useState('');
  // Estado para controlar si se envió el formulario
  const [submitted, setSubmitted] = useState(false);

  // Manejar cambios en el campo de correo electrónico
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar lógica para enviar una solicitud de restablecimiento de contraseña al servidor.
    // Esto podría involucrar una llamada a una API.
    // Después de enviar la solicitud, puedes mostrar un mensaje de éxito o error.
    // Por simplicidad, aquí simplemente mostramos un mensaje de éxito simulado después de 2 segundos.

    // Simulación de solicitud de restablecimiento de contraseña
    setTimeout(() => {
      setMessage('Se ha enviado un correo electrónico con las instrucciones para restablecer la contraseña.');
      setSubmitted(true);
    }, 2000);
  };

  return (
    <section className='container'>
    <div className="password-reset-page">
      <h2>Recuperación de Contraseña</h2>
      {submitted ? (
        // Mostrar mensaje de éxito
        <div className="success-message">{message}</div>
      ) : (
        // Mostrar formulario de recuperación de contraseña
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="form-group">
            <button type="submit">Enviar Solicitud</button>
          </div>
        </form>
      )}
    </div>
    </section>
  );
};

export default PasswordResetPage;
