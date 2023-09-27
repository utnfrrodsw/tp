import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [codPostal, setCodPostal] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [isProvider, setIsProvider] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [emailExists, setEmailExists] = useState(false); // Nuevo estado para controlar si el correo ya existe

  const validateForm = () => {
    const errors = {};

    if (!password) {
      errors.password = 'La contraseña es obligatoria';
    } else if (password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (!passwordPattern.test(password)) {
      errors.password = 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número';
    }

    return errors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Restablece los estados de errores
    setFormErrors({});
    setEmailExists(false);

    const errors = validateForm();

    if (Object.keys(errors).length === 0) {
      try {
        const formattedBirthdate = new Date(birthdate).toISOString().slice(0, 10);

        const postResponse = await axios.post('/api/usuarios/registro', {
          name,
          lastName,
          email,
          password,
          phoneNumber,
          address,
          codPostal,
          birthDate: formattedBirthdate,
          tipo: isProvider ? 'prestador' : 'cliente',
        });

        if (postResponse.status === 201) {
          setRegistrationSuccess(true);
          setTimeout(() => {
            navigate('/login');
          }, 5000);
        }
      } catch (error) {
        if (error.response.status === 400 && error.response.data.message === 'El usuario ya existe') {
          setEmailExists(true); // Establece el estado para mostrar el mensaje
        } else {
          console.error('Error en el registro:', error);
        }
      }
    } else {
      setFormErrors(errors);
      setRegistrationSuccess(false);
    }
  };

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
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="input-box">
              <input
                type="text"
                placeholder="Apellido"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailExists && (
          <span className="error-message">El correo electrónico ya está en uso</span>
        )}
             
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Contraseña"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {formErrors.password && (
              <span className="error-message">{formErrors.password}</span>
            )}
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Confirmar Contraseña"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {formErrors.confirmPassword && (
              <span className="error-message">{formErrors.confirmPassword}</span>
            )}
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Número de Teléfono"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Dirección"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Código Postal"
              required
              value={codPostal}
              onChange={(e) => setCodPostal(e.target.value)}
            />
          </div>
          <div className="input-box">
            <label className="switch-label">
              <input
                type="checkbox"
                checked={isProvider}
                onChange={(e) => setIsProvider(e.target.checked)}
              />
              <div className="switch"></div>
              Soy prestador
            </label>
          </div>
          <div className="input-box">
            <input
              type="date"
              placeholder="Fecha de Nacimiento"
              required
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
            />
          </div>
          <button type="submit" className='btn'>Registrarse</button>
        </form>
        <p>¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
        {registrationSuccess && (
          <div className="success-message">Registro exitoso. Redirigiendo a inicio... Por favor, inicia sesión.</div>
        )}
      </div>
    </section>
  );
};

export default Register;
