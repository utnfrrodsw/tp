import React from 'react';
import type { Oferta } from '../../types';

interface BidHistoryProps {
  ofertas: Oferta[];
  loading?: boolean;
}

export const BidHistory: React.FC<BidHistoryProps> = ({ ofertas, loading }) => {
  if (loading) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <div className="spinner-border text-primary" />
          <p className="mt-2">Cargando ofertas...</p>
        </div>
      </div>
    );
  }

  if (ofertas.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center text-muted">
          <p className="mb-0">
            📭 Aún no hay ofertas. ¡Sé el primero en ofertar!
          </p>
        </div>
      </div>
    );
  }

  const formatearFecha = (fecha: Date | string) => {
    const date = new Date(fecha);
    const ahora = new Date();
    const diffMs = ahora.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHoras = Math.floor(diffMs / 3600000);
    const diffDias = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHoras < 24) return `Hace ${diffHoras}h`;
    if (diffDias < 7) return `Hace ${diffDias}d`;
    
    return date.toLocaleDateString('es-AR', { 
      day: '2-digit', 
      month: 'short' 
    });
  };

  return (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">📊 Historial de Ofertas ({ofertas.length})</h5>
      </div>
      <div className="card-body p-0">
        <div className="list-group list-group-flush" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {ofertas.map((oferta, index) => (
            <div 
              key={oferta.id} 
              className={`list-group-item ${index === 0 ? 'bg-light' : ''}`}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong className={index === 0 ? 'text-success' : ''}>
                    {index === 0 && '👑 '}
                    {oferta.usuario.nombre} {oferta.usuario.apellido}
                  </strong>
                  <small className="text-muted d-block">
                    {formatearFecha(oferta.fechaOferta)}
                  </small>
                </div>
                <span className={`fs-5 fw-bold ${index === 0 ? 'text-success' : ''}`}>
                  ${oferta.monto.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};