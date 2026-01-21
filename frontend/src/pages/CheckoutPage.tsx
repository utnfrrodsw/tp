import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/useCart';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import type { MetodoPago } from '../types';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { usuario } = useAuth();

  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMetodos, setLoadingMetodos] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    direccionEnvio: '', // ✅ CAMBIAR: inicializar vacío porque direccion no existe en Usuario
    metodoPagoId: '',
    notas: ''
  });

  useEffect(() => {
    if (!usuario) {
      navigate('/login');
      return;
    }
    loadMetodosPago();
  }, [usuario, navigate]);

  const loadMetodosPago = async () => {
    try {
      setLoadingMetodos(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_BASE_URL}/metodos-pago`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const metodosActivos = response.data.data.filter((m: MetodoPago) => m.activo);
      setMetodosPago(metodosActivos);
      
    } catch (error: unknown) {
      console.error('Error loading payment methods:', error);
      setError('Error al cargar métodos de pago. Intenta nuevamente.');
    } finally {
      setLoadingMetodos(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (items.length === 0) {
      setError('El carrito está vacío');
      return;
    }
    if (!formData.metodoPagoId) {
      setError('Selecciona un método de pago');
      return;
    }
    if (!formData.direccionEnvio.trim()) {
      setError('La dirección de envío es obligatoria');
      return;
    }
    // Validar stock de todos los items antes de proceder
    const sinStock = items.find(i => i.cantidad > (i.producto?.stock ?? 0));
    if (sinStock) {
      setError(`No hay stock suficiente para "${sinStock.producto.titulo}"`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!usuario) throw new Error('Usuario no autenticado');

      // Construir payload para compra con múltiples ítems (según backend)
      const payload = {
        usuarioId: usuario.id,
        direccionEnvio: formData.direccionEnvio,
        metodoPagoId: parseInt(formData.metodoPagoId),
        items: items.map((item) => ({
          camisetaId: item.producto.id,
          cantidad: item.cantidad,
        })),
        notas: formData.notas || undefined,
      };

      await axios.post(
        `${API_BASE_URL}/compras`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      clearCart();
      setSuccess(`✅ ¡Compra realizada con éxito! Total pagado: $${total.toLocaleString()}`);
      setTimeout(() => {
        setSuccess('');
        navigate('/orders');
      }, 2000);
    } catch (error: unknown) {
      console.error('Error creating order:', error);
      let errorMsg = 'Error al procesar la compra. Intenta nuevamente.';
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { error?: string } | undefined;
        errorMsg = data?.error || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message || errorMsg;
      }
      setError(errorMsg);
      
      // Si el error es de stock, mostrar mensaje visual
    } finally {
      setLoading(false);
    }
  };

  // Redirigir si el carrito está vacío
  if (items.length === 0) {
    return (
      <div className="container mt-5">
        <div className="text-center py-5">
          <h2>🛒 Tu carrito está vacío</h2>
          <p className="text-muted">Agrega productos antes de hacer checkout</p>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => navigate('/catalog')}
            type="button"
          >
            Ver Catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex align-items-center mb-4">
        <button 
          className="btn btn-outline-secondary me-3"
          onClick={() => navigate('/cart')}
          type="button"
        >
          ← Volver al Carrito
        </button>
        <h1 className="mb-0">💳 Finalizar Compra</h1>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Error:</strong> {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError('')}
            aria-label="Close"
          ></button>
        </div>
      )}
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <strong>Éxito:</strong> {success}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setSuccess('')}
            aria-label="Close"
          ></button>
        </div>
      )}

      <div className="row">
        {/* Formulario */}
        <div className="col-lg-8">
          <form onSubmit={handleSubmit}>
            
            {/* Información del usuario */}
            <div className="card mb-3">
              <div className="card-header bg-light">
                <h5 className="mb-0">👤 Información del Comprador</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Nombre:</strong> {usuario?.nombre} {usuario?.apellido}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Email:</strong> {usuario?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dirección de envío */}
            <div className="card mb-3">
              <div className="card-header bg-light">
                <h5 className="mb-0">📍 Dirección de Envío</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Dirección Completa *</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={formData.direccionEnvio}
                    onChange={(e) => setFormData({ ...formData, direccionEnvio: e.target.value })}
                    placeholder="Calle, número, piso, departamento, código postal, ciudad"
                    required
                  />
                  <small className="text-muted">Asegúrate de que la dirección sea correcta y completa</small>
                </div>
              </div>
            </div>

            {/* Método de pago */}
            <div className="card mb-3">
              <div className="card-header bg-light">
                <h5 className="mb-0">💳 Método de Pago</h5>
              </div>
              <div className="card-body">
                {loadingMetodos ? (
                  <div className="text-center py-3">
                    <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                    Cargando métodos de pago...
                  </div>
                ) : metodosPago.length === 0 ? (
                  <div className="alert alert-warning">
                    No hay métodos de pago disponibles. Contacta con soporte.
                  </div>
                ) : (
                  metodosPago.map((metodo) => (
                    <div key={metodo.id} className="form-check mb-3 p-3 border rounded">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="metodoPago"
                        id={`metodo-${metodo.id}`}
                        value={metodo.id}
                        onChange={(e) => setFormData({ ...formData, metodoPagoId: e.target.value })}
                        required
                      />
                      <label className="form-check-label w-100" htmlFor={`metodo-${metodo.id}`}>
                        <strong>{metodo.nombre}</strong>
                        <p className="mb-0 text-muted small mt-1">{metodo.descripcion}</p>
                      </label>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Notas adicionales */}
            <div className="card mb-3">
              <div className="card-header bg-light">
                <h5 className="mb-0">📝 Notas Adicionales (Opcional)</h5>
              </div>
              <div className="card-body">
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Instrucciones especiales de entrega, preferencias de horario, etc."
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg w-100 py-3"
              disabled={loading || loadingMetodos || metodosPago.length === 0}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Procesando compra...
                </>
              ) : (
                `Confirmar Compra - $${total.toLocaleString()}`
              )}
            </button>

            <div className="text-center mt-3">
              <small className="text-muted">
                Al confirmar la compra, aceptas nuestros términos y condiciones
              </small>
            </div>
          </form>
        </div>

        {/* Resumen de orden */}
        <div className="col-lg-4">
          <div className="card sticky-top" style={{ top: '20px' }}>
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">📋 Resumen de Orden</h5>
            </div>
            <div className="card-body">
              <h6 className="mb-3">Productos ({items.length})</h6>
              
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {/* ✅ CAMBIAR: usar producto y cantidad */}
                {items.map((item, index) => (
                  <div key={index} className="d-flex justify-content-between mb-2 pb-2 border-bottom">
                    <div className="flex-grow-1 me-2">
                      <small className="d-block text-truncate">{item.producto.titulo}</small>
                      <small className="text-muted">Cant: {item.cantidad} × ${item.producto.precioInicial.toLocaleString()}</small>
                    </div>
                    <div className="text-end">
                      <small className="fw-bold">${(item.producto.precioInicial * item.cantidad).toLocaleString()}</small>
                    </div>
                  </div>
                ))}
              </div>

              <hr />
              
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <strong>${total.toLocaleString()}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Envío</span>
                <span className="text-success fw-bold">GRATIS</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted small">Impuestos</span>
                <span className="text-muted small">Incluidos</span>
              </div>
              
              <hr className="my-3" />
              
              <div className="d-flex justify-content-between mb-3">
                <h5 className="mb-0">Total a Pagar</h5>
                <h5 className="mb-0 text-primary">${total.toLocaleString()}</h5>
              </div>

              <div className="bg-light p-3 rounded">
                <small className="text-muted d-block mb-2">
                  <i className="bi bi-shield-check text-success"></i> Pago 100% seguro
                </small>
                <small className="text-muted d-block">
                  <i className="bi bi-truck text-primary"></i> Envío gratuito a todo el país
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
