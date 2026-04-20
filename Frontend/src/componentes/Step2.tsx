import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRegistration } from '../context/RegistrationContext';

interface Step2Props {
  onNext: () => void;
  onPrev: () => void;
  error: string;
  setError: (error: string) => void;
}

const Step2: React.FC<Step2Props> = ({ onNext, onPrev, error, setError }) => {
  const { data, updateData } = useRegistration();

  const avatars = [
    { id: 'avatar1', src: '/assets/avatar1.svg', alt: 'Avatar 1' },
    { id: 'avatar2', src: '/assets/avatar2.svg', alt: 'Avatar 2' },
    { id: 'avatar3', src: '/assets/avatar3.svg', alt: 'Avatar 3' },
    { id: 'avatar4', src: '/assets/avatar4.svg', alt: 'Avatar 4' },
    { id: 'avatar5', src: '/assets/avatar5.svg', alt: 'Avatar 5' },
    { id: 'avatar6', src: '/assets/avatar6.svg', alt: 'Avatar 6' },
  ];

  const handleAvatarSelect = (avatarId: string) => {
    updateData({ avatar: avatarId });
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!data.avatar) {
      setError('Por favor selecciona un avatar');
      return;
    }

    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Elige tu avatar</h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Selecciona una imagen que te represente</p>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {avatars.map((avatar) => (
            <button
              key={avatar.id}
              type="button"
              onClick={() => handleAvatarSelect(avatar.id)}
              className={`relative p-4 border-2 rounded-lg transition-all duration-200 ${
                data.avatar === avatar.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <img
                src={avatar.src}
                alt={avatar.alt}
                className="w-16 h-16 mx-auto rounded-full"
              />
              {data.avatar === avatar.id && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onPrev}
            className="flex-1 flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Anterior
          </button>

          <button
            type="submit"
            className="flex-1 flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <span>Siguiente</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step2;
