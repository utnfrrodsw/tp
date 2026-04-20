import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { getSagas } from '../services/sagaService';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface Saga {
  id: number;
  nombre: string;
  cantidadLibros: number;
  libros: Array<{
    id: number;
    titulo: string;
    autores: string[];
    descripcion: string | null;
    imagen: string | null;
    enlace: string | null;
    externalId: string | null;
  }>;
}

const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-gray-700', 'bg-amber-600', 'bg-green-500', 'bg-indigo-500', 'bg-red-500'];

const SagasPage: React.FC = () => {
  const [sagas, setSagas] = useState<Saga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSagas = async () => {
      try {
        const data = await getSagas();
        setSagas(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    fetchSagas();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-gray-950 dark:to-indigo-950">
        <DotLottieReact
          src="https://lottie.host/6d727e71-5a1d-461e-9434-c9e7eb1ae1d1/IWVmdeMHnT.lottie"
          loop
          autoplay
          style={{ width: 140, height: 140 }}
        />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 dark:text-red-400 text-lg">{error}</p>;
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-center text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
                  Sagas
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Explora universos completos y series legendarias
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {sagas.map((saga, index) => {
            const firstBookWithImage = saga.libros.find(libro => libro.imagen);
            return (
              <motion.div
                key={saga.id}
                variants={cardVariants}
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={`/sagas/${saga.id}`}
                  className="group block h-full"
                >
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200/50 dark:border-gray-700/50 h-full flex flex-col">
                    {/* Imagen de portada con efecto mejorado */}
                    <div className="relative h-64 overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-purple-900/20 dark:to-blue-900/20">
                      {firstBookWithImage ? (
                        <>
                          {/* Fondo blur más intenso */}
                          <div
                            className="absolute inset-0 scale-150 blur-2xl opacity-85 dark:opacity-75"
                            style={{
                              backgroundImage: `url(${firstBookWithImage.imagen})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }}
                          />
                          {/* Sin overlay para maximizar colores */}
                          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-transparent" />
                          
                          <div className="relative h-full flex items-center justify-center p-3">
                            <img
                              src={firstBookWithImage.imagen!}
                              alt={firstBookWithImage.titulo}
                              className="h-[90%] w-auto object-contain drop-shadow-2xl transform group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-500"
                            />
                          </div>
                        </>
                      ) : (
                        <div className={`h-full ${colors[index % colors.length]} flex items-center justify-center relative overflow-hidden`}>
                          {/* Patrón decorativo de fondo */}
                          <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 left-0 w-full h-full" 
                                 style={{
                                   backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                                   backgroundSize: '30px 30px'
                                 }} 
                            />
                          </div>
                          <BookOpen className="w-20 h-20 text-white opacity-90 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" />
                        </div>
                      )}
                      
                      {/* Badge de cantidad de libros mejorado */}
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full px-4 py-2 shadow-xl border-2 border-white/30">
                        <span className="text-sm font-bold text-white flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4" />
                          {saga.cantidadLibros}
                        </span>
                      </div>
                    </div>

                    {/* Contenido con mejor espaciado */}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                        {saga.nombre}
                      </h3>
                      
                      {/* CTA más atractivo */}
                      <div className="mt-auto pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                        <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 font-semibold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          <span className="text-sm">Ver colección completa</span>
                          <svg 
                            className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Mensaje si no hay sagas */}
        {sagas.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <BookOpen className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-xl text-gray-600 dark:text-gray-400">
              No hay sagas disponibles en este momento
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SagasPage;
