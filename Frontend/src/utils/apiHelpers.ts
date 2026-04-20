/**
 * Helper function para construir URLs de la API de forma consistente
 * Usar esto en componentes/páginas en lugar de URLs hardcodeadas
 */
import { API_BASE_URL, API_ROOT_URL } from '../config/api.config';

/**
 * Construye una URL completa para un endpoint de la API
 * @param endpoint - El endpoint sin el prefijo /api (ej: '/libro/123')
 * @returns URL completa (ej: 'http://localhost:3000/api/libro/123')
 */
export const buildApiUrl = (endpoint: string): string => {
  // Asegurar que endpoint empiece con /
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};

/**
 * Construye una URL sin el prefijo /api
 * @param endpoint - El endpoint (ej: '/api/libro/123')
 * @returns URL completa (ej: 'http://localhost:3000/api/libro/123')
 */
export const buildRootApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_ROOT_URL}${cleanEndpoint}`;
};
