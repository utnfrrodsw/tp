// src/services/reaccionService.ts
import { fetchWithRefresh } from '../utils/fetchWithRefresh';
import { API_BASE_URL } from '../config/api.config';

const API_URL = `${API_BASE_URL}/reaccion`;

export const getReaccionesByResena = async (resenaId: number) => {
  const response = await fetch(`${API_URL}/resena/${resenaId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('No se pudieron obtener las reacciones');
  }
  
  return await response.json();
};

export const addOrUpdateReaccion = async (
  reaccionData: {
    resenaId: number;
    tipo: string;
  },
  token: string
) => {
  const response = await fetchWithRefresh(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reaccionData),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Error al agregar/actualizar la reacción');
  }

  return await response.json();
};

export const deleteReaccion = async (
  usuarioId: number, 
  resenaId: number, 
  token: string
) => {
  const response = await fetchWithRefresh(
    `${API_URL}/${usuarioId}/${resenaId}`, 
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Error al eliminar la reacción');
  }

  return await response.json();
};
