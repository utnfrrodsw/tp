import React, { useState, useEffect } from 'react';
import { Star, Loader2, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  getRatingLibroByLibroId, 
  createOrUpdateRatingLibro, 
  deleteRatingLibroByLibroId
} from '../services/ratingLibroService';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickRatingProps {
  libroId: string | number;
  onRatingChange?: () => void;
}

export const QuickRating: React.FC<QuickRatingProps> = ({ libroId, onRatingChange }) => {
  const [userRating, setUserRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [justRated, setJustRated] = useState(false);

  useEffect(() => {
    loadUserRating();
  }, [libroId]);

  const loadUserRating = async () => {
    try {
      setLoading(true);
      const rating = await getRatingLibroByLibroId(libroId);
      if (rating?.avgRating) {
        setUserRating(Math.round(rating.avgRating));
      }
    } catch (error: any) {
      // Silently handle - backend now returns default values for books without ratings
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (rating: number) => {
    if (submitting) return;

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Debes iniciar sesión para calificar');
      return;
    }

    try {
      setSubmitting(true);
      
      // 1. NUEVO: Asegurar que el libro exista en la BD (para libros externos)
      if (typeof libroId === 'string') {
        console.log(`🔄 Verificando/creando libro ${libroId} en BD...`);
        try {
          await fetch(`http://localhost:3000/api/libro/ensure-exists/${libroId}`, {
            method: 'POST',
          });
        } catch (ensureError) {
          console.error('Error al asegurar que libro existe:', ensureError);
          // Continuamos de todas formas, el backend intentará buscar el libro
        }
      }
      
      // 2. Si hace click en la misma estrella, eliminar rating
      if (userRating === rating) {
        await deleteRatingLibroByLibroId(libroId, token);
        setUserRating(0);
        toast.success('Calificación eliminada');
      } else {
        // 3. Crear o actualizar rating
        await createOrUpdateRatingLibro({
          libroId,
          avgRating: rating,
          cantidadResenas: 1,
        }, token);
        setUserRating(rating);
        setJustRated(true);
        toast.success(`¡Calificaste con ${rating} estrella${rating !== 1 ? 's' : ''}!`);
        
        // Animación de "guardado"
        setTimeout(() => setJustRated(false), 2000);
      }

      // Notificar al componente padre
      onRatingChange?.();
    } catch (error: any) {
      console.error('Error al calificar:', error);
      if (error.response?.status === 401) {
        toast.error('Debes iniciar sesión para calificar');
      } else {
        toast.error('Error al guardar calificación');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-2xl p-6 border-2 border-amber-200 dark:border-amber-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            Calificación Rápida
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {userRating > 0 ? 'Tu calificación' : 'Califica este libro sin escribir reseña'}
          </p>
        </div>
        
        <AnimatePresence>
          {justRated && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium text-sm"
            >
              <Check className="w-4 h-4" />
              Guardado
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2">
        {Array.from({ length: 5 }, (_, i) => {
          const idx = i + 1;
          const active = hover ? idx <= hover : idx <= userRating;
          
          return (
            <motion.button
              key={idx}
              type="button"
              disabled={submitting}
              aria-label={`${idx} estrella${idx !== 1 ? 's' : ''}`}
              onMouseEnter={() => !submitting && setHover(idx)}
              onMouseLeave={() => setHover(0)}
              onClick={() => handleRate(idx)}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-lg transition-all ${
                submitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              } ${
                active 
                  ? 'text-amber-400 dark:text-amber-500' 
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            >
              <Star 
                className={`w-8 h-8 transition-all ${
                  active ? 'fill-current drop-shadow-lg' : ''
                }`}
              />
            </motion.button>
          );
        })}
      </div>

      {userRating > 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
          Click en la misma estrella para eliminar tu calificación
        </p>
      )}
    </div>
  );
};
