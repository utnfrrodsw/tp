import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PasswordInput } from '../../components/ui/PasswordInput';
import styles from './ResetPassword.module.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }


    try {
      const response = await fetch(
        `http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/users/reset-password/${token}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password })
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al restablecer la contraseña');

      setSuccess('Contraseña actualizada correctamente.');
      setTimeout(() => navigate('/'), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
    }
  };

  return (
  <div className={styles.container}>
        <div className={styles.card}>

        
        <h1 className={styles.title}>Nueva contraseña</h1>
        <p className={styles.subtitle}>
            Elegí una contraseña segura para tu cuenta.
        </p>

        {success && <p className={styles.successMsg}>{success}</p>}
        {error   && <p className={styles.errorMsg}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.group}>
            <label className={styles.label}>Nueva contraseña</label>
            <PasswordInput
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={styles.input}
            required
            placeholder="••••••••"
            />
            </div>

            <div className={styles.group}>
            <label className={styles.label}>Confirmar contraseña</label>
            <PasswordInput
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className={styles.input}
            required
            placeholder="••••••••"
            />
            </div>

            <button type="submit" className={styles.button}>
            Restablecer contraseña
            </button>
        </form>

        </div>
    </div>
    );
};

export default ResetPassword;