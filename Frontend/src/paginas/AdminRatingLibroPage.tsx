import React, { useState, useEffect } from 'react';
import { getRatingLibros, deleteRatingLibro } from '../services/ratingLibroService';
import { getAccessToken } from '../utils/tokenUtil';

interface RatingLibro {
  id: number;
  avgRating: number;
  cantidadResenas: number;
  fechaActualizacion: string;
  libro: {
    id: number;
    titulo: string;
    slug: string;
  };
}

const AdminRatingLibroPage: React.FC = () => {
  const [ratings, setRatings] = useState<RatingLibro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarRatings();
  }, []);

  const cargarRatings = async () => {
    try {
      const ratingsData = await getRatingLibros();
      setRatings(ratingsData);
    } catch (err) {
      setError('Error al cargar ratings de libros');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = getAccessToken();
      if (!token) return;

      await deleteRatingLibro(id, token);
      setRatings(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      setError('Error al eliminar el rating');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-700 dark:bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Administrar Ratings de Libros</h1>
          <div className="text-center">Cargando ratings...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-700 dark:bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Administrar Ratings de Libros</h1>
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Administrar Ratings de Libros</h1>

        {ratings.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No hay ratings de libros registrados.
          </div>
        ) : (
          <div className="space-y-4">
            {ratings.map((rating) => (
              <div key={rating.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Libro: {rating.libro.titulo}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Rating Promedio: {rating.avgRating.toFixed(1)}/5
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Cantidad de Reseñas: {rating.cantidadResenas}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Última Actualización: {new Date(rating.fechaActualizacion).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(rating.id)}
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

export default AdminRatingLibroPage;
