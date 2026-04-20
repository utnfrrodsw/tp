// src/utils/fetchWithRefresh.ts
import { getAccessToken, getNewAccessToken, logoutUser } from '../services/authService';
import { API_BASE_URL } from '../config/api.config';

export async function fetchWithRefresh(input: RequestInfo, init?: RequestInit): Promise<Response> {
  let token = getAccessToken();

  // Convertir rutas relativas a URLs absolutas
  const url = typeof input === 'string' && input.startsWith('/api/') 
    ? input.replace('/api/', `${API_BASE_URL}/`)
    : input;

  const headers = new Headers(init?.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let response = await fetch(url, { ...init, headers });

  if (response.status === 401) {
    // Token expirado o inválido, intentar refrescar
    try {
      token = await getNewAccessToken();
      headers.set('Authorization', `Bearer ${token}`);

      response = await fetch(url, { ...init, headers });
    } catch (error) {
      // No se pudo refrescar, forzar logout y mostrar modal
      logoutUser();
      // Dispatch custom event to show login modal
      window.dispatchEvent(new CustomEvent('sessionExpired'));
      throw new Error('Sesión expirada, por favor inicia sesión nuevamente');
    }
  }

  return response;
}
