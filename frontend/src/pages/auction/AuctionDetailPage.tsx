import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuction } from '../../hooks/useAuction';
import { useAuth } from '../../contexts/AuthContext';
import { AuctionTimer } from '../../components/auction/AuctionTimer';
import { BidForm } from '../../components/auction/BidForm';
import { BidHistory } from '../../components/auction/BidHistory';
import { getImageUrl } from '../../utils/api-config'; 

export const AuctionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, usuario } = useAuth();
  const { subasta, ofertas, loading, error, refetch } = useAuction(parseInt(id || '0'));

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3">Cargando subasta...</p>
      </div>
    );
  }

  if (error || !subasta) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Error al cargar la subasta</h4>
          <p>{error || 'Subasta no encontrada'}</p>
          <button className="btn btn-primary" onClick={() => navigate('/auctions')}>
            ← Volver a Subastas
          </button>
        </div>
      </div>
    );
  }

  const { camiseta } = subasta;
  const puedeOfertar = isAuthenticated && 
                       usuario?.id !== camiseta.vendedor.id && 
                       new Date(subasta.fechaFin) > new Date();

  return (
    <div className="container mt-4 mb-5">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/auctions" className="text-decoration-none">Subastas</a>
          </li>
          <li className="breadcrumb-item active">{camiseta.titulo}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <h1 className="mb-2">🔨 {camiseta.titulo}</h1>
          <AuctionTimer fechaFin={subasta.fechaFin} className="fs-5" />
        </div>
      </div>

      <div className="row">
        <div className="col-lg-7">
          <div className="card mb-4">
            {camiseta.imagen ? (
              <img
                src={getImageUrl(camiseta.imagen)} 
                alt={camiseta.titulo}
                className="card-img-top"
                style={{ maxHeight: '500px', objectFit: 'contain', background: '#fff', width: '100%' }}
              />
            ) : (
              <div
                className="bg-light d-flex align-items-center justify-content-center"
                style={{ height: '500px' }}
              >
                <span style={{ fontSize: '8rem' }}>👕</span>
              </div>
            )}
          </div>

          {/* Información de la camiseta */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">📋 Información del Producto</h5>
            </div>
            <div className="card-body">
              <table className="table table-borderless mb-0">
                <tbody>
                  <tr>
                    <td className="fw-bold">Equipo:</td>
                    <td>{camiseta.equipo}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Temporada:</td>
                    <td>{camiseta.temporada}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Talle:</td>
                    <td>{camiseta.talle}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Condición:</td>
                    <td>
                      <span className="badge bg-info">{camiseta.condicion}</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Categoría:</td>
                    <td>{camiseta.categoria?.nombre || 'Sin categoría'}</td>
                  </tr>
                </tbody>
              </table>

              {camiseta.descripcion && (
                <div className="mt-3">
                  <h6 className="fw-bold">Descripción:</h6>
                  <p className="text-muted mb-0">{camiseta.descripcion}</p>
                </div>
              )}
            </div>
          </div>

          {/* Vendedor */}
          <div className="card mt-3">
            <div className="card-body">
              <h6 className="fw-bold mb-2">👤 Vendedor</h6>
              <p className="mb-0">
                {camiseta.vendedor.nombre} {camiseta.vendedor.apellido}
                {camiseta.vendedor.rol === 'administrador' && (
                  <span className="badge bg-warning text-dark ms-2">Admin</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Ofertas */}
        <div className="col-lg-5">
          {/* Precio actual */}
          <div className="card mb-3 border-success">
            <div className="card-body text-center">
              <h6 className="text-muted mb-2">OFERTA ACTUAL</h6>
              <h2 className="text-success mb-0">
                ${subasta.precioActual.toLocaleString()}
              </h2>
              <small className="text-muted">
                Precio inicial: ${camiseta.precioInicial.toLocaleString()}
              </small>
            </div>
          </div>

          {/* Formulario de oferta */}
          {puedeOfertar ? (
            <BidForm subasta={subasta} onBidSuccess={refetch} />
          ) : !isAuthenticated ? (
            <div className="alert alert-warning">
              <strong>⚠️ Debes iniciar sesión</strong>
              <p className="mb-2">Para hacer ofertas, inicia sesión o regístrate.</p>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => navigate('/login', { state: { from: `/auctions/${id}` } })}
              >
                Iniciar Sesión
              </button>
            </div>
          ) : usuario?.id === camiseta.vendedor.id ? (
            <div className="alert alert-info">
              ℹ️ No puedes ofertar en tu propia subasta
            </div>
          ) : (
            <div className="alert alert-secondary">
              ⏱️ Esta subasta ha finalizado
            </div>
          )}

          {/* Historial de ofertas */}
          <div className="mt-3">
            <BidHistory ofertas={ofertas} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};