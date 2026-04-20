// src/Servicios/authService.ts
import { API_BASE_URL } from '../config/api.config';

export const saveTokens = (token: string, refreshToken?: string) => {
  localStorage.setItem('accessToken', token);
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
};

export const getAccessToken = () => localStorage.getItem('accessToken');

const decodeJwtPayload = (token: string): any | null => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, '=');
    return JSON.parse(atob(paddedPayload));
  } catch (error) {
    console.error('Error decoding JWT payload:', error);
    return null;
  }
};

export const getNewAccessToken = async (): Promise<string> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available, please login again');
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await response.json();

  if (response.ok) {
    const newToken = data.token;
    // Update the stored access token
    localStorage.setItem('accessToken', newToken);
    return newToken;
  } else {
    throw new Error(data.error || 'Failed to refresh token');
  }
};

export const login = async (email: string, password: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (response.ok) {
    saveTokens(data.token, data.refreshToken);
  } else {
    throw new Error(data.error || 'Error al iniciar sesión');
  }
};

export const register = async (username: string, email: string, password: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await response.json();

  if (response.ok) {
    saveTokens(data.token, data.refreshToken);
  } else {
    throw new Error(data.error || 'Error al registrarse');
  }
};

export const requestPasswordReset = async (email: string): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/auth/request-password-reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (response.ok) {
    return data.message || 'Si el email existe, recibirás un enlace de recuperación';
  } else {
    throw new Error(data.error || 'No se pudo solicitar la recuperación de contraseña');
  }
};

export const resetPasswordWithToken = async (token: string, newPassword: string): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword }),
  });

  const data = await response.json();

  if (response.ok) {
    return data.message || 'Contraseña actualizada exitosamente';
  } else {
    throw new Error(data.error || 'No se pudo restablecer la contraseña');
  }
};

export const getToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};

export const removeTokens = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const logoutUser = (): void => {
  removeTokens();
  // acá podrías agregar redirección u otras limpiezas si querés
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Decode JWT token to get user info
export const getUserIdFromToken = (): number | null => {
  const token = getToken();
  if (!token) return null;

  const decoded = decodeJwtPayload(token);
  const userId = Number(decoded?.id);
  return Number.isFinite(userId) && userId > 0 ? userId : null;
};

export const getUserInfoFromToken = (): { id: number; email: string; username: string; rol: string } | null => {
  const token = getToken();
  if (!token) return null;

  const decoded = decodeJwtPayload(token);
  const id = Number(decoded?.id);

  if (!Number.isFinite(id) || id <= 0) {
    return null;
  }

  return {
    id,
    email: decoded.email,
    username: decoded.username,
    rol: decoded.rol
  };
};

export const updateCurrentUser = async (data: any): Promise<void> => {
  const token = getToken();
  if (!token) {
    throw new Error('No authentication token available');
  }

  const response = await fetch(`${API_BASE_URL}/usuarios/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Error updating user profile');
  }
};

export const checkUserExists = async (username?: string, email?: string): Promise<{ usernameExists?: boolean; emailExists?: boolean }> => {
  const response = await fetch(`${API_BASE_URL}/usuarios/check-exists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email }),
  });

  const data = await response.json();

  if (response.ok) {
    return data;
  } else {
    throw new Error(data.error || 'Error checking user existence');
  }
};

// Axios interceptor for automatic token refresh
export const setupAxiosInterceptors = (axiosInstance: any, onSessionExpired?: () => void) => {
  axiosInstance.interceptors.request.use(
    (config: any) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response: any) => {
      return response;
    },
    async (error: any) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const newToken = await getNewAccessToken();
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // If refresh fails, logout user and show modal
          logoutUser();
          if (onSessionExpired) {
            onSessionExpired();
          } else {
            window.location.href = '/LoginPage';
          }
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};
