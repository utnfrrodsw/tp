import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/authProvider';
import './Login.css';
const { API_URL } = require('../../../auth/constants');

function Login () {
  const [email, setEmail] = useState('');
  const [constrasena, setContrasena] = useState('');
  const [errorResponse, setErrorResponse] = useState(null); // Estado para mensajes de error
  const goTo = useNavigate();
  const auth = useAuth();
  const [mostrarContrasena, setMostrarContrasena] = useState(false);


  async function handleLogin(e) {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/usuario/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          constrasena,
        }),
      });

      const json = await response.json();

      if (response.ok) {
        setErrorResponse(null);
        

        if (json.body.token && json.body.refreshToken) {
          auth.saveUser(json);
          if (json.body.user.esPrestador) {
            goTo('/provider/home');
          } else if (!json.body.user.esPrestador) {
            goTo('/client/home');
          }
        }
      } else {

        // Si la respuesta contiene errores de validación, manejarlos aquí
        setErrorResponse(json.errors && json.errors.length > 0 ? json.errors[0].msg : json.message );

        if (json.statusCode === 401) {
          setErrorResponse('Usuario o contraseña incorrectos');
        }
      }
    } catch (error) {

      setErrorResponse(error.message || 'Error al conectar con el servidor');
    }
  }

  if (auth.isAuthenticated) {
    return <Navigate to="/client/home" />;
  }

  return (
    <section className='fondoLogin'>
      <div className="wrapper">
        <form onSubmit={handleLogin}>
          <h1>Login</h1>
          <div className="input-box">
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <i className='bx bxs-user'></i>
          </div>
          <div className="input-box">
          <input
             type={mostrarContrasena ? "text" : "password"}
             placeholder="Contraseña"
             value={constrasena}
             onChange={(e) => setContrasena(e.target.value)}
           />
           <button
              type="button"
              className="mostrar-ocultar"
              onClick={() => setMostrarContrasena(!mostrarContrasena)}
              >
            {mostrarContrasena ? "🙈" : "👁️"}
           </button>
           </div>
          {!!errorResponse && (
            <div className="error-message">{errorResponse}</div>
          )}
          <div className="remember-forget">
            <label><input type="checkbox" /> <p>Recuérdame</p> </label>
            <Link to="/recuperarClave">Recuperar Contraseña</Link>
          </div>
          <button type="submit" className="btn">Login</button>
          
          <div className="register-link">
            <p>No tienes cuenta? <Link to="/register">Regístrate</Link></p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
