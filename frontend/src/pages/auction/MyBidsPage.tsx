import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBids } from '../../hooks/useBids';
import { useAuth } from '../../contexts/AuthContext';
import type { Oferta } from '../../types';
import { getImageUrl } from '../../utils/api-config';

export const MyBidsPage: React.FC = () => {
  const { obtenerMisOfertas, loading } = useBids();
  const { usuario } = useAuth();
  const [ofertas, setOfertas] = useState<Oferta[]>([]);

  useEffect(() => {
    const cargarOfertas = async () => {
      const data = await obtenerMisOfertas();
      // Ordenar por fecha más reciente primero
      setOfertas(data.sort((a, b) => 
        new Date(b.fechaOferta).getTime() - new Date(a.fechaOferta).getTime()
      ));
    };

    cargarOfertas();
  }, [obtenerMisOfertas]);

  if (!usuario) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          <h4>⚠️ Debes iniciar sesión</h4>
          <p>Para ver tus ofertas, inicia sesión.</p>
          <Link to="/login" className="btn btn-primary">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">💰 Mis Ofertas</h1>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
          <p className="mt-3">Cargando ofertas...</p>
        </div>
      )}

      {!loading && ofertas.length === 0 && (
        <div className="alert alert-info text-center py-5">
          <h3>📭 No has realizado ofertas aún</h3>
          <p>Explora las subastas activas y comienza a ofertar.</p>
          <Link to="/auctions" className="btn btn-primary">
            Ver Subastas
          </Link>
        </div>
      )}

      {!loading && ofertas.length > 0 && (
        <div className="row">
          {ofertas.map((oferta) => {
            const subasta = oferta.subasta;
            const camiseta = subasta.camiseta;
            const esMejorOferta = oferta.monto === subasta.precioActual;
            const subastaActiva = new Date(subasta.fechaFin) > new Date();

            return (
              <div key={oferta.id} className="col-md-6 mb-4">
                <div className={`card h-100 ${esMejorOferta ? 'border-success' : ''}`}>
                  <div className="row g-0">
                    {/* Imagen */}
                    <div className="col-4">
                      {camiseta.imagen ? (
                        <img 
                          src={getImageUrl(camiseta.imagen)}
                          alt={camiseta.titulo}
                          className="img-fluid h-100"
                          style={{ objectFit: 'cover', width: '100%', height: 'auto', maxHeight: 180, background: '#fff' }}
                        />
                      ) : (
                        <div 
                          className="bg-light d-flex align-items-center justify-content-center h-100"
                        >
                          <span style={{ fontSize: '3rem' }}>👕</span>
                        </div>
                      )}
                    </div>

                    {/* Contenido */}
                    <div className="col-8">
                      <div className="card-body">
                        <h5 className="card-title">{camiseta.titulo}</h5>
                        
                        {esMejorOferta && (
                          <span className="badge bg-success mb-2">
                            👑 Mejor Oferta
                          </span>
                        )}
                        
                        {!subastaActiva && (
                          <span className="badge bg-secondary mb-2 ms-2">
                            Finalizada
                          </span>
                        )}

                        <p className="mb-1">
                          <strong>Tu oferta:</strong> ${oferta.monto.toLocaleString()}
                        </p>
                        <p className="mb-1">
                          <strong>Oferta actual:</strong> ${subasta.precioActual.toLocaleString()}
                        </p>
                        <p className="text-muted mb-2">
                          <small>
                            Ofertado el {new Date(oferta.fechaOferta).toLocaleDateString('es-AR')}
                          </small>
                        </p>

                        <Link 
                          to={`/auctions/${subasta.id}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          Ver Subasta →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};