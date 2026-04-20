// paginas/NuevosLanzamientos.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNuevosLanzamientos } from '../services/libroService';
import { getResenasByLibro } from '../services/resenaService';
import { Sparkles, Calendar, Star, BookOpen } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion } from 'framer-motion';

interface Libro {
  id: string;
  slug?: string;
  titulo: string;
  autores: string[];
  imagen: string | null;
  descripcion: string | null;
  averageRating: number;
  categoria: string | null;
  fechaPublicacion: string;
  esNuevo: boolean;
}

export default function NuevosLanzamientos() {
  const navigate = useNavigate();
  const [libros, setLibros] = useState<Libro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNuevosLanzamientos();
  }, []);

  const fetchNuevosLanzamientos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getNuevosLanzamientos(24);

      const baseLibros: Libro[] = response.libros || [];
      const librosConPromedioReal = await Promise.all(
        baseLibros.map(async (libro) => {
          try {
            const reviewsData = await getResenasByLibro(String(libro.id));
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

      setLibros(librosConPromedioReal);
    } catch (err) {
      console.error('Error al obtener nuevos lanzamientos:', err);
      setError('Error al cargar los nuevos lanzamientos');
    } finally {
      setLoading(false);
    }
  };

  const handleLibroClick = (libro: Libro) => {
    // Usar slug si está disponible, sino usar id
    const identifier = libro.slug || libro.id;
    navigate(`/libro/${identifier}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors duration-300">
        <div className="flex justify-center items-center">
          <DotLottieReact
            src="https://lottie.host/6d727e71-5a1d-461e-9434-c9e7eb1ae1d1/IWVmdeMHnT.lottie"
            loop
            autoplay
            style={{ width: 140, height: 140 }}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-red-500 dark:text-red-400 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">{error}</p>
          <motion.button
            onClick={fetchNuevosLanzamientos}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
          >
            Reintentar
          </motion.button>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="text-5xl">🚀</span>
              </motion.div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
                  Nuevos Lanzamientos
                </span>
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Descubre los libros más recientes añadidos a nuestra colección en los últimos 6 meses
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-purple-600 dark:text-purple-400 font-semibold">
                {libros.length} {libros.length === 1 ? 'libro nuevo' : 'libros nuevos'}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Grid de libros */}
        {libros.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-lg p-12 max-w-md mx-auto border border-gray-200/50 dark:border-gray-700/50">
              <BookOpen className="w-20 h-20 text-gray-400 dark:text-gray-500 mx-auto mb-6" />
              <p className="text-gray-700 dark:text-gray-300 text-xl font-semibold mb-2">No hay nuevos lanzamientos</p>
              <p className="text-gray-500 dark:text-gray-400">Vuelve pronto para descubrir las novedades</p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {libros.map((libro, index) => (
              <motion.div
                key={libro.id}
                variants={cardVariants}
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleLibroClick(libro)}
                className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden border border-gray-200/50 dark:border-gray-700/50 group h-full"
              >
                {/* Efecto de brillo superior */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
                
                {/* Badge de nuevo */}
                <div className="absolute top-3 right-3 z-20">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.08 + 0.3, type: "spring", stiffness: 200, damping: 10 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-full blur-md opacity-60 animate-pulse" />
                    <span className="relative bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-xl flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                      NUEVO
                    </span>
                  </motion.div>
                </div>
                
                {/* Imagen con efecto overlay */}
                <div className="relative w-full h-64 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-purple-900/20 dark:to-blue-900/20 overflow-hidden flex-shrink-0">
                  {libro.imagen ? (
                    <>
                      {/* Fondo blur con colores de la portada */}
                      <div
                        className="absolute inset-0 scale-150 blur-2xl opacity-85 dark:opacity-75"
                        style={{
                          backgroundImage: `url(${libro.imagen})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                      <div className="relative h-full flex items-center justify-center p-2">
                        <img
                          src={libro.imagen}
                          alt={libro.titulo}
                          className="h-[90%] w-auto object-contain drop-shadow-2xl transform group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-500"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-700 dark:via-purple-900/30 dark:to-blue-900/30">
                      <BookOpen className="w-14 h-14 text-gray-400 dark:text-gray-500" />
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div className="p-3">
                  {/* Fecha en la parte superior - siempre visible */}
                  <div className="flex items-center gap-1 mb-2 text-xs text-purple-600 dark:text-purple-400 font-semibold">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(libro.fechaPublicacion).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  {/* Título - altura fija con line-clamp */}
                  <h3 className="font-extrabold text-gray-900 dark:text-gray-100 text-sm leading-tight mb-1.5 line-clamp-2 h-9 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 dark:group-hover:from-blue-400 dark:group-hover:to-purple-400 transition-all duration-300">
                    {libro.titulo}
                  </h3>

                  {/* Autores - altura fija */}
                  <p className="text-gray-600 dark:text-gray-400 text-xs mb-2.5 line-clamp-1 font-medium h-4">
                    {libro.autores.length > 0 ? libro.autores.join(', ') : 'Autor desconocido'}
                  </p>

                  {/* Rating y Categoría */}
                  <div className="flex items-center justify-between gap-1.5">
                    {libro.averageRating > 0 ? (
                      <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 px-2 py-0.5 rounded-lg border border-yellow-200 dark:border-yellow-800/50 shadow-sm">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                          {libro.averageRating.toFixed(1)}
                        </span>
                      </div>
                    ) : (
                      <div />
                    )}
                    {libro.categoria && (
                      <span className="text-xs bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-lg font-semibold border border-blue-200 dark:border-blue-800/50 shadow-sm line-clamp-1">
                        {libro.categoria}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
  