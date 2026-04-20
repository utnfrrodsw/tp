import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Book, User, Tag, Clock, CheckCircle, Eye, Loader, Check, X, AlertCircle } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { listaService, Lista, ContenidoLista } from '../services/listaService';
import { obtenerFavoritos } from '../services/favoritosService';
import toast, { Toaster } from 'react-hot-toast';
import { LISTA_NOMBRES, LISTA_TIPOS } from '../constants/listas';

interface LibroFavorito {
  id: number; // ✅ Volvemos a usar 'number' como el tipo del ID.
  titulo: string;
  autores: string[];
  categoria: string;
  rating: number;
  imagen: string;
  estados: ('leido' | 'ver-mas-tarde' | 'pendiente' | 'favorito')[]; // ✅ CAMBIO CLAVE: de 'estado' a 'estados'
  fechaAgregado: string;
  externalId?: string;
}

interface AutorFavorito {
  id: number;
  nombre: string;
  libros: number;
  imagen?: string; // Opcional: no mostraremos imagen predeterminada
  fechaAgregado: string;
}

interface CategoriaFavorita {
  id: number;
  nombre: string;
  librosCount: number;
  color: string;
  fechaAgregado: string;
}



export const FavoritosPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'libros' | 'autores' | 'categorias'>('libros');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [listas, setListas] = useState<Lista[]>([]);
  const [librosFavoritos, setLibrosFavoritos] = useState<LibroFavorito[]>([]);
  const [autoresFavoritos, setAutoresFavoritos] = useState<AutorFavorito[]>([]);
  const [categoriasFavoritas, setCategoriasFavoritas] = useState<CategoriaFavorita[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingBookAction, setUpdatingBookAction] = useState<{bookId: number, action: string} | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
        // ✅ Optimización: Hacer las llamadas en paralelo pero con timeout
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 10000)
        );
        
        const [favoritos, allContenidos, userListas] = await Promise.race([
          Promise.all([
            obtenerFavoritos(),
            listaService.getAllUserContenido(),
            listaService.getUserListas(),
          ]),
          timeoutPromise
        ]) as [any[], ContenidoLista[], Lista[]];

        // ======================= DEBUGGING =======================
        console.log("DATOS DE LISTAS (allContenidos):", allContenidos);
        console.log("DATOS DE FAVORITOS (favoritos):", favoritos);
        // =========================================================

        setListas(userListas);

        // ✅ El mapa ahora guardará un array de estados, autores como array y el rating consolidado
        const librosMap = new Map<number, { libroData: any, autores: string[], estados: Set<string>, fecha: string, rating: number }>();

        // 1. PROCESAR LIBROS DE LISTAS (Acumulando estados)
        allContenidos.forEach(contenido => {
            const libroId = contenido.libro.id;
            const estado = contenido.lista.tipo === 'read' ? 'leido' :
                           contenido.lista.tipo === 'to_read' ? 'ver-mas-tarde' : 'pendiente';
            const rating = contenido.libro.ratingLibro?.avgRating || 0;

            const existing = librosMap.get(libroId);
            if (existing) {
                // Si el libro ya está en el mapa, solo añade el nuevo estado
                existing.estados.add(estado);
                // Actualiza el rating si el nuevo es mayor (o si el existente es 0)
                if (rating > existing.rating) {
                    existing.rating = rating;
                }
            } else {
                // Si es la primera vez que vemos el libro, lo agregamos al mapa
                librosMap.set(libroId, {
                    libroData: contenido.libro,
                    // ✅ Normalizamos los autores a un array, filtrando 'Autor desconocido'
                    autores: (contenido.libro.autores || [contenido.libro.autor?.nombre || 'Autor desconocido']).filter(a => a !== 'Autor desconocido'),
                    estados: new Set([estado]), // Usamos un Set para evitar estados duplicados
                    fecha: contenido.createdAt,
                    rating: rating,
                });
            }
        });

        // 2. PROCESAR FAVORITOS (Añadiendo el estado 'favorito')
        favoritos.forEach(fav => {
            const libroId = fav.libroId;
            const existing = librosMap.get(libroId);
            const rating = fav.rating || 0;

            if (existing) {
                // Si el libro ya existe (viene de una lista), añade el estado 'favorito'
                existing.estados.add('favorito');
                // Actualiza los autores si no hay
                if (existing.autores.length === 0) {
                    existing.autores = fav.autores;
                }

                if (rating > existing.rating) {
                    existing.rating = rating;
                }
            } else {
                // Si es un favorito que no está en ninguna lista, lo agregamos al mapa
                librosMap.set(libroId, {
                    libroData: {
                        id: libroId,
                        nombre: fav.titulo,
                        categoria: { nombre: fav.categoria },
                        imagen: fav.imagen,
                        externalId: fav.externalId, // Aseguramos que externalId se propague
                    },
                    autores: fav.autores,
                    estados: new Set(['favorito']),
                    fecha: fav.fechaAgregado,
                    rating: rating,
                });
            }
        });

        // 3. CONSTRUIR EL ARRAY FINAL
        const allLibros: LibroFavorito[] = Array.from(librosMap.values()).map(item => ({
            id: item.libroData.id,
            titulo: item.libroData.nombre,
            autores: item.autores,
            categoria: typeof item.libroData.categoria === 'string' ? item.libroData.categoria : item.libroData.categoria?.nombre || 'Sin categoría',
            rating: item.rating, // Usamos el rating consolidado
            imagen: item.libroData.imagen,
            // ✅ Convertimos el Set de estados a un array
            estados: Array.from(item.estados) as ('leido' | 'ver-mas-tarde' | 'pendiente' | 'favorito')[],
            fechaAgregado: item.fecha,
            externalId: item.libroData.externalId || null,
        }));
        
        setLibrosFavoritos(allLibros);

        // --- El resto de la función para autores y categorías no cambia ---
        const autorMap = new Map<string, AutorFavorito>();
        const categoriaMap = new Map<string, CategoriaFavorita>();

        allLibros.forEach(libro => {
            const autoresArray = libro.autores.filter(a => a);
            autoresArray.forEach((autorNombre: string) => {
                if (autorNombre === 'Autor desconocido') return;
                if (!autorMap.has(autorNombre)) {
                    autorMap.set(autorNombre, {
                        id: Date.now() + Math.random(),
                        nombre: autorNombre,
                        libros: 1,
                        fechaAgregado: libro.fechaAgregado
                    });
                } else {
                    const existing = autorMap.get(autorNombre)!;
                    existing.libros += 1;
                }
            });

            if (libro.categoria && libro.categoria !== 'Sin categoría') {
                if (!categoriaMap.has(libro.categoria)) {
                    categoriaMap.set(libro.categoria, {
                        id: Date.now() + Math.random(),
                        nombre: libro.categoria,
                        librosCount: 1,
                        color: getRandomColor(),
                        fechaAgregado: libro.fechaAgregado
                    });
                } else {
                    const existing = categoriaMap.get(libro.categoria)!;
                    existing.librosCount += 1;
                }
            }
        });

        setAutoresFavoritos(Array.from(autorMap.values()));
        setCategoriasFavoritas(Array.from(categoriaMap.values()));

    } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error al cargar los datos. Por favor, recarga la página.');
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getRandomColor = () => {
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  // ✅ Ref para prevenir race conditions
  const creatingLista = useRef<Record<string, Promise<Lista> | null>>({});

  const cambiarEstadoLibro = async (libroId: number, nuevoEstado: 'leido' | 'ver-mas-tarde' | 'pendiente') => {
    // ✅ Feedback visual inmediato específico para el botón
    setUpdatingBookAction({ bookId: libroId, action: nuevoEstado });
    
    try {
      // Find the libro object usando el estado actual
      const libro = librosFavoritos.find(l => l.id === libroId);
      if (!libro) {
        toast.error('Libro no encontrado');
        setUpdatingBookAction(null);
        return;
      }

      console.log('🔍 Cambiando estado:', { 
        libroId, 
        titulo: libro.titulo, 
        nuevoEstado,
        estadosActuales: libro.estados,
        externalId: libro.externalId
      });

      // ✅ Map estado to lista tipo usando constantes
      const tipoLista = nuevoEstado === 'leido' ? LISTA_TIPOS.READ :
                       nuevoEstado === 'ver-mas-tarde' ? LISTA_TIPOS.TO_READ : 
                       LISTA_TIPOS.PENDING;

      // ✅ Verificar si el libro YA tiene este estado
      const yaEstaEnEstado = libro.estados.includes(nuevoEstado);
      console.log('📊 Ya está en estado:', yaEstaEnEstado, '| Estados:', libro.estados);

      // ✅ Buscar lista con manejo mejorado
      let listaExistente = listas.find(l => l.tipo === tipoLista);
      
      // Si no existe en estado local, sincronizar con servidor
      if (!listaExistente) {
        console.log('🔄 Lista no en estado local, sincronizando con servidor...');
        const todasLasListas = await listaService.getUserListas();
        listaExistente = todasLasListas.find(l => l.tipo === tipoLista);
        
        // Actualizar estado local con todas las listas
        setListas(todasLasListas);
      }
      
      console.log('📋 Lista existente:', listaExistente?.nombre || 'No existe', '| Todas las listas:', listas.map(l => ({ nombre: l.nombre, tipo: l.tipo })));

      if (yaEstaEnEstado && listaExistente) {
        // ✅ QUITAR del estado (toggle off)
        console.log('❌ Eliminando de lista...', {
          listaId: listaExistente.id,
          libroIdentificador: libro.externalId || libroId.toString()
        });
        
        await listaService.removeLibroDeLista(listaExistente.id, libro.externalId || libroId.toString());
        
        // ✅ Actualización optimista del estado local
        setLibrosFavoritos(prev => prev.map(l => 
          l.id === libroId 
            ? { ...l, estados: l.estados.filter(e => e !== nuevoEstado) }
            : l
        ));
        
        toast.success(`✓ Eliminado de "${getNombreEstado(nuevoEstado)}"`, {
          duration: 2000,
          icon: '🗑️'
        });
      } else {
        // ✅ AGREGAR al estado (toggle on)
        if (!listaExistente) {
          // ✅ Usar getOrCreateLista para prevenir duplicados
          console.log('📝 Obteniendo o creando lista de tipo:', tipoLista);
          const nombreLista = tipoLista === LISTA_TIPOS.READ ? LISTA_NOMBRES.READ :
                            tipoLista === LISTA_TIPOS.TO_READ ? LISTA_NOMBRES.TO_READ : 
                            LISTA_NOMBRES.PENDING;
          
          // Verificar si ya se está creando (lock)
          if (!creatingLista.current[tipoLista]) {
            const createPromise = listaService.getOrCreateLista(nombreLista, tipoLista);
            creatingLista.current[tipoLista] = createPromise;
            
            try {
              listaExistente = await createPromise;
              console.log('✨ Lista obtenida/creada:', listaExistente);
              
              // Actualizar estado local solo si no existe
              setListas(prev => {
                const exists = prev.some(l => l.id === listaExistente!.id);
                if (!exists) {
                  return [...prev, listaExistente!];
                }
                return prev;
              });
            } finally {
              creatingLista.current[tipoLista] = null;
            }
          } else {
            // Esperar a que termine la creación en curso
            console.log('⏳ Esperando creación en curso...');
            listaExistente = await creatingLista.current[tipoLista]!;
          }
        }

        console.log('✅ Agregando libro a lista...', {
          listaId: listaExistente.id,
          listaName: listaExistente.nombre,
          libroData: {
            id: libro.externalId || libroId.toString(),
            titulo: libro.titulo,
            autores: libro.autores
          }
        });
        
        await listaService.addLibroALista(listaExistente.id, {
          id: libro.externalId || libroId.toString(),
          titulo: libro.titulo,
          autores: libro.autores,
          descripcion: null,
          imagen: libro.imagen,
          enlace: null,
          source: 'google'
        });
        
        // ✅ Actualización optimista del estado local
        setLibrosFavoritos(prev => prev.map(l => 
          l.id === libroId 
            ? { ...l, estados: [...l.estados, nuevoEstado] }
            : l
        ));
        
        toast.success(`✓ Agregado a "${getNombreEstado(nuevoEstado)}"`, {
          duration: 2000,
          icon: '📚'
        });
      }

    } catch (error: any) {
      console.error('❌ Error cambiando estado del libro:', {
        error,
        mensaje: error.message,
        stack: error.stack,
        response: error.response
      });
      
      // Mensajes de error más específicos
      let mensajeError = 'Error al actualizar el estado';
      
      if (error.message?.includes('ECONNREFUSED')) {
        mensajeError = '⚠️ El servidor no está disponible. Por favor, inicia el backend.';
      } else if (error.message?.includes('404')) {
        mensajeError = '⚠️ Libro o lista no encontrada';
      } else if (error.message?.includes('401') || error.message?.includes('403')) {
        mensajeError = '⚠️ No tienes permisos. Por favor, inicia sesión de nuevo.';
      } else if (error.message) {
        mensajeError = error.message;
      }
      
      toast.error(mensajeError, { duration: 4000 });
      
      // ✅ Revertir cambios en caso de error
      console.log('🔄 Recargando datos después del error...');
      await fetchData();
    } finally {
      setUpdatingBookAction(null);
    }
  };

  const getNombreEstado = (estado: string) => {
    switch (estado) {
      case 'leido': return 'Leídos';
      case 'ver-mas-tarde': return 'Ver más tarde';
      case 'pendiente': return 'Pendientes';
      default: return estado;
    }
  };

  // ✅ Optimización: Memorizar libros filtrados
  const librosFiltrados = useMemo(() => {
    return filtroEstado === 'todos'
      ? librosFavoritos
      : librosFavoritos.filter(libro => libro.estados.includes(filtroEstado as 'leido' | 'ver-mas-tarde' | 'pendiente' | 'favorito'));
  }, [filtroEstado, librosFavoritos]);

  // ✅ Pantalla de carga completa con el pollito de Lottie
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center transition-colors duration-300">
        <DotLottieReact
          src="https://lottie.host/6d727e71-5a1d-461e-9434-c9e7eb1ae1d1/IWVmdeMHnT.lottie"
          loop
          autoplay
          style={{ width: 140, height: 140 }}
        />
        <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mt-4">Cargando tus favoritos...</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2">El pollito está buscando tus libros 🐣</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          className: '',
          style: {
            background: 'transparent',
            boxShadow: 'none',
            padding: 0,
          },
          success: {
            icon: null,
          },
          error: {
            icon: null,
          },
        }}
      >
        {(t) => {
          const isSuccess = t.type === 'success';
          const isError = t.type === 'error';
          
          return (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`
                flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl
                ${isSuccess 
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-500 dark:to-blue-500' 
                  : isError
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 dark:from-rose-500 dark:to-pink-500'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500'
                }
              `}
            >
              {/* Message */}
              <div className="flex-1 text-sm font-semibold text-white">
                {t.message?.toString()}
              </div>

              {/* Close button */}
              <button
                onClick={() => toast.dismiss(t.id)}
                className="flex-shrink-0 w-7 h-7 rounded-full transition-all duration-200 flex items-center justify-center hover:bg-white/20"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </motion.div>
          );
        }}
      </Toaster>
      {/* Header */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-center text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-700 via-blue-600 to-indigo-700 dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-400">
                  Mis Favoritos
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Gestiona tus libros, autores y categorías favoritas con estilo
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <motion.div
          className="flex space-x-1 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-1 rounded-2xl mb-8 max-w-md mx-auto shadow-lg border border-white/20 dark:border-gray-700/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={() => setActiveTab('libros')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'libros'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-300 hover:text-indigo-700 dark:hover:text-indigo-400 hover:bg-white/50 dark:hover:bg-gray-700/50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Book className="w-5 h-5" />
            <span>Libros</span>
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('autores')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'autores'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-300 hover:text-indigo-700 dark:hover:text-indigo-400 hover:bg-white/50 dark:hover:bg-gray-700/50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <User className="w-5 h-5" />
            <span>Autores</span>
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('categorias')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'categorias'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-300 hover:text-indigo-700 dark:hover:text-indigo-400 hover:bg-white/50 dark:hover:bg-gray-700/50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Tag className="w-5 h-5" />
            <span>Categorías</span>
          </motion.button>
        </motion.div>

        {/* Libros Tab */}
        {activeTab === 'libros' && (
          <div>
            {/* Filtros */}
            <motion.div
              className="flex flex-wrap gap-3 mb-8 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                onClick={() => setFiltroEstado('todos')}
                className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 shadow-lg ${
                  filtroEstado === 'todos'
                    ? 'bg-slate-600 text-white shadow-slate-600/25'
                    : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-lg border border-white/20'
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Todos ({librosFavoritos.length})
              </motion.button>
              <motion.button
                onClick={() => setFiltroEstado('leido')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 shadow-lg ${
                  filtroEstado === 'leido'
                    ? 'bg-green-600 text-white shadow-green-600/25'
                    : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-lg border border-white/20'
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <CheckCircle className="w-4 h-4" />
                <span>Leídos ({librosFavoritos.filter(l => l.estados.includes('leido')).length})</span>
              </motion.button>
              <motion.button
                onClick={() => setFiltroEstado('ver-mas-tarde')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 shadow-lg ${
                  filtroEstado === 'ver-mas-tarde'
                    ? 'bg-blue-600 text-white shadow-blue-600/25'
                    : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-lg border border-white/20'
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Eye className="w-4 h-4" />
                <span>Ver más tarde ({librosFavoritos.filter(l => l.estados.includes('ver-mas-tarde')).length})</span>
              </motion.button>
              <motion.button
                onClick={() => setFiltroEstado('pendiente')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 shadow-lg ${
                  filtroEstado === 'pendiente'
                    ? 'bg-orange-600 text-white shadow-orange-600/25'
                    : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-lg border border-white/20'
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Clock className="w-4 h-4" />
                <span>Pendientes ({librosFavoritos.filter(l => l.estados.includes('pendiente')).length})</span>
              </motion.button>
              <motion.button
                onClick={() => setFiltroEstado('favorito')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 shadow-lg ${
                  filtroEstado === 'favorito'
                    ? 'bg-red-600 text-white shadow-red-600/25'
                    : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-lg border border-white/20'
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className="w-4 h-4" />
                <span>Favoritos ({librosFavoritos.filter(l => l.estados.includes('favorito')).length})</span>
              </motion.button>
            </motion.div>

            {/* Libros Grid */}
            {librosFiltrados.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Book className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">No hay libros en esta categoría</h3>
                <p className="text-gray-500 dark:text-gray-400">Intenta con otro filtro o agrega más libros a tus listas</p>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {librosFiltrados.map((libro) => (
                <motion.div
                  key={libro.id}
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 dark:border-gray-700/20"
                  variants={cardVariants}
                  whileHover={{
                    scale: 1.03,
                    y: -8,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative group">
                    <img
                      src={libro.imagen}
                      alt={libro.titulo}
                      className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {libro.estados.includes('favorito') && (
                      <motion.div
                        className="absolute top-4 right-4 bg-red-600 rounded-full p-1"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Heart className="w-6 h-6 text-white drop-shadow-lg" fill="currentColor" />
                      </motion.div>
                    )}
                  </div>
                  <div className="p-6">
                    <Link to={`/libro/${libro.externalId || libro.id}`} className="block group">
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 text-lg leading-tight truncate">
                        {libro.titulo}
                      </h3>
                    </Link>


                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-3 font-medium">
                      <User className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                      <span className="truncate">{libro.autores.join(', ')}</span>
                    </div>
                    

                    {/* Estado Buttons */}
                    <div className="flex space-x-2 mt-4">
                      <motion.button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          cambiarEstadoLibro(libro.id, 'leido');
                        }}
                        disabled={updatingBookAction?.bookId === libro.id}
                        title="Marcar como Leído"
                        className={`flex-1 flex justify-center items-center p-2.5 rounded-xl transition-all duration-300 ${
                          updatingBookAction?.bookId === libro.id && updatingBookAction?.action === 'leido'
                            ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            : libro.estados.includes('leido')
                            ? 'bg-green-600 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-400 hover:shadow-md'
                        }`}
                        whileHover={updatingBookAction?.bookId === libro.id ? {} : { scale: 1.05 }}
                        whileTap={updatingBookAction?.bookId === libro.id ? {} : { scale: 0.95 }}
                      >
                        {updatingBookAction?.bookId === libro.id && updatingBookAction?.action === 'leido' ? (
                          <Loader className="w-5 h-5 animate-spin" />
                        ) : (
                          <CheckCircle className="w-5 h-5" />
                        )}
                      </motion.button>
                      <motion.button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          cambiarEstadoLibro(libro.id, 'ver-mas-tarde');
                        }}
                        disabled={updatingBookAction?.bookId === libro.id}
                        title="Marcar para Ver más tarde"
                        className={`flex-1 flex justify-center items-center p-2.5 rounded-xl transition-all duration-300 ${
                          updatingBookAction?.bookId === libro.id && updatingBookAction?.action === 'ver-mas-tarde'
                            ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            : libro.estados.includes('ver-mas-tarde')
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400 hover:shadow-md'
                        }`}
                        whileHover={updatingBookAction?.bookId === libro.id ? {} : { scale: 1.05 }}
                        whileTap={updatingBookAction?.bookId === libro.id ? {} : { scale: 0.95 }}
                      >
                        {updatingBookAction?.bookId === libro.id && updatingBookAction?.action === 'ver-mas-tarde' ? (
                          <Loader className="w-5 h-5 animate-spin" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </motion.button>
                      <motion.button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          cambiarEstadoLibro(libro.id, 'pendiente');
                        }}
                        disabled={updatingBookAction?.bookId === libro.id}
                        title="Marcar como Pendiente"
                        className={`flex-1 flex justify-center items-center p-2.5 rounded-xl transition-all duration-300 ${
                          updatingBookAction?.bookId === libro.id && updatingBookAction?.action === 'pendiente'
                            ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            : libro.estados.includes('pendiente')
                            ? 'bg-orange-600 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:text-orange-700 dark:hover:text-orange-400 hover:shadow-md'
                        }`}
                        whileHover={updatingBookAction?.bookId === libro.id ? {} : { scale: 1.05 }}
                        whileTap={updatingBookAction?.bookId === libro.id ? {} : { scale: 0.95 }}
                      >
                        {updatingBookAction?.bookId === libro.id && updatingBookAction?.action === 'pendiente' ? (
                          <Loader className="w-5 h-5 animate-spin" />
                        ) : (
                          <Clock className="w-5 h-5" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        )}

        {/* Autores Tab */}
        {activeTab === 'autores' && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {autoresFavoritos.length > 0 ? autoresFavoritos.map((autor) => (
              <motion.div
                key={autor.id}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 dark:border-gray-700/20"
                variants={cardVariants}
                whileHover={{
                  scale: 1.03,
                  y: -8,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative group">
                  {/* Placeholder sin imagen predeterminada */}
                  <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
                    <User className="w-24 h-24 text-purple-300 dark:text-purple-600" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <motion.div
                    className="absolute top-4 right-4"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart className="w-7 h-7 text-red-500 dark:text-red-400 drop-shadow-lg" fill="currentColor" />
                  </motion.div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-lg leading-tight">
                        {autor.nombre}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">{autor.libros} libro{autor.libros !== 1 ? 's' : ''} en tu colección</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Agregado el {new Date(autor.fechaAgregado).toLocaleDateString('es-ES')}
                    </span>
                    <Link
                      to={`/autores`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                    >
                      Ver más
                    </Link>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full text-center py-12">
                <User className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">No tienes autores favoritos aún</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Agrega libros a tus listas para ver aquí a tus autores favoritos</p>
                <Link
                  to="/libros"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-2xl hover:shadow-lg transition-all duration-300"
                >
                  <Book className="w-5 h-5 mr-2" />
                  Explorar libros
                </Link>
              </div>
            )}
          </motion.div>
        )}

        {/* Categorías Tab */}
        {activeTab === 'categorias' && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {categoriasFavoritas.length > 0 ? categoriasFavoritas.map((categoria) => (
              <Link 
                key={categoria.id}
                to={`/libros?filtro=tema&termino=${encodeURIComponent(categoria.nombre)}`}
                className="block"
              >
                <motion.div
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 dark:border-gray-700/20 cursor-pointer"
                  variants={cardVariants}
                  whileHover={{
                    scale: 1.03,
                    y: -8,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`h-32 ${categoria.color} flex items-center justify-center relative`}>
                    <Tag className="w-12 h-12 text-white" />
                    <motion.div
                      className="absolute top-3 right-3"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart className="w-6 h-6 text-white fill-current drop-shadow-lg" />
                    </motion.div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-lg leading-tight">{categoria.nombre}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 font-medium">{categoria.librosCount} libro{categoria.librosCount !== 1 ? 's' : ''} en tu colección</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Agregado el {new Date(categoria.fechaAgregado).toLocaleDateString('es-ES')}
                      </span>
                      <span className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
                        Ver libros →
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            )) : (
              <div className="col-span-full text-center py-12">
                <Tag className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">No tienes categorías favoritas aún</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Agrega libros a tus listas para ver aquí tus categorías favoritas</p>
                <Link
                  to="/libros"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-2xl hover:shadow-lg transition-all duration-300"
                >
                  <Book className="w-5 h-5 mr-2" />
                  Explorar libros
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};