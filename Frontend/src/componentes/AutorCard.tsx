import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Award } from 'lucide-react';
import { fetchAuthorWithCache, WikipediaAuthorData, WikidataAuthorData } from '../services/wikipediaService';
import { API_BASE_URL } from '../config/api.config';

interface AutorCardProps {
  id?: string;
  name: string;
  photo?: string;
  showEnrichedData?: boolean;
  index?: number;
  external?: boolean;
  nombre?: string;
  apellido?: string;
  googleBooksId?: string;
  openLibraryKey?: string;
  biografia?: string;
}

const AutorCard: React.FC<AutorCardProps> = ({ 
  id, 
  name, 
  photo, 
  showEnrichedData = true,
  index = 0,
  external = false,
  nombre,
  apellido,
  googleBooksId,
  openLibraryKey,
  biografia
}) => {
  const navigate = useNavigate();
  const [enrichedData, setEnrichedData] = useState<(WikipediaAuthorData & WikidataAuthorData) | null>(null);
  const [loading, setLoading] = useState(false);
  const [showBio, setShowBio] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!showEnrichedData) return;

    const loadEnrichedData = async () => {
      setLoading(true);
      try {
        const wikiData = await fetchAuthorWithCache(name);
        setEnrichedData(wikiData);
      } catch (error) {
        console.error('Error loading enriched data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEnrichedData();
  }, [name, showEnrichedData]);


  const getLifeSpan = () => {
    if (!enrichedData) return null;
    
    const birth = enrichedData.birthDate?.split('-')[0];
    const death = enrichedData.deathDate?.split('-')[0];
    
    if (birth && death) {
      return `${birth} - ${death}`;
    } else if (birth) {
      return `${birth} - presente`;
    }
    return null;
  };

  const lifeSpan = getLifeSpan();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 border border-gray-100 dark:border-slate-700 hover:shadow-2xl hover:scale-105 transition-all duration-300 group relative"
      onMouseEnter={() => setShowBio(true)}
      onMouseLeave={() => setShowBio(false)}
    >
      {/* Contenido principal */}
      <div className="flex items-start gap-4">
        {/* Foto del autor o iniciales */}
        <div className="relative flex-shrink-0">
          {(enrichedData?.thumbnail?.source || photo) ? (
            <>
              <img
                src={enrichedData?.thumbnail?.source || photo}
                alt={name}
                className="w-20 h-20 rounded-full object-cover shadow-md group-hover:ring-4 group-hover:ring-cyan-200 dark:group-hover:ring-cyan-600 transition-all duration-300"
                onError={(e) => {

                  (e.target as HTMLImageElement).style.display = 'none';
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) {
                    const initialsDiv = parent.querySelector('.initials-fallback') as HTMLElement;
                    if (initialsDiv) {
                      initialsDiv.style.display = 'flex';
                    }
                  }
                }}
              />
              {/* Fallback de iniciales (oculto por defecto) */}
              <div className="initials-fallback hidden w-20 h-20 rounded-full items-center justify-center bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 dark:from-cyan-400 dark:via-blue-600 dark:to-indigo-700 shadow-lg group-hover:ring-4 group-hover:ring-cyan-200 dark:group-hover:ring-cyan-600 transition-all duration-300 group-hover:scale-110">
                <span className="text-2xl font-bold text-white dark:text-slate-100 select-none">
                  {name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase()}
                </span>
              </div>
            </>
          ) : (

            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 dark:from-cyan-400 dark:via-blue-600 dark:to-indigo-700 shadow-lg group-hover:ring-4 group-hover:ring-cyan-200 dark:group-hover:ring-cyan-600 transition-all duration-300 group-hover:scale-110">
              <span className="text-2xl font-bold text-white dark:text-slate-100 select-none">
                {name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase()}
              </span>
            </div>
          )}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-slate-800/70 rounded-full">
              <div className="w-5 h-5 border-2 border-cyan-600 dark:border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Información */}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors mb-2 truncate">
            {name}
          </h2>

          {/* Badges de información */}
          <div className="flex flex-wrap gap-2 mb-3">
            {enrichedData?.nationality && (
              <span className="inline-flex items-center gap-1 text-xs bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full border border-transparent dark:border-blue-800">
                <MapPin className="w-3 h-3" />
                {enrichedData.nationality}
              </span>
            )}

            {lifeSpan && (
              <span className="inline-flex items-center gap-1 text-xs bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400 px-2 py-1 rounded-full border border-transparent dark:border-purple-800">
                <Calendar className="w-3 h-3" />
                {lifeSpan}
              </span>
            )}

            {enrichedData?.genres && enrichedData.genres.length > 0 && (
              <span className="inline-flex items-center gap-1 text-xs bg-pink-50 dark:bg-pink-950/50 text-pink-700 dark:text-pink-400 px-2 py-1 rounded-full border border-transparent dark:border-pink-800">
                <Award className="w-3 h-3" />
                {enrichedData.genres[0]}
              </span>
            )}
          </div>

          {/* Mini biografía (aparece en hover) */}
          {showBio && enrichedData?.extract && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-gray-600 dark:text-slate-300 line-clamp-3 mb-3 italic"
            >
              {enrichedData.extract.split('.')[0]}.
            </motion.p>
          )}

          {/* Botón de acción */}
          <button
            onClick={async () => {

              if (id && !external) {
                navigate(`/autores/${id}`);
                return;
              }


              if (external) {
                setSaving(true);
                try {
                  console.log('💾 Guardando autor externo en BD:', name);
                  const response = await fetch(`${API_BASE_URL}/autor/external/save`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      nombre: nombre || name.split(' ')[0],
                      apellido: apellido || name.split(' ').slice(1).join(' '),
                      googleBooksId,
                      openLibraryKey,
                      biografia,
                      foto: photo,
                      external: true
                    }),
                  });

                  if (!response.ok) {
                    throw new Error('Error al guardar autor externo');
                  }

                  const savedAutor = await response.json();
                  console.log('✅ Autor guardado con ID:', savedAutor.id);
                  navigate(`/autores/${savedAutor.id}`);
                } catch (error) {
                  console.error('❌ Error guardando autor externo:', error);
                  alert('Error al cargar el autor. Por favor intenta de nuevo.');
                } finally {
                  setSaving(false);
                }
              } else if (id) {
                navigate(`/autores/${id}`);
              }
            }}
            disabled={saving}
            className="inline-flex items-center text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 font-medium transition-colors group-hover:translate-x-1 transform duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Cargando...' : 'Ver detalles'}
            {!saving && (
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Skeleton loader overlay */}
      {loading && !enrichedData && (
        <div className="absolute inset-0 bg-white dark:bg-slate-800 bg-opacity-90 dark:bg-opacity-90 rounded-2xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-cyan-600 dark:border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-gray-500 dark:text-slate-400">Enriqueciendo datos...</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AutorCard;
