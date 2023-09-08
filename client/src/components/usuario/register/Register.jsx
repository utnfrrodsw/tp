import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isProvider, setIsProvider] = useState(false);
  const [birthdate, setBirthdate] = useState('');
  const [formErrors, setFormErrors] = useState({}); // Para manejar errores del formulario
  const [registrationSuccess, setRegistrationSuccess] = useState(false); // Para mostrar el mensaje de éxito

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

    // Validación de la contraseña: Debe contener al menos una letra mayúscula, una letra minúscula y un número
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (!passwordPattern.test(password)) {
      errors.password = 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número';
    }

    return errors;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length === 0) {
      // No hay errores, puedes continuar con el registro
      console.log('Registrando usuario con:', firstName, lastName, email, password, birthdate);

      // Limpiar el formulario
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setIsProvider(false);
      setBirthdate('');

      // Mostrar mensaje de éxito
      setRegistrationSuccess(true);
    } else {
      // Hay errores en el formulario, muestra los mensajes de error
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
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            {formErrors.firstName && (
              <span className="error-message">{formErrors.firstName}</span>
            )}
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Apellido"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            {formErrors.lastName && (
              <span className="error-message">{formErrors.lastName}</span>
            )}
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
          {formErrors.email && (
            <span className="error-message">{formErrors.email}</span>
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
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {formErrors.confirmPassword && (
            <span className="error-message">{formErrors.confirmPassword}</span>
          )}
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
      {formErrors.birthdate && (
            <span className="error-message">{formErrors.birthdate}</span>
          )}
          {registrationSuccess && (
          <div className="success-message">¡Registro exitoso! El formulario se ha enviado correctamente.</div>
            )}
    </div>
    </section>
  );
};

export default Register;
