import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, ChevronUp, Star } from 'lucide-react';

export interface FiltrosRecomendaciones {
  categorias: string[];
  autores: string[];
  ratingMinimo: number;
}

interface RecomendacionesFiltrosProps {
  filtros: FiltrosRecomendaciones;
  onFiltrosChange: (filtros: FiltrosRecomendaciones) => void;
  categoriasDisponibles: string[];
  autoresDisponibles: string[];
}

export const RecomendacionesFiltros: React.FC<RecomendacionesFiltrosProps> = ({
  filtros,
  onFiltrosChange,
  categoriasDisponibles,
  autoresDisponibles
}) => {
  const [abierto, setAbierto] = useState(false);
  const [seccionAbierta, setSeccionAbierta] = useState<'categorias' | 'autores' | null>(null);

  const toggleCategoria = (categoria: string) => {
    const nuevasCategorias = filtros.categorias.includes(categoria)
      ? filtros.categorias.filter(c => c !== categoria)
      : [...filtros.categorias, categoria];
    
    onFiltrosChange({ ...filtros, categorias: nuevasCategorias });
  };

  const toggleAutor = (autor: string) => {
    const nuevosAutores = filtros.autores.includes(autor)
      ? filtros.autores.filter(a => a !== autor)
      : [...filtros.autores, autor];
    
    onFiltrosChange({ ...filtros, autores: nuevosAutores });
  };

  const cambiarRating = (rating: number) => {
    onFiltrosChange({ ...filtros, ratingMinimo: rating });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({ categorias: [], autores: [], ratingMinimo: 0 });
  };

  const filtrosActivos = filtros.categorias.length + filtros.autores.length + (filtros.ratingMinimo > 0 ? 1 : 0);

  return (
    <div className="relative">
      {/* Botón de toggle */}
      <motion.button
        onClick={() => setAbierto(!abierto)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Abrir filtros"
      >
        <Filter className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        <span className="font-semibold text-gray-700 dark:text-gray-300">Filtros</span>
        {filtrosActivos > 0 && (
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {filtrosActivos}
          </span>
        )}
        {abierto ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </motion.button>

      {/* Panel de filtros */}
      <AnimatePresence>
        {abierto && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 right-0 z-50 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-purple-200 dark:border-purple-700 overflow-hidden"
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Filtrar recomendaciones
                </h3>
                {filtrosActivos > 0 && (
                  <button
                    onClick={limpiarFiltros}
                    className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-semibold flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Limpiar
                  </button>
                )}
              </div>

              {/* Rating mínimo */}
              <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Rating mínimo
                </label>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4, 5].map((rating) => (
                    <motion.button
                      key={rating}
                      onClick={() => cambiarRating(rating)}
                      className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
                        filtros.ratingMinimo === rating
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-md scale-110'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={`Filtrar por rating ${rating}+`}
                    >
                      {rating === 0 ? (
                        <span className="text-xs font-bold">Todos</span>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Star className="w-4 h-4" fill="currentColor" />
                          <span className="text-xs font-bold">{rating}+</span>
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Categorías */}
              {categoriasDisponibles.length > 0 && (
                <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setSeccionAbierta(seccionAbierta === 'categorias' ? null : 'categorias')}
                    className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    <span>Categorías ({filtros.categorias.length})</span>
                    {seccionAbierta === 'categorias' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <AnimatePresence>
                    {seccionAbierta === 'categorias' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="flex flex-wrap gap-2 max-h-40 overflow-y-auto"
                      >
                        {categoriasDisponibles.map((categoria) => (
                          <motion.button
                            key={categoria}
                            onClick={() => toggleCategoria(categoria)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                              filtros.categorias.includes(categoria)
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {categoria}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Autores */}
              {autoresDisponibles.length > 0 && (
                <div>
                  <button
                    onClick={() => setSeccionAbierta(seccionAbierta === 'autores' ? null : 'autores')}
                    className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    <span>Autores ({filtros.autores.length})</span>
                    {seccionAbierta === 'autores' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <AnimatePresence>
                    {seccionAbierta === 'autores' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="flex flex-wrap gap-2 max-h-40 overflow-y-auto"
                      >
                        {autoresDisponibles.map((autor) => (
                          <motion.button
                            key={autor}
                            onClick={() => toggleAutor(autor)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                              filtros.autores.includes(autor)
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {autor}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecomendacionesFiltros;
