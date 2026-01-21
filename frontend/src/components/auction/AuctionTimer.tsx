import React from 'react';
import { useAuctionTimer } from '../../hooks/useAuctionTimer';

interface AuctionTimerProps {
  fechaFin: Date | string;
  className?: string;
}

export const AuctionTimer: React.FC<AuctionTimerProps> = ({ fechaFin, className = '' }) => {
  const { tiempoRestante, finalizada } = useAuctionTimer(fechaFin);

  if (finalizada) {
    return (
      <div className={`text-red-600 font-bold ${className}`}>
        ⏱️ SUBASTA FINALIZADA
      </div>
    );
  }

  const { dias, horas, minutos, segundos } = tiempoRestante;

  // Cambiar color según tiempo restante
  const isUrgent = tiempoRestante.total < 3600000; 
  const isWarning = tiempoRestante.total < 86400000;

  const colorClass = isUrgent 
    ? 'text-red-600 animate-pulse' 
    : isWarning 
    ? 'text-orange-600' 
    : 'text-green-600';

  return (
    <div className={`font-bold ${colorClass} ${className}`}>
      ⏰ Finaliza en: 
      <span className="ml-2">
        {dias > 0 && `${dias}d `}
        {String(horas).padStart(2, '0')}:
        {String(minutos).padStart(2, '0')}:
        {String(segundos).padStart(2, '0')}
      </span>
    </div>
  );
};