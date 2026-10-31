
import React from 'react';
import './AuthCard.scss';

interface AuthCardProps {
  children: React.ReactNode;
}

export const AuthCard: React.FC<AuthCardProps> = ({ children }) => {
  return (
    <div className="auth-card">
      <div className="auth-logo">
        <h1>PlanIt</h1>
        <p>- Organizacion de Eventos -</p>
      </div>

      <div className="auth-columns">
        <div className="auth-column">
          {children}
        </div>
      </div>
    </div>
  );
};