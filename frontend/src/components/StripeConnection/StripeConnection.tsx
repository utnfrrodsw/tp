import { useState, useEffect, ReactNode } from 'react';
import useAuth from '../../cookie/useAuth';
import { Alert, AlertTitle, AlertDescription } from '../Alerts/Alerts';
import StripeCreate from '../Stripe/stripe';

interface StripeConnectionProps {
  children: ReactNode;
  loadingMessage?: string;
  errorMessage?: string;
  showAutoRefresh?: boolean;
}

function StripeConnection({ 
  children, 
  loadingMessage = "Cargando información de pagos...",
  errorMessage = "Error al verificar la conexión con Stripe",
  
}: StripeConnectionProps) {
  const { usuario, loading: authLoading } = useAuth();
  const [conectadoStripe, setConectadoStripe] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  // Verificar si el usuario ya tiene Stripe conectado
  useEffect(() => {
    const verificarConexionStripe = async () => {
      try {
        // Esperar a que termine la autenticación
        if (authLoading) {
          return;
        }
        
        if (!usuario) {
          setError('Usuario no autenticado');
          setLoading(false);
          return;
        }

        // Verificar si el usuario tiene stripeAccountId
        const tieneStripeConectado = Boolean(usuario.stripeAccountId);
        setConectadoStripe(tieneStripeConectado);
        
        setLoading(false);
      } catch (err) {
        console.error('Error verificando conexión Stripe:', err);
        setError(errorMessage);
        setLoading(false);
      }
    };

    verificarConexionStripe();
  }, [usuario, authLoading, errorMessage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 sm:h-64 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6 sm:py-8 px-4 flex flex-col items-center">
        <Alert variant="danger" className="mb-4 max-w-md w-full text-center">
          <AlertTitle className="text-left w-full">Error</AlertTitle>
          <AlertDescription className="text-left w-full">{error}</AlertDescription>
        </Alert>
        <button 
          onClick={() => window.location.reload()}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 text-sm sm:text-base"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Si no está conectado a Stripe, mostrar el botón de conexión
  if (!conectadoStripe) {
    return <StripeCreate />;
  }

  // Si está conectado, renderizar el contenido hijo
  return <>{children}</>;
}

export default StripeConnection;
