// src/services/libroService.ts
import { API_BASE_URL } from '../config/api.config';

// ✅ Obtener todos los libros
export const getLibros = async () => {
  const response = await fetch(`${API_BASE_URL}/libro`);
  if (!response.ok) {
    throw new Error('No se pudieron obtener los libros');
  }
  return await response.json();
};

// 👉 Obtener libros por IDs (para favoritos, listas, etc.)
export const getLibrosPorIds = async (ids: number[]) => {
  const promesas = ids.map(id =>
    fetch(`${API_BASE_URL}/libro/${id}`).then(res => {
      if (!res.ok) throw new Error('Error al cargar libro ' + id);
      return res.json();
    })
  );
  return Promise.all(promesas);
};

// ✅ Obtener libros por categoría
export const getLibrosPorCategoria = async (categoriaId: number) => {
  const response = await fetch(`${API_BASE_URL}/libro/categoria/${categoriaId}`);
  if (!response.ok) {
    throw new Error('No se pudieron cargar los libros por categoría');
  }
  return await response.json();
};

// ✅ Buscar libros
export const searchLibros = async (query: string) => {
  const response = await fetch(`${API_BASE_URL}/libro/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Error al buscar libros');
  }
  return await response.json();
};

// ✅ Obtener nuevos lanzamientos (últimos 30 días)
export const getNuevosLanzamientos = async (limit: number = 20) => {
  const response = await fetch(`${API_BASE_URL}/libro/nuevos?limit=${limit}`);
  if (!response.ok) {
    throw new Error('Error al obtener nuevos lanzamientos');
  }
  return await response.json();
};
