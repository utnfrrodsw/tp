import type { ReactNode } from 'react';
import './Card.scss';

interface CardProps {
  id: string;
  amount: string;
  label: string;
  icon: string | ReactNode;
}

export default function Card({ id, amount, label, icon }: CardProps) {
  return (
    <div id={id} className="card-container">
      <div className="card-accent" />

      <div className="card-body">
        <div>
          <div className="card-amount">{amount}</div>
          <div className="card-label">{label}</div>
        </div>

        {typeof icon === 'string' ? (
          <img className="card-icon" src={icon} alt="icono" />
        ) : (
          <div className="card-icon card-icon-lucide">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

