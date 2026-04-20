// Utility to decode JWT token payload
export const decodeJwt = (token: string): any => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// Get user role from token
export const getUserRole = (): string | null => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  const decoded = decodeJwt(token);
  return decoded?.rol || null;
};

// Get token from localStorage
export const getToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

// Check if user is admin
export const isAdmin = (): boolean => {
  const role = getUserRole();
  return role === 'admin';
};
