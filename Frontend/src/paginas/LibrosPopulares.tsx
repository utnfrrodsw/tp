import { useEffect, useState, useRef } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, Flame } from "lucide-react";
import { API_BASE_URL } from '../config/api.config';
import LibroCard from "../componentes/LibroCard";

interface LibroTrending {
  id: string;
  title: string;
  slug: string;
  activities_count: number;
  coverUrl: string | null;
  authors: string[];
  description: string | null;
}

export default function LibrosPopulares() {
  const location = useLocation();
  const [trending, setTrending] = useState<LibroTrending[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [errorTrending, setErrorTrending] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(10);

  const isFetchingTrending = useRef(false);

  useEffect(() => {
    const fetchTrending = async () => {
      if (isFetchingTrending.current) return;
      isFetchingTrending.current = true;
      setLoadingTrending(true);

      try {
        const res = await fetch(`${API_BASE_URL}/hardcover/trending`);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const response = await res.json();

        if (response.loading) {
          setTimeout(fetchTrending, 2000);
          return;
        }

        const mapped: LibroTrending[] = (response.books ?? []).map((b: any) => ({
          id: b.id,
          title: b.title,
          slug: b.slug,
          activities_count: b.activities_count,
          coverUrl: b.coverUrl ?? null,
          authors: b.authors ?? [],
          description: b.description ?? null,
        }));

        setTrending(mapped);
        setErrorTrending(null);
      } catch (err: any) {
        setErrorTrending(err.message || "Error al cargar libros populares");
      } finally {
        setLoadingTrending(false);
        isFetchingTrending.current = false;
      }
    };

    fetchTrending();
  }, []);

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
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-700 via-blue-600 to-indigo-700 dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-400">
                Libros populares
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Descubre los libros más leídos y trending del momento
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Loading */}
        {loadingTrending && (
          <div className="flex justify-center items-center py-12">
            <DotLottieReact
              src="https://lottie.host/6d727e71-5a1d-461e-9434-c9e7eb1ae1d1/IWVmdeMHnT.lottie"
              loop
              autoplay
              style={{ width: 140, height: 140 }}
            />
          </div>
        )}

        {/* Error */}
        {errorTrending && (
          <p className="text-center text-red-500 dark:text-red-400 text-lg">{errorTrending}</p>
        )}

        {/* Contenido */}
        {!loadingTrending && !errorTrending && (
          <>
            {/* Top 5 */}
            <section className="mb-12">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-8"
              >
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 px-5 py-2.5 rounded-full shadow-lg mb-3">
                  <Flame className="w-5 h-5 text-white" />
                  <h3 className="text-xl font-bold text-white">Top 5 Más Leídos</h3>
                </div>
              </motion.div>

              <motion.div 
                className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {trending.slice(0, 5).map((libro, index) => (
                  <motion.div
                    key={libro.id}
                    variants={cardVariants}
                    whileHover={{ y: -8 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link 
                      to={`/libro/${libro.slug}`} 
                      state={{ from: location.pathname }} 
                      className="group relative block h-full"
                    >
                      {/* Badge de ranking */}
                      <div className="absolute -top-3 -left-3 z-20">
                        <div className={`
                          w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-xl
                          ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : 
                            index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                            index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                            'bg-gradient-to-br from-blue-500 to-purple-600'}
                        `}>
                          {index + 1}
                        </div>
                      </div>

                      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200/50 dark:border-gray-700/50 h-full">
                        <LibroCard
                          title={libro.title}
                          authors={libro.authors}
                          image={libro.coverUrl}
                          extraInfo={`${libro.activities_count} actividades`}
                        />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </section>

            {/* Otros Libros */}
            <section>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-center mb-8"
              >
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 rounded-full shadow-lg mb-3">
                  <TrendingUp className="w-5 h-5 text-white" />
                  <h3 className="text-xl font-bold text-white">Siguientes en Popularidad</h3>
                </div>
              </motion.div>

              <motion.div 
                className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {trending.slice(5, visibleCount).map((libro) => (
                  <motion.div
                    key={libro.id}
                    variants={cardVariants}
                    whileHover={{ y: -6 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link 
                      to={`/libro/${libro.slug}`} 
                      state={{ from: location.pathname }} 
                      className="block group h-full"
                    >
                      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200/50 dark:border-gray-700/50 h-full">
                        <LibroCard
                          title={libro.title}
                          authors={libro.authors}
                          image={libro.coverUrl}
                          extraInfo={`${libro.activities_count} actividades`}
                        />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              {visibleCount < trending.length && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center mt-10"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setVisibleCount(prev => Math.min(prev + 10, trending.length))}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <span>Ver más libros</span>
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.button>
                </motion.div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
