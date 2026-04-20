import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { seguimientoService } from '../services/seguimientoService';

interface SeguirUsuarioButtonProps {
  usuarioId: number;
  username?: string;
  className?: string;
  onFollowChange?: (isSiguiendo: boolean) => void;
}

const SeguirUsuarioButton: React.FC<SeguirUsuarioButtonProps> = ({ 
  usuarioId, 
  username = 'este usuario',
  className = '',
  onFollowChange
}) => {
  const [isSiguiendo, setIsSiguiendo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');

  // Verificar si ya sigue al usuario
  useEffect(() => {
    verificarSeguimiento();
  }, [usuarioId]);

  const verificarSeguimiento = async () => {
    try {
      setChecking(true);
      const isFollowing = await seguimientoService.isFollowing(usuarioId);
      setIsSiguiendo(isFollowing);
    } catch (err: any) {
      console.error('Error verificando seguimiento:', err);
      // Si hay error, asumimos que no sigue
      setIsSiguiendo(false);
    } finally {
      setChecking(false);
    }
  };

  const handleSeguir = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await seguimientoService.followUser(usuarioId);
      
      setIsSiguiendo(true);
      if (onFollowChange) onFollowChange(true);
      
      // Mostrar mensaje de éxito
      console.log(response.message || `Ahora sigues a ${username}`);
    } catch (err: any) {
      console.error('Error al seguir:', err);
      setError(err.message || 'Error al seguir usuario');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDejarDeSeguir = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await seguimientoService.unfollowUser(usuarioId);
      
      setIsSiguiendo(false);
      if (onFollowChange) onFollowChange(false);
      
      console.log(response.message || `Dejaste de seguir a ${username}`);
    } catch (err: any) {
      console.error('Error al dejar de seguir:', err);
      setError(err.message || 'Error al dejar de seguir');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <button
        disabled
        className={`px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed ${className}`}
      >
        <span className="inline-block animate-pulse">Cargando...</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={isSiguiendo ? handleDejarDeSeguir : handleSeguir}
        disabled={loading}
        className={`
          px-4 py-2 rounded-lg font-semibold transition-all
          ${isSiguiendo
            ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400'
            : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700'
          }
          ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {isSiguiendo ? 'Dejando...' : 'Siguiendo...'}
          </span>
        ) : (
          <span className="flex items-center gap-2">
            {isSiguiendo ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Siguiendo
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Seguir
              </>
            )}
          </span>
        )}
      </motion.button>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute top-full mt-2 left-0 right-0 bg-red-500 text-white text-sm px-3 py-2 rounded-lg shadow-lg z-50"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
};

export default SeguirUsuarioButton;
