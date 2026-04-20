// src/services/editorialService.ts
import { API_BASE_URL } from '../config/api.config';

const API_URL = `${API_BASE_URL}/editorial`;

export const getEditoriales = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('No se pudieron obtener las editoriales');
  }
  return await response.json();
};

export const getEditorialById = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error('No se pudo obtener la editorial');
  }
  return await response.json();
};

export const createEditorial = async (editorialData: any, token: string) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(editorialData),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Error al crear la editorial');
  }

  return await response.json();
};

export const updateEditorial = async (id: number, editorialData: any, token: string) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(editorialData),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Error al actualizar la editorial');
  }

  return await response.json();
};

export const deleteEditorial = async (id: number, token: string) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Error al eliminar la editorial');
  }

  return await response.json();
};
