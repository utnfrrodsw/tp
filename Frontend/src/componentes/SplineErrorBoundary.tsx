import { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary para el componente Spline
 * Si Spline falla al cargar, muestra un fallback elegante
 */
export class SplineErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Spline Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Mostrar fallback personalizado si se proporciona
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Fallback por defecto
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 rounded-3xl p-8"
        >
          <div className="text-center space-y-4">
            {/* Pollito estático como fallback */}
            <div className="relative w-48 h-48 mx-auto">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Cuerpo del pollito */}
                <ellipse cx="100" cy="120" rx="60" ry="70" fill="#FFD93D" />
                
                {/* Cabeza */}
                <circle cx="100" cy="70" r="40" fill="#FFD93D" />
                
                {/* Ojos */}
                <circle cx="90" cy="65" r="5" fill="#2C2C2C" />
                <circle cx="110" cy="65" r="5" fill="#2C2C2C" />
                
                {/* Pico */}
                <path d="M 100 75 L 85 80 L 100 85 Z" fill="#FF6B35" />
                
                {/* Alas */}
                <ellipse cx="65" cy="120" rx="25" ry="35" fill="#FFC93D" transform="rotate(-20 65 120)" />
                <ellipse cx="135" cy="120" rx="25" ry="35" fill="#FFC93D" transform="rotate(20 135 120)" />
                
                {/* Patas */}
                <rect x="85" y="180" width="8" height="20" fill="#FF6B35" />
                <rect x="107" y="180" width="8" height="20" fill="#FF6B35" />
              </svg>
            </div>
            
            <div className="space-y-2">
              <p className="text-gray-700 font-semibold">
                Cargando contenido...
              </p>
            </div>
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}
