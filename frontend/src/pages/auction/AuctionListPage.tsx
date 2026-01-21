import React, { useState } from 'react';
import { useAuctions } from '../../hooks/useAuctions';
import { AuctionCard } from '../../components/auction/AuctionCard';

export const AuctionListPage: React.FC = () => {
  const [filtroActivas, setFiltroActivas] = useState<boolean>(true);
  const { subastas, loading, error, refetch } = useAuctions({ 
    activas: filtroActivas 
  });

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">
          🔨 Subastas {filtroActivas ? 'Activas' : 'Finalizadas'}
        </h1>
        <button 
          className="btn btn-outline-primary"
          onClick={() => refetch()}
        >
          🔄 Actualizar
        </button>
      </div>

      {/* Filtros */}
      <div className="btn-group mb-4" role="group">
        <button
          type="button"
          className={`btn ${filtroActivas ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setFiltroActivas(true)}
        >
          🔥 Activas
        </button>
        <button
          type="button"
          className={`btn ${!filtroActivas ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setFiltroActivas(false)}
        >
          📦 Finalizadas
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
          <p className="mt-3">Cargando subastas...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Sin subastas */}
      {!loading && !error && subastas.length === 0 && (
        <div className="alert alert-info text-center py-5">
          <h3>📭 No hay subastas {filtroActivas ? 'activas' : 'finalizadas'}</h3>
          <p className="mb-0">
            {filtroActivas 
              ? 'Vuelve pronto para ver nuevas subastas.'
              : 'No hay subastas finalizadas en este momento.'}
          </p>
        </div>
      )}

      {/* Grid de subastas */}
      {!loading && !error && subastas.length > 0 && (
        <>
          <div className="row">
            {subastas.map((subasta) => (
              <div key={subasta.id} className="col-md-6 col-lg-4 mb-4">
                <AuctionCard subasta={subasta} />
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="alert alert-light mt-4">
            <strong>Total:</strong> {subastas.length} subasta{subastas.length !== 1 ? 's' : ''}
          </div>
        </>
      )}
    </div>
  );
};