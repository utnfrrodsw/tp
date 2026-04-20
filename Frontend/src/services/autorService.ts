// src/services/autorService.ts
import { API_BASE_URL } from '../config/api.config';

const API_URL = `${API_BASE_URL}/autor`;

export const getAutores = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('No se pudieron obtener los autores');
  }
  return await response.json();
};

export const getAutorById = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error('No se pudo obtener el autor');
  }
  return await response.json();
};

export const createAutor = async (autorData: any, token: string) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(autorData),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Error al crear el autor');
  }

  return await response.json();
};

export const updateAutor = async (id: number, autorData: any, token: string) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(autorData),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Error al actualizar el autor');
  }

  return await response.json();
};

export const deleteAutor = async (id: number, token: string) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Error al eliminar el autor');
  }

  return await response.json();
};

// ✅ Buscar autores con opción de búsqueda externa
export const searchAutores = async (query: string, includeExternal: boolean = false) => {
  const response = await fetch(
    `${API_URL}/search?q=${encodeURIComponent(query)}&includeExternal=${includeExternal}`
  );
  if (!response.ok) {
    throw new Error('Error al buscar autores');
  }
  return await response.json();
};
