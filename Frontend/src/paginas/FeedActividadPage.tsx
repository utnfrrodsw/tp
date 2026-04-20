import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/api.config';

interface Actividad {
  id: number;
  usuario: {
    id: number;
    username: string;
    nombre: string;
    apellido: string;
    avatar?: string;
  };
  tipo: 'resena' | 'respuesta' | 'seguimiento' | 'lista' | 'favorito'; // 'reaccion' eliminado - no se muestra en feed
  libro?: {
    id: number;
    nombre: string;
    autor?: {
      nombre: string;
    };
  };
  resena?: {
    id: number;
    contenido?: string;
    estrellas: number;
    esRespuesta?: boolean;
    resenaPadreAutor?: {
      nombre: string;
      apellido: string;
    };
  };
  fecha: string;
}

// Componente para renderizar avatar con link opcional al perfil
const UserAvatar: React.FC<{ 
  usuario: { id?: number; nombre?: string; username: string; avatar?: string }; 
  size?: string;
  clickable?: boolean;
  currentUserId?: number | null;
}> = ({ usuario, size = "w-14 h-14", clickable = true, currentUserId = null }) => {
  const [imageError, setImageError] = React.useState(false);
  
  // Determinar la fuente del avatar
  const getAvatarSrc = () => {
    if (!usuario.avatar) return null;
    
    // Si es una URL completa (http/https), usarla directamente
    if (usuario.avatar.startsWith('http://') || usuario.avatar.startsWith('https://')) {
      return usuario.avatar;
    }
    
    // Si tiene extensión, usar directamente desde assets
    if (usuario.avatar.includes('.')) {
      return `/assets/${usuario.avatar}`;
    }
    
    // Si no tiene extensión, asumir .svg
    return `/assets/${usuario.avatar}.svg`;
  };

  const avatarSrc = getAvatarSrc();
  const displayName = usuario.nombre || usuario.username || "U";
  const initials = displayName
    .split(" ")
    .filter(s => s.length > 0)
    .map(s => s[0]?.toUpperCase())
    .filter(c => c && /[A-Z]/.test(c))
    .slice(0, 2)
    .join("") || displayName[0]?.toUpperCase() || "U";

  const placeholder = (
    <div className={`${size} rounded-full flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-lg`}>
      {initials}
    </div>
  );

  const content = !imageError && avatarSrc ? (
    <img
      src={avatarSrc}
      alt={`Avatar de ${usuario.username || usuario.nombre}`}
      className={`${size} rounded-full object-cover`}
      onError={() => setImageError(true)}
    />
  ) : placeholder;

  // Si es clickable, no es el usuario actual y tiene ID, envolver en Link
  if (clickable && usuario.id && usuario.id !== currentUserId) {
    return (
      <Link to={`/perfil/${usuario.id}`} className="hover:opacity-80 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
};

const FeedActividadPage: React.FC = () => {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('all');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const cargarActividades = useCallback(async (append = false, forceRefresh = false) => {
    try {
      if (!append) {
        setLoading(true);
        setOffset(0);
        setActividades([]); // Limpiar actividades al cambiar filtro
      } else {
        setLoadingMore(true);
      }

      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Debes iniciar sesión');
        setLoading(false);
        return;
      }

      const currentOffset = append ? offset : 0;
      const params: any = {
        limit: 20,
        offset: currentOffset,
      };

      if (filtroTipo !== 'all') {
        params.tipos = filtroTipo;
      }

      // Agregar timestamp para forzar bypass del caché
      if (forceRefresh) {
        params._t = Date.now();
      }

      const response = await axios.get(
        `${API_BASE_URL}/feed`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params
        }
      );

      if (append) {
        setActividades(prev => [...prev, ...response.data.actividades]);
      } else {
        setActividades(response.data.actividades);
      }

      setHasMore(response.data.hasMore);
      setOffset(currentOffset + response.data.actividades.length);
    } catch (err: any) {
      console.error('Error cargando feed:', err);
      setError(err.response?.data?.error || 'Error al cargar el feed');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filtroTipo]);

  useEffect(() => {
    cargarActividades();
  }, [cargarActividades]);

  // Auto-refresh cuando la página se vuelve visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Recargar si han pasado más de 30 segundos desde la última actualización
        if (Date.now() - lastUpdate > 30000) {
          cargarActividades(false, true); // Force refresh
          setLastUpdate(Date.now());
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [cargarActividades, lastUpdate]);

  const handleRefresh = () => {
    cargarActividades(false, true); // Force refresh para bypass del caché
    setLastUpdate(Date.now());
  };

  const cargarMas = () => {
    if (!loadingMore && hasMore) {
      cargarActividades(true);
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'resena':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      case 'respuesta':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'seguimiento':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'lista':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        );
      case 'favorito':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'resena': return 'from-yellow-500 to-orange-500';
      case 'respuesta': return 'from-green-500 to-emerald-500';
      case 'seguimiento': return 'from-blue-500 to-cyan-500';
      case 'lista': return 'from-purple-500 to-pink-500';
      case 'favorito': return 'from-red-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTipoTexto = (tipo: string, actividad?: Actividad) => {
    switch (tipo) {
      case 'resena':
        return 'escribió una reseña';
      case 'respuesta':
        if (actividad?.resena?.resenaPadreAutor) {
          const autorNombre = `${actividad.resena.resenaPadreAutor.nombre} ${actividad.resena.resenaPadreAutor.apellido}`.trim();
          return `respondió a la reseña de ${autorNombre}`;
        }
        return 'respondió a una reseña';
      case 'seguimiento': return 'comenzó a seguir a alguien';
      case 'lista': return 'actualizó una lista';
      case 'favorito': return 'agregó a favoritos';
      default: return tipo.toLowerCase();
    }
  };

  const getTipoBadge = (tipo: string) => {
    const badges = {
      'resena': { text: 'Reseña', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
      'respuesta': { text: 'Respuesta', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
      'seguimiento': { text: 'Seguimiento', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      'lista': { text: 'Lista', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
      'favorito': { text: 'Favorito', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    };
    return badges[tipo as keyof typeof badges] || { text: tipo, color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
  };

  const formatearFecha = (fecha: string) => {
    try {
      const date = new Date(fecha);
      if (isNaN(date.getTime())) return 'Fecha no disponible';
      
      const ahora = new Date();
      const diferencia = ahora.getTime() - date.getTime();
      const minutos = Math.floor(diferencia / 60000);
      const horas = Math.floor(diferencia / 3600000);
      const dias = Math.floor(diferencia / 86400000);

      if (minutos < 1) return 'Ahora';
      if (minutos < 60) return `${minutos}m`;
      if (horas < 24) return `${horas}h`;
      if (dias < 7) return `${dias}d`;
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) {
      return 'Fecha no disponible';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold text-red-500 mb-2">Error</h2>
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-black py-12 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 via-blue-600 to-indigo-700 dark:from-cyan-400 dark:to-blue-500">
              Feed de Actividad
            </h1>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Refrescar feed"
            >
              <svg 
                className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                />
              </svg>
              <span className="hidden sm:inline">Refrescar</span>
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Últimas actividades de usuarios que sigues
          </p>
        </motion.div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex flex-wrap gap-2"
        >
          {[
            { value: 'all', label: 'Todas' },
            { value: 'resena', label: 'Reseñas' },
            { value: 'respuesta', label: 'Respuestas' },
            { value: 'favorito', label: 'Favoritos' },
            { value: 'lista', label: 'Listas' },
            { value: 'seguimiento', label: 'Seguimientos' },
          ].map((filtro) => (
            <button
              key={filtro.value}
              onClick={() => setFiltroTipo(filtro.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filtroTipo === filtro.value
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800/50 text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-transparent'
              }`}
            >
              {filtro.label}
            </button>
          ))}
        </motion.div>

        {/* Feed */}
        {actividades.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="bg-white dark:bg-gray-800/30 rounded-lg p-12 border border-gray-200 dark:border-gray-700">
              <svg
                className="w-24 h-24 mx-auto mb-4 text-gray-400 dark:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-300 mb-2">
                No hay actividad reciente
              </h3>
              <p className="text-gray-600 dark:text-gray-500 mb-6">
                Las actividades de los usuarios que sigues aparecerán aquí
              </p>
              <Link
                to="/siguiendo"
                className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all"
              >
                Ver usuarios seguidos
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {actividades.map((actividad, index) => {
              const badge = getTipoBadge(actividad.tipo);
              return (
                <motion.div
                  key={actividad.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800/90 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-cyan-400 dark:hover:border-cyan-500 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300"
                >
                  <div className="flex gap-4">
                    {/* Avatar con badge de tipo de actividad */}
                    <div className="flex-shrink-0 relative">
                      <UserAvatar 
                        usuario={{
                          id: actividad.usuario.id,
                          nombre: `${actividad.usuario.nombre} ${actividad.usuario.apellido}`,
                          username: actividad.usuario.username,
                          avatar: actividad.usuario.avatar
                        }} 
                        size="w-14 h-14"
                        clickable={true}
                      />
                      {/* Icono de tipo de actividad más grande */}
                      <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br ${getTipoColor(actividad.tipo)} flex items-center justify-center text-white shadow-md ring-2 ring-gray-900`}>
                        {getTipoIcon(actividad.tipo)}
                      </div>
                    </div>

                    {/* Contenido mejorado */}
                    <div className="flex-1 min-w-0">
                      {/* Header con badge */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Link
                              to={`/perfil/${actividad.usuario.id}`}
                              className="font-bold text-gray-900 dark:text-white hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
                            >
                              {actividad.usuario.nombre} {actividad.usuario.apellido}
                            </Link>
                            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${badge.color}`}>
                              {badge.text}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {getTipoTexto(actividad.tipo, actividad)}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-500 font-medium bg-gray-100 dark:bg-gray-800/50 px-2.5 py-1 rounded-full flex-shrink-0">
                          {formatearFecha(actividad.fecha)}
                        </span>
                      </div>

                      {/* Libro (si aplica) - Mejorado */}
                      {actividad.libro && (
                        <div className="mt-4 p-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:border-cyan-400 dark:hover:border-cyan-500 transition-all duration-300 hover:shadow-xl">
                          <div className="flex items-center gap-3">
                            <svg className="w-8 h-8 text-cyan-600 dark:text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                            </svg>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-base text-gray-900 dark:text-white line-clamp-1">
                                {actividad.libro.nombre}
                              </p>
                              {actividad.libro.autor && (
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  <span className="text-gray-500 dark:text-gray-400">por</span> {actividad.libro.autor.nombre}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Reseña (si aplica) - Mejorado */}
                      {actividad.resena && (
                        <div className={`mt-4 p-5 rounded-xl border-2 shadow-md ${
                          actividad.tipo === 'respuesta' 
                            ? 'bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border-green-400 dark:border-green-500'
                            : 'bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 border-yellow-400 dark:border-yellow-500'
                        }`}>
                          {/* Solo mostrar estrellas si NO es una respuesta */}
                          {actividad.tipo !== 'respuesta' && (
                            <div className="flex items-center gap-3 mb-3">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-6 h-6 ${i < actividad.resena!.estrellas ? 'fill-yellow-500 dark:fill-yellow-400' : 'fill-gray-300 dark:fill-gray-600'}`}
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-base font-bold text-yellow-800 dark:text-yellow-200 bg-yellow-200 dark:bg-yellow-900/50 px-3 py-1 rounded-full shadow-sm">
                                {actividad.resena.estrellas} / 5
                              </span>
                            </div>
                          )}
                          {actividad.resena.contenido && actividad.resena.contenido.trim() && (
                            <p className={`text-sm text-gray-800 dark:text-gray-200 leading-relaxed italic ${actividad.tipo === 'respuesta' ? 'mt-0' : ''}`}>
                              "{actividad.resena.contenido}"
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Botón cargar más - Mejorado */}
            {hasMore && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center pt-8"
              >
                <button
                  onClick={cargarMas}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl hover:shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                >
                  {loadingMore ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                      Cargando más actividades...
                    </span>
                  ) : (
                    'Ver más actividades'
                  )}
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedActividadPage;
