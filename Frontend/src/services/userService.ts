// src/services/userService.ts
import { fetchWithRefresh } from '../utils/fetchWithRefresh';
import { API_BASE_URL } from '../config/api.config';

const API_URL = `${API_BASE_URL}/usuarios`;

export const getUsuarios = async () => {
  const response = await fetchWithRefresh(API_URL);
  if (!response.ok) {
    throw new Error('No se pudieron obtener los usuarios');
  }
  return await response.json();
};

export const getUsuarioById = async (id: number) => {
  const response = await fetchWithRefresh(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error('No se pudo obtener el usuario');
  }
  return await response.json();
};

export const createUsuario = async (usuarioData: any, token: string) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(usuarioData),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Error al crear el usuario');
  }

  return await response.json();
};

export const updateUsuario = async (id: number, usuarioData: any, token: string) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(usuarioData),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Error al actualizar el usuario');
  }

  return await response.json();
};

export const deleteUsuario = async (id: number, token: string) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Error al eliminar el usuario');
  }

  return await response.json();
};
