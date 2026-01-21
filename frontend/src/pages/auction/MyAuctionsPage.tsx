import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { subastaService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { AuctionTimer } from '../../components/auction/AuctionTimer';
import type { Subasta } from '../../types';
import { getImageUrl } from '../../utils/api-config';

export const MyAuctionsPage: React.FC = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [subastas, setSubastas] = useState<Subasta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario) {
      navigate('/login');
      return;
    }

    const cargarMisSubastas = async () => {
      try {
        setLoading(true);
        const data = await subastaService.getMisSubastas(usuario.id);
        
        // Ordenar por fecha de creación (más reciente primero)
        setSubastas(data.sort((a, b) => 
          new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime()
        ));
      } catch (err) {
        console.error('Error al cargar mis subastas:', err);
        setError('Error al cargar tus subastas');
      } finally {
        setLoading(false);
      }
    };

    cargarMisSubastas();
  }, [usuario, navigate]);

  if (!usuario) {
    return null;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">📦 Mis Subastas</h1>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
          <p className="mt-3">Cargando subastas...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {!loading && !error && subastas.length === 0 && (
        <div className="alert alert-info text-center py-5">
          <h3>📭 No has publicado subastas aún</h3>
          <p>Aquí verás las camisetas que hayas puesto en subasta.</p>
          <Link to="/catalog" className="btn btn-primary">
            Explorar Catálogo
          </Link>
        </div>
      )}

      {!loading && !error && subastas.length > 0 && (
        <div className="row">
          {subastas.map((subasta) => {
            const camiseta = subasta.camiseta;
            const estaActiva = new Date(subasta.fechaFin) > new Date();
            const tieneOfertas = subasta.precioActual > camiseta.precioInicial;

            return (
              <div key={subasta.id} className="col-md-6 col-lg-4 mb-4">
                <div className={`card h-100 ${!estaActiva ? 'border-secondary' : ''}`}>
                  {/* Imagen */}
                  <div className="position-relative">
                    {camiseta.imagen ? (
                      <img
                        src={getImageUrl(camiseta.imagen)}
                        alt={camiseta.titulo}
                        className="card-img-top"
                        style={{ width: '100%', height: '200px', objectFit: 'cover', background: '#fff' }}
                      />
                    ) : (
                      <div
                        className="bg-light d-flex align-items-center justify-content-center"
                        style={{ height: '200px' }}
                      >
                        <span style={{ fontSize: '3rem' }}>👕</span>
                      </div>
                    )}

                    <span
                      className={`position-absolute top-0 end-0 m-2 badge ${
                        estaActiva ? 'bg-success' : 'bg-secondary'
                      }`}
                    >
                      {estaActiva ? '✅ ACTIVA' : '⏱️ FINALIZADA'}
                    </span>
                  </div>

                  <div className="card-body">
                    <h5 className="card-title">{camiseta.titulo}</h5>

                    <p className="text-muted mb-2">
                      <small>
                        {camiseta.equipo} • {camiseta.temporada}
                      </small>
                    </p>

                    <div className="mb-2">
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">Precio inicial:</span>
                        <span>${camiseta.precioInicial.toLocaleString()}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="fw-bold">Precio actual:</span>
                        <span className="fw-bold text-success">
                          ${subasta.precioActual.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {tieneOfertas ? (
                      <div className="alert alert-success py-2 mb-2">
                        <small>✅ Hay ofertas realizadas</small>
                      </div>
                    ) : (
                      <div className="alert alert-warning py-2 mb-2">
                        <small>⚠️ Sin ofertas aún</small>
                      </div>
                    )}

                    {estaActiva && (
                      <div className="mb-3">
                        <AuctionTimer fechaFin={subasta.fechaFin} />
                      </div>
                    )}

                    {!estaActiva && (
                      <p className="text-muted mb-3">
                        <small>
                          Finalizó el {new Date(subasta.fechaFin).toLocaleDateString('es-AR')}
                        </small>
                      </p>
                    )}

                    {/* Botón */}
                    <Link
                      to={`/auctions/${subasta.id}`}
                      className="btn btn-outline-primary w-100"
                    >
                      Ver Detalles
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stats */}
      {subastas.length > 0 && (
        <div className="alert alert-light mt-4">
          <div className="row">
            <div className="col-md-4">
              <strong>Total de subastas:</strong> {subastas.length}
            </div>
            <div className="col-md-4">
              <strong>Activas:</strong>{' '}
              {subastas.filter(s => new Date(s.fechaFin) > new Date()).length}
            </div>
            <div className="col-md-4">
              <strong>Finalizadas:</strong>{' '}
              {subastas.filter(s => new Date(s.fechaFin) <= new Date()).length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};