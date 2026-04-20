import React, { useState, useEffect, useRef } from 'react';

interface LibroCardProps {
  title: string;
  authors?: string[];
  image: string | null;
  description?: string;
  extraInfo?: string | React.ReactNode;
  rating?: number | null;
}

const LibroCard: React.FC<LibroCardProps> = ({ title, authors, image, extraInfo, rating }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [shouldLoadImage, setShouldLoadImage] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Lazy loading con Intersection Observer
  useEffect(() => {
    if (!cardRef.current || !image) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoadImage(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '50px' } // Cargar cuando esté a 50px de ser visible
    );

    observer.observe(cardRef.current);

    return () => observer.disconnect();
  }, [image]);

  return (
    <article 
      ref={cardRef}
      className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-500 ease-out flex flex-col border border-gray-200/50 dark:border-gray-700/50 h-full group relative animate-fadeIn"
      role="article"
      aria-label={`Libro: ${title}`}
    >
      {/* Contenedor de imagen mejorado */}
      <div className="relative w-full h-64 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-purple-900/20 dark:to-blue-900/20 overflow-hidden flex-shrink-0">
        {image && !imageError && shouldLoadImage ? (
          <>
            {/* Fondo blur con colores de la portada */}
            {imageLoaded && (
              <div
                className="absolute inset-0 scale-150 blur-2xl opacity-85 dark:opacity-75"
                style={{
                  backgroundImage: `url(${image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            )}
            {/* Skeleton loader mientras carga la imagen */}
            {!imageLoaded && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]" aria-label="Cargando imagen"></div>
            )}
            <div className="relative h-full flex items-center justify-center p-3">
              <img 
                src={image} 
                alt={`Portada de ${title}`}
                loading="lazy"
                className={`h-[90%] w-auto object-contain drop-shadow-2xl transform group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-500 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            </div>
          </>
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-700 dark:via-purple-900/30 dark:to-blue-900/30 relative overflow-hidden"
            role="img"
            aria-label="Imagen no disponible"
          >
            {/* Patrón decorativo de fondo */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full" 
                   style={{
                     backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                     backgroundSize: '30px 30px'
                   }} 
              />
            </div>
            <div className="text-center p-8 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative z-10">
              <svg 
                className="w-20 h-20 mx-auto mb-3 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400 transition-colors duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow relative z-10 bg-white/95 dark:bg-gray-800/95 min-h-[160px]">
        <h3 
          className="text-base font-bold mb-2 line-clamp-2 text-gray-900 dark:text-gray-100 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300 break-words" 
          style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
          title={title}
        >
          {title}
        </h3>
        <p 
          className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium transition-colors duration-300 leading-relaxed"
          style={{ 
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            overflowWrap: 'break-word',
            wordBreak: 'break-word'
          }}
          title={authors?.length ? authors.join(", ") : "Autor desconocido"}
        >
          {authors?.length ? authors.join(", ") : "Autor desconocido"}
        </p>
        {extraInfo && (
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-auto pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
            {typeof extraInfo === 'string' ? <p>{extraInfo}</p> : extraInfo}
          </div>
        )}
      </div>

      {/* Badge de rating mejorado */}
      {rating !== undefined && rating !== null && rating > 0 && (
        <div 
          className="absolute top-4 right-4 z-20"
          role="status"
          aria-label={`Calificación: ${rating.toFixed(1)} de 5 estrellas`}
        >
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-2 rounded-full flex items-center gap-1.5 shadow-xl border-2 border-white/30">
            <svg 
              className="w-4 h-4" 
              fill="currentColor" 
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-bold text-sm">{rating.toFixed(1)}</span>
          </div>
        </div>
      )}
    </article>
  );
};

export default LibroCard;
