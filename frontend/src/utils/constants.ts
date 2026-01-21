// La dirección de tu backend
// Use the backend port where the server is running (3000 in development)
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// Las páginas de tu app
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ADMIN_DASHBOARD: '/admin'
};