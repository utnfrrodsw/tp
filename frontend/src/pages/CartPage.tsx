import React from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/useCart';
import { getImageUrl } from '../utils/api-config'; // ✅ IMPORTAR

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mt-5">
        <div className="text-center py-5">
          <h2>🛒 Tu carrito está vacío</h2>
          <p className="text-muted">¡Agrega algunos productos para comenzar!</p>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => navigate('/catalog')}
          >
            Ver Catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">🛒 Mi Carrito ({items.length} {items.length === 1 ? 'producto' : 'productos'})</h1>

      <div className="row">
        <div className="col-lg-8">
          {items.map((item, index) => (
            <div key={`cart-item-${item.producto.id}-${index}`} className="card mb-3">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-2">
                    {item.producto.imagen ? (
                      <img 
                        src={getImageUrl(item.producto.imagen)} // ✅ USAR FUNCIÓN
                        alt={item.producto.titulo} 
                        className="img-fluid rounded" 
                        style={{ width: '100%', height: 'auto', maxHeight: 100, objectFit: 'contain', background: '#fff' }} 
                      />
                    ) : (
                      <div className="bg-light p-3 text-center rounded">
                        <span style={{ fontSize: '2rem' }}>👕</span>
                      </div>
                    )}
                  </div>

                  <div className="col-md-4">
                    <h5 className="mb-1">{item.producto.titulo}</h5>
                    <p className="text-muted mb-1">
                      <small>{item.producto.equipo} - {item.producto.talle}</small>
                    </p>
                    <small className="text-muted">Stock disponible: {item.producto.stock}</small>
                  </div>

                  <div className="col-md-2">
                    <label className="form-label small">Cantidad:</label>
                    <div className="input-group input-group-sm">
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => updateQuantity(item.producto.id, Math.max(1, item.cantidad - 1))}
                        disabled={item.cantidad <= 1}
                        type="button"
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        className="form-control text-center" 
                        value={item.cantidad}
                        onChange={(e) => {
                          const qty = Math.max(1, Math.min(item.producto.stock, parseInt(e.target.value) || 1));
                          updateQuantity(item.producto.id, qty);
                        }}
                        min={1}
                        max={item.producto.stock}
                        style={{ maxWidth: '60px' }}
                      />
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => updateQuantity(item.producto.id, Math.min(item.producto.stock, item.cantidad + 1))}
                        disabled={item.cantidad >= item.producto.stock}
                        type="button"
                      >
                        +
                      </button>
                    </div>
                    {item.cantidad >= item.producto.stock && (
                      <small className="text-warning d-block mt-1">Stock máximo</small>
                    )}
                  </div>

                  <div className="col-md-2 text-end">
                    <p className="mb-0 fw-bold fs-5">
                      ${((item.producto?.precioInicial ?? 0) * item.cantidad).toLocaleString()}
                    </p>
                    <small className="text-muted">
                      ${(item.producto?.precioInicial ?? 0).toLocaleString()} c/u
                    </small>
                  </div>

                  <div className="col-md-2 text-end">
                    <button 
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => {
                        removeFromCart(item.producto.id);
                        toast.info(`🗑️ ${item.producto.titulo} eliminado del carrito`);
                      }}
                      type="button"
                    >
                      <i className="bi bi-trash"></i> Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="d-flex justify-content-between align-items-center mt-3">
            <button 
              className="btn btn-outline-secondary"
              onClick={() => navigate('/catalog')}
              type="button"
            >
              ← Seguir Comprando
            </button>
            <button 
              className="btn btn-outline-danger"
              onClick={() => {
                clearCart();
                toast.success('🧹 Carrito vaciado');
              }}
              type="button"
            >
              Vaciar Carrito
            </button>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card sticky-top" style={{ top: '20px' }}>
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Resumen de Compra</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal ({items.length} {items.length === 1 ? 'producto' : 'productos'})</span>
                <strong>${total.toLocaleString()}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Envío</span>
                <span className="text-success fw-bold">GRATIS</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <h5 className="mb-0">Total</h5>
                <h5 className="mb-0 text-primary">${total.toLocaleString()}</h5>
              </div>
              
              <button 
                className="btn btn-primary w-100 mb-2 py-2"
                onClick={() => navigate('/checkout')}
                type="button"
              >
                Proceder al Pago →
              </button>
              
              <button 
                className="btn btn-outline-secondary w-100"
                onClick={() => navigate('/catalog')}
                type="button"
              >
                Continuar Comprando
              </button>

              <div className="mt-3 p-3 bg-light rounded">
                <small className="text-muted">
                  <i className="bi bi-shield-check"></i> Compra 100% segura
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
