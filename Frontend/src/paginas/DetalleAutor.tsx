import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config/api.config';
import { 
  ArrowLeft, 
  BookOpen, 
  Star, 
  MessageCircle,
  UserCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  buscarAutorEnGoogleBooks, 
  buscarFotoAutor,
  type GoogleBook
} from '../services/googleBooksAutorService';
import { createGoogleBookSlug } from '../utils/slugUtils';

interface AutorDetalle {
  id: number;
  nombre: string;
  apellido: string;
  foto?: string;
  biografia?: string; // Nueva: biografía de APIs externas
  googleBooksId?: string; // Nueva: ID de Google Books
  openLibraryKey?: string; // Nueva: Key de OpenLibrary
  createdAt: string;
  updatedAt?: string;
}

interface LibroPopular {
  id: number;
  nombre: string;
  imagen?: string;
  totalResenas: number;
}

interface EstadisticasAutor {
  autorId: number;
  nombreCompleto: string;
  estadisticas: {
    totalLibros: number;
    totalResenas: number;
    promedioCalificacion: number;
    librosMasPopulares: LibroPopular[];
  };
}

const DetalleAutor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [autor, setAutor] = useState<AutorDetalle | null>(null);
  const [estadisticas, setEstadisticas] = useState<EstadisticasAutor | null>(null);
  const [biografia, setBiografia] = useState<string>('');
  const [bioExpanded, setBioExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingBio, setLoadingBio] = useState(true);
  const [error, setError] = useState('');
  
  // Estados para Google Books
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [fotoReal, setFotoReal] = useState<string | null>(null);
  const [librosAdicionales, setLibrosAdicionales] = useState<GoogleBook[]>([]);

  useEffect(() => {
    if (id) {
      fetchAutorData();
    }
  }, [id]);

  const fetchAutorData = async () => {
    try {
      setLoading(true);
      
      // Detectar si el ID es numérico o un nombre
      const isNumericId = !isNaN(Number(id));
      
      let autorData;
      let nombreCompleto: string;

      if (isNumericId) {
        // Caso 1: ID numérico - buscar en BD
        const autorRes = await fetch(`${API_BASE_URL}/autor/${id}`);
        if (!autorRes.ok) throw new Error('Autor no encontrado');
        autorData = await autorRes.json();
        setAutor(autorData);
        nombreCompleto = `${autorData.nombre} ${autorData.apellido}`;

        // Fetch estadísticas solo si tenemos un ID numérico válido
        try {
          const statsRes = await fetch(`${API_BASE_URL}/autor/${id}/stats`);
          if (statsRes.ok) {
            const statsData = await statsRes.json();
            setEstadisticas(statsData);
          }
        } catch (err) {
          console.warn('No se pudieron cargar las estadísticas:', err);
        }
      } else {
        // Caso 2: Nombre de autor - buscar en APIs externas
        nombreCompleto = decodeURIComponent(id || '');
        console.log('🔍 Buscando autor por nombre:', nombreCompleto);
        
        // Buscar primero en la BD por si existe
        try {
          const searchRes = await fetch(
            `${API_BASE_URL}/autor/search?q=${encodeURIComponent(nombreCompleto)}&includeExternal=false`
          );
          
          if (searchRes.ok) {
            const autores = await searchRes.json();
            const autorEncontrado = autores.find((a: any) => {
              const nombreAutor = `${a.nombre} ${a.apellido}`.trim().toLowerCase();
              return nombreAutor === nombreCompleto.toLowerCase();
            });
            
            if (autorEncontrado) {
              // Redirigir a la URL con ID numérico
              navigate(`/autores/${autorEncontrado.id}`, { replace: true });
              return;
            }
          }
        } catch (err) {
          console.warn('Error buscando autor en BD:', err);
        }

        // Si no está en BD, crear un objeto temporal para mostrar info de APIs externas
        autorData = {
          id: 0, // ID temporal
          nombre: nombreCompleto.split(' ')[0] || '',
          apellido: nombreCompleto.split(' ').slice(1).join(' ') || '',
          createdAt: new Date().toISOString(),
        };
        setAutor(autorData);
      }

      // Si el autor tiene biografía de las APIs, usarla directamente
      if (autorData.biografia) {
        setBiografia(autorData.biografia);
        setLoadingBio(false);
      } else {
        // Fetch biografía de Wikipedia como fallback
        fetchBiografia(nombreCompleto);
      }

      // Si el autor tiene foto de las APIs, usarla
      if (autorData.foto) {
        setFotoReal(autorData.foto);
      }

      // Fetch datos según el tipo de autor
      if (isNumericId) {
        // Autor local: buscar sus libros en la BD
        fetchLibrosLocales(Number(id));
      } else {
        // Autor externo: buscar en Google Books
        fetchGoogleBooksData(nombreCompleto);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar autor');
      setLoading(false);
    }
  };

  const fetchLibrosLocales = async (autorId: number) => {
    try {
      setLoadingGoogle(true);
      
      // Buscar libros del autor en la BD local
      const response = await fetch(`${API_BASE_URL}/libro?autorId=${autorId}`);
      
      if (response.ok) {
        const data = await response.json();
        // El endpoint devuelve { libros: [...], total, ... }
        const librosData = data.libros || [];
        
        // Convertir libros locales al formato GoogleBook para reutilizar la UI
        const librosFormateados: GoogleBook[] = librosData.map((libro: any) => ({
          id: libro.slug || libro.id.toString(),
          titulo: libro.titulo,
          autores: libro.autores || [],
          descripcion: '',
          imagen: libro.imagen || null,
          portada: libro.imagen || null,
          categoria: '',
          fechaPublicacion: '',
          enlace: `/libro/${libro.slug || libro.id}`,
          source: 'bookcode',
          isLocal: true // Marca para distinguir libros locales
        }));
        
        setLibrosAdicionales(librosFormateados);
      }
      
      setLoadingGoogle(false);
    } catch (err) {
      console.error('Error al cargar libros locales:', err);
      setLoadingGoogle(false);
    }
  };

  const fetchGoogleBooksData = async (nombreCompleto: string) => {
    try {
      setLoadingGoogle(true);
      
      // Buscar foto del autor y sus libros en Google Books en paralelo
      const [foto, googleData] = await Promise.all([
        buscarFotoAutor(nombreCompleto),
        buscarAutorEnGoogleBooks(nombreCompleto, 40)
      ]);
      
      if (foto) {
        setFotoReal(foto);
      }
      
      if (googleData && googleData.libros) {
        // Mostrar todos los libros de Google Books
        setLibrosAdicionales(googleData.libros);
      }
      
      setLoadingGoogle(false);
    } catch (err) {
      console.error('Error fetching Google Books data:', err);
      setLoadingGoogle(false);
    }
  };

  const fetchBiografia = async (nombreCompleto: string) => {
    try {
      setLoadingBio(true);
      
      // Verificar cache (24h)
      const cacheKey = `bio_${id}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { bio, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;
        if (age < 24 * 60 * 60 * 1000) { // 24 horas
          setBiografia(bio);
          setLoadingBio(false);
          return;
        }
      }

      // Llamar a Wikipedia API
      const response = await fetch(
        `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(nombreCompleto)}`
      );

      if (response.ok) {
        const data = await response.json();
        const bio = data.extract || 'No se encontró biografía disponible.';
        setBiografia(bio);
        
        // Guardar en cache
        localStorage.setItem(cacheKey, JSON.stringify({
          bio,
          timestamp: Date.now()
        }));
      } else {
        setBiografia('No se encontró biografía disponible en Wikipedia.');
      }
    } catch (err) {
      console.error('Error fetching biografía:', err);
      setBiografia('No se pudo cargar la biografía.');
    } finally {
      setLoadingBio(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative w-4 h-4">
            <Star className="absolute w-4 h-4 text-yellow-400" />
            <div className="absolute overflow-hidden w-1/2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star key={i} className="w-4 h-4 text-gray-300" />
        );
      }
    }
    return stars;
  };

  const getAvatarUrl = (nombre: string, apellido: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre + ' ' + apellido)}&size=256&background=9333ea&color=fff&bold=true&format=png`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-purple-500 dark:border-purple-400 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 dark:text-gray-300 font-medium">Cargando información del autor...</p>
        </div>
      </div>
    );
  }

  if (error || !autor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md"
        >
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Autor no encontrado</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'No pudimos encontrar este autor en la base de datos.'}</p>
          <button
            onClick={() => navigate('/autores')}
            className="px-6 py-3 bg-purple-600 dark:bg-purple-500 text-white rounded-xl hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors font-medium shadow-lg hover:shadow-xl"
          >
            Volver a Autores
          </button>
        </motion.div>
      </div>
    );
  }

  const nombreCompleto = `${autor.nombre} ${autor.apellido}`;
  const bioTruncated = biografia.length > 300;
  const displayBio = bioExpanded || !bioTruncated ? biografia : biografia.substring(0, 300) + '...';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header con botón volver */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/autores')}
          className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 mb-8 group transition-colors"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Volver a Autores</span>
        </motion.button>

        {/* Sección principal: Foto y Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden mb-8"
        >
          <div className="md:flex">
            {/* Foto del autor */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="md:w-1/3 bg-gradient-to-br from-purple-100 via-pink-100 to-purple-200 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-purple-900/30 flex items-center justify-center p-12 relative overflow-hidden"
            >
              {/* Decorative circles */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-purple-200 dark:bg-purple-700/30 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-pink-200 dark:bg-pink-700/30 rounded-full translate-x-1/3 translate-y-1/3 opacity-50"></div>
              
              <motion.img
                whileHover={{ scale: 1.05 }}
                src={fotoReal || autor.foto || getAvatarUrl(autor.nombre, autor.apellido)}
                alt={nombreCompleto}
                className="w-64 h-64 rounded-full object-cover shadow-2xl border-8 border-white relative z-10"
              />
            </motion.div>

            {/* Información básica */}
            <div className="md:w-2/3 p-8 md:p-10">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                  {nombreCompleto}
                </h1>
              </motion.div>

              {/* Estadísticas */}
              {estadisticas && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
                >
                  {/* Total Libros */}
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <BookOpen className="w-10 h-10 text-white" />
                      <span className="text-4xl font-bold text-white">
                        {librosAdicionales.length > 0 && (librosAdicionales[0] as any).isLocal
                          ? estadisticas.estadisticas.totalLibros
                          : estadisticas.estadisticas.totalLibros + librosAdicionales.length
                        }
                      </span>
                    </div>
                    <p className="text-sm text-blue-100 font-semibold">Libros Publicados</p>
                    {librosAdicionales.length > 0 && (librosAdicionales[0] as any).isLocal && (
                      <p className="text-xs text-blue-100 mt-2 opacity-90">
                        Todos en la base de datos
                      </p>
                    )}
                    {librosAdicionales.length > 0 && !(librosAdicionales[0] as any).isLocal && (
                      <p className="text-xs text-blue-100 mt-2 opacity-90">
                        {estadisticas?.estadisticas.totalLibros || 0} en BD + {librosAdicionales.length} en Google Books
                      </p>
                    )}
                  </motion.div>

                  {/* Promedio Calificación */}
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex gap-0.5">
                        {renderStars(estadisticas.estadisticas.promedioCalificacion)}
                      </div>
                      <span className="text-4xl font-bold text-white">
                        {estadisticas.estadisticas.promedioCalificacion.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-sm text-yellow-100 font-semibold">Calificación Promedio</p>
                  </motion.div>

                  {/* Total Reseñas */}
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <MessageCircle className="w-10 h-10 text-white" />
                      <span className="text-4xl font-bold text-white">
                        {estadisticas.estadisticas.totalResenas}
                      </span>
                    </div>
                    <p className="text-sm text-purple-100 font-semibold">Reseñas Totales</p>
                  </motion.div>
                </motion.div>
              )}

              {/* Biografía */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-600"
              >
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  Biografía
                </h2>
                {loadingBio ? (
                  <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-purple-500 dark:border-purple-400 border-t-transparent rounded-full"
                    />
                    <span>Cargando biografía desde Wikipedia...</span>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">{displayBio}</p>
                    {bioTruncated && (
                      <button
                        onClick={() => setBioExpanded(!bioExpanded)}
                        className="mt-3 flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium transition-colors text-sm"
                      >
                        {bioExpanded ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            Ver menos
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            Ver más
                          </>
                        )}
                      </button>
                    )}
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Libros de Google Books */}
        {librosAdicionales.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800/90 rounded-3xl shadow-2xl p-8 border-2 border-purple-200 dark:border-purple-700/50"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  Libros de {autor?.nombre} {autor?.apellido}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {librosAdicionales.length} {librosAdicionales.length === 1 ? 'libro encontrado' : 'libros encontrados'}
                  {librosAdicionales.length > 0 && (librosAdicionales[0] as any).isLocal ? ' en la base de datos' : ' en Google Books'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {librosAdicionales.map((libro, index) => (
                <motion.div
                  key={libro.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="group"
                >
                  <Link
                    to={(libro as any).isLocal 
                      ? `/libro/${libro.id}` 
                      : `/libro/${createGoogleBookSlug({
                          titulo: libro.titulo,
                          id: libro.id
                        })}`
                    }
                    className="block bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-400 dark:hover:border-purple-500"
                  >
                    {libro.portada ? (
                      <div className="relative overflow-hidden">
                        <img
                          src={libro.portada}
                          alt={libro.titulo}
                          className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ) : (
                      <div className="w-full h-56 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
                        <BookOpen className="w-16 h-16 text-blue-300 dark:text-blue-400" />
                      </div>
                    )}
                    <div className="p-3">
                      <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm mb-1 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors min-h-[2.5rem]">
                        {libro.titulo}
                      </h3>
                      <div className="flex items-center gap-2">
                        {libro.fechaPublicacion && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium bg-gray-100 dark:bg-gray-600 rounded-full px-2 py-1">
                            {new Date(libro.fechaPublicacion).getFullYear()}
                          </p>
                        )}
                        {libro.calificacion && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs text-gray-600 dark:text-gray-300 font-semibold">
                              {libro.calificacion.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Loading state para Google Books */}
            {loadingGoogle && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 mt-6">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 dark:bg-gray-600 h-56 rounded-xl mb-2" />
                    <div className="bg-gray-200 dark:bg-gray-600 h-4 rounded mb-1" />
                    <div className="bg-gray-200 dark:bg-gray-600 h-3 rounded w-2/3" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Sin libros */}
        {librosAdicionales.length === 0 && !loading && !loadingGoogle && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-16 text-center"
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">No se encontraron libros</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              No pudimos encontrar libros de este autor en Google Books. 
              Intenta buscar manualmente o verifica el nombre del autor.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DetalleAutor;
