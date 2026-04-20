
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Check, X, Plus, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import { API_BASE_URL } from '../config/api.config';
import { isAdmin } from "../utils/jwtUtils";
import { createSaga } from "../services/sagaService";
import axios from "axios";
import LibroCard from "../componentes/LibroCard";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface Libro {
  id: number;
  titulo: string;
  autores: string[];
  descripcion?: string;
  imagen: string | null;
  enlace: string | null;
  averageRating?: number;
}

interface GoogleBook {
  id: string;
  titulo: string;
  autores: string[];
  descripcion: string | null;
  imagen: string | null;
  enlace: string | null;
}

const CrearSagaAdmin: React.FC = () => {
  const navigate = useNavigate();
  const isDev = import.meta.env.DEV;
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [libros, setLibros] = useState<Libro[]>([]);
  const [googleBooks, setGoogleBooks] = useState<GoogleBook[]>([]);
  const [selectedLibros, setSelectedLibros] = useState<Set<number>>(new Set());
  const [selectedGoogleBooks, setSelectedGoogleBooks] = useState<Set<string>>(new Set());
  const [sagaName, setSagaName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<string>("todos");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>(searchTerm);
  const [finalQuery, setFinalQuery] = useState<string>("");
  const [searchSource, setSearchSource] = useState<'local' | 'google'>('local');
  const [filteredLibros, setFilteredLibros] = useState<Libro[]>([]);
  const [filteredGoogleBooks, setFilteredGoogleBooks] = useState<GoogleBook[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalLibros, setTotalLibros] = useState<number>(0);
  const librosPerPage = 12;

  // Debounce searchTerm -> debouncedSearchTerm
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (!isAdmin()) {
      setIsAuthorized(false);
      navigate("/");
      return;
    }
    setIsAuthorized(true);
  }, [navigate]);

  useEffect(() => {
    const fetchLibros = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/libro`, {
          params: {
            page: currentPage,
            limit: librosPerPage,
            search: debouncedSearchTerm || undefined,
          },
        });

        const { libros: librosData, total, totalPages: pages } = response.data;
        console.log('Libros response:', response.data);
        setLibros(librosData);
        setFilteredLibros(librosData);
        setTotalLibros(total);
        setTotalPages(pages);
      } catch (err) {
        setError("Error al cargar los libros");
      }
    };

    if (isAuthorized && searchSource === 'local') {
      fetchLibros();
    }
  }, [isAuthorized, currentPage, debouncedSearchTerm, searchSource]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, searchSource]);

  useEffect(() => {
    let q = "";
    if (debouncedSearchTerm && debouncedSearchTerm.length) {
      switch (searchFilter) {
        case "titulo":
          q = `intitle:${debouncedSearchTerm}`;
          break;
        case "autor":
          q = `inauthor:${debouncedSearchTerm}`;
          break;
        case "isbn":
          q = `isbn:${debouncedSearchTerm}`;
          break;
        case "tema":
          q = `subject:${debouncedSearchTerm}`;
          break;
        case "todos":
        default:
          q = debouncedSearchTerm;
          break;
      }
    } else {
      q = "subject:fantasy";
    }
    setFinalQuery(q);
  }, [debouncedSearchTerm, searchFilter]);


  useEffect(() => {
    if (searchSource === 'local' && !debouncedSearchTerm) {
      setFilteredLibros(libros);
    } else if (searchSource === 'local' && debouncedSearchTerm) {
      const filtered = libros.filter(
        (libro) =>
          (libro.titulo?.toLowerCase() || "").includes(debouncedSearchTerm.toLowerCase()) ||
          (libro.autores || []).some((autor) =>
            (autor?.toLowerCase() || "").includes(debouncedSearchTerm.toLowerCase())
          )
      );
      setFilteredLibros(filtered);
    } else if (searchSource === 'google') {
      const fetchGoogleBooks = async () => {
        try {
          if (isDev) {
            console.log('[CrearSaga] Buscando en Google Books con query:', finalQuery);
          }
          const response = await axios.get(`${API_BASE_URL}/google-books/buscar?q=${encodeURIComponent(finalQuery)}`);
          const results = response.data;
          if (isDev) {
            console.log('[CrearSaga] Resultados Google Books:', results.length || 0, 'libros');
          }
          setGoogleBooks(results);
          setFilteredGoogleBooks(results);
          setFilteredLibros([]);
        } catch (err) {
          console.error('[CrearSaga] Error searching Google Books:', err);
          setFilteredGoogleBooks([]);
          setFilteredLibros([]);
        }
      };
      // Always fetch when in google mode (uses finalQuery which defaults to 'subject:fantasy')
      fetchGoogleBooks();
    }
  }, [searchTerm, libros, searchSource, finalQuery, debouncedSearchTerm]);

  const handleLibroSelect = (libroId: number) => {
    const newSelected = new Set(selectedLibros);
    if (newSelected.has(libroId)) {
      newSelected.delete(libroId);
    } else {
      newSelected.add(libroId);
    }
    setSelectedLibros(newSelected);
  };

  const handleCreateSaga = async () => {
    if (!sagaName.trim()) {
      setError("El nombre de la saga es requerido");
      return;
    }

    if (selectedLibros.size === 0 && selectedGoogleBooks.size === 0) {
      setError("Debe seleccionar al menos un libro");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }

      const allLibroIds = new Set(selectedLibros);
      for (const googleBookId of selectedGoogleBooks) {
        try {
          const response = await axios.post(`${API_BASE_URL}/google-books/add`, {
            googleBookId
          }, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const addedBook = response.data;
          allLibroIds.add(addedBook.id);
        } catch (err: any) {
          console.error(`Error adding Google Book ${googleBookId}:`, err);
        }
      }

      if (allLibroIds.size === 0) {
        throw new Error("No se pudieron agregar los libros seleccionados");
      }

      await createSaga(
        {
          nombre: sagaName.trim(),
          libroIds: Array.from(allLibroIds),
        },
        token
      );

      setSuccess("¡Saga creada exitosamente!");
      setSagaName("");
      setSelectedLibros(new Set());
      setSelectedGoogleBooks(new Set());

      setTimeout(() => {
        navigate("/sagas");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Error al crear la saga");
    } finally {
      setLoading(false);
    }
  };

  if (isAuthorized === null) {
    return (
      <div className="flex justify-center items-center py-12">
        <DotLottieReact
          src="https://lottie.host/6d727e71-5a1d-461e-9434-c9e7eb1ae1d1/IWVmdeMHnT.lottie"
          loop
          autoplay
          style={{ width: 140, height: 140 }}
        />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center">
          <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-600 mb-2">Acceso Denegado</h1>
          <p className="text-gray-600 dark:text-gray-400">Solo los administradores pueden crear sagas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-700 via-blue-600 to-indigo-700 dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-400">
              Crear Nueva Saga
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Selecciona libros para agruparlos en una nueva saga
          </p>
        </motion.div>

        {/* Saga Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre de la Saga
              </label>
              <input
                type="text"
                value={sagaName}
                onChange={(e) => setSagaName(e.target.value)}
                placeholder="Ej: Harry Potter, El Señor de los Anillos..."
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                disabled={loading}
              />
            </div>
            <button
              onClick={handleCreateSaga}
              disabled={loading || !sagaName.trim() || (selectedLibros.size === 0 && selectedGoogleBooks.size === 0)}
              className={`px-8 py-3 rounded-xl font-semibold text-white flex items-center gap-2 transition-all duration-300 ${
                loading || !sagaName.trim() || (selectedLibros.size === 0 && selectedGoogleBooks.size === 0)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 hover:shadow-lg transform hover:scale-105"
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creando...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Crear Saga
                </>
              )}
            </button>
          </div>

          {/* Selected Books Count */}
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <BookOpen className="w-4 h-4" />
            <span>{selectedLibros.size + selectedGoogleBooks.size} libro{(selectedLibros.size + selectedGoogleBooks.size) !== 1 ? "s" : ""} seleccionado{(selectedLibros.size + selectedGoogleBooks.size) !== 1 ? "s" : ""}</span>
          </div>
        </motion.div>

        {/* Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 flex items-center gap-3"
          >
            <X className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6 flex items-center gap-3"
          >
            <Check className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0" />
            <p className="text-green-700 dark:text-green-300">{success}</p>
          </motion.div>
        )}

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="flex-shrink-0">
                <select
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="px-4 py-4 rounded-3xl border border-slate-200 dark:border-gray-600 shadow-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-800 focus:border-cyan-400 transition-all duration-300 text-gray-700 dark:text-gray-300 font-medium min-w-[120px]"
                >
                  <option value="todos">Todos</option>
                  <option value="titulo">Título</option>
                  <option value="autor">Autor</option>
                  <option value="isbn">ISBN</option>
                  <option value="tema">Tema</option>
                </select>
              </div>

              <div className="w-full max-w-2xl relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                  <svg className="w-5 h-5 text-cyan-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
                    <circle cx="11" cy="11" r="6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <input
                  type="text"
                  placeholder="Buscar libros (ej: tolkien, subject:fantasy, 978014...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 rounded-3xl border border-slate-200 dark:border-gray-600 shadow-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-800 focus:border-cyan-400 transition-all duration-300 text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500"
                />

                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    title="Limpiar búsqueda"
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 text-slate-600 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setSearchSource('local')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  searchSource === 'local'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <BookOpen className="w-4 h-4 inline mr-2" />
                Biblioteca Local
              </button>
              <button
                onClick={() => setSearchSource('google')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  searchSource === 'google'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <Globe className="w-4 h-4 inline mr-2" />
                Google Books
              </button>
            </div>
          </div>
        </motion.div>

        {/* Books Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredLibros.map((libro) => (
            <motion.div
              key={libro.id}
              className={`relative cursor-pointer transition-all duration-300 ${
                selectedLibros.has(libro.id)
                  ? "ring-2 ring-cyan-500 ring-offset-2 scale-105"
                  : "hover:scale-105"
              }`}
              onClick={() => handleLibroSelect(libro.id)}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <LibroCard
                title={libro.titulo}
                authors={libro.autores}
                image={libro.imagen}
                description={libro.descripcion}
                rating={libro.averageRating}
              />

              {/* Selection Indicator */}
              {selectedLibros.has(libro.id) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 bg-cyan-500 text-white rounded-full p-1"
                >
                  <Check className="w-4 h-4" />
                </motion.div>
              )}
            </motion.div>
          ))}

          {filteredGoogleBooks.map((book) => (
            <motion.div
              key={book.id}
              className={`relative cursor-pointer transition-all duration-300 ${
                selectedGoogleBooks.has(book.id)
                  ? "ring-2 ring-green-500 ring-offset-2 scale-105"
                  : "hover:scale-105"
              }`}
              onClick={() => {
                const newSelected = new Set(selectedGoogleBooks);
                if (newSelected.has(book.id)) {
                  newSelected.delete(book.id);
                } else {
                  newSelected.add(book.id);
                }
                setSelectedGoogleBooks(newSelected);
              }}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <LibroCard
                title={book.titulo}
                authors={book.autores}
                image={book.imagen}
                description={book.descripcion || undefined}
                rating={null}
              />

              {/* Google Books Indicator */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 left-2 bg-green-500 text-white rounded-full p-1"
              >
                <Globe className="w-3 h-3" />
              </motion.div>

              {/* Selection Indicator */}
              {selectedGoogleBooks.has(book.id) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1"
                >
                  <Check className="w-4 h-4" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination Controls - Only show for local books */}
        {searchSource === 'local' && totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center mt-8 mb-6"
          >
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  currentPage === 1
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-cyan-500 text-white hover:bg-cyan-600 hover:shadow-lg'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                        currentPage === pageNum
                          ? 'bg-cyan-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentPage === totalPages
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-cyan-500 text-white hover:bg-cyan-600 hover:shadow-lg'
                }`}
              >
                Siguiente →
              </button>
            </div>
          </motion.div>
        )}

        {/* Results Info */}
        {searchSource === 'local' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4"
          >
            Mostrando {filteredLibros.length} de {totalLibros} libros
            {totalPages > 1 && ` (Página ${currentPage} de ${totalPages})`}
          </motion.div>
        )}

        {filteredLibros.length === 0 && filteredGoogleBooks.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">No se encontraron libros que coincidan con tu búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrearSagaAdmin;
