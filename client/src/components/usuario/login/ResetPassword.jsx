import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResetPassword.css';
const { API_URL } = require('../../../auth/constants');

const ResetPasswordPage = () => {
  const goTo = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');

  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [responseStatus, setResponseStatus] = useState(null);

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/usuario/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code, newPassword }),
      });

      setResponseStatus(response.status);

      const data = await response.json();

      if (response.status === 200) {
        setMessage(data.message);
        setSubmitted(true);
        //quiero que tarde 5 segundos en redirigirme a la pagina de login
        setTimeout(() => {
          goTo('/login');
        }
          , 5000);
  
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Error al restablecer la contraseña:', error);
      setMessage('Error al restablecer la contraseña');
    }
  };

  return (
    <section className="contenedor">
      <div className="pagina-restablecer-contrasena">
        <h2>Restablecimiento de Contraseña</h2>
        {message && (
          <div className={`message ${responseStatus === 200 ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
        {!submitted && (
          <form className="grupo-formulario" onSubmit={handleSubmit}>
            <div className="grupo-formulario">
              <label htmlFor="code">Código de Recuperación</label>
              <input
                type="text"
                id="code"
                name="code"
                value={code}
                onChange={handleCodeChange}
                required
              />
            </div>
            <div className="grupo-formulario">
              <label htmlFor="newPassword">Nueva Contraseña</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={handleNewPasswordChange}
                required
              />
            </div>
            <div className="grupo-formulario">
              <button type="submit">Restablecer Contraseña</button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default ResetPasswordPage;
