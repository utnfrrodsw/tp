import { useState } from 'react';
import styles from './ForgotPassword.module.css';
import { BACKEND_URL } from '@/lib/config';
import { KeyRound } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setSuccess('Te enviamos un mail para restablecer tu contraseña.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>

        <div className={styles.iconWrap}>
          <KeyRound size={28} />
        </div>

        <h1 className={styles.title}>Restablecer contraseña</h1>
        <p className={styles.subtitle}>
          Ingresá tu email y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        {success && <p className={styles.successMsg}>{success}</p>}
        {error && <p className={styles.errorMsg}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.group}>
            <label className={styles.label}>Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={styles.input}
              placeholder="tu@email.com"
              required
            />
          </div>
          <button type="submit" className={styles.button}>
            Enviar enlace
          </button>
        </form>

      </div>
    </div>
  );
};

export default ForgotPassword;