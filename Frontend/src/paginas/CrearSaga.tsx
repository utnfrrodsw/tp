import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Plus, Upload, User, Calendar } from 'lucide-react';
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export const CrearSaga: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagenPreview, setImagenPreview] = useState<string>('');
  
  const [sagaData, setSagaData] = useState({
    nombre: '',
    descripcion: '',
    autor: '',
    añoInicio: '',
    añoFin: '',
    numeroLibros: 0,
    estado: 'en_progreso', // 'completada', 'en_progreso', 'pausada'
    imagen: null as File | null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check user role (replace with actual auth check)
  const userRole = 'admin'; // or 'autor' - get from auth context

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSagaData(prev => ({
      ...prev,
      [name]: name === 'numeroLibros' ? parseInt(value) || 0 : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSagaData(prev => ({ ...prev, imagen: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagenPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!sagaData.nombre.trim()) {
      newErrors.nombre = 'El nombre de la saga es requerido';
    }
    if (!sagaData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }
    if (!sagaData.autor.trim()) {
      newErrors.autor = 'El autor es requerido';
    }
    if (sagaData.añoInicio && sagaData.añoFin && parseInt(sagaData.añoInicio) > parseInt(sagaData.añoFin)) {
      newErrors.añoFin = 'El año de fin no puede ser anterior al año de inicio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
    // TODO: Replace with actual API call
    const formData = new FormData();
    Object.entries(sagaData).forEach(([key, value]) => {
      if (key === 'imagen' && value instanceof File) {
        formData.append(key, value);
      } else if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

      // const response = await fetch('/api/sagas', {
      //   method: 'POST',
      //   body: formData,
      //   headers: {
      //     'Authorization': `Bearer ${getToken()}`
      //   }
      // });

      // if (response.ok) {
      //   const nuevaSaga = await response.json();
      //   navigate(`/saga/${nuevaSaga.id}`);
      // } else {
      //   throw new Error('Error al crear la saga');
      // }

      // Simulate API call
      setTimeout(() => {
        alert('Saga creada exitosamente');
        navigate('/sagas');
      }, 1000);

    } catch (error) {
      console.error('Error al crear saga:', error);
      alert('Error al crear la saga');
    } finally {
      setLoading(false);
    }
  };

  if (userRole !== 'admin' && userRole !== 'autor') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600 dark:text-gray-400">No tienes permisos para crear sagas.</p>
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
            <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Crear Nueva Saga</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Crea una nueva saga de libros para organizar series y colecciones
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Información Básica */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Información Básica</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre de la Saga *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={sagaData.nombre}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${
                    errors.nombre ? 'border-red-500 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Ej: Harry Potter, El Señor de los Anillos..."
                />
                {errors.nombre && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.nombre}</p>}
              </div>

              {/* Autor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Autor *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="autor"
                    value={sagaData.autor}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${
                      errors.autor ? 'border-red-500 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Nombre del autor"
                  />
                </div>
                {errors.autor && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.autor}</p>}
              </div>

              {/* Número de Libros */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Número de Libros Planeados
                </label>
                <input
                  type="number"
                  name="numeroLibros"
                  value={sagaData.numeroLibros || ''}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  placeholder="Ej: 7, 3, 5..."
                />
              </div>

              {/* Año de Inicio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Año de Inicio
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="number"
                    name="añoInicio"
                    value={sagaData.añoInicio}
                    onChange={handleInputChange}
                    min="1000"
                    max={new Date().getFullYear() + 5}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    placeholder="Año del primer libro"
                  />
                </div>
              </div>

              {/* Año de Fin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Año de Finalización
                </label>
                <input
                  type="number"
                  name="añoFin"
                  value={sagaData.añoFin}
                  onChange={handleInputChange}
                  min="1000"
                  max={new Date().getFullYear() + 10}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${
                    errors.añoFin ? 'border-red-500 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Año del último libro (opcional)"
                />
                {errors.añoFin && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.añoFin}</p>}
              </div>

              {/* Estado */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estado de la Saga
                </label>
                <select
                  name="estado"
                  value={sagaData.estado}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                >
                  <option value="en_progreso">En Progreso</option>
                  <option value="completada">Completada</option>
                  <option value="pausada">Pausada</option>
                </select>
              </div>
            </div>

            {/* Descripción */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descripción *
              </label>
              <textarea
                name="descripcion"
                value={sagaData.descripcion}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${
                  errors.descripcion ? 'border-red-500 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Describe la saga, su trama general, personajes principales..."
              />
              {errors.descripcion && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.descripcion}</p>}
            </div>
          </div>

          {/* Imagen de la Saga */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Imagen de la Saga</h2>
            
            <div className="flex items-start space-x-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subir Imagen Representativa
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImagenChange}
                    className="hidden"
                    id="imagen-upload"
                  />
                  <label htmlFor="imagen-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-2">Haz clic para subir una imagen</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">PNG, JPG hasta 5MB</p>
                  </label>
                </div>
              </div>
              
              {imagenPreview && (
                <div className="flex-shrink-0">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Vista Previa</p>
                  <img
                    src={imagenPreview}
                    alt="Vista previa"
                    className="w-32 h-40 object-cover rounded-lg shadow-md"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/sagas')}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
            >
              {loading ? (
                <DotLottieReact
                  src="https://lottie.host/6d727e71-5a1d-461e-9434-c9e7eb1ae1d1/IWVmdeMHnT.lottie"
                  loop
                  autoplay
                  style={{ width: 20, height: 20 }}
                />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              <span>{loading ? 'Creando...' : 'Crear Saga'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};