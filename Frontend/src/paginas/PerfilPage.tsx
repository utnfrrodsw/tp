import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api.config';
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { User, Mail, AtSign, Calendar, MapPin, BookOpen, Edit3, Settings, Heart, MessageCircle, Users, UserPlus, List as ListIcon, TrendingUp, Compass, Library } from 'lucide-react';
import { getUserIdFromToken } from '../services/authService';
import { usuarioService } from '../services/usuarioService';
import { getResenasByUsuario } from '../services/resenaService';
import { listaService } from '../services/listaService';
import { obtenerFavoritos } from '../services/favoritosService';

interface UserStats {
  seguidores: number;
  siguiendo: number;
  reseñasCount: number;
  listasCount: number;
  favoritosCount: number;
  librosLeidosCount: number;
}

const PerfilPage = () => {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState<any>(null);
  const [stats, setStats] = useState<UserStats>({
    seguidores: 0,
    siguiendo: 0,
    reseñasCount: 0,
    listasCount: 0,
    favoritosCount: 0,
    librosLeidosCount: 0
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        
        // Verificar si hay token (buscar en accessToken primero, luego en token como fallback)
        const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
        console.log('🔑 Token encontrado:', token ? 'Sí' : 'No');
        
        if (!token) {
          console.log('❌ No hay token, redirigiendo a login');
          navigate('/LoginPage');
          return;
        }

        console.log('📡 Haciendo petición a:', `${API_BASE_URL}/usuarios/me`);
        
        // Fetch user profile
        const perfilRes = await axios.get(`${API_BASE_URL}/usuarios/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('✅ Perfil recibido:', perfilRes.data);
        setPerfil(perfilRes.data);
        
        const userId = perfilRes.data.id;

        // Fetch stats in parallel (con manejo de errores individual)
        const [statsRes, reseñasRes, listasRes, todasLasListas, favoritosRes] = await Promise.all([
          usuarioService.getUserStats(userId).catch(err => {
            console.error('Error loading stats:', err);
            return { seguidores: 0, siguiendo: 0 };
          }),
          getResenasByUsuario(userId).catch(err => {
            console.error('Error loading reviews:', err);
            return [];
          }),
          listaService.getListasByUsuario(userId).catch(err => {
            console.error('Error loading user lists:', err);
            return [];
          }),
          listaService.getUserListas().catch(err => {
            console.error('Error loading all lists:', err);
            return [];
          }),
          obtenerFavoritos().catch(err => {
            console.error('Error loading favorites:', err);
            return [];
          })
        ]);

        // Count reviews
        const reseñasData = Array.isArray(reseñasRes) 
          ? reseñasRes 
          : (reseñasRes.reviews || []);

        // Count public lists
        const listasData = Array.isArray(listasRes) ? listasRes : [];

        // Count favoritos
        const favoritosData = Array.isArray(favoritosRes) ? favoritosRes : [];

        // Count libros leídos (buscar lista tipo 'read')
        const listaLeidos = todasLasListas.find(l => l.tipo === 'read');
        let librosLeidosCount = 0;
        if (listaLeidos) {
          const contenidoLeidos = await listaService.getContenidoLista(listaLeidos.id);
          librosLeidosCount = contenidoLeidos.length;
        }

        setStats({
          seguidores: statsRes.seguidores || 0,
          siguiendo: statsRes.siguiendo || 0,
          reseñasCount: reseñasData.length || 0,
          listasCount: listasData.length || 0,
          favoritosCount: favoritosData.length || 0,
          librosLeidosCount: librosLeidosCount
        });

        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching profile data:', err);
        
        // Si es error 401, redirigir al login
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          navigate('/LoginPage');
          return;
        }
        
        setError(err.response?.data?.error || 'Error al cargar perfil');
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  // Mapeo de avatars (igual que en ConfiguracionUsuario)
  const avatarMap: { [key: string]: string } = {
    avatar1: '/assets/avatar1.svg',
    avatar2: '/assets/avatar2.svg',
    avatar3: '/assets/avatar3.svg',
    avatar4: '/assets/avatar4.svg',
    avatar5: '/assets/avatar5.svg',
    avatar6: '/assets/avatar6.svg',
  };

  const resolveAvatarSrc = (avatarValue: string | undefined | null) => {
    if (!avatarValue) return null;
    // Si ya es una URL absoluta o una ruta que empieza con '/', usarla tal cual
    if (avatarValue.startsWith('http') || avatarValue.startsWith('/')) return avatarValue;
    // Si es un id tipo 'avatar1', mapearlo
    return avatarMap[avatarValue] ?? null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <DotLottieReact
            src="https://lottie.host/6d727e71-5a1d-461e-9434-c9e7eb1ae1d1/IWVmdeMHnT.lottie"
            loop
            autoplay
            style={{ width: 80, height: 80 }}
          />
          <p className="text-gray-600 dark:text-gray-300 text-lg">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-red-950 flex items-center justify-center transition-colors duration-300">
        <div className="text-center max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="text-red-500 dark:text-red-400 mb-4">
            <User className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Error al cargar perfil</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  if (!perfil) return null;

  const currentAvatarSrc = resolveAvatarSrc(perfil.avatar);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 transition-colors duration-300">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
            {/* Left Section: Avatar + User Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 flex-1">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-28 h-28 bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/40 dark:border-white/30 overflow-hidden shadow-xl">
                  {currentAvatarSrc ? (
                    <img
                      src={currentAvatarSrc}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-14 h-14 text-white" />
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold mb-1">
                  ¡Hola, {perfil.nombre || perfil.username}!
                </h1>
                <p className="text-lg text-blue-100 dark:text-blue-200 mb-6">
                  Bienvenido de vuelta a tu perfil
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                  <Link
                    to="/configuracion"
                    className="inline-flex items-center px-5 py-2.5 bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-200 border border-white/30 dark:border-white/20 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    <span className="font-medium">Configuración</span>
                  </Link>
                  <Link
                    to="/favoritos"
                    className="inline-flex items-center px-5 py-2.5 bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-200 border border-white/30 dark:border-white/20 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    <span className="font-medium">Mis Favoritos</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Section: Comunidad Stats - Integrado */}
            <div className="w-full lg:w-auto lg:min-w-[300px]">
              <div className="bg-white/15 dark:bg-white/10 backdrop-blur-lg rounded-2xl p-5 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Comunidad
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to={`/perfil/${getUserIdFromToken()}/seguidores`}
                    className="bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all duration-200 rounded-xl p-4 text-center group cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-1"
                  >
                    <UserPlus className="w-5 h-5 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <div className="text-2xl font-bold mb-0.5">{stats.seguidores}</div>
                    <div className="text-xs text-white/90 font-medium">Seguidores</div>
                  </Link>

                  <Link
                    to="/siguiendo"
                    className="bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all duration-200 rounded-xl p-4 text-center group cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-1"
                  >
                    <Users className="w-5 h-5 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <div className="text-2xl font-bold mb-0.5">{stats.siguiendo}</div>
                    <div className="text-xs text-white/90 font-medium">Siguiendo</div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* Profile Information Card */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 px-6 py-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Información del Perfil
                </h2>
              </div>

              <div className="p-5 sm:p-6 space-y-5">
                {/* Basic Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                  <div className="space-y-5">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Correo electrónico</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100 break-words">{perfil.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <AtSign className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Nombre de usuario</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100 break-words">@{perfil.username}</p>
                      </div>
                    </div>

                    {perfil.nombre && (
                      <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Nombre completo</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100 break-words">{perfil.nombre}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-5">
                    {perfil.ubicacion && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Ubicación</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100 break-words">{perfil.ubicacion}</p>
                        </div>
                      </div>
                    )}

                    {perfil.genero && (
                      <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Género</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100 capitalize break-words">{perfil.genero}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Miembro desde</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100 break-words">
                          {perfil.createdAt ? new Date(perfil.createdAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            timeZone: 'UTC'
                          }) : '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Biography Section */}
                {perfil.biografia && (
                  <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                        Acerca de mí
                      </h3>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">{perfil.biografia}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Activity Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-200 dark:border-gray-700">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                  Mi Actividad
                </h3>
              </div>

              <div className="space-y-2.5">
                <div 
                  className={`group flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 hover:shadow-md cursor-default ${
                    stats.reseñasCount > 0 
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-green-200 dark:border-green-800/50' 
                      : 'bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      stats.reseñasCount > 0 
                        ? 'bg-green-100 dark:bg-green-900/30' 
                        : 'bg-gray-200 dark:bg-gray-800'
                    }`}>
                      <MessageCircle className={`w-4 h-4 ${
                        stats.reseñasCount > 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Reseñas escritas</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{stats.reseñasCount}</p>
                    </div>
                  </div>
                </div>

                <div 
                  className={`group flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 hover:shadow-md cursor-default ${
                    stats.listasCount > 0 
                      ? 'bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/10 dark:to-violet-900/10 border-purple-200 dark:border-purple-800/50' 
                      : 'bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      stats.listasCount > 0 
                        ? 'bg-purple-100 dark:bg-purple-900/30' 
                        : 'bg-gray-200 dark:bg-gray-800'
                    }`}>
                      <ListIcon className={`w-4 h-4 ${
                        stats.listasCount > 0 
                          ? 'text-purple-600 dark:text-purple-400' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Listas creadas</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{stats.listasCount}</p>
                    </div>
                  </div>
                </div>

                <div 
                  className={`group flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 hover:shadow-md cursor-default ${
                    stats.favoritosCount > 0 
                      ? 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/10 dark:to-pink-900/10 border-red-200 dark:border-red-800/50' 
                      : 'bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      stats.favoritosCount > 0 
                        ? 'bg-red-100 dark:bg-red-900/30' 
                        : 'bg-gray-200 dark:bg-gray-800'
                    }`}>
                      <Heart className={`w-4 h-4 ${
                        stats.favoritosCount > 0 
                          ? 'text-red-600 dark:text-red-400' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Favoritos</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{stats.favoritosCount}</p>
                    </div>
                  </div>
                </div>

                <div 
                  className={`group flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 hover:shadow-md cursor-default ${
                    stats.librosLeidosCount > 0 
                      ? 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 border-blue-200 dark:border-blue-800/50' 
                      : 'bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      stats.librosLeidosCount > 0 
                        ? 'bg-blue-100 dark:bg-blue-900/30' 
                        : 'bg-gray-200 dark:bg-gray-800'
                    }`}>
                      <BookOpen className={`w-4 h-4 ${
                        stats.librosLeidosCount > 0 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Libros leídos</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{stats.librosLeidosCount}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-5 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Edit3 className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Acciones rápidas</h3>
              </div>

              <div className="space-y-2.5">
                <Link
                  to="/libros"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Explorar Libros</span>
                </Link>

                <Link
                  to="/favoritos"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl hover:from-rose-600 hover:to-pink-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <Heart className="w-4 h-4" />
                  <span>Mis Favoritos</span>
                </Link>

                <Link
                  to="/autores"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-xl hover:from-purple-600 hover:to-violet-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <Users className="w-4 h-4" />
                  <span>Explorar Autores</span>
                </Link>

                <Link
                  to="/sagas"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <Library className="w-4 h-4" />
                  <span>Explorar Sagas</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilPage;
