import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { camisetaService } from '../../services/api';
import type { Camiseta, Talle, CondicionCamiseta } from '../../types';
import { getImageUrl } from '../../utils/api-config';
export const MyProductsPage: React.FC = () => {
    // Estado para categorías
    const [categorias, setCategorias] = useState<{ id: number; nombre: string }[]>([]);

    useEffect(() => {
      (async () => {
        try {
          const { categoriaService } = await import('../../services/api');
          const resp = await categoriaService.getAll();
          setCategorias(resp.data);
        } catch (err) {
          console.error('Error cargando categorías', err);
        }
      })();
    }, []);
  const { usuario, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [formSuccess, setFormSuccess] = useState<string>('');
  const [editError, setEditError] = useState<string>('');
  const [editSuccess, setEditSuccess] = useState<string>('');
  const [camisetas, setCamisetas] = useState<Camiseta[]>([]);
  const [todasLasCamisetas, setTodasLasCamisetas] = useState<Camiseta[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{ titulo: string; precioInicial: number; stock: number }>({ titulo: '', precioInicial: 0, stock: 1 });

  const isAdmin = useMemo(() => {
    const result = usuario?.rol === 'administrador';
    console.log('🔍 isAdmin calculado:', result, '| Usuario:', usuario?.email, '| Rol:', usuario?.rol);
    return result;
  }, [usuario]);


  const [imagenArchivo, setImagenArchivo] = useState<File | null>(null);
  const [imagenPreview, setImagenPreview] = useState<string>('');

  const [form, setForm] = useState<{
    titulo: string;
    equipo: string;
    temporada: string;
    talle: Talle;
    condicion: CondicionCamiseta;
    imagen: string;
    precioInicial: number;
    stock: number;
    esSubasta: boolean;
    fechaFinSubasta?: string;
    categoriaId?: number;
  }>({
    titulo: '',
    equipo: '',
    temporada: '',
    talle: 'M' as Talle,
    condicion: 'Nueva' as CondicionCamiseta,
    imagen: '',
    precioInicial: 0,
    stock: 1,
    esSubasta: false,
    fechaFinSubasta: undefined,
    categoriaId: undefined,
  });

  const canCreate = useMemo(() => {
    const basicValidation = 
      form.titulo.trim().length >= 2 &&
      form.equipo.trim().length >= 2 &&
      form.temporada.trim().length >= 2 &&
      Number(form.precioInicial) > 0 &&
      form.stock > 0 &&
      (imagenArchivo !== null || form.imagen.trim().length > 5);
    
    if (form.esSubasta) {
      return basicValidation && !!form.fechaFinSubasta;
    }
    
    return basicValidation;
  }, [form, imagenArchivo]); 

  const fetchMine = useCallback(async () => {
    if (!usuario) return;
    try {
      setLoading(true);
      setError('');
      
      console.log('📊 fetchMine - isAdmin:', isAdmin, '| Usuario:', usuario.email);
      
      if (isAdmin) {
        console.log('👑 Cargando TODAS las camisetas (admin)...');
        const { data: todas } = await camisetaService.getAll({ limit: 1000 });
        console.log('✅ Camisetas totales cargadas:', todas.length);
        setTodasLasCamisetas(todas);
      } else {
        console.log('👤 Usuario normal, NO cargando todas las camisetas');
        setTodasLasCamisetas([]);
      }
      
      console.log('📦 Cargando mis publicaciones para usuario:', usuario.id);
      const { data } = await camisetaService.getAll({ usuarioId: usuario.id, limit: 100 });
      console.log('✅ Mis publicaciones cargadas:', data.length);
      setCamisetas(data);
    } catch (e) {
      console.error('❌ Error cargando mis camisetas', e);
      setError('No se pudo cargar tus publicaciones');
    } finally {
      setLoading(false);
    }
  }, [usuario, isAdmin]);

  useEffect(() => {
    if (!isAuthenticated || !usuario) {
      navigate('/login');
      return;
    }
    fetchMine();
  }, [isAuthenticated, usuario, fetchMine, navigate]);

  const crearPublicacion = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!canCreate) {
      setFormError('Completa todos los campos obligatorios correctamente.');
      return;
    }

    if (form.esSubasta && !form.fechaFinSubasta) {
      setFormError('Debes seleccionar una fecha de fin para la subasta.');
      return;
    }

    try {
      let imagenFinal = form.imagen;

      if (imagenArchivo) {
        console.log('📤 Subiendo imagen desde archivo...');
        const { imagenService } = await import('../../services/api');
        imagenFinal = await imagenService.upload(imagenArchivo);
        console.log('✅ Imagen subida:', imagenFinal);
      }
      else if (/^https?:\/\//i.test(form.imagen)) {
        try {
          const { imagenService } = await import('../../services/api');
          const nombre = `${form.equipo}_${form.temporada}`.replace(/\s+/g, '_').toLowerCase();
          imagenFinal = await imagenService.descargar(form.imagen, nombre);
        } catch (err) {
          console.error('Error descargando imagen, se usará la URL original', err);
        }
      }

      const payload = {
        titulo: form.titulo.trim(),
        descripcion: `${form.equipo} ${form.temporada}`,
        equipo: form.equipo.trim(),
        temporada: form.temporada.trim(),
        talle: form.talle,
        condicion: form.condicion,
        imagen: imagenFinal || undefined,
        precioInicial: Number(form.precioInicial),
        esSubasta: form.esSubasta,
        stock: form.stock,
        categoriaId: form.categoriaId,
        ...(form.esSubasta && form.fechaFinSubasta ? { fechaFinSubasta: form.fechaFinSubasta } : {})
      };
      
      console.log('📤 Enviando payload:', payload);
      await camisetaService.publicar(payload);
      
      setFormSuccess('✅ Publicación creada con éxito');
      setTimeout(() => setFormSuccess(''), 3000);
      
      // Limpiar formulario
      setForm({
        titulo: '',
        equipo: '',
        temporada: '',
        talle: 'M' as Talle,
        condicion: 'Nueva' as CondicionCamiseta,
        imagen: '',
        precioInicial: 0,
        stock: 1,
        esSubasta: false,
        fechaFinSubasta: undefined
      });
      setImagenArchivo(null);
      setImagenPreview('');
      
      await fetchMine();
    } catch (e: unknown) {
      console.error('Error creando publicación', e);
      let msg = 'No se pudo crear la publicación';
      if (
        typeof e === 'object' &&
        e !== null &&
        'response' in e &&
        typeof (e as { response?: unknown }).response === 'object' &&
        (e as { response?: { data?: { message?: string } } }).response?.data?.message
      ) {
        msg = (e as { response: { data: { message: string } } }).response.data.message;
      }
      setFormError(msg);
    }
  };

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      setImagenArchivo(null);
      setImagenPreview('');
      return;
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      setFormError('Solo se permiten archivos de imagen');
      e.target.value = ''; 
      return;
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFormError('La imagen no debe superar los 5MB');
      e.target.value = ''; 
      return;
    }


    setFormError('');

    setImagenArchivo(file);
    
    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagenPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setForm(f => ({ ...f, imagen: '' }));
  };

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
      await fetchMine();
    } catch (e) {
      console.error('Error guardando cambios', e);
      setEditError('No se pudo guardar la edición');
    }
  };

  const deleteItem = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Eliminar publicación?',
      text: 'Esta acción no se puede deshacer. ¿Seguro que deseas eliminar esta publicación?',
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
      setCamisetas(prev => prev.filter(c => c.id !== id));
      if (isAdmin) {
        setTodasLasCamisetas(prev => prev.filter(c => c.id !== id));
      }
      Swal.fire({
        title: 'Eliminado',
        text: 'La publicación ha sido eliminada correctamente.',
        icon: 'success',
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (e) {
      console.error('Error eliminando publicación', e);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo eliminar la publicación',
        icon: 'error',
      });
    }
  };

  // ESTADÍSTICAS GLOBALES DEL SISTEMA (solo para admin)
  const estadisticasGlobales = useMemo(() => {
    console.log('📊 Calculando estadísticas globales - isAdmin:', isAdmin, '| Total camisetas:', todasLasCamisetas.length);
    
    if (!isAdmin) {
      console.log('❌ NO es admin, retornando null');
      return null;
    }
    
    const total = todasLasCamisetas.length;
    const disponibles = todasLasCamisetas.filter(c => c.estado === 'disponible').length;
    const enSubasta = todasLasCamisetas.filter(c => c.esSubasta).length;
    const vendidas = todasLasCamisetas.filter(c => c.estado === 'vendida').length;
    const stockTotal = todasLasCamisetas.reduce((sum, c) => sum + c.stock, 0);
    
    // camisetas publicadas por usuarios vs admin
    const publicadasPorUsuarios = todasLasCamisetas.filter(c => c.vendedor?.rol === 'usuario').length;
    const publicadasPorAdmin = todasLasCamisetas.filter(c => c.vendedor?.rol === 'administrador').length;
    
    const stats = { 
      total, 
      disponibles, 
      enSubasta, 
      vendidas, 
      stockTotal,
      publicadasPorUsuarios,
      publicadasPorAdmin
    };
    console.log('✅ Estadísticas globales calculadas:', stats);
    return stats;
  }, [isAdmin, todasLasCamisetas]);

  // ESTADÍSTICAS PERSONALES (mis publicaciones)
  const estadisticasPersonales = useMemo(() => {
    console.log('📊 Calculando estadísticas personales - Mis publicaciones:', camisetas.length);
    
    const misPublicaciones = camisetas.length;
    const misSubastas = camisetas.filter(c => c.esSubasta).length;
    const misVendidas = camisetas.filter(c => c.estado === 'vendida').length;
    const misDisponibles = camisetas.filter(c => c.estado === 'disponible').length;
    
    const stats = { misPublicaciones, misSubastas, misVendidas, misDisponibles };
    console.log('✅ Estadísticas personales calculadas:', stats);
    return stats;
  }, [camisetas]);

  console.log('🎨 RENDER - isAdmin:', isAdmin, '| estadisticasGlobales:', estadisticasGlobales ? 'SI' : 'NO');

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">
          {isAdmin ? '👑 Gestión de Camisetas (Admin)' : '👕 Mis Publicaciones'}
        </h1>
        <button className="btn btn-outline-secondary" onClick={fetchMine} type="button">🔄 Actualizar</button>
      </div>

      {/* ESTADÍSTICAS GLOBALES DEL SISTEMA (solo admin) */}
      {isAdmin && estadisticasGlobales && (
        <>
          <div className="alert alert-info mb-3">
            <strong>📊 Estadísticas Globales del Sistema</strong>
          </div>
          <div className="row g-3 mb-4">
            <div className="col-md-2">
              <div className="card text-white bg-primary">
                <div className="card-body text-center p-3">
                  <h6 className="card-title mb-1 small">Total Sistema</h6>
                  <p className="card-text fs-4 fw-bold mb-0">{estadisticasGlobales.total}</p>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card text-white bg-success">
                <div className="card-body text-center p-3">
                  <h6 className="card-title mb-1 small">Disponibles</h6>
                  <p className="card-text fs-4 fw-bold mb-0">{estadisticasGlobales.disponibles}</p>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card text-white bg-warning">
                <div className="card-body text-center p-3">
                  <h6 className="card-title mb-1 small">En Subasta</h6>
                  <p className="card-text fs-4 fw-bold mb-0">{estadisticasGlobales.enSubasta}</p>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card text-white bg-danger">
                <div className="card-body text-center p-3">
                  <h6 className="card-title mb-1 small">Vendidas</h6>
                  <p className="card-text fs-4 fw-bold mb-0">{estadisticasGlobales.vendidas}</p>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card text-white bg-info">
                <div className="card-body text-center p-3">
                  <h6 className="card-title mb-1 small">Stock Total</h6>
                  <p className="card-text fs-4 fw-bold mb-0">{estadisticasGlobales.stockTotal}</p>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card border-dark">
                <div className="card-body text-center p-3">
                  <h6 className="card-title mb-1 small text-muted">Por Usuarios</h6>
                  <p className="card-text fs-4 fw-bold mb-0 text-primary">{estadisticasGlobales.publicadasPorUsuarios}</p>
                  <hr className="my-1" />
                  <h6 className="card-title mb-1 small text-muted">Por Admin</h6>
                  <p className="card-text fs-5 fw-bold mb-0 text-secondary">{estadisticasGlobales.publicadasPorAdmin}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ESTADÍSTICAS PERSONALES (para todos) */}
      <div className="alert alert-secondary mb-3">
        <strong>{isAdmin ? '📝 Mis Publicaciones como Admin' : '📝 Mis Publicaciones'}</strong>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-primary">
            <div className="card-body text-center">
              <h6 className="text-muted">Publicadas</h6>
              <p className="fs-3 fw-bold text-primary">{estadisticasPersonales.misPublicaciones}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-success">
            <div className="card-body text-center">
              <h6 className="text-muted">Disponibles</h6>
              <p className="fs-3 fw-bold text-success">{estadisticasPersonales.misDisponibles}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-warning">
            <div className="card-body text-center">
              <h6 className="text-muted">En Subasta</h6>
              <p className="fs-3 fw-bold text-warning">{estadisticasPersonales.misSubastas}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-danger">
            <div className="card-body text-center">
              <h6 className="text-muted">Vendidas</h6>
              <p className="fs-3 fw-bold text-danger">{estadisticasPersonales.misVendidas}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form publicación rápida */}
      <div className="card mb-4">
        <div className="card-header bg-light"><h5 className="mb-0">➕ Crear nueva publicación</h5></div>
        <div className="card-body">
          {formError && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {formError}
              <button type="button" className="btn-close" onClick={() => setFormError('')} aria-label="Close"></button>
            </div>
          )}
          {formSuccess && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {formSuccess}
              <button type="button" className="btn-close" onClick={() => setFormSuccess('')} aria-label="Close"></button>
            </div>
          )}
          <form onSubmit={crearPublicacion}>
            <div className="row g-3">
              {/* Categoría y Título */}
              <div className="col-12 col-md-6">
                <label className="form-label">Categoría (opcional)</label>
                <select
                  className="form-select"
                  value={form.categoriaId ?? ''}
                  onChange={e => setForm(f => ({ ...f, categoriaId: e.target.value === '' ? undefined : Number(e.target.value) }))}
                >
                  <option value="">Sin categoría</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Título *</label>
                <input className="form-control" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} required />
                </div>
                {/* Equipo, Temporada, Talle, Condición */}
                <div className="col-6 col-md-3">
                  <label className="form-label">Equipo *</label>
                  <input className="form-control" value={form.equipo} onChange={e => setForm(f => ({ ...f, equipo: e.target.value }))} required />
                </div>
                <div className="col-6 col-md-3">
                  <label className="form-label">Temporada *</label>
                  <input className="form-control" value={form.temporada} onChange={e => setForm(f => ({ ...f, temporada: e.target.value }))} required />
                </div>
                <div className="col-6 col-md-3">
                  <label className="form-label">Talle *</label>
                  <select className="form-select" value={form.talle} onChange={e => setForm(f => ({ ...f, talle: e.target.value as typeof form.talle }))}>
                    {['XS','S','M','L','XL','XXL'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="col-6 col-md-3">
                  <label className="form-label">Condición *</label>
                  <select className="form-select" value={form.condicion} onChange={e => setForm(f => ({ ...f, condicion: e.target.value as typeof form.condicion }))}>
                    {['Nueva','Usada','Vintage'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                {/* Precio, Stock, Imagen */}
                <div className="col-12 col-md-6 order-md-1">
                  <label className="form-label">Imagen de la camiseta *</label>
                  <input 
                    type="file" 
                    className="form-control mb-2" 
                    accept="image/*"
                    onChange={handleImagenChange}
                  />
                  <small className="text-muted d-block">
                    Formatos: JPG, PNG, GIF, WEBP • Máx 5MB
                  </small>
                  {/* Preview de la imagen */}
                  {imagenPreview && (
                    <div className="mt-2">
                      <img 
                        src={imagenPreview} 
                        alt="Preview" 
                        style={{ 
                          maxWidth: '200px', 
                          maxHeight: '200px', 
                          objectFit: 'contain',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          padding: '8px'
                        }} 
                      />
                    </div>
                  )}
                </div>
                <div className="col-6 col-md-3 order-md-2">
                  <label className="form-label">Precio Inicial ($) *</label>
                  <input type="number" min={1} step="any" className="form-control" value={form.precioInicial === 0 ? '' : form.precioInicial} onChange={e => {
                    const val = e.target.value;
                    setForm(f => ({ ...f, precioInicial: val === '' ? 0 : Number(val) }));
                  }} required />
                </div>
                <div className="col-6 col-md-3 order-md-3">
                  <label className="form-label">Stock *</label>
                  <input type="number" min={1} step="any" className="form-control" value={form.stock === 0 ? '' : form.stock} onChange={e => {
                    const val = e.target.value;
                    setForm(f => ({ ...f, stock: val === '' ? 0 : Number(val) }));
                  }} required />
                </div>
                {/* Subasta y fecha */}
            </div>
            {/* Subasta */}
            <div className="row mt-3">
              <div className="col-12">
                <div className="form-check">
                  <input 
                    id="esSub" 
                    className="form-check-input" 
                    type="checkbox" 
                    checked={form.esSubasta} 
                    onChange={e => setForm(f => ({ 
                      ...f, 
                      esSubasta: e.target.checked,
                      fechaFinSubasta: undefined
                    }))} 
                  />
                  <label htmlFor="esSub" className="form-check-label">Publicar como subasta</label>
                </div>
              </div>
              {form.esSubasta && (
                <div className="col-12 mt-2">
                  <label className="form-label">Fecha de fin de subasta *</label>
                  <DatePicker
                    selected={form.fechaFinSubasta ? new Date(form.fechaFinSubasta) : null}
                    onChange={date => {
                      if (!date || date <= new Date()) {
                        setFormError('La fecha de fin debe ser posterior a la actual.');
                        setForm(f => ({ ...f, fechaFinSubasta: '' }));
                        return;
                      }
                      setFormError('');
                      setForm(f => ({ ...f, fechaFinSubasta: date.toISOString() }));
                    }}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="yyyy-MM-dd HH:mm"
                    minDate={new Date()}
                    className="form-control"
                    required
                  />
                  <small className="text-muted">
                    La subasta finalizará automáticamente en esta fecha
                  </small>
                </div>
              )}
            </div>
            <div className="d-flex justify-content-end mt-3">
              <button
                type="button"
                className="btn btn-outline-secondary me-2"
                onClick={() => {
                  setForm({
                    titulo: '',
                    equipo: '',
                    temporada: '',
                    talle: 'M' as Talle,
                    condicion: 'Nueva' as CondicionCamiseta,
                    imagen: '',
                    precioInicial: 0,
                    stock: 1,
                    esSubasta: false,
                    fechaFinSubasta: undefined,
                    categoriaId: undefined
                  });
                  setImagenArchivo(null);
                  setImagenPreview('');
                }}
              >
                Limpiar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!canCreate}
              >
                {form.esSubasta ? '🔨 Publicar Subasta' :  'Publicar'}
              </button>
            </div>
          </form>
          </div>
        </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
          <p className="mt-2">Cargando publicaciones...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : camisetas.length === 0 ? (
        <div className="alert alert-info">
          {isAdmin ? 'No has publicado ninguna camiseta como admin' : 'Aún no tienes publicaciones'}
        </div>
      ) : (
        <div className="row">
          {camisetas.map((c) => (
            <div key={c.id} className="col-12 col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="position-relative">
                  {c.imagen ? (
                    <img 
                      src={getImageUrl(c.imagen)} 
                      alt={c.titulo} 
                      className="card-img-top" 
                      style={{ height: 200, objectFit: 'cover' }} 
                    />
                  ) : (
                    <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: 200 }}>
                      <span style={{ fontSize: '3rem' }}>👕</span>
                    </div>
                  )}
                  <span className={`position-absolute top-0 end-0 m-2 badge ${c.esSubasta ? 'bg-danger' : 'bg-success'}`}>
                    {c.esSubasta ? '🔨 Subasta' : '💰 Venta'}
                  </span>
                </div>
                <div className="card-body d-flex flex-column">
                  {editingId === c.id ? (
                    <>
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
                    </>
                  ) : (
                    <>
                      <h5 className="card-title">{c.titulo}</h5>
                      {/* Mostrar categoría si existe */}
                      {c.categoria && (
                        <div className="mb-1">
                          <span className="badge bg-secondary">{c.categoria.nombre}</span>
                        </div>
                      )}
                    </>
                  )}
                  <div className="text-muted mb-2"><small>{c.equipo} • {c.temporada}</small></div>
                  <div className="mb-2"><span className="badge bg-info">{c.condicion}</span></div>
                  <div className="mb-3 d-flex justify-content-between align-items-center">
                    {/* MOSTRAR DESCUENTO */}
                    <div className="mb-3">
                      {c.tieneDescuento && c.precioConDescuento ? (
                        <div>
                          <div className="d-flex align-items-baseline gap-2">
                            <span className="text-decoration-line-through text-muted small">
                              ${c.precioInicial.toLocaleString()}
                            </span>
                            <span className="fw-bold text-success">
                              ${c.precioConDescuento.toLocaleString()}
                            </span>
                          </div>
                          <span className="badge bg-success small">
                            -{c.porcentajeTotal?.toFixed(0)}% OFF
                          </span>
                        </div>
                      ) : (
                        <span className="fw-bold text-success">
                          ${(editingId === c.id ? editForm.precioInicial : c.precioInicial).toLocaleString()}
                        </span>
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
                      <>
                        <button className="btn btn-outline-primary" onClick={() => navigate(`/product/${c.id}`)} type="button">Ver Detalle</button>
                        <div className="d-flex gap-2">
                          <button className="btn btn-outline-warning w-50" type="button" onClick={() => startEdit(c)}>Editar</button>
                          <button className="btn btn-outline-danger w-50" type="button" onClick={() => deleteItem(c.id)}>Eliminar</button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProductsPage;
