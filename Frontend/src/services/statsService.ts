/**
 * Servicio para obtener estadísticas de la plataforma
 * Proporciona métricas para el HeroSection
 */
import { API_BASE_URL } from '../config/api.config';

const API_URL = API_BASE_URL;
const isDev = import.meta.env.DEV;

export interface PlatformStats {
  librosCreados: number;
  reseniasTotales: number;
  lectoresActivos: number;
  librosFavoritos: number;
}

/**
 * Obtiene las estadísticas principales de la plataforma
 */
export const getStats = async (): Promise<PlatformStats> => {
  try {
    if (isDev) {
      console.log('🌐 Llamando a API:', `${API_URL}/stats`);
    }
    const response = await fetch(`${API_URL}/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (isDev) {
      console.log('📡 Respuesta API status:', response.status);
    }

    if (!response.ok) {
      throw new Error(`Stats API error: ${response.status}`);
    }

    const data = await response.json();
    if (isDev) {
      console.log('📊 Datos recibidos de la API:', data);
    }
    return data;
  } catch (error) {
    console.error('❌ Error fetching platform stats:', error);
    
    // Fallback a valores por defecto si falla la API
    const fallback = {
      librosCreados: 50000,
      reseniasTotales: 250000,
      lectoresActivos: 15000,
      librosFavoritos: 180000,
    };
    if (isDev) {
      console.log('⚠️ Usando fallback:', fallback);
    }
    return fallback;
  }
};

/**
 * Obtiene estadísticas con caché local para mejorar performance
 */
export const getCachedStats = (): PlatformStats | null => {
  try {
    const cached = localStorage.getItem('platform_stats');
    const timestamp = localStorage.getItem('platform_stats_timestamp');
    
    if (!cached || !timestamp) return null;
    
    const cacheTime = parseInt(timestamp);
    const now = Date.now();
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
    
    // Si el cache es muy viejo, retornar null
    if (now - cacheTime > CACHE_DURATION) {
      return null;
    }
    
    return JSON.parse(cached);
  } catch (error) {
    console.error('Error reading cached stats:', error);
    return null;
  }
};

/**
 * Guarda estadísticas en caché local
 */
export const setCachedStats = (stats: PlatformStats): void => {
  try {
    localStorage.setItem('platform_stats', JSON.stringify(stats));
    localStorage.setItem('platform_stats_timestamp', Date.now().toString());
  } catch (error) {
    console.error('Error caching stats:', error);
  }
};

/**
 * Obtiene estadísticas con caché automático
 */
export const getStatsWithCache = async (): Promise<PlatformStats> => {
  // Intentar primero con caché
  const cached = getCachedStats();
  if (cached) {
    if (isDev) {
      console.log('Using cached stats');
    }
    
    // Actualizar en background
    getStats().then(freshStats => {
      setCachedStats(freshStats);
    }).catch(err => {
      console.error('Background stats update failed:', err);
    });
    
    return cached;
  }
  
  // Si no hay caché, obtener fresh y cachear
  const freshStats = await getStats();
  setCachedStats(freshStats);
  return freshStats;
};
