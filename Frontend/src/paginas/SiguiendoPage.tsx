import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import SeguirUsuarioButton from '../componentes/SeguirUsuarioButton';
import { seguimientoService, Usuario } from '../services/seguimientoService';
import { LogIn } from 'lucide-react';

// Componente para renderizar avatar con link opcional al perfil
const UserAvatar: React.FC<{ 
  usuario: { id?: number; nombre?: string; username: string; avatar?: string }; 
  size?: string;
  clickable?: boolean;
  currentUserId?: number | null;
}> = ({ usuario, size = "w-14 h-14", clickable = true, currentUserId = null }) => {
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

  const avatarContent = avatarSrc ? (
    <img
      src={avatarSrc}
      alt={`Avatar de ${usuario.username || usuario.nombre}`}
      className={`${size} rounded-full object-cover`}
      onError={(e) => {
        // Si falla la carga, mostrar placeholder
        e.currentTarget.style.display = 'none';
        if (e.currentTarget.nextElementSibling) {
          (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
        }
      }}
    />
  ) : (
    <div className={`${size} rounded-full flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-lg`}>
      {((usuario.nombre || usuario.username) || "?")
        .split(" ")
        .map(s => s[0]?.toUpperCase() || "?")
        .slice(0, 2)
        .join("")}
    </div>
  );

  // Agregar div de fallback si hay imagen
  const contentWithFallback = avatarSrc ? (
    <>
      {avatarContent}
      <div className={`${size} rounded-full flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-lg`} style={{ display: 'none' }}>
        {((usuario.nombre || usuario.username) || "?")
          .split(" ")
          .map(s => s[0]?.toUpperCase() || "?")
          .slice(0, 2)
          .join("")}
      </div>
    </>
  ) : avatarContent;

  // Si es clickable, no es el usuario actual y tiene ID, envolver en Link
  if (clickable && usuario.id && usuario.id !== currentUserId) {
    return (
      <Link to={`/perfil/${usuario.id}`} className="hover:opacity-80 transition-opacity">
        {contentWithFallback}
      </Link>
    );
  }

  return contentWithFallback;
};

const SiguiendoPage: React.FC = () => {
  const navigate = useNavigate();
  const [siguiendo, setSiguiendo] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('');
  const [requiresAuth, setRequiresAuth] = useState(false);

  useEffect(() => {
    cargarSiguiendo();
  }, []);

  const cargarSiguiendo = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setError('Debes iniciar sesión para ver los usuarios que sigues');
        setRequiresAuth(true);
        setLoading(false);
        return;
      }

      const seguidos = await seguimientoService.getSeguidos();
      setSiguiendo(seguidos);
      setRequiresAuth(false);
    } catch (err: any) {
      console.error('Error cargando usuarios seguidos:', err);
      if (err.message.includes('autenticado') || err.message.includes('token') || err.message.includes('Sesión expirada')) {
        setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        setRequiresAuth(true);
      } else {
        setError(err.message || 'Error al cargar usuarios seguidos');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFollowChange = (usuarioId: number, isSiguiendo: boolean) => {
    if (!isSiguiendo) {
      // Remover de la lista si dejó de seguir
      setSiguiendo(prev => prev.filter(u => u.id !== usuarioId));
    }
  };

  const usuariosFiltrados = siguiendo.filter(usuario => 
    usuario.username.toLowerCase().includes(filtro.toLowerCase()) ||
    (usuario.nombre?.toLowerCase().includes(filtro.toLowerCase()) ?? false)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f1419] py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f1419] py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#1a2332] border border-red-200 dark:border-red-700 rounded-2xl p-8 text-center shadow-lg"
          >
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              {requiresAuth ? (
                <LogIn className="w-10 h-10 text-red-500 dark:text-red-400" />
              ) : (
                <svg className="w-10 h-10 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
              {requiresAuth ? '🔒 Acceso Restringido' : 'Error'}
            </h2>
            <p className="text-red-600 dark:text-red-300 mb-6 text-lg">{error}</p>
            {requiresAuth ? (
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate('/LoginPage')}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all flex items-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  Volver al Inicio
                </button>
              </div>
            ) : (
              <button
                onClick={() => cargarSiguiendo()}
                className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all"
              >
                Reintentar
              </button>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1419] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Siguiendo
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {siguiendo.length} {siguiendo.length === 1 ? 'usuario' : 'usuarios'}
          </p>
        </motion.div>

        {/* Barra de búsqueda */}
        {siguiendo.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nombre o usuario..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-white dark:bg-[#1a2332] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 transition-colors"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </motion.div>
        )}

        {/* Lista de usuarios */}
        {usuariosFiltrados.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="bg-white dark:bg-[#1a2332] rounded-lg p-12 border border-gray-200 dark:border-gray-600 shadow-sm">
              <svg
                className="w-24 h-24 mx-auto mb-4 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                {filtro ? 'No se encontraron usuarios' : 'No sigues a nadie aún'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {filtro 
                  ? 'Intenta con otro término de búsqueda' 
                  : 'Explora perfiles de usuarios y comienza a seguir a otros lectores'
                }
              </p>
              {!filtro && (
                <Link
                  to="/libros"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all"
                >
                  Explorar libros
                </Link>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {usuariosFiltrados.map((usuario, index) => (
              <motion.div
                key={usuario.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-[#1a2332] border border-gray-200 dark:border-gray-600 rounded-lg p-6 hover:border-cyan-500 dark:hover:border-cyan-400 transition-all shadow-sm hover:shadow-md"
              >
                {/* Avatar y nombre */}
                <div className="flex items-start gap-4 mb-4">
                  <UserAvatar 
                    usuario={{
                      id: usuario.id,
                      nombre: usuario.nombre || usuario.username,
                      username: usuario.username,
                      avatar: usuario.avatar
                    }} 
                    size="w-16 h-16"
                    clickable={true}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/perfil/${usuario.id}`}
                      className="font-semibold text-gray-900 dark:text-gray-100 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors block truncate"
                    >
                      {usuario.nombre || usuario.username}
                    </Link>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">@{usuario.username}</p>
                  </div>
                </div>

                {/* Bio */}
                {usuario.biografia && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {usuario.biografia}
                  </p>
                )}

                {/* Acciones */}
                <div className="flex gap-2">
                  <Link
                    to={`/perfil/${usuario.id}`}
                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-[#2a3648] text-gray-900 dark:text-gray-100 text-center rounded-lg hover:bg-gray-200 dark:hover:bg-[#364153] transition-colors font-medium text-sm"
                  >
                    Ver perfil
                  </Link>
                  <SeguirUsuarioButton
                    usuarioId={usuario.id}
                    username={usuario.username}
                    className="flex-shrink-0"
                    onFollowChange={(isSiguiendo) => handleFollowChange(usuario.id, isSiguiendo)}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SiguiendoPage;
