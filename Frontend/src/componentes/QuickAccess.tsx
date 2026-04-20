// src/componentes/QuickAccess.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, Plus, X, Trash2, GripVertical } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

interface QuickAccessItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  color?: string;
}

const defaultQuickAccesses: QuickAccessItem[] = [
  { id: '1', label: 'Libros Recomendados', href: '/libros/recomendados', icon: '💡', color: 'yellow' },
  { id: '3', label: 'Usuarios que Sigo', href: '/siguiendo', icon: '👥', color: 'blue' },
  { id: '4', label: 'Feed de Actividad', href: '/feed', icon: '📰', color: 'purple' },
];

const STORAGE_KEY = 'bookcode_quick_access';
const MAX_ITEMS = 8;

export const QuickAccess: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [quickAccesses, setQuickAccesses] = useState<QuickAccessItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newItemLabel, setNewItemLabel] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Cargar desde localStorage al montar
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setQuickAccesses(JSON.parse(stored));
      } catch {
        setQuickAccesses(defaultQuickAccesses);
      }
    } else {
      setQuickAccesses(defaultQuickAccesses);
    }
  }, []);

  // Guardar en localStorage cuando cambia
  useEffect(() => {
    if (quickAccesses.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quickAccesses));
    }
  }, [quickAccesses]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsEditing(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddCurrentPage = () => {
    if (quickAccesses.length >= MAX_ITEMS) {
      alert(`Máximo ${MAX_ITEMS} accesos rápidos permitidos`);
      return;
    }

    const currentPath = location.pathname;
    
    // Evitar duplicados
    if (quickAccesses.some(item => item.href === currentPath)) {
      alert('Esta página ya está en tus accesos rápidos');
      return;
    }

    const label = newItemLabel.trim() || getPageLabel(currentPath);
    const newItem: QuickAccessItem = {
      id: Date.now().toString(),
      label,
      href: currentPath,
      icon: getPageIcon(currentPath),
      color: getRandomColor(),
    };

    setQuickAccesses([...quickAccesses, newItem]);
    setNewItemLabel('');
  };

  const handleRemoveItem = (id: string) => {
    setQuickAccesses(quickAccesses.filter(item => item.id !== id));
  };

  const handleReorder = (newOrder: QuickAccessItem[]) => {
    setQuickAccesses(newOrder);
  };

  const handleResetToDefault = () => {
    if (confirm('¿Restaurar accesos rápidos por defecto?')) {
      setQuickAccesses(defaultQuickAccesses);
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Botón principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors duration-200 group"
        aria-label="Accesos rápidos"
      >
        <motion.div
          whileHover={{ rotate: 15, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Zap className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors duration-200" />
        </motion.div>
        
        {/* Badge contador */}
        {quickAccesses.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {quickAccesses.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-1rem)] bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-600 to-orange-500 dark:from-yellow-700 dark:to-orange-600 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Accesos Rápidos
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-white/90 hover:text-white text-sm font-medium transition-colors"
                  >
                    {isEditing ? 'Listo' : 'Editar'}
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de accesos */}
            <div className="p-3 max-h-[400px] overflow-y-auto">
              {quickAccesses.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Zap className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="font-medium">No hay accesos rápidos</p>
                  <p className="text-sm mt-1">Agrega tu primera página favorita</p>
                </div>
              ) : (
                <Reorder.Group
                  axis="y"
                  values={quickAccesses}
                  onReorder={handleReorder}
                  className="space-y-2"
                >
                  {quickAccesses.map((item) => (
                    <Reorder.Item
                      key={item.id}
                      value={item}
                      className={`group ${!isEditing ? 'cursor-pointer' : 'cursor-move'}`}
                    >
                      <motion.div
                        whileHover={{ scale: isEditing ? 1 : 1.02 }}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                          isEditing
                            ? 'bg-gray-50 dark:bg-gray-700/50'
                            : 'hover:bg-green-50 dark:hover:bg-green-900/20'
                        }`}
                      >
                        {/* Drag handle (solo en modo edición) */}
                        {isEditing && (
                          <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )}

                        {/* Icono */}
                        <span className="text-2xl flex-shrink-0">{item.icon}</span>

                        {/* Label */}
                        {isEditing ? (
                          <span className="flex-1 text-gray-700 dark:text-gray-300 font-medium">
                            {item.label}
                          </span>
                        ) : (
                          <Link
                            to={item.href}
                            onClick={() => setIsOpen(false)}
                            className="flex-1 text-gray-700 dark:text-gray-300 font-medium hover:text-green-600 dark:hover:text-green-400"
                          >
                            {item.label}
                          </Link>
                        )}

                        {/* Botón eliminar (solo en modo edición) */}
                        {isEditing && (
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </motion.div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              )}

              {/* Agregar nuevo */}
              {isEditing && quickAccesses.length < MAX_ITEMS && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                >
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newItemLabel}
                      onChange={(e) => setNewItemLabel(e.target.value)}
                      placeholder="Nombre (opcional)"
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCurrentPage()}
                    />
                    <button
                      onClick={handleAddCurrentPage}
                      className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-sm font-medium">Agregar</span>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Agrega la página actual a tus accesos rápidos ({quickAccesses.length}/{MAX_ITEMS})
                  </p>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/50 flex justify-between">
              <button
                onClick={handleResetToDefault}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Restaurar por defecto
              </button>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {quickAccesses.length}/{MAX_ITEMS} accesos
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helpers
function getPageLabel(path: string): string {
  const labels: Record<string, string> = {
    '/': 'Inicio',
    '/libros': 'Libros',
    '/autores': 'Autores',
    '/categorias': 'Categorías',
    '/sagas': 'Sagas',
    '/favoritos': 'Mis Favoritos',
    '/perfil': 'Mi Perfil',
    '/listas': 'Mis Listas',
    '/libros/nuevos': 'Nuevos Lanzamientos',
    '/libros/populares': 'Libros Populares',
    '/libros/recomendados': 'Recomendados',
    '/configuracion': 'Configuración',
  };
  return labels[path] || path.split('/').pop()?.replace(/-/g, ' ') || 'Página';
}

function getPageIcon(path: string): string {
  const icons: Record<string, string> = {
    '/': '🏠',
    '/libros': '📚',
    '/autores': '✍️',
    '/categorias': '🏷️',
    '/sagas': '📖',
    '/favoritos': '⭐',
    '/perfil': '👤',
    '/listas': '📋',
    '/libros/nuevos': '🚀',
    '/libros/populares': '🔥',
    '/libros/recomendados': '💡',
    '/configuracion': '⚙️',
  };
  return icons[path] || '📄';
}

function getRandomColor(): string {
  const colors = ['blue', 'green', 'yellow', 'red', 'purple', 'pink', 'indigo'];
  return colors[Math.floor(Math.random() * colors.length)];
}
