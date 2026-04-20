import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { User, Star, Heart, Book, List, MessageCircle, Calendar, MapPin, Users, Eye, Lock, ArrowLeft, Edit } from 'lucide-react';
import { usuarioService } from '../services/usuarioService';
import { getResenasByUsuario } from '../services/resenaService';
import { listaService } from '../services/listaService';
import { isAuthenticated, getUserIdFromToken } from '../services/authService';
import SeguirUsuarioButton from '../componentes/SeguirUsuarioButton';

interface Usuario {
  id: number;
  nombre: string;
  username: string;
  email: string;
  genero: 'masculino' | 'femenino' | 'otro';
  fechaRegistro: string;
  ubicacion?: string;
  biografia?: string;
  avatar?: string;
  seguidores: number;
  siguiendo: number;
  librosLeidos: number;
  reseñasEscritas: number;
  listasCreadas: number;
  esSeguido: boolean;
  esPerfilPropio: boolean;
}

interface Reseña {
  id: number;
  libroId: string | number; // Puede ser externalId (string) o id interno (number) como fallback
  libroTitulo: string;
  libroAutor: string;
  libroImagen: string;
  rating: number;
  titulo: string;
  comentario: string;
  fecha: string;
  likes: number;
  esPublica: boolean;
}

interface Lista {
  id: number;
  titulo: string;
  descripcion: string;
  librosCount: number;
  esPublica: boolean;
  fechaCreacion: string;
  seguidores: number;
  librosPortada: string[];
}



