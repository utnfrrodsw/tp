// src/componentes/VoteButtons.tsx
import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  votarLibro,
  eliminarVoto,
  obtenerVotoUsuario,
  obtenerEstadisticasLibro,
} from '../services/votacionService';

interface VoteButtonsProps {
  libroId: number;
  showStats?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const VoteButtons: React.FC<VoteButtonsProps> = ({
  libroId,
  showStats = true,
  size = 'md',
}) => {
  const [votoActual, setVotoActual] = useState<'positivo' | 'negativo' | null>(null);
  const [stats, setStats] = useState({ positivos: 0, negativos: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(false);

  // Sizes
  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  // Cargar voto del usuario y estadísticas
  useEffect(() => {
    loadVoteData();
  }, [libroId]);

  const loadVoteData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Siempre cargar estadísticas
      const statsData = await obtenerEstadisticasLibro(libroId);
      setStats(statsData);

      // Solo cargar voto del usuario si está autenticado
      if (token) {
        const votoData = await obtenerVotoUsuario(libroId);
        setVotoActual(votoData.voto);
      }
    } catch (error: any) {
      // Solo mostrar error si no es un error de autenticación
      if (error.response?.status !== 401) {
        console.error('Error loading vote data:', error);
      }
    }
  };

  const handleVote = async (tipoVoto: 'positivo' | 'negativo') => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Debes iniciar sesión para votar');
      return;
    }

    setIsLoading(true);
    try {
      if (votoActual === tipoVoto) {
        // Si clickea el mismo voto, eliminarlo
        await eliminarVoto(libroId);
        setVotoActual(null);
        toast.success('Voto eliminado');
      } else {
        // Votar o cambiar voto
        await votarLibro(libroId, tipoVoto);
        setVotoActual(tipoVoto);
        toast.success(
          tipoVoto === 'positivo' ? '¡Voto positivo!' : 'Voto negativo registrado'
        );
      }
      // Recargar estadísticas
      await loadVoteData();
    } catch (error: any) {
      console.error('Error al votar:', error);
      toast.error(error.response?.data?.error || 'Error al registrar el voto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Botón positivo */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation(); // Evitar navegación si está dentro de un card clickeable
          handleVote('positivo');
        }}
        disabled={isLoading}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`
          ${sizeClasses[size]}
          ${
            votoActual === 'positivo'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/30'
          }
          rounded-lg transition-all duration-200 flex items-center gap-1
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        aria-label="Voto positivo"
      >
        <ThumbsUp className={iconSizes[size]} />
        {showStats && (
          <span className={`font-semibold ${textSizes[size]}`}>{stats.positivos}</span>
        )}
      </motion.button>

      {/* Botón negativo */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          handleVote('negativo');
        }}
        disabled={isLoading}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`
          ${sizeClasses[size]}
          ${
            votoActual === 'negativo'
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/30'
          }
          rounded-lg transition-all duration-200 flex items-center gap-1
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        aria-label="Voto negativo"
      >
        <ThumbsDown className={iconSizes[size]} />
        {showStats && (
          <span className={`font-semibold ${textSizes[size]}`}>{stats.negativos}</span>
        )}
      </motion.button>
    </div>
  );
};
