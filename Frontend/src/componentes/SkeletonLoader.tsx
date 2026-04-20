import React from 'react';
import { motion } from 'framer-motion';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="animate-pulse space-y-4">
      {/* Título skeleton */}
      <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
      <div className="h-6 bg-gray-200 rounded-lg w-1/2"></div>
      
      {/* Líneas de texto skeleton */}
      <div className="space-y-3 mt-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="animate-pulse">
        {/* Imagen skeleton */}
        <div className="h-64 sm:h-72 md:h-80 bg-gradient-to-br from-gray-200 to-gray-300"></div>
        
        {/* Contenido skeleton */}
        <div className="p-6 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          
          {/* Rating skeleton */}
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-5 h-5 bg-gray-200 rounded"></div>
            ))}
          </div>
          
          {/* Descripción skeleton */}
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const StatCardSkeleton: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative rounded-2xl p-6 sm:p-8 border border-white/40 shadow-md bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl"
    >
      <div className="animate-pulse flex flex-col items-center justify-center text-center">
        {/* Icono skeleton */}
        <div className="mb-4 w-14 h-14 bg-gray-200 rounded-xl"></div>
        
        {/* Valor skeleton */}
        <div className="h-12 w-24 bg-gray-200 rounded mb-2"></div>
        
        {/* Label skeleton */}
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </div>
    </motion.div>
  );
};
