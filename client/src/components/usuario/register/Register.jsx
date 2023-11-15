import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap'; // Importa los componentes del modal
import { Link, useNavigate } from 'react-router-dom';
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
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [esPrestador, setEsPrestador] = useState(false);
  const [especialidades, setEspecialidades] = useState([]);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [errorResponse, setErrorResponse] = useState(null);
  const auth = useAuth();
  const [direccionesUsuario, setDireccionesUsuario] = useState([]);
  const [nuevaDireccion, setNuevaDireccion] = useState({});  
  
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

  const [showDireccionModal, setShowDireccionModal] = useState(false);  

  const handleDireccionModalClose = () => {
    
    setShowDireccionModal(false); // Cambia el estado para ocultar el modal de dirección
    setNuevaDireccion({}); // Limpia los datos de la nueva dirección
  };

  const handleEliminarDireccion = (index) => {
    const nuevasDirecciones = [...direccionesUsuario];
    nuevasDirecciones.splice(index, 1);
    setDireccionesUsuario(nuevasDirecciones);
  };
  
  const [direccionError, setDireccionError] = useState(null);

  const handleAgregarDireccion = () => {
    const errors = [];
  
    if (!nuevaDireccion.calle) {
      errors.push('La calle es requerida');
    }
  
    if (!nuevaDireccion.numero) {
      errors.push('El número es requerido');
    } else if (!Number.isInteger(Number(nuevaDireccion.numero))) {
      errors.push('El número debe ser un valor numérico');
    }
  
    if (!nuevaDireccion.codPostal) {
      errors.push('El código postal es requerido');
    } else if (!Number.isInteger(Number(nuevaDireccion.codPostal))) {
      errors.push('El código postal debe ser un valor numérico');
    }
  
    if (!nuevaDireccion.ciudad) {
      errors.push('La ciudad es requerida');
    }
  
    if (!nuevaDireccion.provincia) {
      errors.push('La provincia es requerida');
    }
  
    if (errors.length > 0) {
      setDireccionError(errors.join(', ')); // Establece el error
    } else {
      setDireccionesUsuario([...direccionesUsuario, nuevaDireccion]);
      setNuevaDireccion({
        calle: '',
        numero: '',
        piso: '',
        dpto: '',
        codPostal: '',
        ciudad: '',
        provincia: '',
      });
      handleDireccionModalClose();
      setDireccionError(null); // Limpia cualquier error anterior
    }
  };

  const handleDireccionModalOpen = () => {
    setShowDireccionModal(true);
  };


  const [validationErrors, setValidationErrors] = useState([]);
  const [registrationMessage, setRegistrationMessage] = useState('');
   
  const handleRegister = async (e) => {
    e.preventDefault();
    setValidationErrors([]);
  
    // Verifica si las contraseñas coinciden
    if (contrasena !== confirmContrasena) {
      setValidationErrors([{ msg: 'Las contraseñas no coinciden' }]);
      return;
    }
  
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
          fechaNacimiento,
          esPrestador,
          especialidades,
          direcciones: direccionesUsuario, // Agrega las direcciones del usuario
        }),
      });
  
      if (response.ok) {
        setValidationErrors([]);
        setRegistrationSuccess(true);
        setErrorResponse(null);
        setRegistrationMessage(
          'Registro exitoso. Redirigiendo a la página de inicio de sesión...'
        );
        setTimeout(() => {
          goTo('/login');
        }, 5000);
      } else {
        const json = await response.json();
        setValidationErrors(json.errors || []);
        setRegistrationSuccess(false);
      }
    } catch (error) {
      console.error(error);
      setErrorResponse({ message: 'Error en el servidor' });
      setRegistrationSuccess(false);
    }
  };

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
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="input-box">
              <input
                type="text"
                placeholder="Apellido"
                required
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
              required
              minLength="6"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Confirmar Contraseña"
              required
              value={confirmContrasena}
              onChange={(e) => setConfirmContrasena(e.target.value)}
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Número de Teléfono"
              required
              minLength="9"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>

          <div className="input-box">
            <input
              type="date"
              placeholder="Fecha de Nacimiento"
              required
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
            />
          </div>

        {/* Sección de direcciones */}
        <div className="direcciones-section">
                    {/* Botón para abrir el modal de agregar dirección */}
         <button className="botonDireccion btn-small" type="button" onClick={handleDireccionModalOpen}>
          Agregar Dirección
         </button>  
  <      div className="direcciones-list">
        {direccionesUsuario.map((direccion, index) => (
        <div key={index} className="direccion-item">
            {/* Muestra los detalles de la dirección */}
            <p>{`Calle: ${direccion.calle}, Número: ${direccion.numero}, Piso: ${direccion.piso}, Dpto: ${direccion.dpto}, CP: ${direccion.codPostal}`}</p>
            <button
            className="eliminarDireccion"
            onClick={() => handleEliminarDireccion(index)}
            >
            &#10005; {/* Código de la cruz (X) */}
           </button>
         </div>
         ))}
        </div>

        {/* Modal para agregar dirección */}
        <Modal show={showDireccionModal} onHide={handleDireccionModalClose}>
  <Modal.Header closeButton>
    <Modal.Title>Agregar Dirección</Modal.Title>
  </Modal.Header>
  <Modal.Body>
       <input
             type="text"
             placeholder="Calle"
             value={nuevaDireccion.calle || ''}
             onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, calle: e.target.value })}
             />
           <input
             type="text"
             placeholder="Número"
             value={nuevaDireccion.numero || ''}
             onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, numero: e.target.value })}
    />
          <input
             type="text"
             placeholder="Piso"
             value={nuevaDireccion.piso || ''}
             onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, piso: e.target.value })}
             />
           <input
             type="text"
             placeholder="Dpto"
             value={nuevaDireccion.dpto || ''}
             onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, dpto: e.target.value })}
             />
           <input
             type="text"
             placeholder="Código Postal"
             value={nuevaDireccion.codPostal || ''}
             onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, codPostal: e.target.value })}
             />
             <input
             type="text"
             placeholder="Ciudad"
             value={nuevaDireccion.ciudad || ''}
             onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, ciudad: e.target.value })}
               />
             <input
             type="text"
             placeholder="Provincia"
             value={nuevaDireccion.provincia || ''}
             onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, provincia: e.target.value })}
              />

            {direccionError && <div className="error-message">{direccionError}</div>}
         </Modal.Body>
         <Modal.Footer>
         <Button variant="secondary" onClick={handleDireccionModalClose}>
         Cerrar
         </Button>
         <Button variant="primary" onClick={handleAgregarDireccion}>
         Agregar
         </Button>
         </Modal.Footer>
         </Modal>
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
          <button className="botonEspecialidad btn-small" type="button" onClick={handleModalOpen}>
              Agregar Especialidad
            </button>
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

       {validationErrors.length > 0 && (
        <div className="error-messages">
        {validationErrors.map((error, index) => (
      <div key={index} className="error-message">{error.msg}</div>
      ))}
     </div>
       )}
        {registrationSuccess && (
         <div className="success-message">{registrationMessage}</div>
        )}
        <p>
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </section>
  );
}

export default Register;