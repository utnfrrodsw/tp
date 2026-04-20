import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  const location = useLocation();

  // Si no se pasan items, generar automáticamente desde la ruta
  const breadcrumbItems = items || generateBreadcrumbsFromPath(location.pathname);

  if (breadcrumbItems.length === 0) return null;

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      {/* Home siempre presente */}
      <Link
        to="/"
        className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        aria-label="Inicio"
      >
        <Home className="w-4 h-4" />
      </Link>

      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;

        return (
          <React.Fragment key={item.path}>
            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />
            
            {isLast ? (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-xs"
                aria-current="page"
              >
                {item.label}
              </motion.span>
            ) : (
              <Link
                to={item.path}
                className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate max-w-xs"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

// Función helper para generar breadcrumbs automáticamente
function generateBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  const pathMap: Record<string, string> = {
    'libros': 'Libros',
    'libro': 'Libro',
    'autores': 'Autores',
    'autor': 'Autor',
    'sagas': 'Sagas',
    'saga': 'Saga',
    'categorias': 'Categorías',
    'categoria': 'Categoría',
    'listas': 'Listas',
    'lista': 'Lista',
    'favoritos': 'Favoritos',
    'perfil': 'Perfil',
    'recomendaciones': 'Recomendaciones',
    'nuevos-lanzamientos': 'Nuevos Lanzamientos',
    'populares': 'Populares',
    'admin': 'Administración',
    'configuracion': 'Configuración',
  };

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Si es un ID (número), no agregar al breadcrumb a menos que sea el último
    if (!isNaN(Number(segment))) {
      if (index === segments.length - 1) {
        breadcrumbs.push({
          label: `Detalle`,
          path: currentPath,
        });
      }
    } else {
      breadcrumbs.push({
        label: pathMap[segment] || capitalize(segment),
        path: currentPath,
      });
    }
  });

  return breadcrumbs;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');
}

export default Breadcrumbs;
