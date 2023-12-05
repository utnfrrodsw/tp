import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetRecPass } from '../../../services/RecuperarClave';
import './ResetPassword.css';
import LoaderFijo from '../../load/loaderFijo/LoaderFijo';

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

  const [confirmPassword, setConfirmPassword] = useState(''); // Nuevo estado para confirmar la contraseña

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const jsonResponse = await resetRecPass(email, code, newPassword, confirmPassword);
      setResponseStatus(jsonResponse.message);
       
      if ( jsonResponse.message === 'Contraseña restablecida con éxito') {
        setMessage( 'Contraseña restablecida con éxito');
        setSubmitted(true);
        //quiero que tarde 5 segundos en redirigirme a la pagina de login
        setTimeout(() => {
          goTo('/login');
        }, 5000);
         
      } else {
        const firstError = jsonResponse.errors && jsonResponse.errors.length > 0
        ? jsonResponse.errors[0].msg
        : 'Error during reset password';
        setMessage(
        jsonResponse.error || firstError
        );
        
        if (jsonResponse.message === 'Código de recuperación no válido') {
          setMessage('Código de recuperación no válido');
        }

       }
       
    } catch (error) {
      setMessage('Error al restablecer la contraseña:');
    }
    finally {
      setIsLoading(false); 
    }
  };


  return (
    <section>{isLoading ? <LoaderFijo /> : (
    <section className="contenedor">
      <div className="pagina-restablecer-contrasena">
        <h2>Restablecimiento de Contraseña</h2>
        {message && (
          <div className={`message ${responseStatus === 'Contraseña restablecida con éxito' ? 'success' : 'error'}`}>
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
                 
              />
            </div>
            <div className="grupo-formulario">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
               
            />
          </div>
            <div className="grupo-formulario">
              <button type="submit">Restablecer Contraseña</button>
            </div>
          </form>
        )}
      </div>
    </section>
    )}</section>
  );
};

export default ResetPasswordPage;
