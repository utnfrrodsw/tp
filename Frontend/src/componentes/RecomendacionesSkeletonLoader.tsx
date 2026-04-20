import React from 'react';
import { motion } from 'framer-motion';

export const RecomendacionesSkeletonLoader: React.FC = () => {
  const skeletonItems = Array.from({ length: 15 }, (_, i) => i);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto px-2"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {skeletonItems.map((index) => (
          <motion.div
            key={index}
            variants={item}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Imagen skeleton */}
            <div className="relative h-72 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
            
            {/* Contenido skeleton */}
            <div className="p-4 space-y-3">
              {/* Título */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
              
              {/* Autores */}
              <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
              
              {/* Badges */}
              <div className="flex gap-2">
                <div className="h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg animate-pulse flex-1" />
                <div className="h-8 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg animate-pulse w-20" />
              </div>
              
              {/* Razones */}
              <div className="space-y-1 pt-2 border-t-2 border-gray-100">
                <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-4/5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecomendacionesSkeletonLoader;
