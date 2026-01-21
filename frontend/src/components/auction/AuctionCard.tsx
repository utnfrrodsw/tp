import React from 'react';
import { Link } from 'react-router-dom';
import type { Subasta } from '../../types';
import { AuctionTimer } from './AuctionTimer';
import { getImageUrl } from '../../utils/api-config'; 

interface AuctionCardProps {
  subasta: Subasta;
}

export const AuctionCard: React.FC<AuctionCardProps> = ({ subasta }) => {
  const { camiseta } = subasta;

  return (
    <div className="card h-100 shadow-sm hover:shadow-lg transition-shadow">
      {/* Imagen */}
      <div className="position-relative">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '250px',
            background: '#fff',
            width: '100%',
            position: 'relative',
          }}
        >
          {camiseta.imagen ? (
            <img
              src={getImageUrl(camiseta.imagen)} 
              alt={camiseta.titulo}
              style={{
                maxWidth: '90%',
                maxHeight: '90%',
                objectFit: 'contain',
                width: 'auto',
                height: 'auto',
                display: 'block',
                margin: '0 auto',
                background: '#fff',
              }}
            />
          ) : (
            <span style={{ fontSize: '4rem', color: '#ccc' }}>👕</span>
          )}
        </div>
        
        {/* Badge de subasta activa */}
        <span 
          className="position-absolute top-0 end-0 m-2 badge bg-danger"
          style={{ fontSize: '0.9rem' }}
        >
          🔨 EN SUBASTA
        </span>
      </div>

      <div className="card-body d-flex flex-column">
        {/* Título */}
        <h5 className="card-title mb-2">{camiseta.titulo}</h5>
        
        {/* Info de la camiseta */}
        <p className="text-muted mb-2">
          <small>
            <strong>{camiseta.equipo}</strong> • {camiseta.temporada} • Talle {camiseta.talle}
          </small>
        </p>

        {/* Precios */}
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="text-muted small">Precio inicial:</span>
            <span className="text-muted">${camiseta.precioInicial.toLocaleString()}</span>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <span className="fw-bold">Oferta actual:</span>
            <span className="fs-5 fw-bold text-success">
              ${subasta.precioActual.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Timer */}
        <div className="mb-3">
          <AuctionTimer fechaFin={subasta.fechaFin} />
        </div>

        {/* Botón */}
        <Link 
          to={`/auctions/${subasta.id}`}
          className="btn btn-primary w-100 mt-auto"
        >
          Ver Subasta →
        </Link>
      </div>
    </div>
  );
};