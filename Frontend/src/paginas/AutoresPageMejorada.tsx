import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import AutorCard from '../componentes/AutorCard';
import { API_BASE_URL } from '../config/api.config';
import { searchAutores as searchAutoresAPI } from '../services/autorService';

interface Autor {
  id?: string;
  name: string;
  photo?: string;
  biografia?: string;
  googleBooksId?: string;
  openLibraryKey?: string;
  external?: boolean;
  nombre?: string;
  apellido?: string;
}

type ViewMode = 'grid' | 'list';

const AutoresPage: React.FC = () => {
  const [displayedAutores, setDisplayedAutores] = useState<Autor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalAutores, setTotalAutores] = useState(0);
  const [includeExternal, setIncludeExternal] = useState(true);

  // Búsqueda híbrida (local + APIs externas)
  const fetchAutores = async (searchTerm = '', pageNum = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      let autores;
      let total;
      let totalPagesCount;

      // Si hay término de búsqueda y quiere APIs externas, usar búsqueda híbrida
      if (searchTerm.trim().length >= 2 && includeExternal) {
        console.log('🌐 Búsqueda híbrida con APIs externas:', searchTerm);
        const response = await fetch(
          `${API_BASE_URL}/autor/search?q=${encodeURIComponent(searchTerm)}&includeExternal=true`
        );
        
        if (!response.ok) {
          throw new Error('Error al buscar autores (híbrido)');
        }
        
        const rawData = await response.json();
        // Mapear formato del backend al formato esperado por el frontend
        autores = (rawData || []).map((autor: any) => ({
          id: autor.id ? String(autor.id) : undefined,
          name: autor.name || `${autor.nombre} ${autor.apellido}`.trim(),
          photo: autor.foto,
          biografia: autor.biografia,
          googleBooksId: autor.googleBooksId,
          openLibraryKey: autor.openLibraryKey,
          external: autor.external,
          nombre: autor.nombre,
          apellido: autor.apellido
        }));
        total = autores.length;
        totalPagesCount = 1; // Búsqueda híbrida no tiene paginación
      } else {
        // Sin búsqueda externa o texto corto, usar endpoint paginado normal
        console.log('📚 Búsqueda local:', searchTerm);
        const response = await fetch(
          `${API_BASE_URL}/autor?page=${pageNum}&limit=20&search=${encodeURIComponent(searchTerm)}`
        );
        
        if (!response.ok) {
          throw new Error('Error al cargar autores');
        }
        
        const data = await response.json();
        // Mapear formato del backend al formato esperado por el frontend
        autores = (data.autores || []).map((autor: any) => ({
          id: autor.id ? String(autor.id) : undefined,
          name: autor.name || `${autor.nombre} ${autor.apellido}`.trim(),
          photo: autor.foto,
          biografia: autor.biografia,
          googleBooksId: autor.googleBooksId,
          openLibraryKey: autor.openLibraryKey,
          external: autor.external,
          nombre: autor.nombre,
          apellido: autor.apellido
        }));
        total = data.total || 0;
        totalPagesCount = data.totalPages || 1;
      }
      
      // Reemplazar autores (no acumular como en infinite scroll)
      setDisplayedAutores(autores);
      setTotalPages(totalPagesCount);
      setTotalAutores(total);
      setPage(pageNum);
      
      // Scroll al top al cambiar de página
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setDisplayedAutores([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar autores al inicio
  useEffect(() => {
    fetchAutores('', 1);
  }, []);

  // Debounced search - resetear a página 1
  useEffect(() => {
    if (searchTerm.length >= 2) {
      const timer = setTimeout(() => {
        fetchAutores(searchTerm, 1);
      }, 500);
      return () => clearTimeout(timer);
    } else if (searchTerm === '') {
      fetchAutores('', 1);
    }
  }, [searchTerm]);

  // Recargar búsqueda cuando cambia includeExternal
  useEffect(() => {
    if (searchTerm.trim().length >= 2) {
      fetchAutores(searchTerm, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [includeExternal]);

  // Funciones de navegación de páginas
  const goToPage = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      fetchAutores(searchTerm, pageNum);
    }
  };

  const nextPage = () => {
    if (page < totalPages) {
      goToPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      goToPage(page - 1);
    }
  };

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7; // Máximo de números visibles
    
    if (totalPages <= maxVisible) {
      // Mostrar todos
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Mostrar con elipsis
      if (page <= 4) {
        // Cerca del inicio
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (page >= totalPages - 3) {
        // Cerca del final
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        // En el medio
        pages.push(1);
        pages.push('...');
        for (let i = page - 1; i <= page + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950 dark:to-gray-950 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white/90 dark:bg-slate-900/95 backdrop-blur-lg shadow-lg border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-700 via-blue-600 to-indigo-700 dark:from-cyan-400 dark:via-blue-500 dark:to-indigo-500">
                Autores
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Descubre biografías enriquecidas con Wikipedia y obras indexadas en Google Books
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Barra de búsqueda */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar autores... (ej: García Márquez)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-2.5 pl-11 pr-40 border border-gray-300 dark:border-slate-600 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-500 shadow-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-400 transition-all text-sm"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-400" />
            
            {/* Toggle para búsqueda externa */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              {loading && (
                <div className="w-4 h-4 border-2 border-cyan-500 dark:border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              )}
              <label className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeExternal}
                  onChange={(e) => setIncludeExternal(e.target.checked)}
                  className="w-3.5 h-3.5 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500 dark:focus:ring-cyan-500 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                />
                <span className="hidden lg:inline whitespace-nowrap text-xs">APIs externas</span>
                <span className="lg:hidden text-sm" title="Buscar también en Google Books y OpenLibrary">🌐</span>
              </label>
            </div>
          </div>
        </div>

        {/* Controles de vista e info de paginación */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          {/* Info de resultados */}
          <div className="text-sm text-gray-700 dark:text-slate-200 font-medium">
            {!loading && totalAutores > 0 && (
              <div className="flex flex-col sm:flex-row gap-2">
                <span className="bg-cyan-50 dark:bg-cyan-950/50 px-3 py-1 rounded-full border border-cyan-200 dark:border-cyan-800">
                  Total: <strong>{totalAutores}</strong> autores
                </span>
                <span className="bg-blue-50 dark:bg-blue-950/50 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                  Página <strong>{page}</strong> de <strong>{totalPages}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Toggle vista */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-full p-1 shadow-md">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-full transition-colors ${
              viewMode === 'grid' ? 'bg-cyan-600 dark:bg-cyan-500 text-white' : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
            title="Vista grid"
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-full transition-colors ${
              viewMode === 'list' ? 'bg-cyan-600 dark:bg-cyan-500 text-white' : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
            title="Vista lista"
          >
            <List className="w-5 h-5" />
          </button>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <DotLottieReact
              src="https://lottie.host/6d727e71-5a1d-461e-9434-c9e7eb1ae1d1/IWVmdeMHnT.lottie"
              loop
              autoplay
              style={{ width: 140, height: 140 }}
            />
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-600 dark:text-red-400 text-lg">{error}</p>
          </div>
        )}

        {/* Grid/List de autores */}
        {!loading && displayedAutores.length > 0 && (
          <>
            <div className={`${
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'flex flex-col gap-4'
            }`}>
            {displayedAutores.map((autor, index) => (
              <AutorCard
                key={`${autor.id}-${index}`}
                id={autor.id}
                name={autor.name}
                photo={autor.photo}
                showEnrichedData={true}
                index={index}
                external={autor.external}
                nombre={autor.nombre}
                apellido={autor.apellido}
                googleBooksId={autor.googleBooksId}
                openLibraryKey={autor.openLibraryKey}
                biografia={autor.biografia}
              />
            ))}
          </div>

          {/* Controles de paginación */}
          {totalPages > 1 && (
            <div className="mt-10 mb-6">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {/* Botón Anterior */}
                <button
                  onClick={prevPage}
                  disabled={page === 1}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all ${
                    page === 1
                      ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-600 cursor-not-allowed'
                      : 'bg-white dark:bg-slate-800 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-slate-700 border border-cyan-200 dark:border-cyan-800 shadow-sm'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Anterior</span>
                </button>

                {/* Números de página */}
                {getPageNumbers().map((pageNum, index) => (
                  pageNum === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-2 text-gray-400 dark:text-slate-500">...</span>
                  ) : (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum as number)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                        page === pageNum
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-500 dark:to-blue-600 text-white shadow-lg scale-110'
                          : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:bg-cyan-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 shadow-sm'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                ))}

                {/* Botón Siguiente */}
                <button
                  onClick={nextPage}
                  disabled={page === totalPages}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all ${
                    page === totalPages
                      ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-600 cursor-not-allowed'
                      : 'bg-white dark:bg-slate-800 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-slate-700 border border-cyan-200 dark:border-cyan-800 shadow-sm'
                  }`}
                >
                  <span className="hidden sm:inline">Siguiente</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          </>
        )}

        {/* Empty state */}
        {!loading && displayedAutores.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-slate-300 text-lg mb-4">
              No se encontraron autores para "{searchTerm}"
            </p>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Intenta con otro nombre o explora nuestras categorías destacadas
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutoresPage;
