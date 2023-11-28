import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/authProvider';
import { loginUser } from '../../../services/Login';
import './Login.css';
const { API_URL } = require('../../../auth/constants');

function Login() {
  const [email, setEmail] = useState('');
  const [constrasena, setContrasena] = useState(''); // Corregido el nombre de la variable
  const [errorResponse, setErrorResponse] = useState(null);
  const goTo = useNavigate();
  const auth = useAuth();
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const { response, json, error } = await loginUser(email, constrasena); 

      if (response.ok) {
        setErrorResponse(null);

        const responseBody = json.body;

        if (responseBody.token && responseBody.refreshToken) {
          auth.saveUser(json);

          if (responseBody.user.esPrestador) {
            goTo('/provider/home');
          } else if (!responseBody.user.esPrestador) {
            goTo('/client/home');
          }
        }
      } else {
        setErrorResponse(
          error ||
            (json && json.errors && json.errors.length > 0
              ? json.errors[0].msg
              : json.message)
        );

        if (json && json.statusCode === 401) {
          setErrorResponse('Usuario o contraseña incorrectos');
        }
      }
    } catch (error) {
      setErrorResponse(
        error.message || 'Error al conectar con el servidor'
      );
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
              value={constrasena} // Corregido el nombre de la variable
              onChange={(e) => setContrasena(e.target.value)} // Corregido el nombre de la variable
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
          <button type="submit" className="btn">
            Login
          </button>

          <div className="register-link">
            <p>No tienes cuenta? <Link to="/register">Regístrate</Link></p>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Login;
