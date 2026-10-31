import React, { useState } from 'react';
import { AuthCard } from '../components/AuthCard';
import { FormularioLogin } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';
import type { UsuarioAutenticado} from '../components/LoginForm';
import './AuthPage.scss';

interface AuthPageProps {
  alIniciarSesion?: (user: UsuarioAutenticado) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ alIniciarSesion }) => {
  const [vista, setVista] = useState<'login' | 'register'>('login');

  const manejarRegistroExitoso = (user?: UsuarioAutenticado) => {
    if (user) {
      alIniciarSesion?.(user);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background" />

      <AuthCard>
        {vista === 'login' ? (
          <FormularioLogin
            alIniciarSesion={alIniciarSesion}
            alSolicitarRegistro={() => setVista('register')}
          />
        ) : (
          <RegisterForm
            alSolicitarRegistro={manejarRegistroExitoso}
            onLoginClick={() => setVista('login')}
          />
        )}
      </AuthCard>
    </div>
  );
};

export default AuthPage;