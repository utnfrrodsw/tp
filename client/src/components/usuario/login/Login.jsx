import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/authProvider';
import { loginUser } from '../../../services/Login';
import './Login.css';
import LoaderFijo from '../../load/loaderFijo/LoaderFijo';

function Login() {
  const [email, setEmail] = useState('');
  const [constrasena, setContrasena] = useState(''); // Corregido el nombre de la variable
  const [errorResponse, setErrorResponse] = useState(null);
  const goTo = useNavigate();
  const auth = useAuth();
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setIsLoading(true);  
    try {
      const jsonResponse = await loginUser(email, constrasena);
  
      setErrorResponse(null);
  
      if (jsonResponse.statusCode === 200) {
        const responseBody = jsonResponse.body;
  
        if (responseBody && responseBody.token && responseBody.refreshToken) {
          auth.saveUser(jsonResponse);
  
          if (responseBody.user && responseBody.user.esPrestador) {
            goTo('/provider/home');
          } else if (responseBody.user && !responseBody.user.esPrestador) {
            goTo('/client/home');
          }
        }
      } else {
        const firstError = jsonResponse.errors && jsonResponse.errors.length > 0
          ? jsonResponse.errors[0].msg
          : 'Error during login';
  
        setErrorResponse(
          jsonResponse.error || firstError
        );
  
        if (jsonResponse.statusCode === 401) {
          setErrorResponse('Usuario o contraseña incorrectos');
        }
      }
    } catch (error) {
      setErrorResponse(
        error.message || 'Error al conectar con el servidor'
      );
    } finally {
      setIsLoading(false);  
    }
  }
  
  if (auth.isAuthenticated) {
    return <Navigate to="/client/home" />;
  }

  return (
    <section style={{height: '100%'}}>{isLoading ? <LoaderFijo /> : (             
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
    )}</section>
  );
}

export default Login;