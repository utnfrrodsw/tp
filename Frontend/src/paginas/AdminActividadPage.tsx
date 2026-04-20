import React, { useState, useEffect } from 'react';
import { getActividades, deleteActividad } from '../services/actividadService';
import { getAccessToken } from '../utils/tokenUtil';

interface Actividad {
  id: number;
  tipo: string;
  fecha: string;
  usuario: {
    id: number;
    nombre: string;
    email: string;
  };
  libro?: {
    id: number;
    titulo: string;
  };
  resena?: {
    id: number;
    comentario: string;
    esRespuesta?: boolean;
    resenaPadreAutor?: {
      nombre: string;
      apellido: string;
    };
  };
}

const AdminActividadPage: React.FC = () => {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarActividades();
  }, []);

  const cargarActividades = async () => {
    try {
      const actividadesData = await getActividades();
      setActividades(actividadesData);
    } catch (err) {
      setError('Error al cargar actividades');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = getAccessToken();
      if (!token) return;

      await deleteActividad(id, token);
      setActividades(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      setError('Error al eliminar la actividad');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-700 dark:bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Administrar Actividades</h1>
          <div className="text-center">Cargando actividades...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-700 dark:bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Administrar Actividades</h1>
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Administrar Actividades</h1>

        {actividades.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No hay actividades registradas.
          </div>
        ) : (
          <div className="space-y-4">
            {actividades.map((actividad) => (
              <div key={actividad.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Actividad: {actividad.tipo}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Usuario: {actividad.usuario.nombre} ({actividad.usuario.email})
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Fecha: {new Date(actividad.fecha).toLocaleDateString()}
                    </p>
                    {actividad.libro && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Libro: {actividad.libro.titulo}
                      </p>
                    )}
                    {actividad.resena && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Reseña: {actividad.resena.comentario.substring(0, 50)}...
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(actividad.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminActividadPage;
