import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/api';
import type { Usuario } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const UsersManagement: React.FC = () => {
  const { isAuthenticated, usuario, isLoading: authLoading } = useAuth(); // ✅ AGREGAR isLoading
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [users, setUsers] = useState<Usuario[]>([]);
  const [selected, setSelected] = useState<Usuario | null>(null);
  const [filtroRol, setFiltroRol] = useState<'todos' | 'usuario' | 'administrador'>('todos');
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'activos' | 'inactivos'>('todos');

  useEffect(() => {
    if (authLoading) {
      console.log('⏳ Esperando a que termine de cargar auth...');
      return;
    }

    console.log('🔍 UsersManagement - Estado:', { isAuthenticated, usuario: usuario?.rol });

    if (!isAuthenticated) {
      console.log('❌ No autenticado, redirigiendo a login');
      navigate('/login');
      return;
    }
    
    if (usuario?.rol !== 'administrador') {
      console.log('❌ No es administrador, redirigiendo a home');
      navigate('/');
      return;
    }

    console.log('✅ Cargando usuarios...');
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, usuario, authLoading]); // ✅ AGREGAR authLoading como dependencia

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('📡 Llamando a adminService.getUsuarios()...');
      const data = await adminService.getUsuarios();
      console.log('✅ Usuarios cargados:', data.length);
      setUsers(data);
    } catch (e) {
      console.error('❌ Error cargando usuarios', e);
      setError('No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const toggleEstado = async (id: number) => {
    try {
      const usuarioActualizado = await adminService.toggleEstadoUsuario(id);
      setUsers(prev => prev.map(u => u.id === id ? usuarioActualizado : u));
      
      // Actualizar el seleccionado si es el mismo
      if (selected && selected.id === id) {
        setSelected(usuarioActualizado);
      }
      
      setSuccess(`Usuario ${usuarioActualizado.activo ? 'activado' : 'desactivado'} correctamente`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      console.error('Error al cambiar estado', e);
      setError('No se pudo cambiar el estado del usuario');
      setTimeout(() => setError(''), 3000);
    }
  };

  // ✅ MOSTRAR LOADING MIENTRAS CARGA AUTH
  if (authLoading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3">Verificando autenticación...</p>
      </div>
    );
  }

  // Filtrar usuarios
  const usuariosFiltrados = users.filter(u => {
    if (filtroRol !== 'todos' && u.rol !== filtroRol) return false;
    if (filtroEstado === 'activos' && !u.activo) return false;
    if (filtroEstado === 'inactivos' && u.activo) return false;
    return true;
  });

  // Estadísticas
  const totalUsuarios = users.length;
  const usuariosActivos = users.filter(u => u.activo).length;
  const administradores = users.filter(u => u.rol === 'administrador').length;

  return (
    <div className="container mt-4 mb-5">
      {/* Mensajes de éxito/error */}
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess('')} aria-label="Close"></button>
        </div>
      )}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')} aria-label="Close"></button>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">👥 Gestión de Usuarios</h1>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary" onClick={load} type="button" disabled={loading}>
            <span className="me-1">⟳</span> Actualizar
          </button>
          <button className="btn btn-outline-secondary" onClick={() => navigate('/admin/dashboard')} type="button">
            ← Volver al Dashboard
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5 className="card-title">Total Usuarios</h5>
              <p className="card-text fs-2 fw-bold">{totalUsuarios}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5 className="card-title">Usuarios Activos</h5>
              <p className="card-text fs-2 fw-bold">{usuariosActivos}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-warning">
            <div className="card-body">
              <h5 className="card-title">Administradores</h5>
              <p className="card-text fs-2 fw-bold">{administradores}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Filtrar por Rol</label>
              <select 
                className="form-select" 
                value={filtroRol} 
                onChange={(e) => setFiltroRol(e.target.value as typeof filtroRol)}
              >
                <option value="todos">Todos los roles</option>
                <option value="usuario">Usuarios</option>
                <option value="administrador">Administradores</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Filtrar por Estado</label>
              <select 
                className="form-select" 
                value={filtroEstado} 
                onChange={(e) => setFiltroEstado(e.target.value as typeof filtroEstado)}
              >
                <option value="todos">Todos los estados</option>
                <option value="activos">Solo activos</option>
                <option value="inactivos">Solo inactivos</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
          <p className="mt-3">Cargando usuarios...</p>
        </div>
      ) : usuariosFiltrados.length === 0 ? (
        <div className="alert alert-info">
          No hay usuarios que coincidan con los filtros seleccionados
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosFiltrados.map(u => (
                    <tr key={u.id}>
                      <td>#{u.id}</td>
                      <td>
                        <div className="fw-bold">{u.nombre} {u.apellido}</div>
                      </td>
                      <td>{u.email}</td>
                      <td>{u.telefono || <span className="text-muted">-</span>}</td>
                      <td>
                        <span className={`badge ${u.rol === 'administrador' ? 'bg-warning' : 'bg-secondary'}`}>
                          {u.rol === 'administrador' ? '👑 Admin' : '👤 Usuario'}
                        </span>
                      </td>
                      <td>
                        {u.activo ? (
                          <span className="badge bg-success">✓ Activo</span>
                        ) : (
                          <span className="badge bg-danger">✗ Inactivo</span>
                        )}
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button 
                            className="btn btn-sm btn-outline-primary" 
                            type="button" 
                            onClick={() => setSelected(u)}
                          >
                            👁️ Ver
                          </button>
                          <button 
                            className={`btn btn-sm ${u.activo ? 'btn-outline-warning' : 'btn-outline-success'}`}
                            type="button" 
                            onClick={() => toggleEstado(u.id)}
                          >
                            {u.activo ? '🔒 Desactivar' : '🔓 Activar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-muted mt-2">
              Mostrando {usuariosFiltrados.length} de {totalUsuarios} usuarios
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalle Usuario */}
      {selected && (
        <div 
          className="modal fade show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setSelected(null)}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">👤 Detalle de Usuario</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setSelected(null)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-6">
                    <small className="text-muted d-block">ID</small>
                    <div className="fw-bold">#{selected.id}</div>
                  </div>
                  <div className="col-6">
                    <small className="text-muted d-block">Estado</small>
                    <div>
                      {selected.activo ? (
                        <span className="badge bg-success">✓ Activo</span>
                      ) : (
                        <span className="badge bg-danger">✗ Inactivo</span>
                      )}
                    </div>
                  </div>
                  <div className="col-12">
                    <small className="text-muted d-block">Nombre Completo</small>
                    <div className="fw-bold">{selected.nombre} {selected.apellido}</div>
                  </div>
                  <div className="col-12">
                    <small className="text-muted d-block">Email</small>
                    <div>{selected.email}</div>
                  </div>
                  <div className="col-6">
                    <small className="text-muted d-block">Teléfono</small>
                    <div>{selected.telefono || <span className="text-muted">(sin cargar)</span>}</div>
                  </div>
                  <div className="col-6">
                    <small className="text-muted d-block">Rol</small>
                    <div>
                      <span className={`badge ${selected.rol === 'administrador' ? 'bg-warning' : 'bg-secondary'}`}>
                        {selected.rol === 'administrador' ? '👑 Administrador' : '👤 Usuario'}
                      </span>
                    </div>
                  </div>
                  <div className="col-12">
                    <small className="text-muted d-block">Dirección</small>
                    <div>{selected.direccion || <span className="text-muted">(sin cargar)</span>}</div>
                  </div>
                </div>

                <div className="alert alert-info mt-3 mb-0">
                  <small>
                    <strong>Nota:</strong> Próximamente se mostrarán estadísticas detalladas 
                    (compras realizadas, productos publicados, participación en subastas, etc.)
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setSelected(null)}
                >
                  Cerrar
                </button>
                <button 
                  type="button" 
                  className={`btn ${selected.activo ? 'btn-warning' : 'btn-success'}`}
                  onClick={() => {
                    toggleEstado(selected.id);
                    setSelected({ ...selected, activo: !selected.activo });
                  }}
                >
                  {selected.activo ? '🔒 Desactivar' : '🔓 Activar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
