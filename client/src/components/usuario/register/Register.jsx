import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap'; // Importa los componentes del modal
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/authProvider';
import './Register.css';
const { API_URL } = require('../../../auth/constants');

function Register() {
  const goTo = useNavigate();
  const [showModal, setShowModal] = useState(false); // Controla la visualización del modal
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmContrasena, setConfirmContrasena] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [codPostal, setCodPostal] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [esPrestador, setEsPrestador] = useState(false);
  const [especialidades, setEspecialidades] = useState([]);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [errorResponse, setErrorResponse] = useState(null);
  const auth = useAuth();
  
  const [nuevaEspecialidad, setNuevaEspecialidad] = useState('');
  

  // Función para abrir el modal de agregar especialidad
  const handleModalOpen = () => {
    setShowModal(true);
  };

  // Función para cerrar el modal de agregar especialidad
  const handleModalClose = () => {
    setShowModal(false);
  };


  const handleAgregarEspecialidad = () => {
    if (nuevaEspecialidad) {
      const especialidadEnMinuscula = nuevaEspecialidad.toLowerCase();
      setEspecialidades([...especialidades, especialidadEnMinuscula]);
      setNuevaEspecialidad('');
      setShowModal(false);
    }
  };
  
  
  const handleEliminarEspecialidad = (index) => {
    const nuevasEspecialidades = [...especialidades];
    nuevasEspecialidades.splice(index, 1);
    setEspecialidades(nuevasEspecialidades);
  };

  async function handleRegister(e) {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/usuario/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          apellido,
          email,
          contrasena,
          confirmContrasena,
          telefono,
          direccion,
          codPostal,
          fechaNacimiento,
          esPrestador,
          especialidades, // Incluye las especialidades en el cuerpo de la solicitud
        }),
      });
  
      if (response.ok) {
        console.log('Usuario registrado');
        setErrorResponse("");
        setRegistrationSuccess(true);
        goTo('/login');
      } else {
        console.log('Error al registrar usuario');
        const json = await response.json();
        console.log(json.body);
        setErrorResponse(json.body);
      }
    } catch (error) {
      console.error(error);
      setErrorResponse(error);
    }
  }

  if (auth.isAuthenticated) {
    return <Navigate to="/" />;
  }


  return (
    <section className="fondoRegister">
      <div className="register-container">
        <h2>Registro de Usuario</h2>

        <form onSubmit={handleRegister}>
          <div className="name-inputs">
            <div className="input-box">
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="input-box">
              <input
                type="text"
                placeholder="Apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />
            </div>
          </div>
          <div className="input-box">
            <input
              required
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Contraseña"
              minLength="6"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Confirmar Contraseña"
              value={confirmContrasena}
              onChange={(e) => setConfirmContrasena(e.target.value)}
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Número de Teléfono"
              minLength="9"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>
          <div className='name-inputs'>
            <div className="input-box">
              <input
                type="text"
                placeholder="Código Postal"
                value={codPostal}
                onChange={(e) => setCodPostal(e.target.value)}
              />
            </div>
            <div className="input-box">
              <input
                type="text"
                placeholder="Dirección"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
              />
            </div>
          </div>
          <div className="input-box">
            <input
              type="date"
              placeholder="Fecha de Nacimiento"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
            />
          </div>
          <div className="input-box">
            <label className="switch-label">
              <input
                type="checkbox"
                checked={esPrestador}
                onChange={(e) => setEsPrestador(e.target.checked)}
              />
              <div className="switch"></div>
              Soy prestador
            </label>
          </div>
          {esPrestador && (
            <div className="especialidades-section">
              <div className="especialidades-list">
                {especialidades.map((esp, index) => (
                  <div key={index} className="especialidad-item">
                    {esp}
                    <button
                      className="eliminarEspecialidad"
                      onClick={() => handleEliminarEspecialidad(index)}
                    >
                      &#10005; {/* Código de la cruz (X) */}
                    </button>
                  </div>
                ))}
              </div>
              <button className="botonEspecialidad btn-small" type="button" onClick={handleModalOpen} >
                
                Agregar Especialidad
              </button>
            </div>
          )}
          
          <button type="submit" className="btn">
            Registrarse
          </button>
        </form>
        
        <Modal show={showModal} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Agregar Especialidad</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <label>Nueva Especialidad</label>
              <input
                type="text"
                placeholder="Ej: Gasista"
                value={nuevaEspecialidad}
                onChange={(e) => setNuevaEspecialidad(e.target.value)}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Cerrar
            </Button>
            <Button variant="primary" onClick={handleAgregarEspecialidad}>
              Agregar
            </Button>
          </Modal.Footer>
        </Modal>

        {!!errorResponse && (
          <div className="error-message">{errorResponse.message}</div>
        )}
        {registrationSuccess && (
          <div className="success-message">Registro exitoso</div>
        )}
        <p>
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </section>
  );
}

export default Register;
