import { useEffect, useState } from 'react';
import styles from './Login.module.css';
import Home from '../Home/Home';
import Alert from '../../components/Alert/Alert';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AlertSuccess from '../../components/Alert/AlertSuccess';
import { BACKEND_URL } from '@/lib/config';
import { PasswordInput } from '@/components/ui/PasswordInput';
import ActionButton from '@/components/Common/Buttons/ActionButton';
import { useAuth } from '@/lib/AuthContext';


type FieldErrors = {
  username?: string;
  password?: string;
  email?: string;
};

const Login = () => {
  const navigate = useNavigate();
  const { refetchUser } = useAuth();

  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [login, setLogin] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const [showForgot, setShowForgot] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>('');
  const [resetSubmitting, setResetSubmitting] = useState<boolean>(false);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (username || password) {
      setError(null);
      setFieldErrors((prev) => ({ ...prev, username: undefined, password: undefined }));
    }
  }, [username, password]);

  const validate = (): boolean => {
    const errors: FieldErrors = {};
    if (!username.trim()) {
      errors.username = 'Ingresá tu usuario';
    } else if (username.trim().length < 3) {
      errors.username = 'Debe tener al menos 3 caracteres';
    }

    if (!password) {
      errors.password = 'Ingresá tu contraseña';
    } else if (password.length < 6) {
      errors.password = 'Debe tener al menos 6 caracteres';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);
    const data = { username: username.trim(), password };

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || 'No pudimos iniciar sesión. Revisá tus datos.');
        setLogin(false);
        return;
      }

      await refetchUser();
      navigate('/home', { replace: true });
    } catch (err) {
      console.error('Error:', err);
      setError('Error al conectar con el servidor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResetSuccess(null);

    if (!resetEmail.trim() || !/^\S+@\S+\.\S+$/.test(resetEmail)) {
      setFieldErrors((prev) => ({ ...prev, email: 'Ingresá un email válido' }));
      return;
    }
    setFieldErrors((prev) => ({ ...prev, email: undefined }));

    setResetSubmitting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail.trim() }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || 'No pudimos procesar la solicitud');
        return;
      }

      setResetSuccess('Si el email existe, te enviamos un link para restablecer tu contraseña.');
      setResetEmail('');
    } catch (err) {
      console.error('Error:', err);
      setError('Error al conectar con el servidor');
    } finally {
      setResetSubmitting(false);
    }
  };

  const successMsgE = searchParams.get('success');
  const errorMsgE = searchParams.get('error');

  return (
    <>
      {login ? (
        <Home />
      ) : (
        <div className={styles.container}>
          <div className={styles.card}>
            <h1 className={styles.title}>
              {showForgot ? 'Recuperar contraseña' : 'Iniciar Sesión'}
            </h1>
            <p className={styles.subtitle}>
              {showForgot
                ? 'Ingresá tu email y te mandamos un link para restablecerla'
                : 'Bienvenido de nuevo, ingresá tus datos'}
            </p>

            {successMsgE && <AlertSuccess message={successMsgE} />}
            {errorMsgE && <Alert message={errorMsgE} />}
            {error && <Alert message={error} />}
            {resetSuccess && <AlertSuccess message={resetSuccess} />}

            {!showForgot ? (
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={styles.group}>
                  <label htmlFor="username" className={styles.label}>
                    Usuario
                  </label>
                  <input
                    onChange={(e): void => setUsername(e.target.value)}
                    value={username}
                    type="text"
                    id="username"
                    name="username"
                    className={`${styles.input} ${fieldErrors.username ? styles.inputError : ''}`}
                    placeholder="tu usuario"
                    autoComplete="username"
                  />
                  {fieldErrors.username && (
                    <span className={styles.errorText}>{fieldErrors.username}</span>
                  )}
                </div>

                <div className={styles.group}>
                  <div className={styles.labelRow}>
                    <label htmlFor="password" className={styles.label}>
                      Contraseña
                    </label>
                    <ActionButton
                      label="¿Olvidaste tu contraseña?"
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setShowForgot(true);
                        setError(null);
                        setFieldErrors({});
                      }}
                      />
                      
                  </div>
                  <div className={styles.caja_password}>
                    <PasswordInput
                      onChange={(e): void => setPassword(e.target.value)}
                      value={password}
                      className={`${styles.input} ${fieldErrors.password ? styles.inputError : ''}`}
                      placeholder="••••••••"
                      
                    />
                  </div>
                  {fieldErrors.password && (
                    <span className={styles.errorText}>{fieldErrors.password}</span>
                  )}
                </div>

                <button type="submit" className={styles.button} disabled={submitting}>
                  {submitting ? 'Ingresando…' : 'Ingresar'}
                </button>
              </form>
            ) : (
              <form className={styles.form} onSubmit={handleForgotSubmit} noValidate>
                <div className={styles.group}>
                  <label htmlFor="resetEmail" className={styles.label}>
                    Email
                  </label>
                  <input
                    onChange={(e): void => setResetEmail(e.target.value)}
                    value={resetEmail}
                    type="email"
                    id="resetEmail"
                    name="resetEmail"
                    className={`${styles.input} ${fieldErrors.email ? styles.inputError : ''}`}
                    placeholder="tu@email.com"
                    autoComplete="email"
                  />
                  {fieldErrors.email && (
                    <span className={styles.errorText}>{fieldErrors.email}</span>
                  )}
                </div>

                <button type="submit" className={styles.button} disabled={resetSubmitting}>
                  {resetSubmitting ? 'Enviando…' : 'Enviar link de recuperación'}
                </button>

                <ActionButton
                  label='← Volver a iniciar sesión'
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowForgot(false);
                    setError(null);
                    setResetSuccess(null);
                    setFieldErrors({});
                  }}
                  />
              </form>
            )}

            {!showForgot && (
              <div className={styles.footerText}>
                <span>¿No tienes una cuenta?</span>
                <a href="/register" className={styles.link}>
                  Regístrate
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Login;