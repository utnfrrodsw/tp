"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, ArrowRight, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { buildApiUrl } from "../utils/apiHelpers";
import { API_BASE_URL } from '../config/api.config';

interface PopularBook {
  id: string;
  libroId?: number; // ID numérico de la base de datos
  titulo: string;
  autores: string[];
  imagen: string;
  categoria?: string;
  averageRating: number;
  reviewCount: number;
}

export const FeaturedContent: React.FC = () => {
  const navigate = useNavigate();
  const [popularBooks, setPopularBooks] = useState<PopularBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getReviewCountFromPayload = (payload: any): number => {
    if (Array.isArray(payload)) return payload.length;
    if (typeof payload?.total === 'number') return payload.total;
    if (Array.isArray(payload?.reviews)) return payload.reviews.length;
    return 0;
  };

  const getReviewsFromPayload = (payload: any): any[] => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.reviews)) return payload.reviews;
    return [];
  };

  // Cargar libros más populares desde el backend
  useEffect(() => {
    const loadPopularBooks = async () => {
      setIsLoading(true);
      try {
        // Traemos el máximo permitido por backend para mejorar la agrupación por libro.
        const response = await fetch(buildApiUrl('/resena/populares?limit=50'));
        
        if (!response.ok) {
          throw new Error('Error fetching popular books');
        }
        
        const data = await response.json();
        
        // La API devuelve { total, showing, reviews: [] }
        const reviewsArray = data.reviews || [];
        
        // Debug: ver un libro de Hardcover si existe
        const hardcoverBook = reviewsArray.find((r: any) => r.libro?.source === 'hardcover');
        if (hardcoverBook) {
          console.log('🔍 Libro de Hardcover encontrado:', JSON.stringify(hardcoverBook.libro, null, 2));
        }
        
        // Agrupar por libro para calcular stats
        const bookMap = new Map<string, {
          libro: any;
          ratings: number[];
          reviewCount: number;
        }>();
        
        reviewsArray.forEach((resena: any) => {
          if (!resena.libro) return;
          if (resena.resenaPadre) return;
          
          const bookId = resena.libro.id?.toString() || resena.libro.externalId;
          if (!bookMap.has(bookId)) {
            bookMap.set(bookId, {
              libro: resena.libro,
              ratings: [],
              reviewCount: 0
            });
          }
          
          const bookData = bookMap.get(bookId)!;
                    const estrellas = Number(resena.estrellas);
                    if (Number.isFinite(estrellas) && estrellas > 0) {
                      bookData.ratings.push(estrellas);
          }
          bookData.reviewCount++;
        });
        
        // Obtener información completa de los libros desde la API de libros
        const booksPromises = Array.from(bookMap.values())
          .map(async ({ libro, ratings, reviewCount }) => {
            let autores: string[] = ['Autor desconocido'];
            let approvedReviewCount = reviewCount;
            let pendingReviewCount = 0;
            
            // 1. Si tiene externalId de Google Books
            if (libro.externalId && libro.source === 'google') {
              try {
                const bookUrl = `${API_BASE_URL}/google-books/${libro.externalId}`;
                const bookResponse = await fetch(bookUrl);
                if (bookResponse.ok) {
                  const bookData = await bookResponse.json();
                  if (bookData.autores && Array.isArray(bookData.autores) && bookData.autores.length > 0) {
                    autores = bookData.autores;
                  }
                }
              } catch (error) {
                console.warn('Error fetching author info from Google Books:', error);
              }
            }
            // 2. Si es de Hardcover (usa externalId como ID de Hardcover)
            else if (libro.externalId && libro.source === 'hardcover') {
              try {
                // Para Hardcover, necesitamos buscar en trending y encontrar el libro por su ID
                const trendingUrl = `${API_BASE_URL}/hardcover/trending`;
                const trendingResponse = await fetch(trendingUrl);
                if (trendingResponse.ok) {
                  const trendingData = await trendingResponse.json();
                  // Buscar el libro en los trending por ID
                  const foundBook = trendingData.books?.find((b: any) => b.id?.toString() === libro.externalId);
                  if (foundBook && foundBook.authors && Array.isArray(foundBook.authors)) {
                    autores = foundBook.authors;
                  }
                }
              } catch (error) {
                console.warn('Error fetching author info from Hardcover:', error);
              }
            }
            
            // 3. Fallback: verificar si tiene autor como objeto con nombre y apellido en la BD
            if (autores[0] === 'Autor desconocido' && libro.autor && typeof libro.autor === 'object' && libro.autor.nombre) {
              const nombreCompleto = `${libro.autor.nombre || ''} ${libro.autor.apellido || ''}`.trim();
              if (nombreCompleto) {
                autores = [nombreCompleto];
              }
            }
            
            // Contadores reales de reseñas por estado (aprobadas + pendientes).
            try {
              const libroDbId = libro.id ? libro.id.toString() : '';
              const libroExternalId = (libro.externalId || '').toString();
              const useDbId = /^\d+$/.test(libroDbId);
              const libroRef = useDbId ? libroDbId : libroExternalId;
              if (libroRef) {
                const sourceQuery = !useDbId && libro.source
                  ? `&libroSource=${encodeURIComponent(libro.source)}`
                  : '';
                const matchQuery = useDbId ? '&libroMatch=id' : '&libroMatch=externalId';
                const approvedUrl = buildApiUrl(`/resena?libroId=${encodeURIComponent(libroRef)}${matchQuery}${sourceQuery}&estado=approved&page=1&limit=100`);
                const pendingUrl = buildApiUrl(`/resena?libroId=${encodeURIComponent(libroRef)}${matchQuery}${sourceQuery}&estado=pendiente&includeFlagged=false&page=1&limit=100`);

                const [approvedResponse, pendingResponse] = await Promise.all([
                  fetch(approvedUrl),
                  fetch(pendingUrl),
                ]);

                if (approvedResponse.ok) {
                  const approvedData = await approvedResponse.json();
                  approvedReviewCount = getReviewCountFromPayload(approvedData);

                  const approvedRatings = getReviewsFromPayload(approvedData)
                    .filter((r: any) => !r?.resenaPadre)
                    .map((r: any) => Number(r?.estrellas))
                    .filter((n: number) => Number.isFinite(n) && n > 0);

                  if (approvedRatings.length > 0) {
                    // Reemplazamos la muestra de "populares" por ratings reales de aprobadas.
                    ratings.length = 0;
                    ratings.push(...approvedRatings);
                  }
                }

                if (pendingResponse.ok) {
                  const pendingData = await pendingResponse.json();
                  pendingReviewCount = getReviewCountFromPayload(pendingData);

                  const pendingRatings = getReviewsFromPayload(pendingData)
                    .filter((r: any) => !r?.resenaPadre)
                    .map((r: any) => Number(r?.estrellas))
                    .filter((n: number) => Number.isFinite(n) && n > 0);

                  if (pendingRatings.length > 0) {
                    ratings.push(...pendingRatings);
                  }
                }
              }
            } catch (statsError) {
              console.warn('Error fetching real review count:', statsError);
            }

            const realReviewCount = approvedReviewCount + pendingReviewCount;

            return {
              id: libro.slug || libro.externalId || libro.id?.toString() || 'unknown',
              libroId: libro.id ? Number(libro.id) : undefined,
              titulo: libro.nombre || libro.titulo || 'Título desconocido',
              autores,
              imagen: libro.imagen || 'https://via.placeholder.com/400x600?text=Sin+Imagen',
              categoria: libro.categoria?.nombre || undefined,
              averageRating: ratings.length > 0 
                ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
                : 0,
              reviewCount: realReviewCount,
            };
          });
        
        const books = await Promise.all(booksPromises);

        const sortedBooks = books
          .sort((a, b) => {
            if (b.reviewCount !== a.reviewCount) {
              return b.reviewCount - a.reviewCount;
            }
            // En empate de cantidad, mejor puntuados primero.
            return b.averageRating - a.averageRating;
          })
          .slice(0, 4);

        setPopularBooks(sortedBooks);
      } catch (error) {
        console.error('Error loading popular books:', error);
        setPopularBooks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPopularBooks();
  }, []);

  const handleCardClick = (bookId: string) => {
    navigate(`/libro/${bookId}`);
  };

  // Skeleton mientras carga
  if (isLoading) {
    return (
      <section 
        className="py-12 md:py-16 bg-white dark:bg-gray-900 transition-colors duration-300"
        aria-label="Libros más comentados"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="space-y-3">
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-64"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-96"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-xl h-96"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Si no hay libros populares, no mostrar nada
  if (popularBooks.length === 0) {
    return null;
  }

  return (
    <section
      className="relative overflow-hidden py-10 md:py-14 bg-gradient-to-br from-sky-50 via-indigo-50/70 to-violet-100/70 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 transition-colors duration-300"
      aria-label="Libros más comentados"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-slate-400/20 via-slate-300/10 to-transparent dark:from-black/35 dark:via-black/20" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-500/25 to-transparent dark:via-slate-200/15" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Lo más comentado
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">
              Libros que están generando conversación en la comunidad
            </p>
          </div>
          <motion.button
            onClick={() => navigate('/libros')}
            whileHover={{ scale: 1.05, x: 3 }}
            whileTap={{ scale: 0.95 }}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 border shadow-sm hover:shadow-md bg-white/95 text-indigo-700 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-800 dark:bg-slate-800/90 dark:text-indigo-200 dark:border-indigo-400/30 dark:hover:bg-slate-700/90 dark:hover:text-indigo-100"
          >
            Explorar más
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Grid de libros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {popularBooks.map((book, index) => (
            <motion.article
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              onClick={() => handleCardClick(book.id)}
              className="bg-white dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl overflow-hidden transition-all duration-500 ease-out flex flex-col border border-gray-300/80 dark:border-gray-700/50 h-full group relative cursor-pointer"
              role="article"
              aria-label={`Libro: ${book.titulo}`}
            >
              {/* Contenedor de imagen con gradiente de fondo */}
              <div className="relative w-full h-64 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-800 dark:via-purple-900/20 dark:to-blue-900/20 overflow-hidden flex-shrink-0">
                {book.imagen ? (
                  <div className="relative h-full flex items-center justify-center p-3">
                    <img
                      src={book.imagen}
                      alt={`Portada de ${book.titulo}`}
                      loading="lazy"
                      className="h-[90%] w-auto object-contain drop-shadow-2xl transform group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-500"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-700 dark:via-purple-900/30 dark:to-blue-900/30 relative overflow-hidden">
                    <div className="text-center p-8 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative z-10">
                      <svg
                        className="w-20 h-20 mx-auto mb-3 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400 transition-colors duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              {/* Información del libro */}
              <div className="p-5 flex flex-col flex-grow relative z-10 bg-white dark:bg-gray-800/95 min-h-[140px]">
                <h3
                  className="text-base font-bold mb-2 line-clamp-2 text-gray-900 dark:text-gray-100 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300 break-words"
                  style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
                  title={book.titulo}
                >
                  {book.titulo}
                </h3>
                <p
                  className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium transition-colors duration-300 leading-relaxed line-clamp-2"
                  style={{
                    overflowWrap: 'break-word',
                    wordBreak: 'break-word'
                  }}
                  title={book.autores.join(", ")}
                >
                  {book.autores.join(", ")}
                </p>
                
                {/* Info extra: categoría y contador de reseñas */}
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-auto pt-3 border-t border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between gap-2">
                  {book.categoria && (
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {book.categoria}
                    </span>
                  )}
                  {book.reviewCount > 0 && (
                    <span className="inline-flex items-center gap-1 font-semibold">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {book.reviewCount} reseñas
                    </span>
                  )}
                </div>
              </div>

              {/* Badge de rating */}
              {book.reviewCount > 0 && (
                <div
                  className="absolute top-4 right-4 z-20"
                  role="status"
                  aria-label={`Calificación: ${book.averageRating.toFixed(1)} de 5 estrellas`}
                >
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-2 rounded-full flex items-center gap-1.5 shadow-xl border-2 border-white/30">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-bold text-sm">{book.averageRating.toFixed(1)}</span>
                  </div>
                </div>
              )}
            </motion.article>
          ))}
        </div>

        {/* Botón móvil */}
        <motion.button
          onClick={() => navigate('/libros')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="sm:hidden w-full mt-8 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold border shadow-sm hover:shadow-md transition-all duration-300 bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50 dark:bg-slate-800 dark:text-indigo-200 dark:border-indigo-400/30 dark:hover:bg-slate-700"
        >
          Explorar más libros
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>

      <img
        src="/images/piupiu%20reseña.png"
        alt="Piu Piu con reseña"
        className="hidden sm:block pointer-events-none select-none absolute -bottom-10 md:-bottom-14 right-24 md:right-36 lg:right-44 w-32 md:w-40 lg:w-44 opacity-95 saturate-125"
        loading="lazy"
      />
    </section>
  );
};
