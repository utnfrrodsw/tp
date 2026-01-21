export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// Helper para construir URLs de imágenes
export const getImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  
  // Limpiar cualquier '/uploads/' al inicio
  const cleanPath = imagePath.replace(/^\/?uploads\//, '');
  return `${BACKEND_URL}/uploads/${cleanPath}`;
};