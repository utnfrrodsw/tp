import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Upload, Plus, X, Link as LinkIcon, Tag, Building } from 'lucide-react';
import { getEditoriales } from '../services/editorialService';
import { getCategorias } from '../services/categoriaService';
import { getSagas } from '../services/sagaService';
import { getAutores, createAutor } from '../services/autorService';
import { isAdmin } from '../utils/jwtUtils';
import { getToken } from '../utils/jwtUtils';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface Editorial {
  id: number;
  nombre: string;
}

interface Categoria {
  id: number;
  nombre: string;
}

interface Saga {
  id: number;
  nombre: string;
}

interface Autor {
  id: number;
  nombre: string;
  apellido: string;
}

export const CrearLibro: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [portadaPreview, setPortadaPreview] = useState<string>('');
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [showAutorModal, setShowAutorModal] = useState(false);
  const [showCategoriaModal, setShowCategoriaModal] = useState(false);

  const [editoriales, setEditoriales] = useState<Editorial[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [sagas, setSagas] = useState<Saga[]>([]);
  const [autores, setAutores] = useState<Autor[]>([]);
  
  const [libroData, setLibroData] = useState({
    nombre: '',
    autorId: '',
    externalId: '',
    sinopsis: '',
    editorialId: '',
    categoriaId: '',
    sagaId: '',
    enlace: '',
    source: '',
    imagen: null as File | null,
    imagenUrl: '' // URL de la imagen si se proporciona en lugar de archivo
  });

  const [nuevoAutor, setNuevoAutor] = useState({
    nombre: '',
    apellido: '',
    biografia: '',
    foto: ''
  });

  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre: '',
    descripcion: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Verificar si el usuario es admin
    const checkAuth = async () => {
      const authorized = await isAdmin();
      setIsAuthorized(authorized);
      if (!authorized) {
        setTimeout(() => navigate('/'), 2000);
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    // Cargar datos para los dropdowns desde el backend
    const fetchData = async () => {
      try {
        const [editorialesData, categoriasData, sagasData, autoresData] = await Promise.all([
          getEditoriales(),
          getCategorias(),
          getSagas(),
          getAutores()
        ]);
        
        console.log('📚 Datos cargados:');
        console.log('Editoriales:', editorialesData);
        console.log('Categorías:', categoriasData);
        console.log('Sagas:', sagasData);
        console.log('Autores:', autoresData);
        
        setEditoriales(Array.isArray(editorialesData) ? editorialesData : []);
        setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
        setSagas(Array.isArray(sagasData) ? sagasData : []);
        // Extraer el array de autores del objeto paginado
        const autoresArray = autoresData?.autores || (Array.isArray(autoresData) ? autoresData : []);
        setAutores(autoresArray);
      } catch (error) {
        console.error("Error al cargar datos para el formulario:", error);
        // Asegurar que todos los estados sean arrays vacíos en caso de error
        setEditoriales([]);
        setCategorias([]);
        setSagas([]);
        setAutores([]);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLibroData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLibroData(prev => ({ ...prev, imagen: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPortadaPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNuevoAutorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNuevoAutor(prev => ({ ...prev, [name]: value }));
  };

  const handleNuevaCategoriaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNuevaCategoria(prev => ({ ...prev, [name]: value }));
  };

  const handleCrearAutor = async () => {
    if (!nuevoAutor.nombre.trim() || !nuevoAutor.apellido.trim()) {
      alert('El nombre y apellido del autor son requeridos');
      return;
    }

    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        alert('No estás autenticado. Por favor inicia sesión.');
        return;
      }

      const autorCreado = await createAutor(nuevoAutor, token);
      
      setAutores([...autores, autorCreado]);
      setLibroData(prev => ({ ...prev, autorId: autorCreado.id.toString() }));
      setShowAutorModal(false);
      setNuevoAutor({ nombre: '', apellido: '', biografia: '', foto: '' });
      alert('Autor creado exitosamente');
    } catch (error) {
      console.error('Error al crear autor:', error);
      alert(error instanceof Error ? error.message : 'Error al crear el autor');
    } finally {
      setLoading(false);
    }
  };

  const handleCrearCategoria = async () => {
    if (!nuevaCategoria.nombre.trim()) {
      alert('El nombre de la categoría es requerido');
      return;
    }

    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch('/api/categoria', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${getToken()}`
      //   },
      //   body: JSON.stringify(nuevaCategoria)
      // });
      
      // if (response.ok) {
      //   const categoriaCreada = await response.json();
      //   setCategorias([...categorias, categoriaCreada]);
      //   setLibroData(prev => ({ ...prev, categoriaId: categoriaCreada.id.toString() }));
      //   setShowCategoriaModal(false);
      //   setNuevaCategoria({ nombre: '', descripcion: '' });
      // }

      // Simulación temporal
      const categoriaSimulada = {
        id: Date.now(),
        nombre: nuevaCategoria.nombre,
        descripcion: nuevaCategoria.descripcion
      };
      setCategorias([...categorias, categoriaSimulada]);
      setLibroData(prev => ({ ...prev, categoriaId: categoriaSimulada.id.toString() }));
      setShowCategoriaModal(false);
      setNuevaCategoria({ nombre: '', descripcion: '' });
      alert('Categoría creada exitosamente (simulado)');
    } catch (error) {
      console.error('Error al crear categoría:', error);
      alert('Error al crear la categoría');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!libroData.nombre.trim()) newErrors.nombre = 'El nombre del libro es requerido';
    if (!libroData.autorId) newErrors.autorId = 'El autor es requerido';
    if (!libroData.sinopsis.trim()) newErrors.sinopsis = 'La sinopsis es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Encontrar el autor seleccionado para obtener nombre y apellido
      console.log('🔍 Buscando autor con ID:', libroData.autorId);
      console.log('📋 Lista de autores disponibles:', autores);
      
      const autorSeleccionado = autores.find(a => a.id.toString() === libroData.autorId.toString());
      
      console.log('✅ Autor encontrado:', autorSeleccionado);
      
      if (!autorSeleccionado) {
        alert('Por favor selecciona un autor válido');
        setLoading(false);
        return;
      }

      const token = getToken();
      
      if (!token) {
        alert('No estás autenticado. Por favor inicia sesión.');
        setLoading(false);
        return;
      }

      // Usar JSON siempre (el backend no soporta FormData con archivos)
      const requestBody: any = {
        nombreAutor: autorSeleccionado.nombre,
        apellidoAutor: autorSeleccionado.apellido,
        nombre: libroData.nombre,
        sinopsis: libroData.sinopsis,
        categoriaId: libroData.categoriaId
      };

      // Agregar campos opcionales si existen
      if (libroData.imagenUrl) {
        requestBody.imagen = libroData.imagenUrl;
      }
      if (libroData.editorialId) requestBody.editorialId = libroData.editorialId;
      if (libroData.sagaId) requestBody.sagaId = libroData.sagaId;
      if (libroData.fecha_publicacion) requestBody.fecha_publicacion = libroData.fecha_publicacion;

      console.log('📤 Enviando JSON al backend:', requestBody);

      const response = await fetch('http://localhost:3000/api/libro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const nuevoLibro = await response.json();
        alert('Libro creado exitosamente');
        // Usar slug para libros creados manualmente
        navigate(`/libro/${nuevoLibro.slug}`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear el libro');
      }

    } catch (error) {
      console.error('Error al crear libro:', error);
      alert(error instanceof Error ? error.message : 'Error al crear el libro');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthorized === null) {
    return (
      <div className="flex justify-center items-center py-12 min-h-screen">
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
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-600 mb-2">Acceso Denegado</h1>
          <p className="text-gray-600 dark:text-gray-400">Solo los administradores pueden crear libros.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Book className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Crear Nuevo Libro</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Completa la información del libro para agregarlo a la plataforma
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Información Básica</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre del Libro */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre del Libro *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={libroData.nombre}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.nombre ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Ingresa el nombre del libro"
                />
                {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
              </div>

              {/* Autor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Autor *
                </label>
                <div className="flex gap-2">
                  <select
                    name="autorId"
                    value={libroData.autorId}
                    onChange={handleInputChange}
                    className={`flex-1 px-4 py-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.autorId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <option value="">Selecciona un autor</option>
                    {Array.isArray(autores) && autores.map(autor => (
                      <option key={autor.id} value={autor.id}>
                        {autor.nombre} {autor.apellido}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowAutorModal(true)}
                    className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
                    title="Crear nuevo autor"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">Nuevo</span>
                  </button>
                </div>
                {errors.autorId && <p className="text-red-500 text-sm mt-1">{errors.autorId}</p>}
              </div>

              {/* External ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ID Externo (opcional)
                </label>
                <input
                  type="text"
                  name="externalId"
                  value={libroData.externalId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ID de Google Books, OpenLibrary, etc."
                />
              </div>

              {/* Enlace */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enlace (opcional)
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    name="enlace"
                    value={libroData.enlace}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://ejemplo.com/libro"
                  />
                </div>
              </div>

              {/* Source */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fuente (opcional)
                </label>
                <input
                  type="text"
                  name="source"
                  value={libroData.source}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Google Books, OpenLibrary, etc."
                />
              </div>
            </div>

            {/* Sinopsis */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sinopsis *
              </label>
              <textarea
                name="sinopsis"
                value={libroData.sinopsis}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.sinopsis ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Describe brevemente de qué trata el libro..."
              />
              {errors.sinopsis && <p className="text-red-500 text-sm mt-1">{errors.sinopsis}</p>}
            </div>
          </div>

          {/* Clasificación */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Clasificación</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Editorial */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Editorial (opcional)
                </label>
                <select
                  name="editorialId"
                  value={libroData.editorialId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecciona una editorial</option>
                  {Array.isArray(editoriales) && editoriales.map(editorial => (
                    <option key={editorial.id} value={editorial.id}>
                      {editorial.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Categoría (opcional)
                </label>
                <div className="flex gap-2">
                  <select
                    name="categoriaId"
                    value={libroData.categoriaId}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecciona una categoría</option>
                    {Array.isArray(categorias) && categorias.map(categoria => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowCategoriaModal(true)}
                    className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
                    title="Crear nueva categoría"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">Nueva</span>
                  </button>
                </div>
              </div>

              {/* Saga (opcional) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Saga (opcional)
                </label>
                <select
                  name="sagaId"
                  value={libroData.sagaId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">No pertenece a una saga</option>
                  {Array.isArray(sagas) && sagas.map(saga => (
                    <option key={saga.id} value={saga.id}>
                      {saga.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Imagen */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Imagen del Libro</h2>
            
            {/* Input de URL de imagen */}
            <div className="flex items-start space-x-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  URL de la Imagen
                </label>
                <input
                  type="url"
                  name="imagenUrl"
                  value={libroData.imagenUrl}
                  onChange={(e) => {
                    handleInputChange(e);
                    setPortadaPreview(e.target.value);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
              
              {portadaPreview && (
                <div className="flex-shrink-0">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Vista Previa</p>
                  <img
                    src={portadaPreview}
                    alt="Vista previa"
                    className="w-32 h-40 object-cover rounded-lg shadow-md"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/128x160?text=Error';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/libros')}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Plus className="w-5 h-5" />
              )}
              <span>{loading ? 'Creando...' : 'Crear Libro'}</span>
            </button>
          </div>
        </form>

        {/* Modal para Crear Autor */}
        {showAutorModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Crear Nuevo Autor</h3>
                <button
                  onClick={() => setShowAutorModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={nuevoAutor.nombre}
                    onChange={handleNuevoAutorChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Nombre del autor"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    value={nuevoAutor.apellido}
                    onChange={handleNuevoAutorChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Apellido del autor"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Biografía (opcional)
                  </label>
                  <textarea
                    name="biografia"
                    value={nuevoAutor.biografia}
                    onChange={handleNuevoAutorChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Breve biografía del autor..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    URL de Foto (opcional)
                  </label>
                  <input
                    type="url"
                    name="foto"
                    value={nuevoAutor.foto}
                    onChange={handleNuevoAutorChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="https://ejemplo.com/foto.jpg"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAutorModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleCrearAutor}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  <span>Crear Autor</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para Crear Categoría */}
        {showCategoriaModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Crear Nueva Categoría</h3>
                <button
                  onClick={() => setShowCategoriaModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={nuevaCategoria.nombre}
                    onChange={handleNuevaCategoriaChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ej: Fantasy, Mystery, Romance..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descripción (opcional)
                  </label>
                  <textarea
                    name="descripcion"
                    value={nuevaCategoria.descripcion}
                    onChange={handleNuevaCategoriaChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Breve descripción de la categoría..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCategoriaModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleCrearCategoria}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  <span>Crear Categoría</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};