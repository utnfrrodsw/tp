import { useEffect, useState } from 'react';
import styles from './Login.module.css';
import Home from '../Home/Home';
import Alert from '../../components/Alert/Alert';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AlertSuccess from '../../components/Alert/AlertSuccess';
import { PasswordInput } from '@/components/ui/PasswordInput';
const Login = () => {
  const navigate = useNavigate();  

    const [password, setPassword] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [login, setLogin] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searchParams] = useSearchParams();

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = { username, password };

    try {
        const response = await fetch(`http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/auth/loginUser`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            // Acá caen los 401, 403, etc.
            setError(result.message);
            setLogin(false);
            return;
        }

        // Acá solo llega si fue 200
        localStorage.setItem('token', result.token);
        sessionStorage.setItem('showLoginToast', 'true');
        navigate('/home', { replace: true });

    } catch (error) {
        console.error('Error:', error);
        setError('Error al conectar con el servidor');
    }
}
    const successMsgE = searchParams.get('success');
    const errorMsgE = searchParams.get('error');

    return (
      useEffect(() => {
        if (username || password) {
          setError(null);
        }
      }, [username, password]),
    <>{login ? <Home />: 
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Iniciar Sesión</h1>
        
        {successMsgE && <AlertSuccess message={successMsgE} />}
        {errorMsgE && <Alert message={errorMsgE} />}
        {error && <Alert message={error} />}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.group}>
            <label htmlFor="username" className={styles.label}>Username:</label>
            <input 
              onChange={(e): void => setUsername(e.target.value)}
              type="text" 
              id="username" 
              name="username" 
              className={styles.input} 
              required
            />
          </div>

          <div className={styles.group}>
            <label htmlFor="password" className={styles.label}>Password:</label>
            <div className={styles.caja_password}>
              <PasswordInput onChange={(e): void => setPassword(e.target.value)} value={password} required className={styles.input} placeholder="••••••••"/>
            </div>
          </div>

          <button type="submit" className={styles.button} >Login</button>
        </form>
        <div className={styles.footerText}>
          <span>¿No tienes una cuenta?</span>
          <a href="/register" className={styles.link}>Regístrate</a>
        </div>
      </div>
    </div>
}</>
  );
}
export default Login;