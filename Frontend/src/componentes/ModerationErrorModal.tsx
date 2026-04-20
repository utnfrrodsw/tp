// src/componentes/ModerationErrorModal.tsx
import React from 'react';
import { AlertCircle, X, Shield, BookOpen, MessageSquare, ThumbsDown } from 'lucide-react';

interface ModerationErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string;
  moderationDetails?: {
    score?: number;
    reasons?: string[];
    autoRejected?: boolean;
  };
}

export const ModerationErrorModal: React.FC<ModerationErrorModalProps> = ({
  isOpen,
  onClose,
  errorMessage,
  moderationDetails
}) => {
  if (!isOpen) return null;

  const getNormasPorRazones = (reasons: string[] = []) => {
    const normasRelevantes = [];
    
    if (reasons.some(r => r.toLowerCase().includes('profanidad') || r.toLowerCase().includes('ofensivo'))) {
      normasRelevantes.push({
        icon: <Shield className="w-5 h-5 text-red-500" />,
        titulo: 'Lenguaje Respetuoso',
        descripcion: 'No se permite lenguaje ofensivo, insultos o palabras inapropiadas.'
      });
    }
    
    if (reasons.some(r => r.toLowerCase().includes('spam') || r.toLowerCase().includes('mayúsculas'))) {
      normasRelevantes.push({
        icon: <MessageSquare className="w-5 h-5 text-orange-500" />,
        titulo: 'Contenido de Calidad',
        descripcion: 'Evita usar mayúsculas excesivas, repeticiones o contenido tipo spam.'
      });
    }
    
    if (reasons.some(r => r.toLowerCase().includes('sentimiento') || r.toLowerCase().includes('negativo'))) {
      normasRelevantes.push({
        icon: <ThumbsDown className="w-5 h-5 text-yellow-500" />,
        titulo: 'Tono Constructivo',
        descripcion: 'Las críticas son bienvenidas, pero deben ser constructivas y respetuosas.'
      });
    }

    // Normas generales siempre mostradas
    if (normasRelevantes.length === 0) {
      normasRelevantes.push({
        icon: <BookOpen className="w-5 h-5 text-blue-500" />,
        titulo: 'Reseñas Auténticas',
        descripcion: 'Escribe reseñas honestas basadas en tu experiencia de lectura.'
      });
    }

    return normasRelevantes;
  };

  const normas = getNormasPorRazones(moderationDetails?.reasons);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Reseña No Publicada</h2>
              <p className="text-red-100 mt-1">
                {moderationDetails?.autoRejected 
                  ? 'Tu reseña no cumple con nuestras normas de comunidad'
                  : 'Tu reseña necesita revisión'}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Mensaje de error */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium">{errorMessage}</p>
            {moderationDetails?.score !== undefined && (
              <p className="text-red-600 text-sm mt-2">
                Puntuación de calidad: {moderationDetails.score}/100
              </p>
            )}
          </div>

          {/* Razones específicas */}
          {moderationDetails?.reasons && moderationDetails.reasons.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Razones de rechazo:
              </h3>
              <ul className="space-y-2">
                {moderationDetails.reasons.map((razon, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <span className="text-red-500 mt-1">•</span>
                    <span>{razon}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Normas de la Comunidad */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Normas de la Comunidad
            </h3>
            <div className="space-y-4">
              {normas.map((norma, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  {norma.icon}
                  <div>
                    <h4 className="font-semibold text-gray-800">{norma.titulo}</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{norma.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Todas las normas */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">📖 Guía Completa de Reseñas</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>✓ Sé respetuoso con autores y otros lectores</li>
              <li>✓ Basa tu reseña en el contenido del libro</li>
              <li>✓ Evita spoilers sin advertir</li>
              <li>✓ Usa un lenguaje apropiado</li>
              <li>✓ Sé constructivo en tus críticas</li>
              <li>✓ Aporta valor a la comunidad</li>
            </ul>
          </div>

          {/* Sugerencias */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">💡 Sugerencias para mejorar tu reseña:</h4>
            <ul className="text-green-800 text-sm space-y-1">
              <li>• Revisa el lenguaje y reemplaza palabras ofensivas</li>
              <li>• Escribe con un tono más neutral o positivo</li>
              <li>• Evita usar mayúsculas excesivas</li>
              <li>• Sé específico sobre qué te gustó o no del libro</li>
              <li>• Agrega más detalles sobre tu experiencia de lectura</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-b-2xl flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Entendido, intentaré nuevamente
          </button>
        </div>
      </div>
    </div>
  );
};
