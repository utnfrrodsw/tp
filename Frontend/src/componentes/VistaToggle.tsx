import React from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, List } from 'lucide-react';

export type VistaRecomendaciones = 'grid' | 'lista';

interface VistaToggleProps {
  vista: VistaRecomendaciones;
  onVistaChange: (vista: VistaRecomendaciones) => void;
}

export const VistaToggle: React.FC<VistaToggleProps> = ({ vista, onVistaChange }) => {
  return (
    <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-xl shadow-md border-2 border-purple-200 dark:border-purple-700 p-1">
      <motion.button
        onClick={() => onVistaChange('grid')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
          vista === 'grid'
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Vista en cuadrícula"
      >
        <LayoutGrid className="w-5 h-5" />
        <span className="font-semibold text-sm hidden sm:inline">Grid</span>
      </motion.button>
      
      <motion.button
        onClick={() => onVistaChange('lista')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
          vista === 'lista'
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Vista en lista"
      >
        <List className="w-5 h-5" />
        <span className="font-semibold text-sm hidden sm:inline">Lista</span>
      </motion.button>
    </div>
  );
};

export default VistaToggle;
