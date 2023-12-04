import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap'; // Importa los componentes del modal
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/authProvider';
import { registerUser } from '../../../services/Register';
import './Register.css';
import LoaderFijo from '../../load/loaderFijo/LoaderFijo';
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
  const [errorResponse, setErrorResponse] = useState("");
  const auth = useAuth();
  const [direccionesUsuario, setDireccionesUsuario] = useState([]);
  const [nuevaDireccion, setNuevaDireccion] = useState({});  
  const [nuevaEspecialidad, setNuevaEspecialidad] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); 
  

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
    let error = null;
  
    if (!nuevaDireccion.calle) {
      error = 'La calle es requerida';
    } else if (!nuevaDireccion.numero) {
      error = 'El número es requerido';
    } else if (!Number.isInteger(Number(nuevaDireccion.numero))) {
      error = 'El número debe ser un valor numérico';
    } else if (!nuevaDireccion.codPostal) {
      error = 'El código postal es requerido';
    } else if (!Number.isInteger(Number(nuevaDireccion.codPostal))) {
      error = 'El código postal debe ser un valor numérico';
    } else if (!nuevaDireccion.ciudad) {
      error = 'La ciudad es requerida';
    } else if (!nuevaDireccion.provincia) {
      error = 'La provincia es requerida';
    }
  
    if (error) {
      setDireccionError(error); // Establece el primer error
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

  const [message, setMessage] = useState('');
  const [successMessage, setSucceseMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

   
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);  
    setMessage('');
  
    try {
       const jsonResponse = await registerUser( nombre,apellido,email,contrasena,
        confirmContrasena,telefono, fechaNacimiento,esPrestador,especialidades, direccionesUsuario,  );
  
        if (jsonResponse && jsonResponse.message === 'Registro exitoso') {
          setShowSuccessModal(true);  
          setTimeout(() => {
            setShowSuccessModal(false);  
            goTo('/login');
          }, 5000);
      } else {
         
        const firstError = jsonResponse.errors && jsonResponse.errors.length > 0
        ? jsonResponse.errors[0].msg
        : 'Error during login';

        setMessage(
          jsonResponse.error || firstError
        );

      }
  
      if (jsonResponse.statusCode === 400) {
        setMessage('El email ingresado ya está en uso');
      }
    } catch (error) {
      setMessage(error.message || 'Error al conectar con el servidor');
    }
    finally {
      setIsLoading(false); // Detiene el loader
    }
  };
  
  return (
    <section>{isLoading ? <LoaderFijo /> : (
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
              
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-box">
          <input
             type={mostrarContrasena ? "text" : "password"}
             placeholder="Contraseña"
             value={contrasena}
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
              
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>

          <div className="input-box">
            <input
              type="date"
              placeholder="Fecha de Nacimiento"
              
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
            />
          </div>

        {/* Sección de direcciones */}
        <div className="direcciones-section">
                    {/* Botón para abrir el modal de agregar dirección */}
         <button className="botonDireccion-btn-small" type="button" onClick={handleDireccionModalOpen}>
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
        {errorResponse && <div className="error-message">{errorResponse.message}</div>}
      </form>
        
        <Modal show={showModal} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Agregar Especialidad</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <label className='nuevaEspecialidad'> <h5>Nueva Especialidad</h5></label>
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
         {message && <div className="error-message">{message}</div>}
         {successMessage && <div className="success-message">{successMessage}</div>}
        <p>
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}  data-testid="exito-modal">
        <Modal.Header closeButton>
          <Modal.Title>Registro exitoso</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Registro exitoso, redirigiendo al login...</p>
         </Modal.Body>
      </Modal>
    </section>
    )}</section>
  );
}

export default Register;