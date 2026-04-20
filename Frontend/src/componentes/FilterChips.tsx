// src/componentes/FilterChips.tsx
import React from 'react';
import { X, Filter, Star, Calendar, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FilterValue {
  type: 'category' | 'year' | 'rating' | 'language';
  value: string;
  label: string;
}

interface FilterChipsProps {
  filters: FilterValue[];
  onRemoveFilter: (filter: FilterValue) => void;
  onClearAll: () => void;
  onAddFilter: () => void;
  resultCount?: number;
}

const filterConfig = {
  category: {
    icon: BookOpen,
    color: 'blue',
    bgLight: 'bg-blue-100 dark:bg-blue-900/30',
    textLight: 'text-blue-700 dark:text-blue-300',
    borderLight: 'border-blue-300 dark:border-blue-700',
    hoverBg: 'hover:bg-blue-200 dark:hover:bg-blue-800/40',
  },
  year: {
    icon: Calendar,
    color: 'green',
    bgLight: 'bg-green-100 dark:bg-green-900/30',
    textLight: 'text-green-700 dark:text-green-300',
    borderLight: 'border-green-300 dark:border-green-700',
    hoverBg: 'hover:bg-green-200 dark:hover:bg-green-800/40',
  },
  rating: {
    icon: Star,
    color: 'yellow',
    bgLight: 'bg-yellow-100 dark:bg-yellow-900/30',
    textLight: 'text-yellow-700 dark:text-yellow-300',
    borderLight: 'border-yellow-300 dark:border-yellow-700',
    hoverBg: 'hover:bg-yellow-200 dark:hover:bg-yellow-800/40',
  },
  language: {
    icon: Filter,
    color: 'purple',
    bgLight: 'bg-purple-100 dark:bg-purple-900/30',
    textLight: 'text-purple-700 dark:text-purple-300',
    borderLight: 'border-purple-300 dark:border-purple-700',
    hoverBg: 'hover:bg-purple-200 dark:hover:bg-purple-800/40',
  },
};

export const FilterChips: React.FC<FilterChipsProps> = ({
  filters,
  onRemoveFilter,
  onClearAll,
  onAddFilter,
  resultCount,
}) => {
  if (filters.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="flex flex-wrap items-center gap-2 mt-3 pb-2 border-b border-gray-200 dark:border-gray-700"
    >
      {/* Etiqueta "Filtros activos" */}
      <div className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-400">
        <Filter className="w-4 h-4" />
        <span>Filtros:</span>
      </div>

      {/* Chips de filtros */}
      <AnimatePresence mode="popLayout">
        {filters.map((filter, index) => {
          const config = filterConfig[filter.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={`${filter.type}-${filter.value}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.05 }}
              layout
            >
              <div
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                  border transition-all duration-200
                  ${config.bgLight} ${config.textLight} ${config.borderLight}
                  group
                `}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{filter.label}</span>
                <button
                  onClick={() => onRemoveFilter(filter)}
                  className={`ml-1 p-0.5 rounded-full transition-colors ${config.hoverBg}`}
                  aria-label={`Quitar filtro ${filter.label}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Botón "Limpiar todos" */}
      {filters.length > 1 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={onClearAll}
          className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium underline transition-colors"
        >
          Limpiar todos
        </motion.button>
      )}

      {/* Botón "Agregar filtro" */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAddFilter}
        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-dashed border-gray-300 dark:border-gray-600 rounded-full hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
      >
        <Filter className="w-3.5 h-3.5" />
        Agregar filtro
      </motion.button>

      {/* Contador de resultados */}
      {resultCount !== undefined && (
        <div className="ml-auto text-sm text-gray-600 dark:text-gray-400 font-medium">
          {resultCount} {resultCount === 1 ? 'resultado' : 'resultados'}
        </div>
      )}
    </motion.div>
  );
};

// Modal para agregar filtros
interface FilterSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFilter: (filter: FilterValue) => void;
  existingFilters: FilterValue[];
}

export const FilterSelector: React.FC<FilterSelectorProps> = ({
  isOpen,
  onClose,
  onAddFilter,
  existingFilters,
}) => {
  const [selectedType, setSelectedType] = React.useState<FilterValue['type'] | null>(null);

  const categories = [
    'Ficción',
    'No Ficción',
    'Ciencia',
    'Historia',
    'Biografía',
    'Tecnología',
    'Fantasía',
    'Romance',
    'Misterio',
    'Aventura',
  ];

  const yearRanges = [
    { label: '2024-2025', value: '2024-2025' },
    { label: '2020-2023', value: '2020-2023' },
    { label: '2010-2019', value: '2010-2019' },
    { label: '2000-2009', value: '2000-2009' },
    { label: 'Antes de 2000', value: '<2000' },
  ];

  const ratings = [
    { label: '⭐⭐⭐⭐⭐ 5 estrellas', value: '5' },
    { label: '⭐⭐⭐⭐ 4+ estrellas', value: '4+' },
    { label: '⭐⭐⭐ 3+ estrellas', value: '3+' },
  ];

  const handleSelectFilter = (type: FilterValue['type'], value: string, label: string) => {
    // Evitar duplicados
    const exists = existingFilters.some(f => f.type === type && f.value === value);
    if (exists) {
      alert('Este filtro ya está aplicado');
      return;
    }

    onAddFilter({ type, value, label });
    onClose();
    setSelectedType(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 m-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Agregar Filtro
          </h3>

          {!selectedType ? (
            <div className="space-y-2">
              <button
                onClick={() => setSelectedType('category')}
                className="w-full flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
              >
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div className="text-left">
                  <div className="font-semibold text-gray-900 dark:text-gray-100">Categoría</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Ficción, Ciencia, Historia...</div>
                </div>
              </button>

              <button
                onClick={() => setSelectedType('year')}
                className="w-full flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all"
              >
                <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div className="text-left">
                  <div className="font-semibold text-gray-900 dark:text-gray-100">Año de publicación</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">2024-2025, 2020-2023...</div>
                </div>
              </button>

              <button
                onClick={() => setSelectedType('rating')}
                className="w-full flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-yellow-400 dark:hover:border-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all"
              >
                <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <div className="text-left">
                  <div className="font-semibold text-gray-900 dark:text-gray-100">Calificación</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">4+, 3+, 5 estrellas...</div>
                </div>
              </button>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setSelectedType(null)}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4"
              >
                ← Volver
              </button>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {selectedType === 'category' &&
                  categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleSelectFilter('category', cat, cat)}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-900 dark:text-gray-100 transition-colors"
                    >
                      {cat}
                    </button>
                  ))}

                {selectedType === 'year' &&
                  yearRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => handleSelectFilter('year', range.value, range.label)}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-900 dark:text-gray-100 transition-colors"
                    >
                      {range.label}
                    </button>
                  ))}

                {selectedType === 'rating' &&
                  ratings.map((rating) => (
                    <button
                      key={rating.value}
                      onClick={() => handleSelectFilter('rating', rating.value, rating.label)}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 text-gray-900 dark:text-gray-100 transition-colors"
                    >
                      {rating.label}
                    </button>
                  ))}
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full mt-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
