type AxiosError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import type { LoginData } from '../../types';

export const Login = () => {
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    contrasena: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const authResponse = await authService.login(formData);
      login(authResponse.usuario, authResponse.token);
      setSuccess('¡Ingreso exitoso! Redirigiendo...');
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      const axiosErr = err as AxiosError;
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof axiosErr.response === 'object' &&
        axiosErr.response?.data?.message
      ) {
        setError(axiosErr.response.data.message!);
      } else {
        setError('Error al iniciar sesión');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <nav className="bg-blue-600 text-white p-3 p-md-4 mb-4">
        <div className="container d-flex align-items-center justify-content-between">
          <Link to="/" className="text-decoration-none d-flex align-items-center" style={{ gap: '10px' }}>
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
          <div className="d-flex align-items-center gap-4 ms-auto">
            <Link to="/catalog" className="nav-link fw-bold text-white" style={{ fontSize: '1.1rem', letterSpacing: '1px' }}>Catálogo</Link>
          </div>
        </div>
      </nav>

      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-4">
            <div className="card">
              <div className="card-header">
                <h3 className="text-center">🔐 Iniciar Sesión</h3>
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
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="contrasena" className="form-label">Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      id="contrasena"
                      name="contrasena"
                      value={formData.contrasena}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Ingresando...
                      </>
                    ) : (
                      'Ingresar'
                    )}
                  </button>
                </form>
                <div className="text-center mt-3">
                  <p>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};