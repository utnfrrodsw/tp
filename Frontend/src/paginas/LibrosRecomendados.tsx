import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, Award, Info } from 'lucide-react';
import { obtenerRecomendaciones, invalidarCacheRecomendaciones, RecomendacionResponse } from '../services/recomendacionService';
import { getResenasByLibro } from '../services/resenaService';
import LibroCard from '../componentes/LibroCard';
import RecomendacionesSkeletonLoader from '../componentes/RecomendacionesSkeletonLoader';
import RecomendacionesFiltros, { FiltrosRecomendaciones } from '../componentes/RecomendacionesFiltros';
import VistaToggle, { VistaRecomendaciones } from '../componentes/VistaToggle';
import Tooltip from '../componentes/Tooltip';
import LibroImagen from '../componentes/LibroImagen';

export const LibrosRecomendados: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<RecomendacionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Nuevos estados para mejoras
  const [vista, setVista] = useState<VistaRecomendaciones>('grid');
  const [filtros, setFiltros] = useState<FiltrosRecomendaciones>({
    categorias: [],
    autores: [],
    ratingMinimo: 0
  });

  // Función para navegar al libro pasando el origen para el botón "Volver"
  const handleLibroClick = (slug: string) => {
    console.log('🔍 Navegando desde recomendaciones con state:', { from: '/recomendaciones' });
    navigate(`/libro/${slug}`, { 
      state: { from: '/recomendaciones' } 
    });
  };

  const cargarRecomendaciones = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await obtenerRecomendaciones(15);
      const librosConPromedioReal = await Promise.all(
        response.libros.map(async (libro) => {
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

      setData({
        ...response,
        libros: librosConPromedioReal,
      });
    } catch (err: any) {
      console.error('Error al cargar recomendaciones:', err);
      setError(err.message || 'Error al cargar recomendaciones');
    } finally {
      setLoading(false);
    }
  };

  const actualizarRecomendaciones = useCallback(() => {
    // Limpiar timeout anterior si existe
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Crear nuevo timeout (debounce de 500ms)
    debounceTimerRef.current = setTimeout(async () => {
      try {
        setRefreshing(true);
        setError(null);
        await invalidarCacheRecomendaciones();
        await cargarRecomendaciones();
      } catch (err: any) {
        console.error('Error al actualizar recomendaciones:', err);
        setError(err.message || 'Error al actualizar recomendaciones');
      } finally {
        setRefreshing(false);
      }
    }, 500);
  }, []);

  useEffect(() => {
    cargarRecomendaciones();

    // Cleanup del debounce timer
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Obtener categorías y autores únicos para los filtros
  const categoriasDisponibles = useMemo(() => {
    if (!data) return [];
    const categorias = new Set<string>();
    data.libros.forEach(libro => {
      libro.matchCategorias.forEach(cat => categorias.add(cat));
    });
    return Array.from(categorias).sort();
  }, [data]);

  const autoresDisponibles = useMemo(() => {
    if (!data) return [];
    const autores = new Set<string>();
    data.libros.forEach(libro => {
      libro.matchAutores.forEach(aut => autores.add(aut));
      libro.autores.forEach(aut => autores.add(aut));
    });
    return Array.from(autores).sort();
  }, [data]);

  // Filtrar libros según los filtros activos
  const librosFiltrados = useMemo(() => {
    if (!data) return [];
    
    return data.libros.filter(libro => {
      // Filtro de rating
      if (filtros.ratingMinimo > 0 && libro.averageRating < filtros.ratingMinimo) {
        return false;
      }

      // Filtro de categorías
      if (filtros.categorias.length > 0) {
        const tieneCategoria = libro.matchCategorias.some(cat => 
          filtros.categorias.includes(cat)
        );
        if (!tieneCategoria) return false;
      }

      // Filtro de autores
      if (filtros.autores.length > 0) {
        const tieneAutor = [...libro.matchAutores, ...libro.autores].some(aut => 
          filtros.autores.includes(aut)
        );
        if (!tieneAutor) return false;
      }

      return true;
    });
  }, [data, filtros]);  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300" role="status" aria-live="polite">
        {/* Header mientras carga */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-lg border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-700 via-blue-600 to-indigo-700 dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-400">
                  Recomendaciones para ti
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Generando recomendaciones personalizadas basadas en tus preferencias
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <RecomendacionesSkeletonLoader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 sm:p-8 transition-colors duration-300" role="alert" aria-live="assertive">
        <div className="max-w-md w-full">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 text-center border border-gray-200/50 dark:border-gray-700/50">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Algo salió mal</h3>
            <p className="text-red-600 dark:text-red-400 text-xs sm:text-sm mb-6">{error}</p>
            <button
              onClick={cargarRecomendaciones}
              className="px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg font-semibold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Reintentar carga de recomendaciones"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300" role="main">
      {/* Header limpio */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-700 via-blue-600 to-indigo-700 dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-400">
                Recomendaciones para ti
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Libros seleccionados especialmente según tus preferencias
            </p>
          </motion.div>
        </div>
      </div>

      {/* Barra de controles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Contador e info */}
          <div className="flex items-center gap-3 flex-wrap">
            {data?.metadata && (
              <div 
                className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg px-4 py-2.5 shadow-md border border-gray-200/50 dark:border-gray-700/50"
                role="status"
                aria-label={`${librosFiltrados.length} de ${data.metadata.totalRecomendaciones} recomendaciones mostradas`}
              >
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium">
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-base sm:text-lg">{librosFiltrados.length}</span>
                  {librosFiltrados.length !== data.metadata.totalRecomendaciones && (
                    <span className="text-gray-500"> de {data.metadata.totalRecomendaciones}</span>
                  )}
                  <span className="ml-1">libros</span>
                </p>
              </div>
            )}
          </div>
          
          {/* Controles: Filtros, Vista, Actualizar */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Filtros */}
            <RecomendacionesFiltros
              filtros={filtros}
              onFiltrosChange={setFiltros}
              categoriasDisponibles={categoriasDisponibles}
              autoresDisponibles={autoresDisponibles}
            />

            {/* Toggle de vista */}
            <VistaToggle vista={vista} onVistaChange={setVista} />

            {/* Botón actualizar */}
            <motion.button
              onClick={actualizarRecomendaciones}
              disabled={refreshing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={refreshing ? 'Actualizando recomendaciones' : 'Actualizar recomendaciones'}
            >
              <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${refreshing ? 'animate-spin' : ''}`} aria-hidden="true" />
              <span className="hidden sm:inline">{refreshing ? 'Actualizando...' : 'Actualizar'}</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Info del algoritmo */}
      {data?.metadata && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-blue-50/80 dark:bg-gray-800/50 backdrop-blur-sm border border-blue-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 shadow-md"
            role="region"
            aria-label="Información sobre el algoritmo de recomendaciones"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="bg-white dark:bg-gray-700 rounded-full p-2 sm:p-3 shadow-sm flex-shrink-0">
                <Info className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-base sm:text-lg">¿Cómo funcionan las recomendaciones?</h2>
                <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">
                  Analizamos tus <strong>libros favoritos</strong>, <strong>ratings</strong>, 
                  <strong> reseñas</strong> y <strong>autores preferidos</strong> para sugerirte libros similares 
                  que aún no has explorado, incluyendo novedades recientes y títulos mejor valorados.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Lista de libros */}
      {data?.libros && data.libros.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 sm:py-20" role="status" aria-live="polite">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 dark:text-gray-600" aria-hidden="true" />
              </div>
              <h2 className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 mb-3 font-bold">No hay recomendaciones disponibles</h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Empieza a <strong className="text-blue-600 dark:text-blue-400">calificar libros</strong>, 
                <strong className="text-indigo-600 dark:text-indigo-400"> agregar favoritos</strong> y 
                <strong className="text-cyan-600 dark:text-cyan-400"> escribir reseñas</strong> para recibir recomendaciones personalizadas.
              </p>
              <div className="flex items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-500">
                <span>⭐ Califica</span>
                <span>❤️ Favoritos</span>
                <span>📝 Reseñas</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Vista Grid con animación stagger */}
          {vista === 'grid' && (
            <motion.div 
              className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              role="list"
              aria-label="Lista de libros recomendados"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.08
                  }
                }
              }}
            >
              {librosFiltrados.map((libro) => {
              // Construir extraInfo con badge de match
              const extraInfo = (
                <div className="space-y-2">
                  {/* Badge de match con tooltip */}
                  <Tooltip 
                    content={`Este libro tiene un ${(libro.score * 100).toFixed(0)}% de afinidad con tus preferencias`}
                    position="top"
                  >
                    <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-1.5 border border-blue-200 dark:border-blue-800">
                      <Award className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                        {(libro.score * 100).toFixed(0)}% Match
                      </span>
                    </div>
                  </Tooltip>
                </div>
              );

              return (
                <motion.div
                  key={libro.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ y: -6 }}
                  whileTap={{ scale: 0.98 }}
                  role="listitem"
                  onClick={() => handleLibroClick(libro.slug)}
                  className="cursor-pointer"
                >
                  {/* Card clickeable */}
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200/50 dark:border-gray-700/50 h-full">
                    <LibroCard
                      title={libro.titulo}
                      authors={libro.autores}
                      image={libro.imagen}
                      rating={libro.averageRating > 0 ? libro.averageRating : null}
                      extraInfo={extraInfo}
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
          )}

          {/* Vista Lista */}
          {vista === 'lista' && (
            <motion.div
              className="space-y-4"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
            >
              {librosFiltrados.map((libro) => {
                return (
                  <motion.div
                    key={libro.id}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      show: { opacity: 1, x: 0 }
                    }}
                    transition={{ duration: 0.4 }}
                    className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200/50 dark:border-gray-700/50 relative"
                  >
                    {/* Contenedor clickeable */}
                    <div 
                      className="flex flex-col sm:flex-row gap-4 p-4 cursor-pointer"
                      onClick={() => handleLibroClick(libro.slug)}
                    >
                      {/* Imagen */}
                      <div className="flex-shrink-0 w-full sm:w-32 h-48 sm:h-auto">
                        <LibroImagen
                          src={libro.imagen}
                          alt={libro.titulo}
                          titulo={libro.titulo}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      {/* Contenido */}
                      <div className="flex-1 min-w-0 space-y-3">
                        {/* Header */}
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 line-clamp-2 mb-1">
                            {libro.titulo}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            por {libro.autores.join(', ')}
                          </p>
                        </div>

                        {/* Badges */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {libro.averageRating > 0 && (
                            <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-lg text-xs font-semibold flex items-center gap-1">
                              ⭐ {libro.averageRating.toFixed(1)}
                            </span>
                          )}
                          
                          <Tooltip 
                            content={`${(libro.score * 100).toFixed(0)}% de afinidad con tus preferencias`}
                            position="top"
                          >
                            <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-semibold border border-blue-200 dark:border-blue-800">
                              {(libro.score * 100).toFixed(0)}% Match
                            </span>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default LibrosRecomendados;
  