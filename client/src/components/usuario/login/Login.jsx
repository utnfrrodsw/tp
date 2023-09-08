import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 

  const handleLogin = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para manejar el inicio de sesión
    console.log('Iniciar sesión con:', email, password);
  };

  return (
    <section className='fondoLogin'>
      <div className="wrapper">
        <form onSubmit={handleLogin}>
          <h1>Login</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <i className='bx bxs-lock-alt'></i>
          </div>
          <div className="remember-forget">
            <label><input type="checkbox" /> Recuérdame</label>
            <Link to="/forgot-password">Recuperar Contraseña</Link> {/* Usar Link para rutas de React Router */}
          </div>
          <button type="submit" className="btn">Login</button>
          <div className="register-link">
            <p>No tienes cuenta? <Link to="/register">Regístrate</Link></p> {/* Usar Link para rutas de React Router */}
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
