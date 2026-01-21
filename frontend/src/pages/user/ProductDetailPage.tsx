import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { camisetaService } from '../../services/api';
import type { Camiseta } from '../../types';
import { useCart } from '../../context/useCart';
import { getImageUrl } from '../../utils/api-config'; // ✅ IMPORTAR

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [camiseta, setCamiseta] = useState<Camiseta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await camisetaService.getById(Number(id));
        setCamiseta(data);
      } catch (e) {
        console.error('Error cargando producto', e);
        setError('No se pudo cargar el producto');
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const handleAddToCart = () => {
    if (!camiseta) return;
    addToCart(camiseta, 1);
    setSuccess(`✅ ${camiseta.titulo} agregado al carrito`);
    setTimeout(() => setSuccess(''), 2000);
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3">Cargando producto...</p>
      </div>
    );
  }

  if (error || !camiseta) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Error</h4>
          <p>{error || 'Producto no encontrado'}</p>
          <button className="btn btn-primary" onClick={() => navigate('/catalog')} type="button">Volver al Catálogo</button>
        </div>
      </div>
    );
  }

  const precioFinal = camiseta.tieneDescuento && camiseta.precioConDescuento
    ? camiseta.precioConDescuento
    : camiseta.precioInicial;

  return (
    <div className="container mt-4 mb-5">
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess('')} aria-label="Close"></button>
        </div>
      )}

      {camiseta.tieneDescuento && camiseta.descuentos && camiseta.descuentos.length > 0 && (
        <div className="alert alert-success mb-3">
          <div className="d-flex align-items-start">
            <span className="fs-4 me-2">🏷️</span>
            <div className="flex-grow-1">
              <strong className="d-block mb-2">
                ¡{camiseta.porcentajeTotal?.toFixed(0)}% de descuento acumulado!
              </strong>
              {camiseta.descuentos.length === 1 ? (
                <div>
                  <span className="badge bg-success me-2">{camiseta.descuentos[0].porcentaje}%</span>
                  {camiseta.descuentos[0].descripcion}
                </div>
              ) : (
                <>
                  <small className="d-block mb-2">Descuentos aplicados:</small>
                  <ul className="mb-0 small">
                    {camiseta.descuentos.map((desc, idx) => (
                      <li key={idx}>
                        <span className="badge bg-success me-2">{desc.porcentaje}%</span>
                        {desc.descripcion}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="d-flex align-items-center mb-3">
        <button className="btn btn-outline-secondary me-3" onClick={() => navigate(-1)} type="button">← Volver</button>
        <h1 className="mb-0">{camiseta.titulo}</h1>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <div className="card">
            {camiseta.imagen ? (
              <img 
                src={getImageUrl(camiseta.imagen)} // ✅ USAR FUNCIÓN
                alt={camiseta.titulo} 
                className="card-img-top img-fluid" 
                style={{ width: '100%', height: 'auto', maxHeight: 480, objectFit: 'contain', background: '#fff' }} 
              />
            ) : (
              <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: 320 }}>
                <span style={{ fontSize: '6rem' }}>👕</span>
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card mb-3">
            <div className="card-body">
              <div className="mb-3">
                <span className="text-muted d-block mb-1">Precio</span>
                {camiseta.tieneDescuento && camiseta.precioConDescuento ? (
                  <div>
                    <div className="d-flex align-items-baseline gap-2">
                      <span className="text-decoration-line-through text-muted fs-5">
                        ${camiseta.precioInicial.toLocaleString()}
                      </span>
                      <span className="fs-2 fw-bold text-success">
                        ${precioFinal.toLocaleString()}
                      </span>
                      <span className="badge bg-success fs-6">
                        -{camiseta.porcentajeTotal?.toFixed(0)}% OFF
                      </span>
                    </div>
                    <small className="text-success d-block mt-1">
                      Ahorrás ${(camiseta.precioInicial - precioFinal).toLocaleString()}
                    </small>
                  </div>
                ) : (
                  <span className="fs-2 fw-bold text-success">
                    ${precioFinal.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="mb-2">
                {camiseta.esSubasta ? (
                  <span className="badge bg-danger">En subasta</span>
                ) : (
                  <span className="badge bg-success">Disponible</span>
                )}
                {camiseta.stock <= 0 && (
                  <span className="badge bg-secondary ms-2">Sin stock</span>
                )}
              </div>

              <table className="table table-borderless mb-0">
                <tbody>
                  <tr><td className="fw-bold">Equipo</td><td>{camiseta.equipo}</td></tr>
                  <tr><td className="fw-bold">Temporada</td><td>{camiseta.temporada}</td></tr>
                  <tr><td className="fw-bold">Talle</td><td>{camiseta.talle}</td></tr>
                  <tr><td className="fw-bold">Condición</td><td>{camiseta.condicion}</td></tr>
                  {camiseta.categoria && (
                    <tr><td className="fw-bold">Categoría</td><td>{camiseta.categoria.nombre}</td></tr>
                  )}
                  <tr><td className="fw-bold">Vendedor</td><td>{camiseta.vendedor.nombre} {camiseta.vendedor.apellido}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="d-grid gap-2 d-md-flex">
            {camiseta.esSubasta ? (
              <button className="btn btn-warning flex-grow-1" onClick={() => navigate(`/auctions`)} type="button">Ver Subastas</button>
            ) : (
              <button className="btn btn-primary flex-grow-1" disabled={camiseta.stock <= 0} onClick={handleAddToCart} type="button">
                🛒 Agregar al Carrito
              </button>
            )}
            <button className="btn btn-outline-secondary" onClick={() => navigate('/catalog')} type="button">Volver al Catálogo</button>
          </div>
        </div>
      </div>

      {camiseta.descripcion && (
        <div className="card mt-4">
          <div className="card-header bg-light"><h5 className="mb-0">Descripción</h5></div>
          <div className="card-body"><p className="mb-0 text-muted">{camiseta.descripcion}</p></div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
