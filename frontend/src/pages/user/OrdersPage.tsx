// src/pages/user/OrdersPage.tsx - HISTORIAL DE COMPRAS

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/constants';
import { getImageUrl } from '../../utils/api-config';
import type { Compra, EstadoCompra } from '../../types';

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!usuario) {
      navigate('/login');
      return;
    }
    const loadCompras = async () => {
      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/compras/usuario/${usuario?.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setCompras(response.data.data || []);
        } else {
          setCompras([]);
        }
      } catch (error: unknown) {
        console.error('Error loading orders:', error);
        if (error instanceof axios.AxiosError && (error.response?.status === 404 || error.response?.data?.count === 0)) {
          setCompras([]);
        } else {
          setError('Error al cargar las compras');
        }
      } finally {
        setLoading(false);
      }
    };
    loadCompras();
  }, [usuario, navigate]);

  const getEstadoBadge = (estado: EstadoCompra): string => {
    const badges: Record<string, string> = {
      pendiente: 'warning',
      confirmada: 'info',
      pagada: 'success',
      enviada: 'primary',
      entregada: 'success',
      cancelada: 'danger'
    };
    return badges[estado] || 'secondary';
  };

  const getEstadoIcono = (estado: EstadoCompra): string => {
    const iconos: Record<string, string> = {
      pendiente: '⏳',
      confirmada: '✅',
      pagada: '💰',
      enviada: '🚚',
      entregada: '📦',
      cancelada: '❌'
    };
    return iconos[estado] || '📋';
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p>Cargando tus compras...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h5>⚠️ {error}</h5>
          <button 
            className="btn btn-outline-danger mt-2" 
            onClick={() => window.location.reload()}
            type="button"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>📦 Mis Compras</h1>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/')}
          type="button"
        >
          Seguir Comprando
        </button>
      </div>

      {compras.length === 0 ? (
        <div className="text-center py-5">
          <div style={{ fontSize: '4rem' }}>🛒</div>
          <h3 className="mt-3">No tienes compras aún</h3>
          <p className="text-muted">¡Comienza a comprar tus camisetas favoritas!</p>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => navigate('/')}
            type="button"
          >
            Ver Catálogo
          </button>
        </div>
      ) : (
        <>
          <div className="alert alert-info mb-4">
            <strong>Total de compras:</strong> {compras.length} orden{compras.length !== 1 ? 'es' : ''}
          </div>

          <div className="row">
            {compras.map((compra) => (
              <div key={compra.id} className="col-12 mb-3">
                <div className="card">
                  <div className="card-body">
                    {/* Header de la orden */}
                    <div className="row align-items-center mb-3">
                      <div className="col-md-3">
                        <h6 className="mb-0 text-primary">Orden #{compra.id}</h6>
                        <small className="text-muted">
                          {new Date(compra.fechaCompra).toLocaleDateString('es-AR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </small>
                      </div>

                      <div className="col-md-3 text-center">
                        <span className={`badge bg-${getEstadoBadge(compra.estado)} fs-6 px-3 py-2`}>
                          {getEstadoIcono(compra.estado)} {compra.estado.toUpperCase()}
                        </span>
                      </div>

                      <div className="col-md-3 text-center">
                        <small className="text-muted d-block">Método de pago</small>
                        <strong>{compra.metodoPago.nombre}</strong>
                      </div>

                      <div className="col-md-3 text-end">
                        <small className="text-muted d-block">Total</small>
                        <h5 className="mb-0 text-success">${compra.total.toLocaleString()}</h5>
                      </div>
                    </div>

                    {/* ✅ ITEMS CON PRECIOS Y DESCUENTOS */}
                    <div className="border-top pt-3">
                      {compra.items && compra.items.length > 0 ? (
                        <>
                          <small className="text-muted d-block mb-2">
                            <strong>Productos ({compra.items.length}):</strong>
                          </small>
                          {compra.items.map((item) => {
                            // ✅ Detectar si hubo descuento comparando precioUnitario con precioInicial
                            const precioOriginal = item.camiseta.precioInicial;
                            const precioComprado = item.precioUnitario;
                            const huboDescuento = precioComprado < precioOriginal;
                            const porcentajeDescuento = huboDescuento 
                              ? ((precioOriginal - precioComprado) / precioOriginal * 100).toFixed(0)
                              : 0;

                            return (
                              <div key={item.id} className="d-flex align-items-center mb-2 pb-2 border-bottom">
                                {item.camiseta.imagen ? (
                                  <img 
                                    src={getImageUrl(item.camiseta.imagen)}
                                    alt={item.camiseta.titulo} 
                                    className="rounded me-3" 
                                    style={{ width: '60px', height: '60px', objectFit: 'cover' }} 
                                  />
                                ) : (
                                  <div className="bg-light rounded me-3 d-flex align-items-center justify-content-center" 
                                       style={{ width: '60px', height: '60px' }}>
                                    <span style={{ fontSize: '2rem' }}>👕</span>
                                  </div>
                                )}
                                <div className="flex-grow-1">
                                  <strong className="d-block">{item.camiseta.titulo}</strong>
                                  <small className="text-muted">
                                    {item.camiseta.equipo} • {item.camiseta.temporada} • Talle {item.camiseta.talle}
                                  </small>
                                  <div className="mt-1">
                                    <span className="badge bg-secondary me-2">
                                      Cantidad: {item.cantidad}
                                    </span>
                                    {/* ✅ MOSTRAR PRECIO CON DESCUENTO SI APLICA */}
                                    {huboDescuento ? (
                                      <span className="text-muted">
                                        <span className="text-decoration-line-through me-1">
                                          ${precioOriginal.toLocaleString()}
                                        </span>
                                        <span className="text-success fw-bold">
                                          ${precioComprado.toLocaleString()} c/u
                                        </span>
                                        <span className="badge bg-success ms-2 small">
                                          -{porcentajeDescuento}% OFF
                                        </span>
                                      </span>
                                    ) : (
                                      <span className="text-muted">
                                        ${item.precioUnitario.toLocaleString()} c/u
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="text-end">
                                  <strong className="text-success d-block">
                                    ${item.subtotal.toLocaleString()}
                                  </strong>
                                  {huboDescuento && (
                                    <small className="text-muted">
                                      Ahorraste ${((precioOriginal - precioComprado) * item.cantidad).toLocaleString()}
                                    </small>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </>
                      ) : (
                        <div className="alert alert-warning mb-0">
                          <small>
                            ℹ️ Esta compra no tiene productos asociados. 
                            Contacta con soporte si esto es un error.
                          </small>
                        </div>
                      )}
                    </div>

                    {/* Dirección de envío */}
                    {compra.direccionEnvio && (
                      <div className="mt-3 pt-3 border-top">
                        <small className="text-muted">
                          <strong>📍 Dirección de envío:</strong> {compra.direccionEnvio}
                        </small>
                      </div>
                    )}

                    {/* Notas */}
                    {compra.notas && (
                      <div className="mt-2">
                        <small className="text-muted">
                          <strong>📝 Notas:</strong> {compra.notas}
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default OrdersPage;