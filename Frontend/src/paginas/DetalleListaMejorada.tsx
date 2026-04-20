import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { listaService, Lista, ContenidoLista } from '../services/listaService';
import toast, { Toaster } from 'react-hot-toast';
import { API_BASE_URL } from '../config/api.config';
import axios from 'axios';
import { LoadingSkeleton, ListHeaderSkeleton, ToolbarSkeleton } from '../componentes/LoadingSkeleton';
import LibroImagen from '../componentes/LibroImagen';
import { 
  BookOpen, 
  Grid3x3, 
  List, 
  Search, 
  Filter, 
  SortAsc, 
  Star, 
  BookMarked,
  Clock,
  Check,
  ArrowLeft,
  X,
  GripVertical,
  Maximize2,
  Save
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type OrderBy = 'alfabetico' | 'fecha' | 'rating' | 'personalizado';
type ViewMode = 'grid' | 'list';

// Componente para cada item sorteable
function SortableItem({ contenido, onRemove, navigate }: { 
  contenido: ContenidoLista, 
  onRemove: (id: number) => void,
  navigate: any
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: contenido.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 flex gap-4 group ${isDragging ? 'z-50' : ''}`}
    >
      {/* Drag Handle */}
      <div 
        {...attributes} 
        {...listeners}
        className="flex-shrink-0 flex items-center cursor-grab active:cursor-grabbing text-gray-400 dark:text-gray-500 hover:text-gray-600"
      >
        <GripVertical className="w-6 h-6" />
      </div>

      {/* Imagen */}
      <div 
        className="flex-shrink-0 cursor-pointer"
        onClick={() => navigate(`/libro/${contenido.libro.id}`)}
      >
        <LibroImagen
          src={contenido.libro.imagen}
          alt={contenido.libro.nombre}
          titulo={contenido.libro.nombre}
          className="w-24 h-36 object-cover rounded-lg"
        />
      </div>

      {/* Información */}
      <div 
        className="flex-1 min-w-0 cursor-pointer"
        onClick={() => navigate(`/libro/${contenido.libro.id}`)}
      >
        <div className="flex items-start gap-2 mb-1">
          {contenido.orden !== null && contenido.orden !== undefined && (
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 text-white font-bold flex items-center justify-center text-sm">
              {contenido.orden}
            </span>
          )}
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {contenido.libro.nombre}
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          por {contenido.libro.autores?.[0] || 'Autor desconocido'}
        </p>
        
        <div className="flex items-center gap-4 mt-3">
          {contenido.libro.categoria && (
            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              {contenido.libro.categoria.nombre}
            </span>
          )}
          
          {contenido.libro.ratingLibro && (
            <div className="flex items-center gap-1 text-yellow-600">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-semibold">{contenido.libro.ratingLibro.avgRating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Botón eliminar */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(contenido.libro.id);
        }}
        className="flex-shrink-0 p-3 text-gray-400 dark:text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
        title="Eliminar de la lista"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

export default function DetalleListaMejorada() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const listaId = id ? parseInt(id) : 0;

  const [lista, setLista] = useState<Lista | null>(null);
  const [contenidos, setContenidos] = useState<ContenidoLista[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  // Estados de filtros y visualización
  const [viewMode, setViewMode] = useState<ViewMode>('list'); // Por defecto 'list' para drag & drop
  const [orderBy, setOrderBy] = useState<OrderBy>('personalizado');
  const [search, setSearch] = useState('');
  const [filterAutor, setFilterAutor] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('');
  const [filterRating, setFilterRating] = useState<number | undefined>();
  const [showFilters, setShowFilters] = useState(false);

  // Sensores para drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    cargarLista();
  }, [listaId, orderBy, filterAutor, filterCategoria, filterRating, search]);

  const cargarLista = async () => {
    try {
      setLoading(true);
      setError(null);

      const filtros = {
        orderBy,
        filterAutor: filterAutor || undefined,
        filterCategoria: filterCategoria || undefined,
        filterRating: filterRating,
        search: search || undefined,
      };

      const data = await listaService.getListaDetallada(listaId, filtros);
      setLista(data);
      setContenidos(data.contenidos || []);
      setHasChanges(false);
    } catch (err) {
      setError('Error al cargar la lista');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setContenidos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Actualizar el orden de cada item
        const updatedItems = newItems.map((item, index) => ({
          ...item,
          orden: index + 1
        }));
        
        setHasChanges(true);
        return updatedItems;
      });
    }
  };

  const guardarOrden = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Debes iniciar sesión');
        return;
      }

      // Crear array con el nuevo orden
      const orden = contenidos.map((contenido, index) => ({
        contenidoId: contenido.id,
        orden: index + 1
      }));

      await axios.put(
        `${API_BASE_URL}/lista/${listaId}/reordenar`,
        { orden },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Orden guardado correctamente');
      setHasChanges(false);
    } catch (err: any) {
      console.error('Error al guardar orden:', err);
      toast.error(err.response?.data?.error || 'Error al guardar el orden');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveLibro = async (libroId: number) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-semibold text-gray-900 dark:text-gray-100">¿Eliminar este libro de la lista?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              
              await toast.promise(
                listaService.removeLibroDeLista(listaId, libroId.toString()),
                {
                  loading: 'Eliminando libro...',
                  success: '¡Libro eliminado correctamente!',
                  error: 'Error al eliminar el libro',
                }
              );
              
              setContenidos(contenidos.filter(c => c.libro.id !== libroId));
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Eliminar
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-200 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancelar
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const getTipoListaIcon = (tipo: string) => {
    switch (tipo) {
      case 'leido': return <Check className="w-5 h-5" />;
      case 'ver_mas_tarde': return <Clock className="w-5 h-5" />;
      case 'pendientes': return <BookMarked className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const limpiarFiltros = () => {
    setSearch('');
    setFilterAutor('');
    setFilterCategoria('');
    setFilterRating(undefined);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8 dark:from-gray-900 dark:to-gray-800">
        <Toaster position="top-center" />
        <div className="max-w-7xl mx-auto space-y-6">
          <ListHeaderSkeleton />
          <ToolbarSkeleton />
          <LoadingSkeleton count={6} />
        </div>
      </div>
    );
  }

  if (error || !lista) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8 dark:from-gray-900 dark:to-gray-800">
        <Toaster position="top-center" />
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-800">{error || 'Lista no encontrada'}</p>
            <button
              onClick={() => navigate('/perfil')}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Volver al perfil
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isDragDropMode = orderBy === 'personalizado' && viewMode === 'list';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8 dark:from-gray-900 dark:to-gray-800">
      <Toaster position="top-center" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/perfil')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:text-gray-100 mb-4 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al perfil
          </button>

          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                  {getTipoListaIcon(lista.tipo)}
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">{lista.nombre}</h1>
                  <p className="text-white/80 text-lg">
                    {contenidos.length} {contenidos.length === 1 ? 'libro' : 'libros'}
                  </p>
                </div>
              </div>
              
              {hasChanges && (
                <button
                  onClick={guardarOrden}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 dark:bg-gray-700 dark:text-purple-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  {saving ? 'Guardando...' : 'Guardar orden'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          {/* Búsqueda */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Buscar en esta lista..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Controles */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Ordenar */}
            <div className="flex items-center gap-2">
              <SortAsc className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <select
                value={orderBy}
                onChange={(e) => setOrderBy(e.target.value as OrderBy)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="personalizado">Orden personalizado</option>
                <option value="alfabetico">Alfabético</option>
                <option value="fecha">Fecha agregado</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            {/* Vista */}
            <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition ${
                  viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="Vista cuadrícula"
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition ${
                  viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="Vista lista"
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Filtros */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                showFilters ? 'bg-purple-600 text-white' : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Filter className="w-5 h-5" />
              Filtros
            </button>

            {isDragDropMode && (
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                <GripVertical className="w-5 h-5" />
                <span className="text-sm font-medium">Arrastra para reordenar</span>
              </div>
            )}
          </div>

          {/* Panel de Filtros */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Autor</label>
                  <input
                    type="text"
                    placeholder="Filtrar por autor..."
                    value={filterAutor}
                    onChange={(e) => setFilterAutor(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría</label>
                  <input
                    type="text"
                    placeholder="Filtrar por categoría..."
                    value={filterCategoria}
                    onChange={(e) => setFilterCategoria(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rating mínimo</label>
                  <select
                    value={filterRating || ''}
                    onChange={(e) => setFilterRating(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Todos</option>
                    <option value="4">4★ o más</option>
                    <option value="3">3★ o más</option>
                    <option value="2">2★ o más</option>
                    <option value="1">1★ o más</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={limpiarFiltros}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Contenido */}
        {contenidos.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-xl text-gray-600 dark:text-gray-300">No hay libros en esta lista</p>
            <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-2">
              {search || filterAutor || filterCategoria || filterRating
                ? 'Intenta ajustar los filtros'
                : 'Empieza a agregar libros desde la página de detalle de cada libro'}
            </p>
          </div>
        ) : isDragDropMode ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={contenidos.map(c => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {contenidos.map((contenido) => (
                  <SortableItem
                    key={contenido.id}
                    contenido={contenido}
                    onRemove={handleRemoveLibro}
                    navigate={navigate}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {contenidos.map((contenido) => (
              <div
                key={contenido.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                onClick={() => navigate(`/libro/${contenido.libro.id}`)}
              >
                <div className="relative aspect-[2/3]">
                  <LibroImagen
                    src={contenido.libro.imagen}
                    alt={contenido.libro.nombre}
                    titulo={contenido.libro.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveLibro(contenido.libro.id);
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    title="Eliminar de la lista"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {contenido.libro.ratingLibro && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      {contenido.libro.ratingLibro.avgRating.toFixed(1)}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 line-clamp-2 text-lg mb-1">
                    {contenido.libro.nombre}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 line-clamp-1">
                    {contenido.libro.autores?.[0] || 'Autor desconocido'}
                  </p>
                  {contenido.libro.categoria && (
                    <p className="text-xs text-purple-600 mt-2 font-medium">
                      {contenido.libro.categoria.nombre}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {contenidos.map((contenido) => (
              <div
                key={contenido.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 flex gap-4 group cursor-pointer"
                onClick={() => navigate(`/libro/${contenido.libro.id}`)}
              >
                <div className="flex-shrink-0">
                  <LibroImagen
                    src={contenido.libro.imagen}
                    alt={contenido.libro.nombre}
                    titulo={contenido.libro.nombre}
                    className="w-24 h-36 object-cover rounded-lg"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {contenido.libro.nombre}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-2">
                    por {contenido.libro.autores?.[0] || 'Autor desconocido'}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-3">
                    {contenido.libro.categoria && (
                      <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        {contenido.libro.categoria.nombre}
                      </span>
                    )}
                    
                    {contenido.libro.ratingLibro && (
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-semibold">{contenido.libro.ratingLibro.avgRating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveLibro(contenido.libro.id);
                  }}
                  className="flex-shrink-0 p-3 text-gray-400 dark:text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar de la lista"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
