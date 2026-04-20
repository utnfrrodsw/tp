import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRegistration } from '../context/RegistrationContext';
import { updateCurrentUser, register } from '../services/authService';

interface Step3Props {
  onPrev: () => void;
  onComplete: () => void;
  setError: (error: string) => void;
  setSuccess: (success: string) => void;
}

const Step3: React.FC<Step3Props> = ({ onPrev, onComplete, setError, setSuccess }) => {
  const { data, updateData } = useRegistration();
  const [loading, setLoading] = useState(false);

  const countries = [
    'Argentina',
    'Australia',
    'Brasil',
    'Canadá',
    'Chile',
    'Colombia',
    'España',
    'Estados Unidos',
    'Francia',
    'Italia',
    'México',
    'Perú',
    'Reino Unido',
    'Uruguay',
    'Venezuela',
    // Add more as needed
  ];

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // First register the user
      await register(data.username, data.email, data.password);

      // Then update the user profile with additional fields
      await updateCurrentUser({
        nombre: data.nombre,
        email: data.email,
        username: data.username,
        avatar: data.avatar,
        ubicacion: data.pais,
        genero: data.genero,
        biografia: data.biografia,
      });

      setSuccess('Registro completado exitosamente');
      onComplete();
    } catch (error: any) {
      setError(error.message || 'Error al completar el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Información adicional</h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Completa tu perfil</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nombre completo
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            required
            value={data.nombre}
            onChange={(e) => updateData({ nombre: e.target.value })}
            className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Tu nombre completo"
          />
        </div>

        <div>
          <label htmlFor="pais" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            País
          </label>
          <select
            id="pais"
            name="pais"
            required
            value={data.pais}
            onChange={(e) => updateData({ pais: e.target.value })}
            className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
          >
            <option value="">Selecciona tu país</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="genero" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Género
          </label>
          <select
            id="genero"
            name="genero"
            required
            value={data.genero}
            onChange={(e) => updateData({ genero: e.target.value })}
            className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
          >
            <option value="">Selecciona tu género</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <div>
          <label htmlFor="biografia" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Biografía
          </label>
          <textarea
            id="biografia"
            name="biografia"
            rows={4}
            value={data.biografia}
            onChange={(e) => updateData({ biografia: e.target.value })}
            className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Cuéntanos un poco sobre ti..."
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onPrev}
            className="flex-1 flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            disabled={loading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Anterior
          </button>

          <button
            type="submit"
            className="flex-1 flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Finalizar Registro'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step3;
