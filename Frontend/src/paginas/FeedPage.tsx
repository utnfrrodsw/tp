import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { MessageCircle, Heart, Book, List, User } from 'lucide-react';
//import { getFeed } from '../services/actividadService';
import { isAuthenticated } from '../services/authService';
import { useNavigate } from 'react-router-dom';

interface Actividad {
  id: number;
  tipo: string;
  fecha: string;
  usuario: {
    id: number;
    nombre: string;
    username: string;
  };
  libro?: {
    id: number;
    titulo: string;
    imagenPortada: string;
  };
  resena?: {
    id: number;
    titulo: string;
    comentario: string;
    esRespuesta?: boolean;
    resenaPadreAutor?: {
      nombre: string;
      apellido: string;
    };
  };
}

export const FeedPage: React.FC = () => {
  const [actividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeed = async () => {
      if (!isAuthenticated()) {
        navigate('/LoginPage');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        //const feedData = await getFeed();
       // setActividades(feedData);
      } catch (err) {
        console.error('Error fetching feed:', err);
        setError('Error al cargar el feed');
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [navigate]);

  const getActividadIcon = (tipo: string) => {
    switch (tipo) {
      case 'resena':
        return <MessageCircle className="w-5 h-5 text-blue-600" />;      case 'respuesta':
        return <MessageCircle className="w-5 h-5 text-green-600" />;      case 'favorito':
        return <Heart className="w-5 h-5 text-red-600" />;
      case 'lista':
        return <List className="w-5 h-5 text-green-600" />;
      case 'seguimiento':
        return <User className="w-5 h-5 text-purple-600" />;
      // case 'reaccion': eliminado - las reacciones no se muestran en el feed
      default:
        return <Book className="w-5 h-5 text-gray-600" />;
    }
  };

  const getActividadText = (actividad: Actividad) => {
    const userName = actividad.usuario.nombre;
    switch (actividad.tipo) {
      case 'resena':
        return `${userName} escribió una reseña de "${actividad.libro?.titulo}"`;
      case 'respuesta':
        if (actividad.resena?.resenaPadreAutor) {
          const autorNombre = `${actividad.resena.resenaPadreAutor.nombre} ${actividad.resena.resenaPadreAutor.apellido}`.trim();
          return `${userName} respondió a la reseña de ${autorNombre}`;
        }
        return `${userName} respondió a una reseña`;
      case 'favorito':
        return `${userName} agregó "${actividad.libro?.titulo}" a favoritos`;
      case 'lista':
        return `${userName} creó una nueva lista`;
      case 'seguimiento':
        return `${userName} comenzó a seguir a alguien`;
      // case 'reaccion': eliminado - las reacciones no se muestran en el feed
      default:
        return `${userName} realizó una actividad`;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Hace menos de una hora';
    if (diffInHours < 24) return `Hace ${diffInHours} horas`;
    if (diffInHours < 48) return 'Ayer';
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-700 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <DotLottieReact
            src="https://lottie.host/6d727e71-5a1d-461e-9434-c9e7eb1ae1d1/IWVmdeMHnT.lottie"
            loop
            autoplay
            style={{ width: 140, height: 140 }}
          />
          <p className="text-gray-600">Cargando feed...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-700 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Book className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Error al cargar feed</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-700 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Feed de Actividades</h1>
          <p className="text-gray-600">Descubre qué hacen las personas que sigues</p>
        </div>

        <div className="space-y-6">
          {actividades.map((actividad) => (
            <div key={actividad.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {getActividadIcon(actividad.tipo)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Link
                      to={`/perfil/${actividad.usuario.id}`}
                      className="font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 transition-colors duration-200"
                    >
                      {actividad.usuario.nombre}
                    </Link>
                    <span className="text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{formatDate(actividad.fecha)}</span>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-4">{getActividadText(actividad)}</p>

                  {actividad.libro && (
                    <div className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <Link to={`/libro/${actividad.libro.id}`}>
                        <img
                          src={actividad.libro.imagenPortada}
                          alt={actividad.libro.titulo}
                          className="w-12 h-16 object-cover rounded hover:opacity-80 transition-opacity duration-200"
                        />
                      </Link>
                      <div>
                        <Link
                          to={`/libro/${actividad.libro.id}`}
                          className="font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 transition-colors duration-200"
                        >
                          {actividad.libro.titulo}
                        </Link>
                      </div>
                    </div>
                  )}

                  {actividad.resena && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{actividad.resena.titulo}</h4>
                      <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">{actividad.resena.comentario}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {actividades.length === 0 && (
            <div className="text-center py-12">
              <Book className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No hay actividades aún</h3>
              <p className="text-gray-600">
                Comienza siguiendo a otros usuarios para ver sus actividades aquí
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