export const PerfilUsuario: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [reseñas, setReseñas] = useState<Reseña[]>([]);
  const [listas, setListas] = useState<Lista[]>([]);
  const [activeTab, setActiveTab] = useState<'reseñas' | 'listas'>('reseñas');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      // Check if user is authenticated
      if (!isAuthenticated()) {
        navigate('/LoginPage');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const userId = parseInt(id);
        const currentUserId = getUserIdFromToken();

        console.log('🔍 Debug perfil:', {
          userId,
          currentUserId,
          esPerfilPropio: userId === currentUserId,
          userIdFromUrl: id,
          userIdFromToken: currentUserId
        });

        // Fetch user public profile (includes isFollowing)
        const usuarioData = await usuarioService.getPublicProfile(userId);

        // Fetch user stats (followers and following counts)
        const statsData = await usuarioService.getUserStats(userId);

        // Fetch reviews
        const reseñasResponse = await getResenasByUsuario(userId);
        
        // Handle paginated response - extract reviews array
        const reseñasData = Array.isArray(reseñasResponse) 
          ? reseñasResponse 
          : (reseñasResponse.reviews || []);

        // Fetch lists
        const listasData = await listaService.getListasByUsuario(userId);

        const usuario: Usuario = {
          id: usuarioData.id,
          nombre: usuarioData.nombre || '',
          username: usuarioData.username,
          email: '', // Not included in public profile
          genero: usuarioData.genero || 'otro',
          fechaRegistro: usuarioData.createdAt,
          ubicacion: usuarioData.ubicacion,
          biografia: usuarioData.biografia,
          avatar: usuarioData.avatar,
          seguidores: statsData.seguidores,
          siguiendo: statsData.siguiendo,
          librosLeidos: 0, // TODO: Implement
          reseñasEscritas: reseñasData.length,
          listasCreadas: listasData.length,
          esSeguido: usuarioData.isFollowing || false,
          esPerfilPropio: userId === currentUserId,
        };

        const reseñas: Reseña[] = reseñasData.map((r: any) => {
          // Determinar el ID correcto del libro (priorizar externalId)
          const libroId = r.libro?.externalId || r.libro?.id?.toString() || r.libroId?.toString() || '';
          
          console.log('📚 Mapeando reseña:', {
            reseñaId: r.id,
            libroIdInterno: r.libro?.id,
            externalId: r.libro?.externalId,
            libroIdUsado: libroId,
            nombreLibro: r.libro?.nombre,
            autorLibro: r.libro?.autor?.nombre,
            imagen: r.libro?.imagen,
            reaccionesCount: r.reaccionesCount
          });
          
          return {
            id: r.id,
            libroId: libroId,
            libroTitulo: r.libro?.nombre || r.libro?.titulo || 'Sin título',
            libroAutor: r.libro?.autor?.nombre || 'Autor desconocido',
            libroImagen: r.libro?.imagen || r.libro?.imagenPortada || '/placeholder-book.png',
            rating: r.estrellas || r.rating || 0,
            titulo: r.titulo || '',
            comentario: r.comentario || '',
            fecha: r.createdAt || r.fechaResena || r.fecha,
            likes: r.reaccionesCount?.likes || r.reaccionesCount?.total || r.likes || 0,
            esPublica: r.esPublica !== false,
          };
        });

        const listas: Lista[] = listasData.map((l: any) => ({
          id: l.id,
          titulo: l.nombre || l.titulo,
          descripcion: l.descripcion || '',
          librosCount: l.librosCount || 0,
          esPublica: l.tipo !== 'custom' || l.esPublica !== false,
          fechaCreacion: l.createdAt || l.fechaCreacion,
          seguidores: l.seguidores || 0,
          librosPortada: [], // TODO: Implement book covers
        }));

        setUsuario(usuario);
        setReseñas(reseñas);
        setListas(listas);
      } catch (err) {
        console.error('Error fetching user profile data:', err);
        setError('Error al cargar el perfil del usuario');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const getAvatarIcon = (genero: string, avatar?: string, nombre?: string, username?: string) => {
    // Determinar la fuente del avatar
    const getAvatarSrc = () => {
      if (!avatar) return null;
      
      // Si es una URL completa (http/https), usarla directamente
      if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
        return avatar;
      }
      
      // Si tiene extensión, usar directamente desde assets
      if (avatar.includes('.')) {
        return `/assets/${avatar}`;
      }
      
      // Si no tiene extensión, asumir .svg
      return `/assets/${avatar}.svg`;
    };

    const avatarSrc = getAvatarSrc();
    const displayName = nombre || username || 'Usuario';
    const initials = displayName
      .split(' ')
      .map(s => s[0]?.toUpperCase() || '?')
      .slice(0, 2)
      .join('');

    // Determinar color del placeholder según género
    const getGradientClasses = () => {
      if (genero === 'femenino') return 'from-pink-400 via-rose-400 to-purple-500';
      if (genero === 'masculino') return 'from-blue-400 via-cyan-400 to-indigo-500';
      return 'from-purple-400 via-indigo-400 to-blue-500';
    };

    // Si hay avatar, mostrarlo con fallback
    if (avatarSrc) {
      return (
        <div className="w-32 h-32 rounded-full overflow-hidden shadow-2xl ring-4 ring-white/20 backdrop-blur-sm">
          <img
            src={avatarSrc}
            alt={`Avatar de ${displayName}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Si falla la carga, ocultar imagen y mostrar fallback
              e.currentTarget.style.display = 'none';
              const fallbackDiv = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallbackDiv) {
                fallbackDiv.style.display = 'flex';
              }
            }}
          />
          {/* Fallback div oculto por defecto */}
          <div 
            className={`w-full h-full bg-gradient-to-br ${getGradientClasses()} flex items-center justify-center text-white font-bold text-3xl`}
            style={{ display: 'none' }}
          >
            {initials}
          </div>
        </div>
      );
    }

    // Si no hay avatar, mostrar placeholder con iniciales
    return (
      <div className={`w-32 h-32 bg-gradient-to-br ${getGradientClasses()} rounded-full flex items-center justify-center shadow-2xl ring-4 ring-white/20 backdrop-blur-sm`}>
        <span className="text-white font-bold text-3xl drop-shadow-lg">{initials}</span>
      </div>
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <DotLottieReact
            src="https://lottie.host/6d727e71-5a1d-461e-9434-c9e7eb1ae1d1/IWVmdeMHnT.lottie"
            loop
            autoplay
            style={{ width: 140, height: 140 }}
          />
          <p className="text-gray-600 dark:text-gray-400 text-lg mt-4 font-medium">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-300">
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl p-12 text-center max-w-md border border-gray-200/50 dark:border-gray-700/50">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-full mb-6">
            <User className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Error al cargar perfil</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Volver atrás
          </button>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-300">
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl p-12 text-center max-w-md border border-gray-200/50 dark:border-gray-700/50">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full mb-6">
            <User className="w-12 h-12 text-gray-500 dark:text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Usuario no encontrado</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">El perfil que buscas no existe o ha sido eliminado.</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Volver atrás
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back button */}
          <button
            onClick={() => window.history.back()}
            className="text-white/90 hover:text-white transition-colors mb-8 flex items-center gap-2 font-medium group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Volver</span>
          </button>

          {/* Profile Info Section - Paleta coherente con el gradiente */}
          <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-indigo-200/30 dark:border-indigo-400/20">
            {/* Sección principal: Avatar + Info + Botón */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Avatar */}
              <div className="flex-shrink-0 mx-auto sm:mx-0">
                {getAvatarIcon(usuario.genero, usuario.avatar, usuario.nombre, usuario.username)}
              </div>

              {/* Info del usuario */}
              <div className="flex-1 text-center sm:text-left min-w-0">
                {/* Nombre y username */}
                <div className="mb-3">
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                    {usuario.nombre || usuario.username}
                  </h1>
                  <p className="text-indigo-600 dark:text-indigo-400 text-base font-medium">@{usuario.username}</p>
                </div>

                {/* Biografía - más compacta */}
                {usuario.biografia && (
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-3 line-clamp-2">
                    {usuario.biografia}
                  </p>
                )}

                {/* Metadata inline - más compacta */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 dark:text-slate-400">
                  {usuario.ubicacion && (
                    <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700/50 px-2.5 py-1 rounded-md">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{usuario.ubicacion}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700/50 px-2.5 py-1 rounded-md">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Desde {new Date(usuario.fechaRegistro).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              {/* Botón de acción - alineado arriba derecha */}
              <div className="flex-shrink-0 mx-auto sm:mx-0">
                {usuario.esPerfilPropio ? (
                  <button
                    onClick={() => navigate('/configuracion')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="text-sm">Editar Perfil</span>
                  </button>
                ) : (
                  <SeguirUsuarioButton 
                    usuarioId={usuario.id}
                    username={usuario.username}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                    onFollowChange={(isSiguiendo) => {
                      // Actualizar contador de seguidores
                      setUsuario(prev => prev ? {
                        ...prev,
                        seguidores: prev.seguidores + (isSiguiendo ? 1 : -1),
                        esSeguido: isSiguiendo
                      } : null);
                    }}
                  />
                )}
              </div>
            </div>

            {/* Separador elegante */}
            <div className="h-px bg-gradient-to-r from-transparent via-indigo-200 dark:via-indigo-400/30 to-transparent my-5"></div>

            {/* Stats inline - diseño compacto horizontal con colores coherentes */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6">
              <Link
                to={`/perfil/${usuario.id}/seguidores`}
                className={`flex items-center gap-2.5 transition-all duration-200 hover:scale-105 ${usuario.seguidores === 0 ? 'opacity-40' : 'opacity-100'}`}
              >
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border border-blue-200/50 dark:border-blue-400/20">
                  <Users className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white leading-none">{usuario.seguidores}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 leading-none mt-0.5 font-medium">Seguidores</div>
                </div>
              </Link>

              <div className={`flex items-center gap-2.5 transition-all duration-200 hover:scale-105 ${usuario.siguiendo === 0 ? 'opacity-40' : 'opacity-100'}`}>
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl border border-indigo-200/50 dark:border-indigo-400/20">
                  <Users className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white leading-none">{usuario.siguiendo}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 leading-none mt-0.5 font-medium">Siguiendo</div>
                </div>
              </div>

              <div className={`flex items-center gap-2.5 transition-all duration-200 hover:scale-105 ${usuario.librosLeidos === 0 ? 'opacity-40' : 'opacity-100'}`}>
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl border border-purple-200/50 dark:border-purple-400/20">
                  <Book className="w-4.5 h-4.5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white leading-none">{usuario.librosLeidos}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 leading-none mt-0.5 font-medium">Libros</div>
                </div>
              </div>

              <div className={`flex items-center gap-2.5 transition-all duration-200 hover:scale-105 ${usuario.reseñasEscritas === 0 ? 'opacity-40' : 'opacity-100'}`}>
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-xl border border-cyan-200/50 dark:border-cyan-400/20">
                  <MessageCircle className="w-4.5 h-4.5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white leading-none">{usuario.reseñasEscritas}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 leading-none mt-0.5 font-medium">Reseñas</div>
                </div>
              </div>

              <div className={`flex items-center gap-2.5 transition-all duration-200 hover:scale-105 ${usuario.listasCreadas === 0 ? 'opacity-40' : 'opacity-100'}`}>
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/30 dark:to-indigo-900/30 rounded-xl border border-violet-200/50 dark:border-violet-400/20">
                  <List className="w-4.5 h-4.5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white leading-none">{usuario.listasCreadas}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 leading-none mt-0.5 font-medium">Listas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="inline-flex bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-1.5 rounded-xl mb-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
          <button
            onClick={() => setActiveTab('reseñas')}
            className={`flex items-center gap-2 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'reseñas'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg scale-105'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span>Reseñas</span>
            <span className={`ml-1 text-sm ${activeTab === 'reseñas' ? 'text-white/90' : 'text-gray-500'}`}>
              ({reseñas.length})
            </span>
          </button>
          <button
            onClick={() => setActiveTab('listas')}
            className={`flex items-center gap-2 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'listas'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg scale-105'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            <List className="w-5 h-5" />
            <span>Listas</span>
            <span className={`ml-1 text-sm ${activeTab === 'listas' ? 'text-white/90' : 'text-gray-500'}`}>
              ({listas.length})
            </span>
          </button>
        </div>

        {/* Reviews Tab */}
        {activeTab === 'reseñas' && (
          <div className="space-y-6">
            {reseñas.map((reseña) => (
              <div key={reseña.id} className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200/50 dark:border-gray-700/50 transform hover:-translate-y-1">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <Link to={`/libro/${reseña.libroId}`} className="flex-shrink-0 group mx-auto sm:mx-0">
                      <div className="relative">
                        <img
                          src={reseña.libroImagen}
                          alt={reseña.libroTitulo}
                          className="w-28 h-40 sm:w-32 sm:h-44 object-cover rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></div>
                      </div>
                    </Link>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-3">
                        <div className="flex-1 min-w-0">
                          <Link 
                            to={`/libro/${reseña.libroId}`}
                            className="font-bold text-xl text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 line-clamp-2 block"
                          >
                            {reseña.libroTitulo}
                          </Link>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">por {reseña.libroAutor}</p>
                        </div>
                        
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1.5 rounded-lg">
                            {renderStars(reseña.rating)}
                          </div>
                          <div title={reseña.esPublica ? 'Reseña pública' : 'Reseña privada'}>
                            {reseña.esPublica ? (
                              <Eye className="w-5 h-5 text-green-500" />
                            ) : (
                              <Lock className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {reseña.titulo && (
                        <h4 className="font-semibold text-lg text-gray-900 dark:text-white mb-3 line-clamp-2">
                          {reseña.titulo}
                        </h4>
                      )}
                      
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3 mb-4">
                        {reseña.comentario}
                      </p>
                      
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {formatDate(reseña.fecha)}
                        </span>
                        <div className="flex items-center gap-2 text-sm bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span className="font-medium text-gray-700 dark:text-gray-300">{reseña.likes} likes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {reseñas.length === 0 && (
              <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-lg p-16 text-center border border-gray-200/50 dark:border-gray-700/50">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full mb-6">
                  <MessageCircle className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No hay reseñas aún</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                  {usuario.esPerfilPropio 
                    ? 'Comienza escribiendo tu primera reseña para compartir tus opiniones sobre los libros que has leído' 
                    : `${usuario.nombre || usuario.username} no ha escrito reseñas públicas todavía`
                  }
                </p>
              </div>
            )}
          </div>
        )}

        {/* Lists Tab */}
        {activeTab === 'listas' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listas.map((lista) => (
              <div 
                key={lista.id} 
                className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50"
              >
                {/* Book covers preview */}
                <div className="h-48 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 relative overflow-hidden">
                  {lista.librosPortada.length > 0 ? (
                    <div className="flex items-center justify-center h-full gap-3 p-4">
                      {lista.librosPortada.slice(0, 3).map((imagen, index) => (
                        <img
                          key={index}
                          src={imagen}
                          alt=""
                          className="w-16 h-24 object-cover rounded-lg shadow-2xl transform transition-transform duration-300 hover:scale-110"
                          style={{ transform: `rotate(${(index - 1) * 5}deg)` }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Book className="w-20 h-20 text-white/30" strokeWidth={1.5} />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md rounded-full p-2 shadow-lg" title={lista.esPublica ? 'Lista pública' : 'Lista privada'}>
                    {lista.esPublica ? (
                      <Eye className="w-4 h-4 text-white" />
                    ) : (
                      <Lock className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3.5rem]">
                    {lista.titulo}
                  </h3>
                  
                  {lista.descripcion && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 min-h-[2.5rem] leading-relaxed">
                      {lista.descripcion}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center gap-2 text-sm bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg">
                      <Book className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="font-semibold text-gray-700 dark:text-gray-300">{lista.librosCount} libros</span>
                    </div>
                    {lista.esPublica && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Users className="w-4 h-4" />
                        <span className="font-medium">{lista.seguidores}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-3">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(lista.fechaCreacion)}
                  </div>
                </div>
              </div>
            ))}

            {listas.length === 0 && (
              <div className="col-span-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-lg p-16 text-center border border-gray-200/50 dark:border-gray-700/50">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full mb-6">
                  <List className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No hay listas aún</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                  {usuario.esPerfilPropio 
                    ? 'Crea tu primera lista para organizar y compartir tus libros favoritos' 
                    : `${usuario.nombre || usuario.username} no ha creado listas públicas todavía`
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};