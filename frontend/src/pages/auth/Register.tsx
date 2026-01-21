import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import type { RegisterData } from '../../types';

export const Register = () => {
    React.useEffect(() => {
      const originalOverflow = document.body.style.overflowY;
      document.body.style.overflowY = 'hidden';
      return () => {
        document.body.style.overflowY = originalOverflow;
      };
    }, []);
  const [formData, setFormData] = useState<RegisterData>({
    nombre: '',
    apellido: '',
    email: '',
    contrasena: '',
    direccion: '',
    telefono: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Partial<RegisterData>>({});
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setFieldErrors({});
    setSuccess('');

    // Validación frontend
    let valid = true;
    const newFieldErrors: Partial<RegisterData> = {};
    
    if (!formData.nombre.trim()) {
      newFieldErrors.nombre = 'El nombre es obligatorio';
      valid = false;
    }
    if (!formData.apellido.trim()) {
      newFieldErrors.apellido = 'El apellido es obligatorio';
      valid = false;
    }
    if (!formData.email.trim()) {
      newFieldErrors.email = 'El email es obligatorio';
      valid = false;
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
      newFieldErrors.email = 'El formato de email no es válido';
      valid = false;
    }
    if (!formData.contrasena.trim()) {
      newFieldErrors.contrasena = 'La contraseña es obligatoria';
      valid = false;
    } else if (formData.contrasena.length < 6) {
      newFieldErrors.contrasena = 'La contraseña debe tener al menos 6 caracteres';
      valid = false;
    }
    if (!formData.direccion.trim()) {
      newFieldErrors.direccion = 'La dirección es obligatoria';
      valid = false;
    }
    if (!formData.telefono.trim()) {
      newFieldErrors.telefono = 'El teléfono es obligatorio';
      valid = false;
    } else if (!/^\d{7,15}$/.test(formData.telefono)) {
      newFieldErrors.telefono = 'El teléfono debe ser numérico (7-15 dígitos)';
      valid = false;
    }

    setFieldErrors(newFieldErrors);

    if (!valid) {
      setIsLoading(false);
      return;
    }

    try {
      const authResponse = await authService.register(formData);
      login(authResponse.usuario, authResponse.token);
      setSuccess('¡Cuenta creada con éxito! Redirigiendo...');
      setTimeout(() => {
        setSuccess('');
        navigate('/');
      }, 1500);
    } catch (error: unknown) {
      console.error('Error en registro:', error);
      if (error instanceof Error) {
        setError(error.message || 'Error al crear la cuenta');
      } else {
        setError('Error al crear la cuenta');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container mt-5 position-relative">
      <Link to="/" style={{ position: 'absolute', top: 0, left: 10, zIndex: 10, textDecoration: 'none' }} title="Ir a inicio">
        <button
          type="button"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: 60,
            height: 60,
            borderRadius: '12px',
            background: 'white',
            color: '#2563eb',
            fontWeight: 900,
            fontSize: '1.1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: '2px solid #2563eb',
            transition: 'background 0.2s',
            padding: 0,
            lineHeight: 1.1,
            minWidth: 60,
            minHeight: 60,
          }}
          title="Ir a inicio"
          className="border-0"
        >
          <span style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '1px' }}>Tienda</span>
          <span style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '2px', marginTop: '-2px' }}>Retro</span>
        </button>
      </Link>
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card">
            <div className="card-header bg-white border-bottom-0">
              <h3 className="text-center">📝 Crear Cuenta</h3>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="nombre" className="form-label">Nombre *</label>
                    <input
                      type="text"
                      className={`form-control ${fieldErrors.nombre ? 'is-invalid' : ''}`}
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                    {fieldErrors.nombre && (
                      <div className="invalid-feedback">
                        {fieldErrors.nombre}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="apellido" className="form-label">Apellido *</label>
                    <input
                      type="text"
                      className={`form-control ${fieldErrors.apellido ? 'is-invalid' : ''}`}
                      id="apellido"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      required
                    />
                    {fieldErrors.apellido && (
                      <div className="invalid-feedback">
                        {fieldErrors.apellido}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email *</label>
                  <input
                    type="email"
                    className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {fieldErrors.email && (
                    <div className="invalid-feedback">
                      {fieldErrors.email}
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="contrasena" className="form-label">Contraseña *</label>
                  <input
                    type="password"
                    className={`form-control ${fieldErrors.contrasena ? 'is-invalid' : ''}`}
                    id="contrasena"
                    name="contrasena"
                    value={formData.contrasena}
                    onChange={handleChange}
                    required
                  />
                  {fieldErrors.contrasena && (
                    <div className="invalid-feedback">
                      {fieldErrors.contrasena}
                    </div>
                  )}
                  <div className="form-text">La contraseña debe tener al menos 6 caracteres</div>
                </div>
                <div className="mb-3">
                  <label htmlFor="direccion" className="form-label">Dirección *</label>
                  <input
                    type="text"
                    className={`form-control ${fieldErrors.direccion ? 'is-invalid' : ''}`}
                    id="direccion"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                  />
                  {fieldErrors.direccion && (
                    <div className="invalid-feedback">
                      {fieldErrors.direccion}
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="telefono" className="form-label">Teléfono *</label>
                  <input
                    type="tel"
                    className={`form-control ${fieldErrors.telefono ? 'is-invalid' : ''}`}
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                  />
                  {fieldErrors.telefono && (
                    <div className="invalid-feedback">
                      {fieldErrors.telefono}
                    </div>
                  )}
                  <div className="form-text">Solo números, entre 7 y 15 dígitos</div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creando cuenta...
                    </>
                  ) : (
                    'Crear Cuenta'
                  )}
                </button>
              </form>
              <div className="text-center mt-3">
                <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};