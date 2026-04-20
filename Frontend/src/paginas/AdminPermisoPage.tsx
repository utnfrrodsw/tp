import React, { useState, useEffect } from 'react';
import { getPermisos, createPermiso, updatePermiso, deletePermiso, getPermisoById } from '../services/permisoService';
import { getAccessToken } from '../utils/tokenUtil';
import { getUsuarios } from '../services/userService'; // Assuming userService has getUsuarios

interface Permiso {
  id: number;
  tipo: string;
  descripcion: string;
}

interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

const AdminPermisoPage: React.FC = () => {
  const [permisos, setPermisos] = useState<Permiso[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPermiso, setSelectedPermiso] = useState<Permiso | null>(null);
  const [selectedUsuario, setSelectedUsuario] = useState<number | null>(null);
  const [nuevoPermiso, setNuevoPermiso] = useState({ tipo: '', descripcion: '' });

  useEffect(() => {
    cargarPermisos();
    cargarUsuarios();
  }, []);

  const cargarPermisos = async () => {
    try {
      const permisosData = await getPermisos();
      setPermisos(permisosData);
    } catch (err) {
      setError('Error al cargar permisos');
      console.error(err);
    }
  };

  const cargarUsuarios = async () => {
    try {
      const usuariosData = await getUsuarios();
      setUsuarios(usuariosData);
    } catch (err) {
      setError('Error al cargar usuarios');
      console.error(err);
    }
  };

  const handleCreatePermiso = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = getAccessToken();
      if (!token) return;

      await createPermiso(nuevoPermiso, token);
      setNuevoPermiso({ tipo: '', descripcion: '' });
      cargarPermisos();
    } catch (err) {
      setError('Error al crear el permiso');
      console.error(err);
    }
  };

  const handleUpdatePermiso = async () => {
    if (!selectedPermiso) return;
    try {
      const token = getAccessToken();
      if (!token) return;

      await updatePermiso(selectedPermiso.id, selectedPermiso, token);
      setSelectedPermiso(null);
      cargarPermisos();
    } catch (err) {
      setError('Error al actualizar el permiso');
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = getAccessToken();
      if (!token) return;

      await deletePermiso(id, token);
      setPermisos(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError('Error al eliminar el permiso');
      console.error(err);
    }
  };

  const handleAsignarPermiso = async () => {
    if (!selectedPermiso || !selectedUsuario) return;
    try {
      const token = getAccessToken();
      if (!token) return;

      // Assuming an endpoint to assign permission to user, e.g., via userService
      // For now, simulate or use a placeholder; in real, call updateUsuario with permissions
      console.log(`Asignando permiso ${selectedPermiso.tipo} al usuario ${selectedUsuario}`);
      setError('Función de asignación simulada. Implementar endpoint en backend.');
      setSelectedPermiso(null);
      setSelectedUsuario(null);
    } catch (err) {
      setError('Error al asignar permiso');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-700 dark:bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Administrar Permisos</h1>
          <div className="text-center">Cargando...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-700 dark:bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Administrar Permisos</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-700 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Administrar Permisos</h1>

        {/* Crear Nuevo Permiso */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Crear Nuevo Permiso</h2>
          <form onSubmit={handleCreatePermiso} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo</label>
              <input
                type="text"
                value={nuevoPermiso.tipo}
                onChange={(e) => setNuevoPermiso({ ...nuevoPermiso, tipo: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
              <textarea
                value={nuevoPermiso.descripcion}
                onChange={(e) => setNuevoPermiso({ ...nuevoPermiso, descripcion: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Crear Permiso
            </button>
          </form>
        </div>

        {/* Lista de Permisos */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">Lista de Permisos</h2>
          {permisos.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">No hay permisos registrados.</div>
          ) : (
            permisos.map((permiso) => (
              <div key={permiso.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{permiso.tipo}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{permiso.descripcion}</p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => setSelectedPermiso(permiso)}
                      className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(permiso.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Gestión de Permisos de Usuario */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Asignar Permiso a Usuario</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Seleccionar Permiso</label>
              <select
                value={selectedPermiso?.id || ''}
                onChange={(e) => {
                  const permiso = permisos.find(p => p.id === parseInt(e.target.value));
                  setSelectedPermiso(permiso || null);
                }}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm"
              >
                <option value="">-- Seleccionar Permiso --</option>
                {permisos.map(p => (
                  <option key={p.id} value={p.id}>{p.tipo}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Seleccionar Usuario</label>
              <select
                value={selectedUsuario || ''}
                onChange={(e) => setSelectedUsuario(parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm"
              >
                <option value="">-- Seleccionar Usuario --</option>
                {usuarios.map(u => (
                  <option key={u.id} value={u.id}>{u.nombre} ({u.email})</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleAsignarPermiso}
            disabled={!selectedPermiso || !selectedUsuario}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            Asignar Permiso
          </button>
        </div>

        {/* Modal para Editar (simple inline for simplicity) */}
        {selectedPermiso && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Editar Permiso</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={selectedPermiso.tipo}
                  onChange={(e) => setSelectedPermiso({ ...selectedPermiso, tipo: e.target.value })}
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm"
                  placeholder="Tipo"
                />
                <textarea
                  value={selectedPermiso.descripcion}
                  onChange={(e) => setSelectedPermiso({ ...selectedPermiso, descripcion: e.target.value })}
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm"
                  placeholder="Descripción"
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => setSelectedPermiso(null)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdatePermiso}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Actualizar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPermisoPage;
