/**
 * Configuración centralizada de la API
 * En producción usa la variable de entorno VITE_API_URL
 * En desarrollo usa localhost:3000
 */

// Type assertion para variables de entorno de Vite
const getEnvVar = (key: string): string | undefined => {
  return (import.meta as any).env?.[key];
};

export const API_BASE_URL = getEnvVar('VITE_API_URL') || 'http://localhost:3000/api';

// Para uso sin el /api al final
export const API_ROOT_URL = getEnvVar('VITE_API_URL')?.replace('/api', '') || 'http://localhost:3000';
