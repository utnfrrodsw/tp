import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // Estado para mensajes de error
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 200) {
        const data = await response.json();
        const userType = data.userType;
        
        if (userType === 'cliente') {
          navigate('/client/home');
        } else if (userType === 'prestador') {
          navigate('/provider/home');
        } else {
          alert('Tipo de usuario desconocido');
        }
      } else if (response.status === 401) {
        const data = await response.json();
        setError(data.message);
      } else {
        setError('Error en el inicio de sesión. Inténtalo de nuevo más tarde.');
      }
    } catch (error) {
      setError('Error en el inicio de sesión. Inténtalo de nuevo más tarde.');
      console.error('Error en el inicio de sesión:', error);
    }
  };

  return (
    <section className='fondoLogin'>
      <div className="wrapper">
        <form onSubmit={handleLogin}>
          <h1>Login</h1>
          {error && <div className="error-message">{error}</div>} {/* Renderiza el mensaje de error si existe */}
          <div className="input-box">
            <input
              type="text"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <i className='bx bxs-lock-alt'></i>
          </div>
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
