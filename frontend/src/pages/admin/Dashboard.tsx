// src/pages/admin/Dashboard.tsx

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { camisetaService } from '../../services/api';
import type { Camiseta } from '../../types';
import { getImageUrl } from '../../utils/api-config';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [camisetas, setCamisetas] = useState<Camiseta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const camisetasResponse = await camisetaService.getAll();
      setCamisetas(camisetasResponse.data || []);
      
    } catch (err: unknown) {
      console.error('Error loading admin data:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Eliminar camiseta?',
      text: 'Esta acción no se puede deshacer. ¿Seguro que deseas eliminar esta camiseta?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;
    try {
      await camisetaService.delete(id);
      setCamisetas(camisetas.filter(c => c.id !== id));
      Swal.fire({
        title: 'Eliminado',
        text: 'La camiseta ha sido eliminada correctamente.',
        icon: 'success',
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar';
      Swal.fire({
        title: 'Error',
        text: `No se pudo eliminar la camiseta: ${msg}`,
        icon: 'error',
      });
    }
  };

  // Edición en línea
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{ titulo: string; precioInicial: number; stock: number }>({ titulo: '', precioInicial: 0, stock: 1 });
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  const startEdit = (c: Camiseta) => {
    setEditingId(c.id);
    setEditForm({ titulo: c.titulo, precioInicial: c.precioInicial, stock: c.stock });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id: number) => {
    setEditError('');
    setEditSuccess('');
    if (!editForm.titulo.trim() || Number(editForm.precioInicial) <= 0 || Number(editForm.stock) < 0) {
      setEditError('Completa los campos correctamente.');
      return;
    }
    try {
      await camisetaService.update(id, {
        titulo: editForm.titulo.trim(),
        precioInicial: Number(editForm.precioInicial),
        stock: Number(editForm.stock),
      });
      setEditSuccess('✅ Cambios guardados con éxito');
      setTimeout(() => setEditSuccess(''), 2000);
      setEditingId(null);
      await loadData();
    } catch (e) {
      console.error('Error guardando cambios', e);
      setEditError('No se pudo guardar la edición');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Cargando dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-2 pb-4">
      <h1 className="text-3xl font-bold mb-0">Dashboard Administrativo</h1>
      {/* Gestión de Camisetas */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Gestión de Camisetas</h2>
          <div className="d-flex gap-2">
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded" onClick={() => navigate('/my-products')} type="button">+ Nueva Camiseta</button>
            <button className="btn btn-outline-primary" onClick={() => navigate('/admin/users')} type="button">👥 Usuarios</button>
            <button className="btn btn-outline-success" onClick={() => navigate('/admin/categories')} type="button">📂 Categorías</button>
            <button className="btn btn-outline-warning" onClick={() => navigate('/admin/discounts')} type="button">💰 Descuentos</button>
          </div>
        </div>
        {camisetas.length > 0 ? (
          <div className="row">
            {camisetas.map(c => (
              <div key={c.id} className="col-12 col-md-6 mb-4">
                <div className="card h-100">
                  <div className="position-relative">
                    {c.imagen ? (
                      <img src={getImageUrl(c.imagen)} alt={c.titulo} className="card-img-top img-fluid" style={{ width: '100%', height: '200px', objectFit: 'contain', background: '#fff', borderRadius: '8px' }} />
                    ) : (
                      <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: 200 }}>
                        <span style={{ fontSize: '3rem' }}>👕</span>
                      </div>
                    )}
                    <span className={`position-absolute top-0 end-0 m-2 badge ${c.esSubasta ? 'bg-danger' : 'bg-success'}`}>{c.esSubasta ? '🔨 Subasta' : '💰 Venta'}</span>
                  </div>
                  <div className="card-body d-flex flex-column">
                    {editingId === c.id ? (
                      <React.Fragment>
                        {editError && (
                          <div className="alert alert-danger alert-dismissible fade show" role="alert">
                            {editError}
                            <button type="button" className="btn-close" onClick={() => setEditError('')} aria-label="Close"></button>
                          </div>
                        )}
                        {editSuccess && (
                          <div className="alert alert-success alert-dismissible fade show" role="alert">
                            {editSuccess}
                            <button type="button" className="btn-close" onClick={() => setEditSuccess('')} aria-label="Close"></button>
                          </div>
                        )}
                        <input className="form-control mb-2" value={editForm.titulo} onChange={e => setEditForm(f => ({ ...f, titulo: e.target.value }))} />
                        <div className="row g-2">
                          <div className="col-6">
                            <label className="form-label small">Precio ($)</label>
                            <input type="number" step="any" className="form-control" value={editForm.precioInicial === 0 ? '' : editForm.precioInicial} onChange={e => {
                              const val = e.target.value;
                              setEditForm(f => ({ ...f, precioInicial: val === '' ? 0 : Number(val) }));
                            }} />
                          </div>
                          <div className="col-6">
                            <label className="form-label small">Stock</label>
                            <input type="number" step="any" className="form-control" value={editForm.stock === 0 ? '' : editForm.stock} onChange={e => {
                              const val = e.target.value;
                              setEditForm(f => ({ ...f, stock: val === '' ? 0 : Number(val) }));
                            }} />
                          </div>
                        </div>
                      </React.Fragment>
                    ) : (
                      <h5 className="card-title">{c.titulo}</h5>
                    )}
                    <div className="text-muted mb-2"><small>{c.equipo} • {c.temporada}</small></div>
                    <div className="mb-2"><span className="badge bg-info">{c.condicion}</span></div>
                    <div className="mb-3 d-flex justify-content-between align-items-center">
                      <div className="mb-3">
                        {c.tieneDescuento && c.precioConDescuento ? (
                          <div>
                            <div className="d-flex align-items-baseline gap-2">
                              <span className="text-decoration-line-through text-muted small">${c.precioInicial.toLocaleString()}</span>
                              <span className="fw-bold text-success">${c.precioConDescuento.toLocaleString()}</span>
                            </div>
                            <span className="badge bg-success small">-{c.porcentajeTotal?.toFixed(0)}% OFF</span>
                          </div>
                        ) : (
                          <span className="fw-bold text-success">{(editingId === c.id ? editForm.precioInicial : c.precioInicial).toLocaleString()}</span>
                        )}
                        <small className="text-muted ms-2">Stock: {editingId === c.id ? editForm.stock : c.stock}</small>
                      </div>
                    </div>
                    <div className="mt-auto d-grid gap-2">
                      {editingId === c.id ? (
                        <div className="d-flex gap-2">
                          <button className="btn btn-success w-50" type="button" onClick={() => saveEdit(c.id)}>Guardar</button>
                          <button className="btn btn-outline-secondary w-50" type="button" onClick={cancelEdit}>Cancelar</button>
                        </div>
                      ) : (
                        <React.Fragment>
                          <button className="btn btn-outline-primary" onClick={() => navigate(`/product/${c.id}`)} type="button">Ver Detalle</button>
                          <div className="d-flex gap-2">
                            <button className="btn btn-outline-warning w-50" type="button" onClick={() => startEdit(c)}>Editar</button>
                            <button className="btn btn-outline-danger w-50" type="button" onClick={() => handleDelete(c.id)}>Eliminar</button>
                          </div>
                        </React.Fragment>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No hay camisetas para mostrar</p>
          </div>
        )}
      </div>
    </div>
  );
};