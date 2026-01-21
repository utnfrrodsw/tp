// src/components/common/ProductCard.tsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import type { Camiseta } from '../../types';
import { useCart } from '../../context/useCart';
import { getImageUrl } from '../../utils/api-config';
import { API_BASE_URL } from '../../utils/constants'; 

interface ProductCardProps {
  camiseta: Camiseta;
  onAddToCart?: (camiseta: Camiseta) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void | Promise<void>;
  showActions?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ camiseta, onAddToCart, onEdit, onDelete, showActions }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleVerSubasta = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/subastas/camiseta/${camiseta.id}`);
      
      if (!response.ok) {
        throw new Error('No se encontró subasta');
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        navigate(`/auctions/${data.data.id}`);
      } else {
        toast.error('❌ No se encontró una subasta activa para esta camiseta.');
      }
    } catch (error) {
      console.error('Error al buscar subasta:', error);
      toast.error('❌ Error al cargar la subasta. Esta camiseta aún no tiene una subasta creada.');
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarAlCarrito = () => {
    if (onAddToCart) {
      onAddToCart(camiseta);
    } else {
      addToCart(camiseta, 1);
      toast.success(`✅ ${camiseta.titulo} agregado al carrito`);
    }
  };

  const precioFinal = camiseta.tieneDescuento && camiseta.precioConDescuento 
    ? camiseta.precioConDescuento 
    : camiseta.precioInicial;

  return (
    <div className="card h-100 shadow-sm">
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

        {camiseta.esSubasta && (
          <span className="position-absolute top-0 end-0 m-2 badge bg-danger">
            🔨 EN SUBASTA
          </span>
        )}

        {camiseta.tieneDescuento && camiseta.porcentajeTotal && (
          <span className="position-absolute top-0 start-0 m-2 badge bg-success">
            🏷️ -{camiseta.porcentajeTotal.toFixed(0)}% OFF
          </span>
        )}
      </div>

      <div className="card-body d-flex flex-column">
        <h5 className="card-title mb-2">{camiseta.titulo}</h5>

        <p className="text-muted mb-2">
          <small>
            <strong>{camiseta.equipo}</strong> • {camiseta.temporada} • Talle {camiseta.talle}
          </small>
        </p>

        <div className="mb-2">
          <span className="badge bg-info">{camiseta.condicion}</span>
        </div>

        <div className="mb-3">
          {camiseta.tieneDescuento && camiseta.precioConDescuento ? (
            <>
              <div className="d-flex align-items-center gap-2">
                <span className="text-decoration-line-through text-muted">
                  ${camiseta.precioInicial.toLocaleString()}
                </span>
                <span className="fs-5 fw-bold text-success">
                  ${precioFinal.toLocaleString()}
                </span>
              </div>
              {camiseta.descuentos && camiseta.descuentos.length > 0 && (
                <small className="text-success d-block">
                  {camiseta.descuentos.length === 1 
                    ? `✅ ${camiseta.descuentos[0].descripcion}`
                    : `✅ ${camiseta.descuentos.length} descuentos acumulados`
                  }
                </small>
              )}
            </>
          ) : (
            <span className="fs-5 fw-bold text-success">
              ${precioFinal.toLocaleString()}
            </span>
          )}
          {camiseta.esSubasta && (
            <span className="text-muted ms-2 d-block">
              <small>Precio inicial</small>
            </span>
          )}
        </div>

        <div className="mt-auto">
          {camiseta.esSubasta ? (
            <button
              onClick={handleVerSubasta}
              className="btn btn-danger w-100"
              type="button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Buscando...
                </>
              ) : (
                '🔨 Ver Subasta'
              )}
            </button>
          ) : (
            <button
              onClick={handleAgregarAlCarrito}
              className="btn btn-primary w-100"
              type="button"
            >
              🛒 Agregar al Carrito
            </button>
          )}

          <button
            onClick={() => navigate(`/product/${camiseta.id}`)}
            className="btn btn-outline-secondary w-100 mt-2"
            type="button"
          >
            Ver Detalle
          </button>

          {showActions && (
            <div className="d-flex gap-2 mt-2">
              {onEdit && (
                <button className="btn btn-outline-warning w-50" type="button" onClick={() => onEdit(camiseta.id)}>Editar</button>
              )}
              {onDelete && (
                <button className="btn btn-outline-danger w-50" type="button" onClick={() => onDelete(camiseta.id)}>Eliminar</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};