import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { descuentoService, categoriaService, camisetaService } from '../../services/api';
import type { Descuento, Categoria, CamisetaSeleccion, TipoAplicacionDescuento as TipoAplicacionType } from '../../types';
import { TipoAplicacionDescuento } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export const DiscountsManagement: React.FC = () => {
  const { isLoading: authLoading } = useAuth();
  
  const [descuentos, setDescuentos] = useState<Descuento[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [camisetasDisponibles, setCamisetasDisponibles] = useState<CamisetaSeleccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<{
    codigo: string;
    descripcion: string;
    porcentaje: string;
    fechaInicio: string;
    fechaFin: string;
    activo: boolean;
    tipoAplicacion: TipoAplicacionType;
    categoriaId: number | undefined;
    camisetaIds: number[];
  }>({
    codigo: '',
    descripcion: '',
    porcentaje: '',
    fechaInicio: '',
    fechaFin: '',
    activo: true,
    tipoAplicacion: TipoAplicacionDescuento.TODAS,
    categoriaId: undefined,
    camisetaIds: []
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      loadData();
    }
  }, [authLoading]); 

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔄 Cargando datos de descuentos...');
      console.log('🔑 Token en localStorage:', localStorage.getItem('token')?.substring(0, 20) + '...');
      
      const [descuentosRes, categoriasRes, camisetasRes] = await Promise.all([
        descuentoService.getAll(),
        categoriaService.getAll(),
        camisetaService.getSeleccion()
      ]);
      
      console.log('✅ Descuentos cargados:', descuentosRes);
      console.log('✅ Categorías cargadas:', categoriasRes);
      console.log('✅ Camisetas cargadas:', camisetasRes);
      
      setDescuentos(descuentosRes.data);
      setCategorias(categoriasRes.data);
      setCamisetasDisponibles(camisetasRes.data);
      
      console.log('📊 Estado actualizado:', {
        descuentos: descuentosRes.data.length,
        categorias: categoriasRes.data.length,
        camisetas: camisetasRes.data.length
      });
    } catch (err) {
      console.error('❌ Error al cargar datos:', err);
      setError('No se pudieron cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.codigo.trim()) {
      toast.error('El código es obligatorio');
      return;
    }

    if (formData.codigo.trim().length < 3) {
      toast.error('El código debe tener al menos 3 caracteres');
      return;
    }

    if (!formData.descripcion.trim()) {
      toast.error('La descripción es obligatoria');
      return;
    }

    const porcentaje = parseFloat(formData.porcentaje);
    if (isNaN(porcentaje) || porcentaje <= 0 || porcentaje > 100) {
      toast.error('El porcentaje debe estar entre 1 y 100');
      return;
    }

    if (!formData.fechaInicio || !formData.fechaFin) {
      toast.error('Las fechas de inicio y fin son obligatorias');
      return;
    }

    const inicio = new Date(formData.fechaInicio);
    const fin = new Date(formData.fechaFin);

    if (fin <= inicio) {
      toast.error('La fecha de fin debe ser posterior a la fecha de inicio');
      return;
    }

    if (formData.tipoAplicacion === TipoAplicacionDescuento.CATEGORIA && !formData.categoriaId) {
      toast.error('Debe seleccionar una categoría');
      return;
    }

    if (formData.tipoAplicacion === TipoAplicacionDescuento.ESPECIFICAS && formData.camisetaIds.length === 0) {
      toast.error('Debe seleccionar al menos una camiseta');
      return;
    }

    setSubmitting(true);
    try {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataToSend: any = {
        codigo: formData.codigo.trim().toUpperCase(),
        descripcion: formData.descripcion.trim(),
        porcentaje: porcentaje,
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
        tipoAplicacion: formData.tipoAplicacion
      };

      if (formData.tipoAplicacion === TipoAplicacionDescuento.CATEGORIA) {
        dataToSend.categoriaId = formData.categoriaId;
      } else if (formData.tipoAplicacion === TipoAplicacionDescuento.ESPECIFICAS) {
        dataToSend.camisetaIds = formData.camisetaIds;
      }

      if (editingId) {
        // Editar
        dataToSend.activo = formData.activo;
        await descuentoService.update(editingId, dataToSend);
        toast.success('✅ Descuento actualizado correctamente');
      } else {
        // Crear
        await descuentoService.create(dataToSend);
        toast.success('✅ Descuento creado correctamente');
      }
      
      setShowForm(false);
      setEditingId(null);
      resetForm();
      loadData();
    } catch (err: unknown) {
      console.error('Error al guardar descuento:', err);
      let message = 'Error al guardar el descuento';
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

  const handleEdit = (descuento: Descuento) => {
    setEditingId(descuento.id);
    
    // Formatear fechas para input type="date"
    const fechaInicio = new Date(descuento.fechaInicio);
    const fechaFin = new Date(descuento.fechaFin);
    
    setFormData({
      codigo: descuento.codigo,
      descripcion: descuento.descripcion,
      porcentaje: descuento.porcentaje.toString(),
      fechaInicio: fechaInicio.toISOString().split('T')[0],
      fechaFin: fechaFin.toISOString().split('T')[0],
      activo: descuento.activo,
      tipoAplicacion: descuento.tipoAplicacion || TipoAplicacionDescuento.TODAS,
      categoriaId: descuento.categoriaId,
      camisetaIds: descuento.camisetasEspecificas?.map(c => c.id) || []
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number, codigo: string) => {
    if (!window.confirm(`¿Confirma desactivar el descuento "${codigo}"?`)) {
      return;
    }

    try {
      await descuentoService.delete(id);
      toast.success('✅ Descuento desactivado correctamente');
      loadData();
    } catch (err: unknown) {
      console.error('Error al desactivar descuento:', err);
      let message = 'Error al desactivar el descuento';
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

  const resetForm = () => {
    setFormData({
      codigo: '',
      descripcion: '',
      porcentaje: '',
      fechaInicio: '',
      fechaFin: '',
      activo: true,
      tipoAplicacion: TipoAplicacionDescuento.TODAS,
      categoriaId: undefined,
      camisetaIds: []
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    resetForm();
  };

  const handleNew = () => {
    setEditingId(null);
    resetForm();
    setShowForm(true);
  };

  const formatFecha = (fecha: Date | string): string => {
    const d = new Date(fecha);
    return d.toLocaleDateString('es-AR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const isVigente = (descuento: Descuento): boolean => {
    const ahora = new Date();
    const inicio = new Date(descuento.fechaInicio);
    const fin = new Date(descuento.fechaFin);
    return descuento.activo && inicio <= ahora && fin >= ahora;
  };

  // FILTRAR CAMISETAS POR CATEGORÍA
  const camisetasPorCategoria = formData.categoriaId
    ? camisetasDisponibles.filter(c => c.categoria?.id === formData.categoriaId)
    : [];

  const getTipoAplicacionText = (descuento: Descuento): string => {
    switch (descuento.tipoAplicacion) {
      case TipoAplicacionDescuento.TODAS:
        return '🌐 Todas las camisetas';
      case TipoAplicacionDescuento.CATEGORIA: {
        const cat = categorias.find(c => c.id === descuento.categoriaId);
        return `📁 Categoría: ${cat?.nombre || 'N/A'}`;
      }
      case TipoAplicacionDescuento.ESPECIFICAS:
        return `👕 ${descuento.camisetasEspecificas?.length || 0} camisetas específicas`;
      default:
        return 'N/A';
    }
  };

  if (authLoading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3">Verificando autenticación...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3">Cargando descuentos...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>💰 Gestión de Descuentos</h1>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-success" 
            onClick={handleNew}
            disabled={showForm}
          >
            ➕ Nuevo Descuento
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
        <div className="card mb-4 border-success">
          <div className="card-header bg-success text-white">
            <h5 className="mb-0">{editingId ? '✏️ Editar Descuento' : '➕ Nuevo Descuento'}</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Código *</label>
                  <input
                    type="text"
                    className="form-control text-uppercase"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                    required
                    minLength={3}
                    maxLength={20}
                    placeholder="Ej: VERANO25"
                    disabled={!!editingId}
                  />
                  <small className="text-muted">Mínimo 3 caracteres, máximo 20</small>
                </div>
                
                <div className="col-md-6">
                  <label className="form-label">Porcentaje (%) *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.porcentaje}
                    onChange={(e) => setFormData({ ...formData, porcentaje: e.target.value })}
                    required
                    min="1"
                    max="100"
                    step="0.01"
                    placeholder="Ej: 25"
                  />
                  <small className="text-muted">Entre 1% y 100%</small>
                </div>

                <div className="col-12">
                  <label className="form-label">Descripción *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    required
                    maxLength={255}
                    placeholder="Ej: Descuento de verano para camisetas retro"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Fecha Inicio *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.fechaInicio}
                    onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Fecha Fin *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.fechaFin}
                    onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12">
                  <hr />
                  <h6 className="mb-3">🎯 Aplicar descuento a:</h6>
                  
                  {/* Todas las camisetas */}
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="tipoAplicacion"
                      id="todasRadio"
                      checked={formData.tipoAplicacion === TipoAplicacionDescuento.TODAS}
                      onChange={() => setFormData({ 
                        ...formData, 
                        tipoAplicacion: TipoAplicacionDescuento.TODAS,
                        categoriaId: undefined,
                        camisetaIds: []
                      })}
                    />
                    <label className="form-check-label" htmlFor="todasRadio">
                      <strong>🌐 Todas las camisetas</strong>
                      <br />
                      <small className="text-muted">El descuento se aplicará a cualquier compra</small>
                    </label>
                  </div>

                  {/* Por categoría */}
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="tipoAplicacion"
                      id="categoriaRadio"
                      checked={formData.tipoAplicacion === TipoAplicacionDescuento.CATEGORIA}
                      onChange={() => setFormData({ 
                        ...formData, 
                        tipoAplicacion: TipoAplicacionDescuento.CATEGORIA,
                        camisetaIds: []
                      })}
                    />
                    <label className="form-check-label" htmlFor="categoriaRadio">
                      <strong>📁 Por categoría</strong>
                      <br />
                      <small className="text-muted">Solo a camisetas de una categoría específica</small>
                    </label>
                  </div>

                  {/* Selector de categoría */}
                  {formData.tipoAplicacion === TipoAplicacionDescuento.CATEGORIA && (
                    <div className="ms-4 mb-3">
                      <select
                        className="form-select"
                        value={formData.categoriaId || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          categoriaId: e.target.value ? parseInt(e.target.value) : undefined 
                        })}
                        required
                      >
                        <option value="">Seleccione una categoría</option>
                        {categorias.filter(c => c.activa).map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.nombre} ({camisetasDisponibles.filter(c => c.categoria?.id === cat.id).length} camisetas)
                          </option>
                        ))}
                      </select>
                      
                      {/* Preview de camisetas de la categoría */}
                      {formData.categoriaId && camisetasPorCategoria.length > 0 && (
                        <div className="mt-2 p-2 bg-light rounded">
                          <small className="text-muted">
                            <strong>Camisetas en esta categoría:</strong> {camisetasPorCategoria.length}
                          </small>
                          <div className="mt-2" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                            {camisetasPorCategoria.slice(0, 5).map(c => (
                              <div key={c.id} className="small">• {c.titulo} - {c.equipo}</div>
                            ))}
                            {camisetasPorCategoria.length > 5 && (
                              <div className="small text-muted">+ {camisetasPorCategoria.length - 5} más...</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Camisetas específicas */}
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="tipoAplicacion"
                      id="especificasRadio"
                      checked={formData.tipoAplicacion === TipoAplicacionDescuento.ESPECIFICAS}
                      onChange={() => setFormData({ 
                        ...formData, 
                        tipoAplicacion: TipoAplicacionDescuento.ESPECIFICAS,
                        categoriaId: undefined
                      })}
                    />
                    <label className="form-check-label" htmlFor="especificasRadio">
                      <strong>👕 Camisetas específicas</strong>
                      <br />
                      <small className="text-muted">Seleccione manualmente las camisetas donde aplicar el descuento</small>
                    </label>
                  </div>

                  {/* Selector múltiple de camisetas */}
                  {formData.tipoAplicacion === TipoAplicacionDescuento.ESPECIFICAS && (
                    <div className="ms-4 mb-3">
                      <select
                        className="form-select"
                        size={8}
                        multiple
                        value={formData.camisetaIds.map(String)}
                        onChange={(e) => {
                          const selectedOptions = Array.from(e.target.selectedOptions);
                          const selectedIds = selectedOptions.map(opt => parseInt(opt.value));
                          setFormData({ ...formData, camisetaIds: selectedIds });
                        }}
                        required
                      >
                        {camisetasDisponibles.map(cam => (
                          <option key={cam.id} value={cam.id}>
                            {cam.titulo} - {cam.equipo} ({cam.temporada}) - ${cam.precio}
                          </option>
                        ))}
                      </select>
                      <small className="text-muted d-block mt-1">
                        Mantén presionado Ctrl (Windows) o Cmd (Mac) para seleccionar múltiples camisetas
                      </small>
                      
                      {/* Preview de seleccionadas */}
                      {formData.camisetaIds.length > 0 && (
                        <div className="mt-2 p-2 bg-light rounded">
                          <small className="text-muted">
                            <strong>Seleccionadas:</strong> {formData.camisetaIds.length} camisetas
                          </small>
                          <div className="mt-1">
                            {formData.camisetaIds.slice(0, 3).map(id => {
                              const cam = camisetasDisponibles.find(c => c.id === id);
                              return cam ? (
                                <div key={id} className="small">• {cam.titulo}</div>
                              ) : null;
                            })}
                            {formData.camisetaIds.length > 3 && (
                              <div className="small text-muted">+ {formData.camisetaIds.length - 3} más...</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {editingId && (
                  <div className="col-12">
                    <hr />
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="activoCheck"
                        checked={formData.activo}
                        onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="activoCheck">
                        Descuento activo
                      </label>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-3 d-flex gap-2">
                <button 
                  type="submit" 
                  className="btn btn-success"
                  disabled={submitting}
                >
                  {submitting ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Guardando...</>
                  ) : (
                    editingId ? '💾 Guardar Cambios' : '➕ Crear Descuento'
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

      {/* Tabla de descuentos */}
      <div className="card">
        <div className="card-header bg-light">
          <h5 className="mb-0">📋 Listado de Descuentos ({descuentos.length})</h5>
        </div>
        <div className="card-body p-0">
          {descuentos.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <p className="mb-0">No hay descuentos registrados</p>
              <button className="btn btn-success mt-3" onClick={handleNew}>
                ➕ Crear Primer Descuento
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '60px' }}>ID</th>
                    <th style={{ width: '120px' }}>Código</th>
                    <th>Descripción</th>
                    <th style={{ width: '60px' }} className="text-center">%</th>
                    <th style={{ width: '200px' }}>Aplicación</th>
                    <th style={{ width: '100px' }}>Inicio</th>
                    <th style={{ width: '100px' }}>Fin</th>
                    <th style={{ width: '90px' }} className="text-center">Estado</th>
                    <th style={{ width: '140px' }} className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {descuentos.map((descuento) => (
                    <tr key={descuento.id}>
                      <td className="text-muted">#{descuento.id}</td>
                      <td className="fw-bold font-monospace">{descuento.codigo}</td>
                      <td className="text-muted">{descuento.descripcion}</td>
                      <td className="text-center fw-bold text-success">{descuento.porcentaje}%</td>
                      <td>
                        <small>{getTipoAplicacionText(descuento)}</small>
                      </td>
                      <td><small>{formatFecha(descuento.fechaInicio)}</small></td>
                      <td><small>{formatFecha(descuento.fechaFin)}</small></td>
                      <td className="text-center">
                        {isVigente(descuento) ? (
                          <span className="badge bg-success">Vigente</span>
                        ) : descuento.activo ? (
                          <span className="badge bg-warning">Programado</span>
                        ) : (
                          <span className="badge bg-secondary">Inactivo</span>
                        )}
                      </td>
                      <td className="text-center">
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(descuento)}
                            title="Editar"
                          >
                            ✏️
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(descuento.id, descuento.codigo)}
                            title="Desactivar"
                            disabled={!descuento.activo}
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

export default DiscountsManagement;