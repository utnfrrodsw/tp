import React, { useState } from 'react';

interface LibroImagenProps {
  src?: string | null;
  alt: string;
  titulo?: string;
  className?: string;
  fallbackClassName?: string;
}

/**
 * Componente para mostrar imágenes de libros con fallback elegante
 * Si la imagen falla o no existe, muestra un placeholder con el título
 */
export const LibroImagen: React.FC<LibroImagenProps> = ({
  src,
  alt,
  titulo,
  className = '',
  fallbackClassName = ''
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Si no hay src o hubo error, mostrar fallback
  const shouldShowFallback = !src || imageError;

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  if (shouldShowFallback) {
    return (
      <div 
        className={`flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 ${fallbackClassName || className}`}
        title={alt}
      >
        <div className="text-center p-4">
          {/* Icono de libro */}
          <svg 
            className="w-16 h-16 mx-auto mb-2 text-indigo-400 dark:text-indigo-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
            />
          </svg>
          
          {/* Título del libro si está disponible */}
          {titulo && (
            <p className="text-xs font-medium text-indigo-700 dark:text-indigo-300 line-clamp-3 px-2">
              {titulo}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Skeleton loader mientras carga */}
      {isLoading && (
        <div 
          className={`absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700 ${className}`}
        />
      )}
      
      {/* Imagen real */}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading="lazy"
      />
    </div>
  );
};

export default LibroImagen;
