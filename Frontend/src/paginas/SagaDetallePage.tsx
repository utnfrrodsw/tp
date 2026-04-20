import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { getSagaById } from '../services/sagaService';
import { getResenasByLibro } from '../services/resenaService';
import LibroCard from '../componentes/LibroCard';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface Libro {
  id: number;
  titulo: string;
  autores: string[];
  descripcion?: string;
  imagen: string | null;
  enlace: string | null;
  averageRating?: number;
  externalId?: string;
}

interface Saga {
  id: number;
  nombre: string;
  libros: Libro[];
  createdAt: string;
  updatedAt?: string;
}

const SagaDetallePage: React.FC = () => {
  const { id } = useParams();
  const [saga, setSaga] = useState<Saga | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSaga = async () => {
      if (!id) return;

      try {
        const data = await getSagaById(Number(id));
        const librosConPromedioReal = await Promise.all(
          (data.libros || []).map(async (libro: Libro) => {
            try {
              const lookupId = String(libro.externalId || libro.id);
              const reviewsData = await getResenasByLibro(lookupId);
              const reviews = reviewsData?.reviews || [];
              const avgRating = reviews.length > 0
                ? reviews.reduce((sum: number, r: any) => sum + r.estrellas, 0) / reviews.length
                : 0;

              return { ...libro, averageRating: avgRating };
            } catch {
              return libro;
            }
          })
        );

        setSaga({
          ...data,
          libros: librosConPromedioReal,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchSaga();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <DotLottieReact
          src="https://lottie.host/6d727e71-5a1d-461e-9434-c9e7eb1ae1d1/IWVmdeMHnT.lottie"
          loop
          autoplay
          style={{ width: 140, height: 140 }}
        />
      </div>
    );
  }

  if (error || !saga) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            {error || 'Saga no encontrada'}
          </h1>
          <Link
            to="/sagas"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Sagas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/sagas"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors font-medium group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              Volver a Sagas
            </Link>
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
                  {saga.nombre}
                </span>
              </h1>
              <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full px-4 py-2 shadow-lg">
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    {saga.libros.length} {saga.libros.length !== 1 ? 'Libros' : 'Libro'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {saga.libros.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-lg p-12 max-w-md mx-auto border border-gray-200/50 dark:border-gray-700/50">
              <BookOpen className="w-20 h-20 text-gray-400 dark:text-gray-500 mx-auto mb-6" />
              <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">Esta saga no tiene libros asociados aún.</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, staggerChildren: 0.1 }}
          >
            {saga.libros.map((libro, index) => (
              <motion.div
                key={libro.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link to={`/libro/${libro.externalId || libro.id}`} className="block h-full">
                  <div className="h-full transform transition-all duration-300">
                    <LibroCard
                      title={libro.titulo}
                      authors={libro.autores}
                      image={libro.imagen}
                      description={libro.descripcion}
                      rating={libro.averageRating}
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SagaDetallePage;
