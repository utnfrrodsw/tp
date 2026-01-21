import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { categoriaService } from '../../services/api';
import type { Categoria } from '../../types';

export const CategoriesManagement: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  // Estados para el formulario
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ nombre: '', descripcion: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await categoriaService.getAll();
      setCategorias(response.data);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
      setError('No se pudieron cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      toast.error('El nombre es obligatorio');
      return;
    }

    if (formData.nombre.trim().length < 2) {
      toast.error('El nombre debe tener al menos 2 caracteres');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        // Editar
        await categoriaService.update(editingId, {
          nombre: formData.nombre.trim(),
          descripcion: formData.descripcion.trim() || undefined
        });
        toast.success('✅ Categoría actualizada correctamente');
      } else {
        // Crear
        await categoriaService.create({
          nombre: formData.nombre.trim(),
          descripcion: formData.descripcion.trim() || undefined
        });
        toast.success('✅ Categoría creada correctamente');
      }
      
      setShowForm(false);
      setEditingId(null);
      setFormData({ nombre: '', descripcion: '' });
      loadCategorias();
    } catch (err: unknown) {
      console.error('Error al guardar categoría:', err);
      let message = 'Error al guardar la categoría';
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: unknown }).response === 'object' &&
        (err as { response?: { data?: { message?: string } } }).response?.data?.message
      ) {
        message = (err as { response: { data: { message: string } } }).response.data.message;
      }
      toast.error(`❌ ${message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (categoria: Categoria) => {
    setEditingId(categoria.id);
    setFormData({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number, nombre: string) => {
    if (!window.confirm(`¿Confirma eliminar la categoría "${nombre}"?`)) {
      return;
    }

    try {
      await categoriaService.delete(id);
      toast.success('✅ Categoría eliminada correctamente');
      loadCategorias();
    } catch (err: unknown) {
      console.error('Error al eliminar categoría:', err);
      let message = 'Error al eliminar la categoría';
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: unknown }).response === 'object' &&
        (err as { response?: { data?: { message?: string } } }).response?.data?.message
      ) {
        message = (err as { response: { data: { message: string } } }).response.data.message;
      }
      toast.error(`❌ ${message}`);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ nombre: '', descripcion: '' });
  };

  const handleNew = () => {
    setEditingId(null);
    setFormData({ nombre: '', descripcion: '' });
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3">Cargando categorías...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>📂 Gestión de Categorías</h1>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-success" 
            onClick={handleNew}
            disabled={showForm}
          >
            ➕ Nueva Categoría
          </button>
          <a href="/admin/dashboard" className="btn btn-outline-secondary">
            ← Volver al Dashboard
          </a>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <div className="card mb-4 border-primary">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">{editingId ? '✏️ Editar Categoría' : '➕ Nueva Categoría'}</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                    minLength={2}
                    maxLength={100}
                    placeholder="Ej: Selecciones"
                  />
                  <small className="text-muted">Mínimo 2 caracteres</small>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Descripción</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    maxLength={255}
                    placeholder="Ej: Camisetas de selecciones nacionales"
                  />
                </div>
              </div>
              
              <div className="mt-3 d-flex gap-2">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Guardando...</>
                  ) : (
                    editingId ? '💾 Guardar Cambios' : '➕ Crear Categoría'
                  )}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={handleCancel}
                  disabled={submitting}
                >
                  ✖️ Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabla de categorías */}
      <div className="card">
        <div className="card-header bg-light">
          <h5 className="mb-0">📋 Listado de Categorías ({categorias.length})</h5>
        </div>
        <div className="card-body p-0">
          {categorias.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <p className="mb-0">No hay categorías registradas</p>
              <button className="btn btn-primary mt-3" onClick={handleNew}>
                ➕ Crear Primera Categoría
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '80px' }}>ID</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th style={{ width: '100px' }} className="text-center">Estado</th>
                    <th style={{ width: '180px' }} className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.map((categoria) => (
                    <tr key={categoria.id}>
                      <td className="text-muted">#{categoria.id}</td>
                      <td className="fw-bold">{categoria.nombre}</td>
                      <td className="text-muted">
                        {categoria.descripcion || <em>Sin descripción</em>}
                      </td>
                      <td className="text-center">
                        {categoria.activa ? (
                          <span className="badge bg-success">Activa</span>
                        ) : (
                          <span className="badge bg-secondary">Inactiva</span>
                        )}
                      </td>
                      <td className="text-center">
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(categoria)}
                            title="Editar"
                          >
                            ✏️
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(categoria.id, categoria.nombre)}
                            title="Eliminar"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesManagement;