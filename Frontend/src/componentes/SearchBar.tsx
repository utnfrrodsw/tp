import React, { useState, useEffect, useRef } from 'react';
import { Search, Book, User, X, Loader2, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '../hooks/useDebounce';
import { searchBooksAutocomplete, GoogleBooksVolume } from '../services/googleBooksService';

interface SearchItem {
  id: string;
  title: string;
  type: 'book' | 'author' | 'saga';
  author?: string;
  books?: number;
  year?: number;
  image?: string;
}

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  database?: SearchItem[];
  className?: string;
  disableSuggestions?: boolean;
}

const mockDatabase: SearchItem[] = [
  { id: '1', title: 'Cien años de soledad', type: 'book', author: 'Gabriel García Márquez', year: 1967 },
  { id: '2', title: 'Don Quijote de la Mancha', type: 'book', author: 'Miguel de Cervantes', year: 1605 },
  { id: '3', title: 'El amor en los tiempos del cólera', type: 'book', author: 'Gabriel García Márquez', year: 1985 },
  { id: '4', title: 'La casa de los espíritus', type: 'book', author: 'Isabel Allende', year: 1982 },
  { id: '5', title: 'Rayuela', type: 'book', author: 'Julio Cortázar', year: 1963 },
  { id: '6', title: 'Gabriel García Márquez', type: 'author', books: 15, year: 1927 },
  { id: '7', title: 'Isabel Allende', type: 'author', books: 23, year: 1942 },
  { id: '8', title: 'Julio Cortázar', type: 'author', books: 18, year: 1914 },
];

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Buscar libros, autores...',
  onSearch,
  database = mockDatabase,
  className = '',
  disableSuggestions = false,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Debounce del query para evitar demasiadas llamadas a la API
  const debouncedQuery = useDebounce(query, 300);

  // Búsquedas populares/trending
  const trendingSearches = [
    'Cien años de soledad',
    'El principito',
    'Harry Potter',
    'Don Quijote',
  ];

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length > 2 && !disableSuggestions) {
        setIsLoading(true);
        try {
          // Buscar en Google Books API
          const results = await searchBooksAutocomplete(debouncedQuery, 6);
          
          const googleSuggestions: SearchItem[] = results.map((book: GoogleBooksVolume) => ({
            id: book.id,
            title: book.volumeInfo.title,
            type: 'book' as const,
            author: book.volumeInfo.authors?.[0] || 'Autor desconocido',
            year: book.volumeInfo.publishedDate ? new Date(book.volumeInfo.publishedDate).getFullYear() : undefined,
            image: book.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:'),
          }));

          // Combinar con resultados locales si existen
          const localResults = database
            .filter(
              (item) =>
                (item.title?.toLowerCase() || '').includes(debouncedQuery.toLowerCase()) ||
                (item.author?.toLowerCase() || '').includes(debouncedQuery.toLowerCase())
            )
            .slice(0, 2);

          setSuggestions([...googleSuggestions, ...localResults].slice(0, 8));
          setIsOpen(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          // Fallback a búsqueda local
          const filtered = database
            .filter(
              (item) =>
                (item.title?.toLowerCase() || '').includes(debouncedQuery.toLowerCase()) ||
                (item.author?.toLowerCase() || '').includes(debouncedQuery.toLowerCase())
            )
            .slice(0, 8);
          setSuggestions(filtered);
          setIsOpen(filtered.length > 0);
        } finally {
          setIsLoading(false);
        }
      } else if (debouncedQuery.length === 0) {
        setSuggestions([]);
        setIsOpen(false);
      }
      setSelectedIndex(-1);
    };

    fetchSuggestions();
  }, [debouncedQuery, database, disableSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0) {
        handleSelect(suggestions[selectedIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSelect = (item: SearchItem) => {
    setQuery(item.title);
    setIsOpen(false);
    if (onSearch) onSearch(item.title);
    if (item.type === 'book') window.location.href = `/libro/${item.id}`;
  };

  const handleSearch = () => {
    if (onSearch) onSearch(query);
    setIsOpen(false);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div
      ref={searchRef}
      className={`relative w-full max-w-2xl mx-auto ${className}`}
    >
      <motion.div 
        className="relative"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-20 blur-lg group-hover:opacity-30 transition duration-300"></div>
        
        {/* Search icon con animación */}
        <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none z-10">
          <motion.div
            animate={{ 
              scale: query.length > 0 ? [1, 1.1, 1] : 1,
              rotate: isLoading ? 360 : 0
            }}
            transition={{ 
              scale: { duration: 0.3 },
              rotate: { duration: 1, repeat: isLoading ? Infinity : 0, ease: "linear" }
            }}
          >
            <Search className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 dark:text-blue-400" />
          </motion.div>
        </div>

        {/* Input con diseño mejorado */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="relative block w-full pl-12 sm:pl-14 pr-14 sm:pr-16 py-4 sm:py-5 
                     border-2 border-gray-200 dark:border-gray-700 
                     rounded-2xl 
                     text-gray-900 dark:text-gray-100 
                     placeholder-gray-400 dark:placeholder-gray-500
                     bg-white/90 dark:bg-gray-800/90 backdrop-blur-md
                     focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 
                     focus:border-blue-500 dark:focus:border-blue-400
                     text-base sm:text-lg font-medium
                     shadow-xl shadow-blue-500/10 dark:shadow-blue-400/10
                     hover:shadow-2xl hover:shadow-blue-500/20 dark:hover:shadow-blue-400/20
                     transition-all duration-300
                     group"
          placeholder={placeholder}
          aria-autocomplete="list"
          aria-controls="search-results"
          aria-activedescendant={selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        />

        {/* Botones de acción con mejor diseño */}
        <div className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center gap-2">
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 dark:text-blue-400 animate-spin" />
              </motion.div>
            )}
            {query && !isLoading && (
              <motion.button
                key="clear"
                onClick={clearSearch}
                aria-label="Borrar búsqueda"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-2 transition-colors"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {!disableSuggestions && isOpen && (
          <motion.div
            id="search-results"
            role="listbox"
            className="absolute z-50 w-full mt-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Header con contador mejorado */}
            {suggestions.length > 0 && (
              <div className="px-5 py-3 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/40 dark:via-indigo-900/40 dark:to-purple-900/40 border-b-2 border-blue-100 dark:border-blue-800/50">
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  {suggestions.length} resultado{suggestions.length !== 1 ? 's' : ''} encontrado{suggestions.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}

            {/* Sugerencias con diseño mejorado */}
            <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 dark:scrollbar-thumb-blue-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
              {suggestions.length > 0 ? (
                suggestions.map((item, index) => (
                  <motion.div
                    key={item.id}
                    id={`suggestion-${index}`}
                    role="option"
                    aria-selected={selectedIndex === index}
                    onClick={() => handleSelect(item)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                    whileHover={{ scale: 1.01, x: 4 }}
                    className={`px-5 py-4 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 flex items-center gap-4 transition-all duration-200 ${
                      selectedIndex === index 
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/40 border-l-4 border-l-blue-500 shadow-sm' 
                        : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 dark:hover:from-gray-700/50 dark:hover:to-blue-900/20 border-l-4 border-l-transparent'
                    }`}
                  >
                    {/* Imagen de portada o ícono mejorado */}
                    <div className="flex-shrink-0">
                      {item.image ? (
                        <div className="relative">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-12 h-16 object-cover rounded-lg shadow-md ring-2 ring-gray-200 dark:ring-gray-600"
                            onError={(e) => {
                              // Fallback si la imagen falla
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        </div>
                      ) : null}
                      <div className={item.image ? 'hidden' : 'flex items-center justify-center w-12 h-16 rounded-lg bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900/50 dark:via-indigo-900/50 dark:to-purple-900/50 shadow-md ring-2 ring-blue-200 dark:ring-blue-700'}>
                        {item.type === 'book' ? (
                          <Book className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        ) : item.type === 'author' ? (
                          <User className="w-6 h-6 text-green-600 dark:text-green-400" />
                        ) : null}
                      </div>
                    </div>

                    {/* Información mejorada */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 dark:text-gray-100 truncate text-base">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1 flex items-center gap-1">
                        {item.type === 'book' && item.author && `por ${item.author}`}
                        {item.type === 'author' && item.books && `${item.books} libros`}
                        {item.year && item.type !== 'saga' && (
                          <span className="text-gray-400 dark:text-gray-500">• {item.year}</span>
                        )}
                      </p>
                    </div>

                    {/* Badge de tipo mejorado */}
                    <div className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm ${
                      item.type === 'book' 
                        ? 'bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/60 dark:to-indigo-900/60 text-blue-700 dark:text-blue-300 ring-1 ring-blue-300 dark:ring-blue-700' 
                        : 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/60 dark:to-emerald-900/60 text-green-700 dark:text-green-300 ring-1 ring-green-300 dark:ring-green-700'
                    }`}>
                      {item.type === 'book' ? 'Libro' : 'Autor'}
                    </div>
                  </motion.div>
                ))
              ) : query.length > 0 && !isLoading ? (
                <div className="px-5 py-12 text-center text-gray-500 dark:text-gray-400">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                    <Search className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-base font-semibold mb-1">No se encontraron resultados</p>
                  <p className="text-sm">Intenta con otro término de búsqueda</p>
                </div>
              ) : null}
            </div>

            {/* Footer con búsquedas populares mejorado */}
            {query.length === 0 && (
              <div className="px-5 py-4 bg-gradient-to-r from-gray-50 to-blue-50/30 dark:from-gray-800/50 dark:to-blue-900/10 border-t-2 border-gray-200 dark:border-gray-700">
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  Búsquedas populares
                </p>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((term) => (
                    <motion.button
                      key={term}
                      onClick={() => {
                        setQuery(term);
                        inputRef.current?.focus();
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-white dark:bg-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      {term}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
