import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PasswordInput } from '../../components/ui/PasswordInput';
import styles from './ResetPassword.module.css';
import { BACKEND_URL } from '@/lib/config';

type FieldErrors = {
  password?: string;
  confirmPassword?: string;
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const errors: FieldErrors = {};

    if (!password) {
      errors.password = 'Ingresá una contraseña';
    } else if (password.length < 8) {
      errors.password = 'Debe tener al menos 8 caracteres';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirmá tu contraseña';
    } else if (confirmPassword !== password) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('El enlace es inválido o está incompleto. Solicitá uno nuevo.');
      return;
    }

    if (!validate()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Error al restablecer la contraseña');
      }

      setSuccess(data.message || 'Contraseña actualizada correctamente.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Nueva contraseña</h1>
        <p className={styles.subtitle}>Elegí una contraseña segura para tu cuenta.</p>

        {!token && (
          <div className={styles.errorMsg}>
            Este enlace es inválido o está incompleto. Pedí uno nuevo desde &quot;Olvidé mi contraseña&quot;.
          </div>
        )}
        {success && <div className={styles.successMsg}>{success}</div>}
        {error && <div className={styles.errorMsg}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.group}>
            <label className={styles.label}>Nueva contraseña</label>
            <PasswordInput
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFieldErrors((p) => ({ ...p, password: undefined }));
              }}
              className={`${styles.input} ${fieldErrors.password ? styles.inputError : ''}`}
              placeholder="••••••••"
            />
            {fieldErrors.password ? (
              <span className={styles.errorText}>{fieldErrors.password}</span>
            ) : (
              <span className={styles.hintText}>Mínimo 8 caracteres</span>
            )}
          </div>

          <div className={styles.group}>
            <label className={styles.label}>Confirmar contraseña</label>
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setFieldErrors((p) => ({ ...p, confirmPassword: undefined }));
              }}
              className={`${styles.input} ${fieldErrors.confirmPassword ? styles.inputError : ''}`}
              placeholder="••••••••"
            />
            {fieldErrors.confirmPassword && (
              <span className={styles.errorText}>{fieldErrors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className={styles.button} disabled={submitting || !token}>
            {submitting ? 'Restableciendo…' : 'Restablecer contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;