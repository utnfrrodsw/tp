import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import './Login.css';
import { useAuth } from '../../../auth/authProvider';
const { API_URL } = require('../../../auth/constants');

function Login () {
  const [email, setEmail] = useState('');
  const [constrasena, setConstrasena] = useState('');
  const [errorResponse, setErrorResponse] = useState(null); // Estado para mensajes de error
  const goTo = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try{
      const response = await fetch(`${API_URL}/usuario/login`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          constrasena,
        }),
      })
      if(response.ok){
        console.log('Usuario logueado');
        setErrorResponse("");
        const json = (await response.json());

        console.log("body: " + json.body.user);

        if(json.body.token && json.body.refreshToken){
          auth.saveUser(json);
        
          if(response.body.user.esPrestador){
            goTo('/provider/home');
          }else if(!response.body.user.esPrestador){
            goTo('/client/home');
          }
          goTo('/');
        }
      }else{
        console.log('Error al loguear usuario');
        const json = await response.json();
        console.log(json.body);
        setErrorResponse(json.body);
        return;
      }
    }catch(error){
      console.log(error);
    }
  };

  const auth = useAuth();
  if(auth.isAuthenticated){
    return <Navigate to="/client/home" />;
  }

  return (
    <section className='fondoLogin'>
      <div className="wrapper">
        <form onSubmit={handleLogin}>
          <h1>Login</h1>
          <div className="input-box">
            <input
              type="email" // Cambiado de "text" a "email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <i className='bx bxs-user'></i>
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              value={constrasena}
              onChange={(e) => setConstrasena(e.target.value)}
              required
              minLength="6" // Agregar una longitud mínima para la contraseña
            />
            <i className='bx bxs-lock-alt'></i>
          </div>
          {!!errorResponse && (
            <div className="error-message">{errorResponse.message}</div>
          )}
          <div className="remember-forget">
            <label><input type="checkbox" /> Recuérdame</label>
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
