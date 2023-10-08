import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../../auth/authProvider';
import './Register.css';

const Register = () => {
  const goTo = useNavigate();

  const [nombre, setnombre] = useState('');
  const [apellido, setapellido] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setcontrasena] = useState('');
  const [confirmcontrasena, setConfirmcontrasena] = useState('');
  const [telefono, settelefono] = useState('');
  const [direccion, setdireccion] = useState('');
  const [codPostal, setCodPostal] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [esProvedor, setesProvedor] = useState(false);
  //const [formErrors, setFormErrors] = useState({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  //const [emailExists, setEmailExists] = useState(false);
  const auth = useAuth();

  const [errorResponse, setErrorResponse] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    try{
      const response = await fetch('http://localhost:5000/api/usuario/registrar',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre,
          apellido,
          email,
          contrasena,
          telefono,
          direccion,
          codPostal,
          fechaNacimiento,
          tipo: esProvedor ? 1 : 0,
        }),
      })
      if(response.ok){
        console.log('Usuario registrado');
        setErrorResponse("");
        setRegistrationSuccess(true);
        goTo('/login');
      }else{
        console.log('Error al registrar usuario');
        const json = await response.json();
        console.log(json);
        setErrorResponse(json.body);
        setRegistrationSuccess(false);
        return;
      }
    }catch(error){
      console.log(error);
      setErrorResponse(error.message);
      setRegistrationSuccess(false);
    }
  }

  if(auth.isAuthenticated){
    return <Navigate to="/" />;
  }


  return (
    <section className='fondoRegister'>
      <div className="register-container">
        <h2>Registro de Usuario</h2>

        <form onSubmit={handleRegister}>
          <div className="name-inputs">
            <div className="input-box">
              <input
                type="text"
                placeholder="Nombre"
                
                value={nombre}
                onChange={(e) => setnombre(e.target.value)}
              />
            </div>
            <div className="input-box">
              <input
                type="text"
                placeholder="Apellido"
                
                value={apellido}
                onChange={(e) => setapellido(e.target.value)}
              />
            </div>
          </div>
          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {/*{formErrors.email && (
              <span className="error-message">{formErrors.email}</span>
            )}
            {emailExists && (
              <span className="error-message">El correo electrónico ya está en uso</span>
            )}*/}
             
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Contraseña"
              
              minLength="6" // Agregar una longitud mínima para la contraseña
              value={contrasena}
              onChange={(e) => setcontrasena(e.target.value)}
            />
            {/*{formErrors.contrasena && (
              <span className="error-message">{formErrors.contrasena}</span>
            )}*/}
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Confirmar Contraseña"
              
              value={confirmcontrasena}
              onChange={(e) => setConfirmcontrasena(e.target.value)}
            />
            {/*{formErrors.confirmcontrasena && (
              <span className="error-message">{formErrors.confirmcontrasena}</span>
            )}*/}
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Número de Teléfono"
              
              minLength="9" // Agregar una longitud mínima para el nro de telefono
              value={telefono}
              onChange={(e) => settelefono(e.target.value)}
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Dirección"
              
              value={direccion}
              onChange={(e) => setdireccion(e.target.value)}
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Código Postal"
              
              value={codPostal}
              onChange={(e) => setCodPostal(e.target.value)}
            />
          </div>
          <div className="input-box">
            <label className="switch-label">
              <input
                type="checkbox"
                checked={esProvedor}
                onChange={(e) => setesProvedor(e.target.checked)}
              />
              <div className="switch"></div>
              Soy prestador
            </label>
          </div>
          <div className="input-box">
            <input
              type="date"
              placeholder="Fecha de Nacimiento"
              
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
            />
          </div>
          <button type="submit" className='btn'>Registrarse</button>
        </form>
        {!!errorResponse && (
          <div className="error-message">{errorResponse}</div>
        )}
        {registrationSuccess && (
          <div className="success-message">Registro exitoso</div>
        )}
        <p>¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
      </div>
    </section>
  );
};

export default Register;