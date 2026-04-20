import { useState, useEffect, useRef } from 'react';
import { Bell, Trash2, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  obtenerNotificaciones,
  contarNoLeidas,
  marcarComoLeida,
  marcarTodasComoLeidas,
  eliminarNotificacion,
  type Notificacion
} from '../services/notificacionService';
import { useNavigate } from 'react-router-dom';

export const NotificationBell = () => {
  const [count, setCount] = useState(0);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Cargar contador inicial y setup polling
  useEffect(() => {
    fetchCount();
    
    // Polling cada 30 segundos
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const fetchCount = async () => {
    try {
      const newCount = await contarNoLeidas();
      setCount(newCount);
    } catch (error) {
      console.error('Error al obtener contador:', error);
    }
  };

  const fetchNotificaciones = async () => {
    setIsLoading(true);
    try {
      const notifs = await obtenerNotificaciones(20);
      setNotificaciones(notifs);
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async () => {
    if (!isOpen) {
      await fetchNotificaciones();
    }
    setIsOpen(!isOpen);
  };

  const handleNotificacionClick = async (notif: Notificacion) => {
    // Marcar como leída si no lo está
    if (!notif.leida) {
      try {
        await marcarComoLeida(notif.id);
        // Actualizar estado local inmediatamente para feedback visual
        setNotificaciones(prev =>
          prev.map(n => n.id === notif.id ? { ...n, leida: true } : n)
        );
        // Actualizar contador
        setCount(prev => Math.max(0, prev - 1));
        // Recargar desde servidor para asegurar consistencia
        await fetchCount();
      } catch (error) {
        console.error('Error al marcar como leída:', error);
        // Revertir cambio local si falla
        setNotificaciones(prev =>
          prev.map(n => n.id === notif.id ? { ...n, leida: false } : n)
        );
      }
    }

    // Navegar a la URL si existe
    if (notif.url) {
      setIsOpen(false);
      navigate(notif.url);
    }
  };

  const handleMarcarTodasLeidas = async () => {
    try {
      await marcarTodasComoLeidas();
      // Actualizar estado local
      setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
      setCount(0);
      // Recargar desde servidor para confirmar
      await fetchCount();
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
      // Recargar notificaciones si falla
      await fetchNotificaciones();
      await fetchCount();
    }
  };

  const handleEliminar = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Guardar notificación antes de eliminar por si necesitamos revertir
    const notifEliminada = notificaciones.find(n => n.id === id);
    
    try {
      // Actualizar UI inmediatamente para feedback visual
      setNotificaciones(prev => prev.filter(n => n.id !== id));
      if (notifEliminada && !notifEliminada.leida) {
        setCount(prev => Math.max(0, prev - 1));
      }
      
      // Eliminar en servidor
      await eliminarNotificacion(id);
      
      // Recargar contador para asegurar consistencia
      await fetchCount();
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
      // Revertir cambios si falla
      if (notifEliminada) {
        setNotificaciones(prev => [...prev, notifEliminada].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
        if (!notifEliminada.leida) {
          setCount(prev => prev + 1);
        }
      }
    }
  };

  const getIconoTipo = (tipo: Notificacion['tipo']) => {
    switch (tipo) {
      case 'NUEVO_SEGUIDOR':
        return '👤';
      case 'NUEVA_REACCION':
        return '👍';
      case 'ACTIVIDAD_SEGUIDO':
        return '📝';
      case 'RESPUESTA_RESENA':
        return '💬';
      case 'NUEVA_RESENA':
        return '📚';
      case 'LIBRO_FAVORITO':
        return '❤️';
      case 'RESENA_RECHAZADA':
        return '🚫';
      default:
        return '🔔';
    }
  };

  const formatearFecha = (fecha: string) => {
    const ahora = new Date();
    const notifFecha = new Date(fecha);
    const diffMs = ahora.getTime() - notifFecha.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHoras = Math.floor(diffMs / 3600000);
    const diffDias = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHoras < 24) return `Hace ${diffHoras}h`;
    if (diffDias < 7) return `Hace ${diffDias}d`;
    return notifFecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón de campana */}
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Notificaciones"
      >
        <Bell 
          size={24} 
          className="text-gray-700 dark:text-gray-300"
        />
        
        {/* Badge contador */}
        <AnimatePresence>
          {count > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
            >
              {count > 99 ? '99+' : count}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Dropdown de notificaciones */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Notificaciones
              </h3>
              {notificaciones.length > 0 && count > 0 && (
                <button
                  onClick={handleMarcarTodasLeidas}
                  className="flex items-center gap-1 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  <CheckCheck size={16} />
                  <span>Marcar todas</span>
                </button>
              )}
            </div>

            {/* Lista de notificaciones */}
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">Cargando...</p>
                </div>
              ) : notificaciones.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">No tienes notificaciones</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {notificaciones.map((notif) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors relative group ${
                        !notif.leida ? 'bg-purple-50 dark:bg-purple-900/10' : ''
                      }`}
                      onClick={() => handleNotificacionClick(notif)}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icono */}
                        <div className="text-2xl mt-1 flex-shrink-0">
                          {getIconoTipo(notif.tipo)}
                        </div>

                        {/* Contenido */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${
                            !notif.leida 
                              ? 'text-gray-900 dark:text-white font-medium' 
                              : 'text-gray-600 dark:text-gray-300'
                          }`}>
                            {notif.mensaje}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {formatearFecha(notif.createdAt)}
                          </p>
                        </div>

                        {/* Indicador no leída */}
                        {!notif.leida && (
                          <div className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0 mt-2"></div>
                        )}

                        {/* Botón eliminar */}
                        <button
                          onClick={(e) => handleEliminar(notif.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-opacity"
                          aria-label="Eliminar notificación"
                        >
                          <Trash2 size={16} className="text-gray-500 dark:text-gray-400" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
